//=============================================================================
// Mythic Games Engine - Harvest Manager
// MGE_HarvestManager.js
//=============================================================================

var Imported = Imported || {};
Imported.MGE_HarvestManager = true;

var Mythic = Mythic || {};
Mythic.HarvestManager = Mythic.HarvestManager || {};
Mythic.HarvestManager.version = 1;

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
// Harvest Manager
//=============================================================================

function HarvestManager(){
    this.initialize.apply(this, arguments);
}

HarvestManager.prototype.initialize = function(){
    this.item = {};
    this.min = 0;
    this.max = 0;
    this.rechargeRate = 0;
    this.rechargeTimer = 0;
    this.readyToHarvest = true;
}

HarvestManager.prototype.harvest = function(){
    if(this.readyToHarvest){
        $gameParty.gainItem(this.item, Mythic.Core.RandomNumberWithMin(this.min, this.max), false);
        this.readyToHarvest = false;
        this.rechargeTimer = this.rechargeRate;
    }
}

HarvestManager.prototype.setRechargeRate = function(rate){
    this.rechargeRate = rate * Mythic.Core.timeInSeconds;
}

HarvestManager.prototype.setItem = function(type, name){
    this.item = Mythic.Core.GetGameDataByName(type).find( el => { if(el) return el.name == name })
}

HarvestManager.prototype.setMinMax = function(min, max){
    this.min = min;
    this.max = max;
}

HarvestManager.prototype.update = function(){
    if(this.rechargeTimer > 0){
        this.rechargeTimer -= 1;
    }
    else this.readyToHarvest = true;
}

//=============================================================================
// Game_Event Setup
//=============================================================================


Game_Event.prototype.setHarvestManager = function(){
    this._harvestManager = new HarvestManager();
}

Game_Event.prototype.updateHarvestManager = function(){
    this._harvestManager.update();
};

Game_Event.prototype.readyToHarvest = function(){
    return this._harvestManager.readyToHarvest;    
};

Game_Event.prototype.setHarvestItem = function(type, name, min, max, rate){
    this._harvestManager.setItem(type, name);
    this._harvestManager.setMinMax(min, max);
    this._harvestManager.setRechargeRate(rate);
};

Game_Event.prototype.Harvest = function(){
    this._harvestManager.harvest();
};

