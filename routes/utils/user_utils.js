const DButils = require("./DButils");

async function markAsFavorite(user_id, recipe_id){
    await DButils.execQuery(`insert into favoriterecipes values ('${user_id}',${recipe_id})`);
}

async function getFavoriteRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from favoriterecipes where user_id='${user_id}'`);
    return recipes_id;
}

async function getRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from user_created_recipes where user_id='${user_id}'`);
    return recipes_id;
}

async function addNewRecipe(user_id,recipe_id,title,readyInMinutes,image,popularity,vegan,vegetarian,glutenFree,ingredients,instructions,numOfDishes){
    await DButils.execQuery(`insert into recipes (recipe_id,title,readyInMinutes,image,popularity,vegan,vegetarian,glutenFree,ingredients,instructions,numOfDishes) VALUES ('${recipe_id}', '${title}', '${readyInMinutes}',
    '${image}', '${popularity}', '${vegan}', '${vegetarian}', '${glutenFree}', '${ingredients}', '${instructions}', '${numOfDishes}')`);
    if(Number.isInteger(user_id) == false){
        user_id = parseInt(user_id)
    }
    await DButils.execQuery(`insert into user_created_recipes VALUES ('${user_id}','${recipe_id}')`);
}


async function getLast3Watch(user_id){
    const Last3Watch = await DButils.execQuery(`select History_Watch_R1,History_Watch_R2,History_Watch_R3 from user_last_3_watch where user_id='${user_id}'`);
    return Last3Watch;
}

async function Update_Table_user_indication_about_recipe(user_id,recipe_id){
    const DB_ans = await DButils.execQuery(`select * from user_indication_about_recipe where user_id='${user_id}' AND recipe_id='${recipe_id}'`);
    if(DB_ans.length==0){
        const alreadyWatchFlag = Number(1);
        const alreadySaveFlag = Number(0);
        await DButils.execQuery(`insert into user_indication_about_recipe (user_id,recipe_id,alreadySaveFlag,alreadyWatchFlag) VALUES ('${user_id}', '${recipe_id}', '${alreadySaveFlag}', '${alreadyWatchFlag}')`);
    }
    
}
async function Get_user_indication_about_recipe(user_id,recipe_id){
    const DB_ans = await DButils.execQuery(`select * from user_indication_about_recipe where user_id='${user_id}' AND recipe_id='${recipe_id}'`);
    if(DB_ans.length!=0){
        return DB_ans.map((row) => {
            let data = row;
            const{
                alreadyWatchFlag,
                alreadySaveFlag,
            } = data;
            return {
                alreadyWatchFlag: alreadyWatchFlag,
                alreadySaveFlag: alreadySaveFlag,
            }
        })
    }
    else{
        return {
            alreadyWatchFlag: Number(0),
            alreadySaveFlag: Number(0)
        }
    }
    
}

async function Get_user_indication_about_recipe_NEW(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from user_indication_about_recipe where user_id='${user_id}'`);
    return recipes_id;
}

async function Update_User_last_3_watch(user_id,recipe_id){
    const DB_ans = await DButils.execQuery(`select * from user_last_3_watch where user_id='${user_id}'`);
    if(DB_ans.length==0){
        const History_Watch_R1 =recipe_id;
        const History_Watch_R2 =0;
        const History_Watch_R3 =0;
        const alreadySaveFlag = Number(0);
        await DButils.execQuery(`insert into user_last_3_watch (user_id,History_Watch_R1,History_Watch_R2,History_Watch_R3) VALUES ('${user_id}', '${History_Watch_R1}', '${History_Watch_R2}','${History_Watch_R3}')`);
    }
    else{
        //let results=Object.values(JSON.parse(JSON.stringify(DB_ans)));
        let History_Watch_R1 =DB_ans[0].History_Watch_R1;
        let History_Watch_R2 =DB_ans[0].History_Watch_R2;
        let History_Watch_R3 =DB_ans[0].History_Watch_R3;
        History_Watch_R3=History_Watch_R2;
        History_Watch_R2=History_Watch_R1;
        History_Watch_R1=recipe_id;
        console.log(History_Watch_R1);
        console.log(History_Watch_R2);
        console.log(History_Watch_R3);
        await DButils.execQuery(`update user_last_3_watch set History_Watch_R1='${History_Watch_R1}',History_Watch_R2='${History_Watch_R2}',History_Watch_R3='${History_Watch_R3}' where user_id='${user_id}'`);
    }
}
async function get_user_Last3Watch(DB_ans) {
    return DB_ans.map((row) => {
        let data = row;
        const{
            History_Watch_R1,
            History_Watch_R2,
            History_Watch_R3
        } = data;
        return {
            History_Watch_R1: History_Watch_R1,
            History_Watch_R2: History_Watch_R2,
            History_Watch_R3: History_Watch_R3
        }
    })
}


exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.addNewRecipe = addNewRecipe
exports.getRecipes = getRecipes
exports.getLast3Watch=getLast3Watch;
exports.Update_Table_user_indication_about_recipe=Update_Table_user_indication_about_recipe;
exports.Update_User_last_3_watch=Update_User_last_3_watch;
exports.get_user_Last3Watch=get_user_Last3Watch;
exports.Get_user_indication_about_recipe=Get_user_indication_about_recipe;
exports.Get_user_indication_about_recipe_NEW=Get_user_indication_about_recipe_NEW;