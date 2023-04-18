//=============================================================================
// Mythic Games Engine - Crafting Core
// MGE_Core.js
//=============================================================================

var Imported = Imported || {};
Imported.MGE_CraftingCore = true;

var Mythic = Mythic || {};
Mythic.CraftingCore = Mythic.CraftingCore || {};
Mythic.CraftingCore.version = 1;

//=============================================================================
/*: 
 * @plugindesc Allows the crafting of game items..
 * @author Richard Guilliamsd
 *
 * @help This plugin does not provide plugin commands.
 * 
 * Version 1.00:
 * - Finished plugin!
*/
//=============================================================================

//=============================================================================
// Crafting
//=============================================================================

Mythic.CraftingCore.Craft = function(){
    let recipe = {
        listItems: []
    };
    // the item used to begin the crafing process
    let itemInUse = $dataSkills[$gameActors._data[$gameParty._menuActorId]._lastMenuSkill._itemId];
    // separates the list of ingredients and their relevant data into an array
    let ingredients = itemInUse.meta.Ingredients.split(';');
    let ingredientsList = [];
    //breaks the array of ingredients into a smaller set of arrays
    ingredients.forEach(element => {
        ingredientsList.push(element.split(',')); 
    });

    ingredientsList.forEach(ingredient => {
        Mythic.CraftingCore.CheckIngredients(ingredient, recipe);
    })

    if(itemInUse.meta.RecipeLength == recipe.listItems.length){
        ingredientsList.forEach(ingredient => {
            Mythic.CraftingCore.UseIngredient(ingredient);
        });

        Mythic.CraftingCore.CreateItem(itemInUse.meta.ItemType, itemInUse.meta.ItemName, itemInUse.meta.ItemQuantity);
        $gameMessage.add(`Congratulations you crafted ${itemInUse.meta.ItemName}`);
    }
}

Mythic.CraftingCore.CheckIngredients = function(ingredient, recipe){
    switch(ingredient[0]){
        case "Item": 
            Mythic.CraftingCore.CreateRecipe($gameParty._items, $dataItems, ingredient, recipe);
            break;
        
        case "Weapon":
            Mythic.CraftingCore.CreateRecipe($gameParty._weapons, $dataWeapons, ingredient, recipe);
            break;
            
        case "Armor":
            Mythic.CraftingCore.CreateRecipe($gameParty._armors, $dataArmors, ingredient, recipe);
            break;
    }
}

Mythic.CraftingCore.CreateRecipe = function(partyData, gameData, ingredient, recipe){
    [itemType, itemName, itemQuantity] = ingredient;
    if(partyData[Mythic.Core.GetIDByName(gameData, itemName)] == undefined) return $gameMessage.add(`You dont have ${itemName}`);
    if(partyData[Mythic.Core.GetIDByName(gameData, itemName)] < itemQuantity) return $gameMessage.add(`You need ${itemQuantity - $gameParty._items[MGE_GetIdByName($dataItems, itemName)]} more ${itemName} to craft this item`);
    else recipe.listItems.push([itemType, itemName, itemQuantity]);
}


Mythic.CraftingCore.UseIngredient = function(ingredient){
    [itemType, itemName, itemQuantity] = ingredient;
    switch(itemType){
        case "Item": 
            $gameParty.loseItem($dataItems[Mythic.Core.GetIDByName($dataItems, itemName)], parseInt(itemQuantity), false);
        break;

        case "Weapon":
            $gameParty.loseItem($dataWeapons[Mythic.Core.GetIDByName($dataWeapons, itemName)], parseInt(itemQuantity), false);
            break;

        case "Armor":
            $gameParty.loseItem($dataArmors[Mythic.Core.GetIDByName($dataArmors, itemName)], parseInt(itemQuantity), false);
            break;
        }
}

Mythic.CraftingCore.CreateItem = function(itemType, itemName, itemQuantity){
    switch(itemType){
        case "Item": 
            $gameParty.gainItem($dataItems[Mythic.Core.GetIDByName($dataItems, itemName)], parseInt(itemQuantity), false);
        break;

        case "Weapon":
            $gameParty.gainItem($dataWeapons[Mythic.Core.GetIDByName($dataWeapons, itemName)], parseInt(itemQuantity), false);
            break;

        case "Armor":
            $gameParty.gainItem($dataArmors[Mythic.Core.GetIDByName($dataArmors, itemName)], parseInt(itemQuantity), false);
            break;
        }
}
