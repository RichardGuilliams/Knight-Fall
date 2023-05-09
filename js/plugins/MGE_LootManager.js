//=============================================================================
// Mythic Games Engine - Loot 
// MGE_Loot.js
//=============================================================================

var Imported = Imported || {};
Imported.MGE_Loot = true;

var Mythic = Mythic || {};
Mythic.Loot = Mythic.Loot || {};
Mythic.Loot.version = 1;

//=============================================================================
/*: 
* @plugin desc Allows the crafting of game items..
* @author Richard Guilliams
*
* @help This plugin does not provide plugin commands.
* 
* Version 1.00:
* - Finished plugin!
*/
//=============================================================================

//=============================================================================
// Loot 
//=============================================================================

function Loot(){
    this.initialize.apply(this, arguments);
}    

Loot.prototype.initialize = function(){
    this.inventory = [];
    this.minItems = 0;
    this.maxItems = 0;
    this.minWeapons = 0;
    this.maxWeapons = 0;
    this.minArmors = 0;
    this.maxArmors = 0;
    this.rechargeRate = 0;
    this.rechargeTimer = 0;
    this.readyToLoot = true;
}    

Loot.prototype.Loot = function(){
    if(this.readyToLoot){
        $gameParty.gainItem(this.item, Mythic.Core.RandomNumberWithMin(this.min, this.max), false);
        this.readyToLoot = false;
        this.rechargeTimer = this.rechargeRate;
    }    
}    

Loot.prototype.setRechargeRate = function(rate){
    this.rechargeRate = rate * Mythic.Core.timeInSeconds;
}    

Loot.prototype.update = function(){
    if(this.rechargeTimer > 0){
        this.rechargeTimer -= 1;
    }    
    else this.readyToLoot = true;
}    

Loot.prototype.ITEM = 0;
Loot.prototype.WEAPON = 1;
Loot.prototype.ARMOR = 2;

Loot.prototype.setup = function(type){
    this.inventory = [];
    switch(type){
        case 'Human Bones':
            this.type = 'Human Bones';
            this.setupHumanBonesInventory();
            break;
    } 
    this.createRandomInventory();
    console.log(this.inventory);
};

Loot.prototype.OpenShop = function(){
    Scene.push(Scene_Shop);
    Scene.prepareNextScene(this.inventory, this.inventory[0][4]);
};

Loot.prototype.addItem = function(item){
    if(this.inventory.length == 0) item.push(false);
    this.inventory.push(item);
}

Loot.prototype.setMinMaxItems = function(min, max){
    this.minItems = min;
    this.maxItems = max;
}

Loot.prototype.setMinMaxWeapons = function(min, max){
    this.minWeapons = min;
    this.maxWeapons = max;
}

Loot.prototype.setMinMaxArmors = function(min, max){
    this.minArmors = min;
    this.maxArmors = max;
}


Loot.prototype.setupHumanBonesInventory = function(){
    this.setMinMaxItems(3, 7);
    this.setMinMaxWeapons(0, 3);
    this.setMinMaxArmors(0, 2);    
};

Loot.prototype.createRandomInventory = function(){
    let itemNumber = Mythic.Core.RandomNumber(this.maxItems + 1 - this.minItems) + this.minItems;
    let weaponNumber = Mythic.Core.RandomNumber(this.maxWeapons + 1 - this.minWeapons) + this.minWeapons;
    let armorNumber = Mythic.Core.RandomNumber(this.maxArmors + 1 - this.minArmors) + this.minArmors;
    this.setRandomItems(this.ITEM, $dataItems, itemNumber);
    this.setRandomItems(this.WEAPON, $dataWeapons, weaponNumber);
    this.setRandomItems(this.ARMOR, $dataArmors, armorNumber);
}

/*
* the number of the shopType meta for an item will increase the chance o
*/

Loot.prototype.setRandomItems = function(dataId, data, itemNumber){
    let items = this.getItemList(data); 
    for(let i = 0; i < itemNumber; i++){
        let weightSum = this.getWeightSum(items);
        let item = this.getRandomItem(items, weightSum);
        if(!item) return;
        this.addItem([dataId, item.id ? item.id : items[0].id, 0, 0]);
        items.splice(item.id ? items.indexOf(item) : 0, 1);
    }
}

Loot.prototype.getRandomItem = function(items, weightSum){
    var value = Mythic.Core.RandomNumber(weightSum);
    for(var i = 0; i < items.length; i++){
        value -= items[i].meta[this.type];
        if (value < 0) {
            return  items[i]
        }
    }
}

Loot.prototype.getWeightSum = function(items){
    let sum = 0;
    items.map(el => { sum += parseInt(el.meta[this.type]) });
    return sum;
}

Loot.prototype.getItemList = function(data){
    let items = [];
    data.map( (item, i) => {
        if(!item) return;
        if(item.meta[this.type]){
            items.push(item);
        } 
    })
    return items;
}

//=============================================================================
// Game_Event Setup
//=============================================================================


Game_Event.prototype.setLoot = function(){
    this._loot = new Loot();
}    

Game_Event.prototype.updateLoot = function(){
    this._loot.update();
};    

Game_Event.prototype.readyToLoot = function(){
    return this._loot.readyToLoot;    
};    

Game_Event.prototype.setLootItem = function(type, name, min, max, rate){
    this._loot.setItem(type, name);
    this._loot.setMinMax(min, max);
    this._loot.setRechargeRate(rate);
};    

Game_Event.prototype.Loot = function(){
    this._loot.Loot();
};    

