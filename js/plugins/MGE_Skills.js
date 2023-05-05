//=============================================================================
// Mythic Games Engine - Skills
// MGE_Core.js
//=============================================================================

var Imported = Imported || {};
Imported.MGE_Skills = true;

var Mythic = Mythic || {};
Mythic.Skills = Mythic.Skills || {};
Mythic.Skills.version = 1;

//=============================================================================
/*: 
 * @plugindesc Creates and Modifies important parameters of the games base objects.
 * @author Richard Guilliamsd
 *
 * @help This plugin does not provide plugin commands.
 * 
 * Version 1.00:
 * - Finished plugin!
*/
//=============================================================================

// function StealableItems(){
//     this.initialize.apply(this, arguments);
// }

// StealableItems.prototype.initialize = function(){
//     this.items = [];
// }

// StealableItems.prototype.addItem = function(item, quantity, chance){
//     let item = { item, quantity, chance};
//     this.items.push(item);
// };

// StealableItems.prototype.stealRate = function(subject, target){
//     let attackingRoll = ((subject.luk * subject._level) + subject.agi);
//     let defendingRoll = ((target.luk * target.lvl) + target.agi);
//     return attackingRoll - defendingRoll / 2

// };

// StealableItems.prototype.steal = function(subject, target){
//     let item = Mythic.Core.RandomNumber(this.items.length);
//     let roll = Mythic.Core.RandomNumber(this.stealRate(subject, target));
//     if(roll >= this.items[item].chance) return true;
//     return false;
// }

//=============================================================================
// Skills
//=============================================================================

Mythic.Skills.Lure = function(){
    let map = $dataMap.meta;

    encounterList = map.LureEncounters.split(';');
    let encounters = [];
    encounterList.forEach(e => {
        encounters.push(e.split(','));
    })

    $gameMessage.add(`An enemy approaches.`);

    let encounter = Math.floor(Math.random() * encounterList.length);
     
    BattleManager.setup(parseInt(encounters[encounter][0]), encounters[encounter][1], encounters[encounter][2]);
    SceneManager.push(Scene_Battle);
}



BattleManager.startAction = function() {
    var subject = this._subject;
    var action = subject.currentAction();
    var targets = action.makeTargets();
    this._phase = 'action';
    this._action = action;
    this._targets = targets;
    subject.useItem(action.item());
    this._action.applyGlobal();
    this.refreshStatus();
    this._logWindow.startAction(subject, action, targets);
};

//=============================================================================
// Game_Enemy
//=============================================================================
// Mythic.Skills.Initialize_Game_Enemy = Game_Enemy.prototype.initialize;
// Game_Enemy.prototype.initialize = function(){
//     this.initStealData();
//     Mythic.Skills.Initialize_Game_Enemy.call(this);
// }

// Game_Enemy.prototype.initStealData = function(){
//     this._canSteal = false;
//     this._stealCount = 0;
//     this._stealItems = [];
// }

// Game_Enemy.prototype.canSteal = function() {
    //     if (this.stealable && this.stealable.canSteal()) {
        //         return true;
        //     }
        //     return false;
        // };
        
        //=============================================================================
        // BattleManager
        //=============================================================================

        Mythic.Skills.apply = Game_Action.prototype.apply;
        Game_Action.prototype.apply = function(target) {
            if(this.item().meta.MGE_Skill){
                this.processSpecialSkill();
            }
            Mythic.Skills.apply.call(this, target);
};

Mythic.Skills.applyItemEffect = Game_Action.prototype.applyItemEffect 
Game_Action.prototype.applyItemEffect = function(target, effect) {
    Mythic.Skills.applyItemEffect.call(this, target, effect);
    switch (effect.code) {
        case Game_Action.EFFECT_STEAL:
            this.itemEffectSteal(target, effect);
            break;
            case Game_Action.EFFECT_CATCH:
                this.itemEffectCatch($gameActors._data[this._subjectActorId], target, effect);
        break;
    }
};

