//=============================================================================
// Mythic Games Engine - Breeding Core
// MGE_Core.js
//=============================================================================

var Imported = Imported || {};
Imported.MGE_BreedingCore = true;

var Mythic = Mythic || {};
Mythic.BreedingCore = Mythic.BreedingCore || {};
Mythic.BreedingCore.version = 1;

//=============================================================================
/*: 
 * @plugindesc Allows the copying of various game data arrays.
 * @author Richard Guilliams
 *
 * @help This plugin does not provide plugin commands.
 * 
 * Version 1.00:
 * - Finished plugin!
*/
//=============================================================================

//=============================================================================
// Breeding Manager
//=============================================================================

function BreedingManager(){
    this.initialize.apply(this, arguments);
}

BreedingManager.prototype.initialize = function(){
    this.gender = 0;
    this.timesBred = 0;
    this.breedingRange = 0;
    this.breedingTime = 0;
    this.coolDownTime = 0;
    this.isCoolingDown = false;
    this.canBreed = false;
    this.isBreeding = false;
}

BreedingManager.prototype.setup = function(){

}

BreedingManager.prototype.updateBreeding = function(){

}

BreedingManager.prototype.breed = function(){
    
}

BreedingManager.prototype.coolDownBreeding = function(){
    
}

BreedingManager.prototype.completeBreeding = function(){
    
}

BreedingManager.prototype.spawnEggBehindMonster = function(){
    
}

BreedingManager.prototype.outOfBreedingXRange = function(){
    
}

BreedingManager.prototype.outOfBreedingYRange = function(){
    
}



// Game_Event.prototype.breed = function() {
//     if(this.canBreed){
//         $gameMap._events.forEach( (character, i) => {
//             if(!character) return;
//             if(!this.canBreed) return
//             if(this._eventId == i) return;
//             if(!this.sameName(character)) return;
//             if(this.outOfXBreedingRange(character) && this.outOfYBreedingRange(character)) return
//             if (this.isMale == character.isMale) return 
//             if (!this.isBreeding && !this.isCoolingDown) this.isBreeding = true;
//             if (this.isBreeding && !this.isCoolingDown) this.breed(character);
//         })
//         if (!this.isBreeding && this.isCoolingDown) this.coolDownBreeding();
//     }
// }


// Game_Event.prototype.breed = function(character){
//     if(this.isBreeding == false){
//         this.isBreeding = true;
//     } 
//     else {
//         if(this.breedingTime > 0) {
//             this.breedingTime = this.breedingTime - 1;
//         }
//         if (this.breedingTime <= 0) {
//             this.completeBreeding(character);
//         }
//     }
// }

// Game_Event.prototype.coolDownBreeding = function(){
//     if(this.coolDownTime > 0) this.coolDownTime -= 1;
//     else if(this.coolDownTime == 0) {
//         this.isCoolingDown = false;
//         this.coolDownTime = this.breedingCoolDown * this.ticksInSeconds;
//     }
// }

// Game_Event.prototype.completeBreeding = function(character){
//     // console.log('Breeding Complete');
//     if(this.isMale == 0) this.SpawnEggBehindMonster(character);
//     this.isCoolingDown = true;
//     this.isBreeding = false;
//     this.breedingTime = this.breedingSpeed * this.ticksInSeconds;
// }

// Game_Event.prototype.sameName = function(character){
//     return this.name === character.name;
// }

// Game_Event.prototype.SpawnEggBehindMonster = function(character){
//     // Left
//     if(this.direction() == 4) return Mythic.EventSpawner.SpawnEventWithParentData(this, character, 'Egg Green', this._realX + 1, this._realY);
//     // Right
//     if(this.direction() == 6) return Mythic.EventSpawner.SpawnEventWithParentData(this, character, 'Egg Green', this._realX - 1, this._realY);
//     // Down
//     if(this.direction() == 2) return Mythic.EventSpawner.SpawnEventWithParentData(this, character, 'Egg Green', this._realX, this._realY - 1);
//     // Up
//     if(this.direction() == 8) return Mythic.EventSpawner.SpawnEventWithParentData(this, character, 'Egg Green', this._realX, this._realY + 1);
// }

// Game_Event.prototype.outOfXBreedingRange = function(event){
//     if(event._x >= this._x + this.breedingRange || event._x <= this._x - this.breedingRange) return true;
//     return false;
// }

// Game_Event.prototype.outOfYBreedingRange = function(event){
//     if(event._y >= this._y + this.breedingRange || event._y <= this._y - this.breedingRange) return true;
//     return false;
// }


// Game_Event.prototype.setBreedingData = function(){
//     if(!this.meta.Breeding) return;
//     else {
//         this.isMale = Math.floor(Math.random() * 2);
//         this.canBreed = true;
//         this.isBreeding = false;
//         this.breedingCoolDown = parseInt(this.meta.BreedingCoolDown);
//         this.breedingRange = parseInt(this.meta.BreedingRange);
//         this.breedingSpeed = parseInt(this.meta.BreedingSpeed);
//         this.coolDownTime = this.breedingCoolDown * this.ticksInSeconds;
//         this.breedingTime = this.breedingSpeed * this.ticksInSeconds;
//     }
// };