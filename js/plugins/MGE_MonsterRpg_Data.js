//=============================================================================
// Mythic Games Engine - Monster RPG
// MGE_MonsterRPG.js
//=============================================================================

var Imported = Imported || {};
Imported.MGE_MonsterRPG = true;

var Mythic = Mythic || {};
Mythic.MonsterRPG = Mythic.MonsterRPG || {};
Mythic.MonsterRPG.version = 1;

//=============================================================================
/*: 
 * @plugindesc Allows the Meta of game items..
 * @author Richard Guilliams
*
 * @help This plugin does not provide plugin commands.
 * 
 * Version 1.00:
 * - Finished plugin!
*/
//=============================================================================

//Game Parameters 

//=============================================================================
// Set Player Meta
//=============================================================================

Game_Player.prototype.checkEventTriggerThere = function(triggers) {
    if (this.canStartLocalEvents()) {
        var direction = this.direction();
        var x1 = this.x;
        var y1 = this.y;
        var x2 = Mythic.Core.GetEventXWhileFlying();
        var y2 = Mythic.Core.GetEventYWhileFlying();
        this.startMapEvent(x2, y2, triggers, true);
        if (!$gameMap.isAnyEventStarting() && $gameMap.isCounter(x2, y2)) {
            var x3 = $gameMap.roundXWithDirection(x2, direction);
            var y3 = $gameMap.roundYWithDirection(y2, direction);
            this.startMapEvent(x3, y3, triggers, true);
        }
    }
};

Mythic.MonsterRPG.aliasActorInit = Game_Actor.prototype.initialize;
Game_Actor.prototype.initialize = function(actorId) {
    Mythic.MonsterRPG.aliasActorInit.call(this, actorId);
    Mythic.MonsterRPG.convertActorMeta.call(this, actorId);
};

Mythic.MonsterRPG.convertActorMeta = function(actorId){
    let actor = $dataActors[actorId];
    if(!actor) return;
    if(actor.meta._fly) Mythic.MetaCore.convertMetaToProperty(actor, '_movementTypes', '_fly', actor.meta._fly);
    if(actor.meta._walk) Mythic.MetaCore.convertMetaToProperty( actor, '_movementTypes', '_walk', actor.meta._walk);
    if(actor.meta._phase) Mythic.MetaCore.convertMetaToProperty(actor, '_movementTypes', '_phase', actor.meta._phase);
    if(actor.meta._teleport) Mythic.MetaCore.convertMetaToProperty(actor, '_movementTypes', '_teleport', actor.meta._teleport);
    if(actor.meta._swim) Mythic.MetaCore.convertMetaToProperty(actor, '_movementTypes', '_swim', actor.meta._swim);
}

//=============================================================================
// Set Event Meta
//=============================================================================

Mythic.MonsterRPG.aliasEventInit = Game_Event.prototype.initialize;
Game_Event.prototype.initialize = function(mapId, eventId) {
    Mythic.MonsterRPG.aliasEventInit.call(this, mapId, eventId);
    this.setEventMeta(eventId);
};

Game_CharacterBase.prototype.ticksInSeconds = 60;
Game_CharacterBase.prototype.ticksInMinutes = Game_CharacterBase.prototype.ticksInSeconds * 60;

Game_Event.prototype.setEventMeta = function(eventId){
    this.name = $dataMap.events[eventId].name;
    this.meta = $dataMap.events[eventId].meta
    if(this.meta.Breeding) this.setBreedingData();
}

Game_Event.prototype.setBreedingData = function(){
    if(!this.meta.Breeding) return;
    else {
        this.isMale = Math.floor(Math.random() * 2);
        this.canBreed = true;
        this.isCoolingDown = false;
        this.isBreeding = false;
        this.breedingCoolDown = parseInt(this.meta.BreedingCoolDown);
        this.breedingRange = parseInt(this.meta.BreedingRange);
        this.breedingSpeed = parseInt(this.meta.BreedingSpeed);
        this.coolDownTime = this.breedingCoolDown * this.ticksInSeconds;
        this.breedingTime = this.breedingSpeed * this.ticksInSeconds;
    }
};

Game_Event.prototype.update = function() {
    Game_Character.prototype.update.call(this);
    this.checkEventTriggerAuto();
    this.updateParallel();
    if(this.canBreed) this.updateBreeding();
};

