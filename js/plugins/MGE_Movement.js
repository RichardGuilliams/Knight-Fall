//=============================================================================
// Mythic Games Engine - Monster Rpg Menu
// MGE_KnightFall.js
//=============================================================================

var Imported = Imported || {};
Imported.MGE_MovementCore = true;

var Mythic = Mythic || {};
Mythic.MovementCore = Mythic.MovementCore || {};
Mythic.MovementCore.version = 1;

//=============================================================================
/*: 
 * @plugindesc Creates The Menus for MonsterRPG
 * @author Richard Guilliams
 *
 * @help This plugin does not provide plugin commands.
 * 
 * Version 1.00:
 * - Finished plugin!
*/
//=============================================================================

//=============================================================================
// Main Menu
//=============================================================================

Mythic.MovementCore.aliasIsMapPassable = Game_CharacterBase.prototype.isMapPassable
Game_CharacterBase.prototype.isMapPassable = function(x, y, d) {
    // if(Mythic.MovementCore.isFlying.call(this) == true) {
    //     return true;
    // }
    return Mythic.MovementCore.aliasIsMapPassable.call(this, x, d, y);
};


Game_CharacterBase.prototype.isMapPassable = function(x, y, d) {
    var x2 = $gameMap.roundXWithDirection(x, d);
    var y2 = $gameMap.roundYWithDirection(y, d);
    var d2 = this.reverseDir(d);
    return $gameMap.isPassable(x, y, d) && $gameMap.isPassable(x2, y2, d2);
};

Game_Map.prototype.isPassable = function(x, y, d) {
    return this.checkPassage(x, y, (1 << (d / 2 - 1)) & 0x0f);
};

Mythic.MovementCore.isFlying = function(){
    if(this._movementType){
        if(this._movementType.fly == true) return true
        else return false;
    } 
    return false;
}

Mythic.MovementCore.aliasCharacterSetup = Game_Character.prototype.initialize
Game_Character.prototype.initialize = function() {
    Mythic.MovementCore.aliasCharacterSetup.call(this);
    // if(this.isEvent) Mythic.MetaCore.ParseProperties(this);

    Mythic.MovementCore.initMovementTypes.call(this);
};

Mythic.MovementCore.initMovementTypes = function(){
    this._movementType = { walk: false, fly: false, swim: false, phase: false, teleport: false };
} 

Mythic.MovementCore.isEventFlying = function(event, id){
    return false;
    // if(SceneManager._sceneStarted){
    //     if(this.constructor == Game_Player) {
    //         if(this._followers){
    //             console.log(this);
    //             return Mythic.Core.ToBoolean($dataActors[$gameParty._actors[0]].meta.fly);
    //         }
    //         debugger;
    //     }
    // }
    // if(this._movementType){
    //     if(this._movementType.fly === true) {
    //         return true;
    //     }
    // }
    // else return false;
}