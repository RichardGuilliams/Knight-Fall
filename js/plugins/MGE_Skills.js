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

Mythic.Skills.steal = function(arr){
    let subject = BattleManager._action.subject()
    let grandRoll = arr.reduce( (a, b) => parseInt(a[3]) + parseInt(b[3])) * arr.length;
    let roll = Math.floor(Math.random() * (subject.luk + subject.agi + subject.level))
    if (roll > grandRoll) console.log('grandRoll');
    else {
        arr = arr.sort((a, b) => parseInt(a[3]) - parseInt(b[3]));
        let winningItem = Math.floor(Math.random() * arr.length);

        if(roll > arr[winningItem][3]){
            let itemArr = Mythic.Core.GetGameDataByName(arr[winningItem][0]);
            let number = Math.floor(Math.random() * arr[winningItem][2]) + 1;
            let item = itemArr[Mythic.Core.GetIDByName(itemArr, arr[winningItem][1])];
            $gameParty.gainItem(item, number, false);
            BattleManager._logWindow.addText(`You stole ${number} ${item.name}!`);
        }

        else BattleManager._logWindow.addText(`You failed to steal anything!`)
    }
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
}

Game_Enemy.prototype.steal = function() {
    if ($gameParty.inBattle()) {
        enemy = $dataEnemies[$gameTroop._enemies[BattleManager._action._targetIndex]._enemyId]
        if(enemy.meta.StealItems){
            let meta = enemy.meta.StealItems;
            let items = Mythic.MetaCore.getArrayFromMetaData(meta, ',');
            items.map( (el, i) => {
                items[i] = el.split('-');
            })
            Mythic.Skills.steal(items);
        }
    }
    Game_Battler.prototype.performDamage.call(this);
};

Game_Action.EFFECT_STEAL = 101;


Game_Action.prototype.itemEffectSteal = function(target, effect) {
    target.steal();
    target.result();    
    this.makeSuccess(target);
};