Game_Action.prototype.processSpecialSkill = function(){
    let skill = $dataSkills[BattleManager._action._item._itemId].meta.MGE_Skill;
    if(skill === 'Steal'){
        $dataSkills[BattleManager._action._item._itemId].effects[0] = {
            code: 101,
            dataId: 1,
            value1: 1,
            value2: 0
        }
    }
    if(skill === 'Catch'){
        $dataSkills[BattleManager._action._item._itemId].effects[0] = {
            code: 102,
            dataId: 1,
            value1: 1,
            value2: 0
        }
    }   
}

Game_Enemy.prototype.steal = function(){
    if ($gameParty.inBattle()) {
        // enemy = $dataEnemies[$gameTroop._enemies[BattleManager._action._targetIndex]._enemyId]
        if(this._stealItems.length > 0){
            this.performSteal();
        }
        else BattleManager._logWindow.addText(`There is nothing to steal`); 
    }
    Game_Battler.prototype.performDamage.call(this);
};

Game_Enemy.prototype.catch = function(subject, target) {
    if ($gameParty.inBattle()) {
        if(!this.matchingType(subject)) BattleManager._logWindow.addText(`A ${$dataActors[subject._actorId].name} cannot tame a ${$dataEnemies[this._enemyId].name}`);
        else if(target._catchDifficulty){
            if(this.checkCatchSuccess(subject, target)) this.catchSuccess();
            else BattleManager._logWindow.addText(`You failed to tame this monster.`);
        }
        else BattleManager._logWindow.addText(`You cannot tame this unit`); 
    }
    Game_Battler.prototype.performDamage.call(this);
};

Game_Enemy.prototype.matchingType = function(subject){
    let match = false;
    $dataActors[subject._actorId]._canTame.map( el => {
        if(this._types.contains(el)) match = true;
    })
    return match;
}

Game_Enemy.prototype.performSteal = function(arr){
    let subject = $gameParty.targetActor();
    let item = this._stealItems[Mythic.Core.RandomNumber(this._stealItems.length)];
    let roll = subject.stealthRoll();
    console.log(roll); 
    if(roll > item.chance){
        let number = Mythic.Core.RandomNumber(item.quantity) + 1;
        let itemIndex = this._stealItems.indexOf(item)
        this._stealItems[itemIndex].quantity -= number;
        if(this._stealItems[itemIndex].quantity <= 0) this._stealItems.splice(itemIndex, 1); 
        $gameParty.gainItem(item.item, number, false);
        BattleManager._logWindow.addText(`You stole ${number} ${item.item.name}!`);
    }
    else BattleManager._logWindow.addText(`You failed to steal anything`);

}

Game_Enemy.prototype.checkCatchSuccess = function(subject){
    let roll = Mythic.Core.RandomNumber((subject.agi + subject.luk) * subject._level);
    let cr = (this.luk + this.agi + this.hp) * this._level;
    if(roll > cr) return true
}

Game_Enemy.prototype.catchSuccess = function(){
    this._hp = 0;
    let newMonsterId = $dataActors.find( (el) => { if(el != undefined) return el.name == $dataEnemies[this._enemyId].name }).id;
    this.initNewMonster(newMonsterId);
};

Game_Enemy.prototype.initNewMonster = function(newMonsterId){
    Mythic.CopyCore.CopyToData($dataActors, newMonsterId);
    let monster = $dataActors[$dataActors.length - 1];
    monster.initialLevel = this._level;
    Mythic.CopyCore.CopyToData($dataClasses ,monster.classId);
    this._classParams.map( (el, i) => { 
        if(i == 1) return
        else el[this._level] += 1;
    });
    $dataClasses[$dataClasses.length - 1].params = this._classParams;
    // debugger;
    monster.classId = $dataClasses.length - 1;
    $gameParty.addActor($dataActors.length - 1);
};

Game_Action.EFFECT_STEAL = 101;
Game_Action.EFFECT_CATCH = 102;


Game_Action.prototype.itemEffectSteal = function(target, effect) {
    target.steal();
    target.result();    
    this.makeSuccess(target);
};

Game_Action.prototype.itemEffectCatch = function(subject, target, effect) {
    target.catch(subject, target, effect);
    target.result();    
    this.makeSuccess(target);
};