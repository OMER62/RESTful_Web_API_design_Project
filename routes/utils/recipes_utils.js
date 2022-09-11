const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";
const DButils = require("./DButils");



/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info 
 */


async function getRecipeInformation(recipe_id) {
    return await axios.get(`${api_domain}/${recipe_id}/information`, {
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey
        }
    });
}

async function getRecipeInformationLocal(recipe_id) {
    console.log(recipe_id)
    //sql error when user doesnt have recipes
    const response =  await DButils.execQuery(`select recipe_id,title,readyInMinutes,image,popularity,vegan,vegetarian,glutenFree,ingredients,instructions,numOfDishes from recipes where recipe_id in (${recipe_id})`);
    return response;
}

async function getRandomRecipes(){
    const response = await axios.get(`${api_domain}/random`,{
        params:{
            number: 3,
            apiKey: process.env.spooncular_apiKey
        }
    });
    return response;
}

function extractPreviewRecipeDetails(recipes_info){
    return recipes_info.map((recipe_info) => {
        let data = recipe_info;
        if(recipe_info.data){
            data=recipe_info.data
            
        }
        let{
            id,
            title,
            readyInMinutes,
            image,
            aggregateLikes,
            vegan,
            vegetarian,
            glutenFree,
            instructions,
            analyzedInstructions,
            extendedIngredients,
        } = data;
        return {
            id:id,
            title: title,
            readyInMinutes: readyInMinutes,
            image: image,
            popularity: aggregateLikes,
            vegan: vegan,
            vegetarian: vegetarian,
            glutenFree: glutenFree,
            instructions: instructions,
            analyzedInstructions:analyzedInstructions,
            extendedIngredients: extendedIngredients,
        }
    })
}



async function getRecipeDetails(recipe_id) {
    let recipe_info = await getRecipeInformation(recipe_id);
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree,  instructions, extendedIngredients, analyzedInstructions} = recipe_info.data;
    //extendedIngredients = await getRecipeIngredients(extendedIngredients)
    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
        instructions: instructions,
        extendedIngredients: extendedIngredients,
        analyzedInstructions: analyzedInstructions
        
    }
}

async function getRecipeDetailsMultiple(recipe_id_array) {
    results = [];
    console.log(recipe_id_array)
    for (index = 0; index < recipe_id_array.length; index++) {
        console.log(recipe_id_array[index]);
        results.push(await getRecipeDetails(recipe_id_array[index]));
    }
    return results;
}

async function getRecipeIngredients(ingredients) {
    return ingredients.map((recipe_info) => {
        let data = recipe_info;
        const{
            name,
            amount,
            unit
        } = data;
        return {
            name: name,
            amount: amount,
            unit: unit
        }
    })
}

async function getRecipeDetailsLocal(id) {
    console.log(id)
    let recipe_info = await getRecipeInformationLocal(id);
    //console.log(recipe_info)
    return recipe_info.map((recipe_info) => {
        let data = recipe_info;
        const{
            recipe_id,
            title,
            readyInMinutes,
            image,
            popularity,
            vegan,
            vegetarian,
            glutenFree,
            ingredients,
            instructions,
            numOfDishes,
        } = data;
        return {
            recipe_id: recipe_id,
            title: title,
            readyInMinutes: readyInMinutes,
            image: image,
            popularity: popularity,
            vegan: Boolean(vegan),
            vegetarian: Boolean(vegetarian),
            glutenFree: Boolean(glutenFree),
            ingredients: ingredients,
            instructions: instructions,
            numOfDishes: numOfDishes,
        }
    })
}

async function getRandomThreeRecipes() {
    let random_pool = await getRandomRecipes();
    return extractPreviewRecipeDetails(random_pool.data.recipes)
}




exports.getRecipeDetails = getRecipeDetails;
exports.getRecipeInformationLocal = getRecipeInformationLocal;
exports.getRecipeDetailsLocal = getRecipeDetailsLocal;
exports.getRandomThreeRecipes = getRandomThreeRecipes;
exports.extractPreviewRecipeDetails = extractPreviewRecipeDetails;
exports.getRecipeDetailsMultiple = getRecipeDetailsMultiple;


