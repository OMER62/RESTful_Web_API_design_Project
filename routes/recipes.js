var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");
const search_utils = require("./utils/search_utils")

router.get("/", (req, res) => res.send("im here"));

/**
 * This path returns 3 random recipes from the spooncular api
 */
router.get("/random",async (req,res,next)=>{
  try{
    let random_3_recipes = await recipes_utils.getRandomThreeRecipes();
    res.send(random_3_recipes);
  } catch(error){
    next(error);
  }
});


/**
 * This path returns a full details of a recipe by its id
 */
router.get("/:recipeId", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeDetails(req.params.recipeId);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

router.get("/search/query/:searchQuery/amount/:num",async (req,res,next)=>{
  const{searchQuery,num} = req.params;
  //set search parameters
  search_params = {};
  search_params.query = searchQuery;
  search_params.number = num;
  search_params.instructionsRequired=true;
  search_params.addRecipeInformation=true;
  search_params.apiKey = process.env.spooncular_apiKey;
  //give a defualt num
  if(num != 5 && num != 10 && num != 15){
    search_params.number = 5;
  }
  search_utils.extractQueryParams(req.query,search_params)
  try{
    search_utils.searchForRecipes(search_params)
    .then((recipes)=> 
    {
      res.send(recipes_utils.extractPreviewRecipeDetails(recipes.data.results))
    })
  } catch(error){
    next(error);
  }

});
module.exports = router;
