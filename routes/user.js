var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const recipe_utils = require("./utils/recipes_utils");

/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {
  if (req.session && req.session.user_id) {
    DButils.execQuery("SELECT user_id FROM users").then((users) => {
      if (users.find((x) => x.user_id === req.session.user_id)) {
        req.user_id = req.session.user_id;
        next();
      }
    }).catch(err => next(err));
  } else {
    console.log(req.session.user_id);
    res.sendStatus(401);
  }
});


router.post('/createRecipe', async (req,res,next)=>{
  try{
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;
    const title = req.body.title;
    const readyInMinutes = req.body.readyInMinutes;
    const image = req.body.image;
    const popularity = req.body.popularity;
    const vegan = Number(req.body.vegan)
    const vegetarian = Number(req.body.vegetarian);
    const glutenFree = Number(req.body.glutenFree);
    const ingredients = req.body.ingredients;
    const instructions = req.body.instructions;
    const numOfDishes = req.body.numOfDishes;
    await user_utils.addNewRecipe(user_id,recipe_id,title,readyInMinutes,image,popularity,vegan,vegetarian,glutenFree,ingredients,instructions,numOfDishes);
    res.status(200).send("The Recipe successfully added");
  } catch(error){
    next(error);
  }
  
})

/**
 * This path gets body with recipeId and save this recipe in the favorites list of the logged-in user
 */
router.post('/favorites', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    console.log(req.body)
    const recipe_id = req.body.recipeId;
    await user_utils.markAsFavorite(user_id,recipe_id);
    res.status(200).send("The Recipe successfully saved as favorite");
    } catch(error){
    next(error);
  }
})

/**
 * This path returns the favorites recipes that were saved by the logged-in user
 */
router.get('/favorites', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    let favorite_recipes = {};
    const recipes_id = await user_utils.getFavoriteRecipes(user_id);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    const results = await recipe_utils.getRecipeDetailsMultiple(recipes_id_array);
    res.status(200).send(results);
  } catch(error){
    next(error); 
  }
});

router.get('/favoritesIDOnly', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    let favorite_recipes = {};
    const recipes_id = await user_utils.getFavoriteRecipes(user_id);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    const results = recipes_id_array;
    res.status(200).send(results);
  } catch(error){
    next(error); 
  }
});

router.get('/recipes',async(req,res,next)=>{
  try{
    const user_id = req.session.user_id;
    let favorite_recipes = {};
    const recipes_id = await user_utils.getRecipes(user_id);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    const results = await recipe_utils.getRecipeDetailsLocal(recipes_id_array);
    res.status(200).send(results);
  } catch(error){
    next(error);
  }
});

router.get('/user_last_3_watch', async (req,res,next) => {
  try{

    const user_id = req.session.user_id;
    const results = await user_utils.getLast3Watch(user_id);
    const results2=await user_utils.get_user_Last3Watch(results);
    res.status(200).send(results2);
  } catch(error){
    next(error); 
  }
});

//1.Update in the user_indication_about_recipe Table:the already watchFlage 
//2.Update  the user_last_3_watch Table
router.post('/user_watched_recipe', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;
    const results1 = await user_utils.Update_Table_user_indication_about_recipe(user_id,recipe_id);
    const results2 = await user_utils.Update_User_last_3_watch(user_id,recipe_id);
    res.status(200).send("The Recipe successfully update as an watched recipe");
  } catch(error){
    next(error); 
  }
});

router.get('/user_indication_recipe', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;
    const results = await user_utils.Get_user_indication_about_recipe(user_id,recipe_id);
    res.status(200).send(results);
  } catch(error){
    next(error); 
  }
});

router.get('/user_indication_recipe_NEW', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipes_id = await user_utils.Get_user_indication_about_recipe_NEW(user_id);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    results = recipes_id_array;
    res.status(200).send(results);
  } catch(error){
    next(error); 
  }
});



module.exports = router;