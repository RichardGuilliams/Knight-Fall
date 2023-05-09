//=============================================================================
// Mythic Games Engine - Event
// MGE_Core.js
//=============================================================================

var Imported = Imported || {};
Imported.MGE_Event = true;

var Mythic = Mythic || {};
Mythic.Event = Mythic.Event || {};
Mythic.Event.version = 1;

//=============================================================================
/*: 
 * @plugindesc Allows the Event of game items..
 * @author Richard Guilliamsd
 *
 * @help This plugin does not provide plugin commands.
 * 
 * Version 1.00:
 * - Finished plugin!
*/
//=============================================================================

//=============================================================================
// Event
//=============================================================================

//=============================================================================
// Loot 
//=============================================================================

function Loot(){
    this.initialize.apply(this, arguments);
}    

Loot.prototype.initialize = function(){
    this.inventory = [];
}    

Loot.prototype.ITEM = 0;
Loot.prototype.WEAPON = 1;
Loot.prototype.ARMOR = 2;

Loot.prototype.addItem = function(type, name, min, max, weight){
    let item = Mythic.Core.GetItemByName(type, name);
    this.inventory.push({item, min, max, weight});
}

Loot.prototype.getRandomItem = function(){
    var value = Mythic.Core.RandomNumber(this.getWeightSum());
    for(i = 0; i < this.inventory.length; i++){
        value -= this.inventory[i].weight;
        if(value < 0) return this.inventory[i];
    }
}

Loot.prototype.getWeightSum = function(){
    let sum = 0;
    this.inventory.map( (el) => { sum += el.weight });
    return sum;
}

Loot.prototype.loot = function(){
    let item = this.getRandomItem();
    let quantity = Mythic.Core.RandomNumberWithMin(item.min, item.max);
    $gameParty.gainItem(item.item, quantity, false);
    $gameMessage._positionType = 0;
    $gameMessage.add(`You have found ${quantity} ${item.item.name}`)
}    

//=============================================================================
// Game_Event Setup
//=============================================================================

Game_Event.prototype.initLoot = function(){
    this._loot = new Loot();
}    

Game_Event.prototype.addItem = function(type, name, min, max, weight){
    this._loot.addItem(type, name, min, max, weight);
};    

Game_Event.prototype.loot = function(){
    this._loot.loot();
};    