Game_Event.prototype.updateBreeding = function() {
    if(this.canBreed){
        $gameMap._events.forEach( (character, i) => {
            if(!this.canBreed) return
            if(this._eventId == i) return;
            if(!this.sameName(character)) return;
            if(this.outOfXBreedingRange(character) && this.outOfYBreedingRange(character)) return
            if (this.isMale == character.isMale) return 
            if (!this.isBreeding && !this.isCoolingDown) this.isBreeding = true;
            if (this.isBreeding && !this.isCoolingDown) this.breed();
        })
        if (!this.isBreeding && this.isCoolingDown) this.coolDownBreeding();
    }
}

Game_Event.prototype.outOfXBreedingRange = function(event){
    if(event._x >= this._x + this.breedingRange || event._x <= this._x - this.breedingRange) return true;
    return false;
}

Game_Event.prototype.outOfYBreedingRange = function(event){
    if(event._y >= this._y + this.breedingRange || event._y <= this._y - this.breedingRange) return true;
    return false;
}

Game_Event.prototype.characterSprite = function(){   
    let sprite;
    SceneManager._scene.children[0]._characterSprites.forEach( (character, i) => {
        if(character._character._eventId == this._eventId){
            sprite = SceneManager._scene.children[0]._characterSprites[i]
        } 
            
    })
    return sprite;
}

Game_Event.prototype.ANIMATION_COUNT = 0;
Game_Event.prototype.BREEDING_COUNT = 0;

Game_Event.prototype.breed = function(character){
    if(this.isBreeding == false) this.isBreeding = true;
    else {
        if(this.breedingTime > 0) {
            if(!this._animationPlaying && this._animationId == 0 && this.characterSprite()._animationSprites.length <= 0) {
                this.requestAnimation(120);
                this.animationPlaying = true;
                console.log(this._animationPlaying, this._animationId)
            }
            // console.log(this.characterSprite()._animationSprites);
            // if(!this._balloonPlaying && this._balloonId == 0) {
                //     this.requestBalloon(4)
                // }
                this.breedingTime = this.breedingTime - 1;
                if(this.characterSprite()._animationSprites.length > 0) console.log(this.characterSprite()._animationSprites); 

        }
        if (this.breedingTime <= 0) {
            this.BREEDING_COUNT;
            this._animationCount = 0;
            this.characterSprite()._animationFrames = null;
            this.completeBreeding(character);
        }
    }
}

// Sprite_Character.prototype.startBalloon = function() {
//     if (!this._balloonSprite) {
//         if(this._character.isBreeding) this._balloonSprite = new Sprite_Balloon(.5, .5, .5)
//         else this._balloonSprite = new Sprite_Balloon(1, 1, .5);
//     }
//     this._balloonSprite.setup(this._character.balloonId());
//     this.parent.addChild(this._balloonSprite);
// };

// Sprite_Balloon.prototype.initialize = function(scale, xAnchor, yAnchor) {
//     Sprite_Base.prototype.initialize.call(this);
//     this.initMembers();
//     this.loadBitmap();
//     if(scale) this.initScale(scale, xAnchor, yAnchor);
// };

// Sprite_Balloon.prototype.initScale = function(scale, xAnchor, yAnchor){
//     this.transform.scale._x = scale;
//     this.transform.scale._y = scale;
//     this.anchor._x = xAnchor;
//     this.anchor._y = yAnchor
// }



Game_Event.prototype.coolDownBreeding = function(){
    if(this.coolDownTime > 0) this.coolDownTime -= 1;
    else if(this.coolDownTime == 0) {
        this.isCoolingDown = false;
        this.coolDownTime = this.breedingCoolDown * this.ticksInSeconds;
    }
}

Game_Event.prototype.completeBreeding = function(character){
    console.log('Breeding Complete');
    if(this.isMale == 0) this.SpawnEggBehindMonster();
    this.isCoolingDown = true;
    this.isBreeding = false;
    this.breedingTime = this.breedingSpeed * this.ticksInSeconds;
}

Game_Event.prototype.sameName = function(character){
    return this.name === character.name;
}

