//=============================================================================
// Mythic Games Engine - Knight Fall Menu
// MGE_KnightFallMenu.js
//=============================================================================

var Imported = Imported || {};
Imported.MGE_Shadow = true;

var Mythic = Mythic || {};
Mythic.Shadow = Mythic.Shadow || {};
Mythic.Shadow.version = 1;

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



Sprite_Character.prototype.update = function() {
    Sprite_Base.prototype.update.call(this);
    this.updateBitmap();
    this.updateFrame();
    if(this.hasName.call(this)) Mythic.Shadow.update.call(this);
    this.updatePosition();
    this.updateAnimation();
    this.updateBalloon();
    this.updateOther();
};

Mythic.Shadow.createShadowSprite = function() {
    if(this.hasName()){
        this._shadowSprite = new Sprite();
        this._shadowSprite.bitmap = ImageManager.loadSystem('Shadow1');
        this._shadowSprite.anchor.x = 0.5;
        this._shadowSprite.anchor.y = 0.86;
        this._shadowSprite.anchor.z = 1;
        this.addChild(this._shadowSprite);
    }
};

Mythic.Shadow.aliasSpriteCharacterInit = Sprite_Character.prototype.initialize;
Sprite_Character.prototype.initialize = function(character) {
    Mythic.Shadow.aliasSpriteCharacterInit.call(this, character);
    if(this.hasName()) Mythic.Shadow.createShadowSprite.call(this);
};

Mythic.Shadow.update = function() {
    if(this._shadowSprite) Mythic.Shadow.updateShadow.call(this);
}

Mythic.Shadow.updateShadow = function(){
    Mythic.Shadow.defaultShadow.call(this);
};
    
Mythic.Shadow.defaultShadow = function(){
    if(this._shadowSprite){
        this._shadowSprite.x = 0;
        this._shadowSprite.y = 0;
        this._shadowSprite.opacity = 150;
    }
}