//=============================================================================
// Mythic Games Engine - Flying Object Shadows
// MGE_KnightFallMenu.js
//=============================================================================

var Imported = Imported || {};
Imported.MGE_FlyingShadow = true;

var Mythic = Mythic || {};
Mythic.FlyingShadow = Mythic.FlyingShadow || {};
Mythic.FlyingShadow.version = 1;

//=============================================================================
/*: 
 * @plugindesc Creates shadows for events and characters on the map
 * @author Richard Guilliams
 *
 * @help This plugin does not provide plugin commands.
 * 
 * Version 1.00:
 * - Finished plugin!
*/
//=============================================================================

//=============================================================================
// Shadow
//=============================================================================


Mythic.FlyingShadow.aliasUpdateShadow = Mythic.Shadow.updateShadow
Mythic.Shadow.updateShadow = function(){
    Mythic.FlyingShadow.aliasUpdateShadow.call(this);
    if(Mythic.MovementCore.isEventFlying.call(this._character)){
        this._character._through = true;
        this.anchor.y = 2;
        this._z = 1;
        this._scale = 2;
        this._character.y = -48
    }
    else Mythic.Shadow.defaultShadow.call(this, event);
}


Mythic.FlyingShadow.spriteCharacterUpdatePosition = Sprite_Character.prototype.updatePosition;
Sprite_Character.prototype.updatePosition = function() {
    Mythic.FlyingShadow.spriteCharacterUpdatePosition.call(this);
    this.z = this._z;
};

Sprite_Character.prototype._z = 0;

// Game_CharacterBase.prototype.z = function(){
//     return this._z;
// }
// Game_CharacterBase.prototype._z = 0;
// Game_CharacterBase.prototype.screenZ = function() {
//     return this._priorityType * 2 + 1 + this.z();
// };