Game_Event.prototype.SpawnEggBehindMonster = function(){
    // Left
    if(this.direction() == 4) return Mythic.EventSpawner.SpawnEvent('Egg Green', this._realX + 1, this._realY);
    // Right
    if(this.direction() == 6) return Mythic.EventSpawner.SpawnEvent('Egg Green', this._realX - 1, this._realY);
    // Down
    if(this.direction() == 2) return Mythic.EventSpawner.SpawnEvent('Egg Green', this._realX, this._realY - 1);
    // Up
    if(this.direction() == 8) return Mythic.EventSpawner.SpawnEvent('Egg Green', this._realX, this._realY + 1);
}
//=============================================================================
// Set Game Enemy Meta
//=============================================================================

//=============================================================================
// Game_Battler
//=============================================================================

Mythic.MonsterRpg.aliasGameBattlerInit = Game_BattlerBase.prototype.initMembers;
Game_BattlerBase.prototype.initMembers = function() {
    Mythic.MonsterRpg.aliasGameBattlerInit.call(this)

    Mythic.MonsterRpg.initAptitudes.call(this);
    Mythic.MonsterRpg.initTypes.call(this);
};

Mythic.MonsterRpg.initAptitudes = function(){
    this._typeAptitudes = {
        _fire: 0,
        _water: 0,
        _earth: 0,
        _wind: 0,
        _electric: 0,
        _flying: 0,
        _dragon: 0,
        _bug: 0,
        _plant: 0,
        _light: 0,
        _beast: 0,
        _dark: 0
    }
}



Mythic.MonsterRPG.initTypes = function(){
    this._elementalTypes = {
        _fire: false,
        _water: false,
        _earth: false,
        _air: false,
        _holy: false,
        _unholy: false
    }
}

//=============================================================================
// Game_Character
//=============================================================================

// Mythic.MonsterRPG.Game_CharacterBase_initMembers = Game_CharacterBase.prototype.initMembers 
// Game_CharacterBase.prototype.initMembers = function() {
//     Mythic.MonsterRPG.Game_CharacterBase_initMembers.call(this);
//     Mythic.MonsterRPG.initBreedingData.call(this);
// };

// Mythic.MonsterRPG.initBreedingData = function(){
//     this._breedingData = {
//         _isMale: false,
//         _canBreed: false,
//         _isBreeding: false,
//         _isParent: false,
//         _isChild: false,
//         _parents: [],
//         _breedingRange: 0,
//         _incubationTime: 0,
//         _isEgg: false,
//         _hatchingTime: 0,
//         _timesMated: 0
//     }
// };


Game_Enemy.prototype.initialize = function(enemyId, x, y) {
    Game_Battler.prototype.initialize.call(this);
    this.setup(enemyId, x, y);
    this.setMeta(enemyId);
};

Game_Enemy.prototype.setStealItems = function(meta){
    if(meta.StealItems != undefined){
        this._stealItems = Mythic.MetaCore.getArrayFromMetaData(meta.StealItems, ',');
        this._stealItems.map( (item, i) => {
            this._stealItems[i] = item.split('-');
            Mythic.MetaCore.ConvertStringToNum(this._stealItems[i]);
        })
    }
}

Game_Enemy.prototype.setDropItems = function(meta){
    if(meta.DropItems != undefined){
        this._dropItems = Mythic.MetaCore.getArrayFromMetaData(meta.DropItems, ',');
        this._dropItems.map( (item, i) => {
            this._dropItems[i] = item.split('-');
            Mythic.MetaCore.ConvertStringToNum(this._dropItems[i]);
        })
    }
}

Game_Enemy.prototype.setRank = function(meta){
    if(meta.Rank != undefined)  this._rank = meta.Rank;
}

Game_Enemy.prototype.setTypes = function(meta){
    if(meta.Types != undefined) this._types = Mythic.MetaCore.getArrayFromMetaData(meta.Types, ',');
}



Game_Enemy.prototype.setMeta = function(enemyId){
    let meta = $dataEnemies[enemyId].meta;
    this.setStealItems(meta);
    this.setDropItems(meta);
    this.setRank(meta);
    this.setTypes(meta);
};


Mythic.MonsterRPG.setEnemyMeta = function(battler, enemyId){
    let meta = $dataEnemies[enemyId].meta
    battler._stealItems = Mythic.MetaCore.getArrayFromMetaData(meta.StealItems, ',').split('-');
    // console.log(battler);
}


Mythic.MonsterRPG.update = function(){
    
};