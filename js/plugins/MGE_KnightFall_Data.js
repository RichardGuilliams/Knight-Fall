//=============================================================================
// Mythic Games Engine - Knight Fall
// KnightFall.js
//=============================================================================

var Imported = Imported || {};
Imported.KnightFallData = true;

var Mythic = Mythic || {};
Mythic.KnightFall = Mythic.KnightFall || {};
Mythic.KnightFall.version = 1;

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

Mythic.KnightFall.aliasItemInit = Game_Item.prototype.initialize;
Game_Item.prototype.initialize = function(item) {
    Mythic.KnightFall.aliasItemInit.call(this, item);
    this.setMeta(item);
};

Game_Item.prototype.setMeta = function(item){
    // console.log(this);
}


//=============================================================================
// Flash Manager
//=============================================================================

function FlashManager(){
    this.initialize.apply(this, arguments);
}

FlashManager.prototype.initialize = function(speed, parent){
    this._flashSpeed = speed;
    this._parent = parent;
    this._started = false;
    this._cycle = 0;
    this._rgb = [0, 0, 0, 0];
    this._channelLimit = [0, 0, 0, 0];
    this._channelIntensity = [0, 0, 0, 0];
}

FlashManager.prototype.defaultIntensity = 4;

FlashManager.prototype.setChannelLimit = function(...limits){
    this._channelLimit = limits;
}

FlashManager.prototype.setChannelIntensity = function(...intensity){
    this._channelIntensity = intensity;
}

FlashManager.prototype.start = function(){
    this._cycle = 1;
    this._started = true;
}

FlashManager.prototype.stop = function(){
    this._cycle = 0;
    this._started = false;
    this._rgb = [0, 0, 0, 0];
    this._channelIntensity = [0, 0, 0, 0];
    this._channelLimit = [0, 0, 0, 0];
    this._parent.characterSprite()._colorTone = [0, 0, 0, 0]
}

FlashManager.prototype.flashBlue = function(){
    this._rgb = [0, 0, 0, 0];
    this._channelIntensity = [0, 0, this.defaultIntensity, 0];
    this._channelLimit = [0, 0, 144, 0];
    this._cycle = 1;
    this._started = true;
}

FlashManager.prototype.flashGreen = function(){
    this._rgb = [0, 0, 0, 0];
    this._channelIntensity = [0, this.defaultIntensity, 0, 0];
    this._channelLimit = [0, 144, 0, 0];
    this._cycle = 1;
    this._started = true;
}


FlashManager.prototype.flashRed = function(){
    this._rgb = [0, 0, 0, 0];
    this._channelIntensity = [this.defaultIntensity, 0, 0, 0];
    this._channelLimit = [144, 0, 0, 0];
    this._cycle = 1;
    this._started = true;
}

FlashManager.prototype.flashWhite = function(){
    this._rgb = [0, 0, 0, 0];
    this._channelIntensity = [4, 4, 4, 0];
    this._channelLimit = [120, 120, 120, 0];
    this._cycle = 1;
    this._started = true;
}

FlashManager.prototype.flashTurquoise = function(){
    this._rgb = [0, 0, 0, 0];
    this._channelIntensity = [0, this.defaultIntensity, this.defaultIntensity, 0];
    this._channelLimit = [0, 120, 120, 0];
    this._cycle = 1;
    this._started = true;
}

FlashManager.prototype.flashPink = function(){
    this._rgb = [0, 0, 0, 0];
    this._channelIntensity = [this.defaultIntensity * 2, this.defaultIntensity, this.defaultIntensity, 0];
    this._channelLimit = [240, 120, 120, 0];
    this._cycle = 1;
    this._started = true;
}


FlashManager.prototype.update = function(){
    if (this._started == true){
        this.updateChannels();
        // this.updateChannel2();
        // this.updateChannel3();
        // this.updateChannel4();
        this._parent.characterSprite()._colorTone = this._rgb;
    }
}

FlashManager.prototype.updateChannels = function(){
    this._rgb.forEach( (channel, i) => {
        this.updateChannel(i);
    })
}

FlashManager.prototype.updateChannel2 = function(){
    
}

FlashManager.prototype.updateChannel = function(i){
    if(this._channelLimit[i] > 0){
        if(this._cycle == 1){
            if(this._rgb[i] >= this._channelLimit[i]){
                this._rgb[i] = this._channelLimit[i] - this.defaultIntensity;
                this._cycle = -1;
            } 
            else{ 
            this._rgb[i] += this._channelIntensity[i];
            // this._rgb[i] <= this._channelLimit[i]
            }
        }
        else if(this._rgb[i] >= 0 && this._cycle == -1){
            if(this._rgb[i] <= 0){
                this._rgb[i] = 0 + this.defaultIntensity;
                this._cycle = 1;
            } 
            else this._rgb[i] -= this._channelIntensity[i];
        }  
    }
}



// FlashManager.prototype.updateChannel3 = function(){
//     console.log('update channel')
//     if(this._channelLimit[2] > 0 && this._rgb[2] <= this._channelLimit[2] && this._cycle == 1){
//         this._rgb[2] += this._channelIntensity[2];
//         if(this._rgb[2] >= this._channelLimit[2]){
//             this._rgb[2] = this._channelLimit[2];
//             this._cycle = -1;
//         } 
//     }
//     else if(this._rgb[2] >= 0 && this._cycle == -1){
//         this._rgb[2] -= this._channelIntensity[2];
//         if(this._rgb[2] <= 0){
//             this._rgb[2] = 0;
//             this._cycle = 1;
//         } 
//     }  
// }

FlashManager.prototype.updateChannel4 = function(){
    
}


//=============================================================================
// NPC Shop
//=============================================================================

function NPCShop(){
    this.initialize.apply(this, arguments);
}

NPCShop.prototype.initialize = function(){
    this.type = '';
    this.inventory = [];
    this.minItems = 0;
    this.maxItems = 0;
    this.minWeapons = 0;
    this.maxWeapons = 0;
    this.minArmors = 0;
    this.maxArmors = 0;
};

NPCShop.prototype.ITEM = 0;
NPCShop.prototype.WEAPON = 1;
NPCShop.prototype.ARMOR = 2;
NPCShop.prototype.SHOP_CODE = 302;
NPCShop.prototype.ITEM_CODE = 605;

NPCShop.prototype.setup = function(type){
    this.inventory = [];
    switch(type){
        case 'Hunter':
            this.type = 'Hunter';
            this.setupHunterInventory();
            this.createRandomInventory();
            break;
            case 'Forager': 
            this.setupForagerInventory();
            this.createRandomInventory();
            break; 
        case 'Miner': 
            this.setupMinerInventory();
            this.createRandomInventory();
            break; 
        case 'Armorer': 
            this.setupArmorerInventory();
            this.createRandomInventory();
            break; 
        case 'Blacksmith': 
            this.setupBlacksmithInventory();
            this.createRandomInventory();
            break; 
        case 'Alchemist': 
            this.setupAlchemistInventory();
            this.createRandomInventory();
            break; 
            case 'Enchanter': 
            this.setupEnchanterInventory();
            this.createRandomInventory();
            break;
        case 'Merchant': 
            this.setupMerchantInventory();
            this.createRandomInventory();
            break; 
        } 
};

NPCShop.prototype.OpenShop = function(){
    SceneManager.push(Scene_Shop);
    SceneManager.prepareNextScene(this.inventory, this.inventory[0][4]);
};

NPCShop.prototype.addItem = function(item){
    if(this.inventory.length == 0) item.push(false);
    this.inventory.push(item);
}

NPCShop.prototype.setMinMaxItems = function(min, max){
    this.minItems = min;
    this.maxItems = max;
}

NPCShop.prototype.setMinMaxWeapons = function(min, max){
    this.minWeapons = min;
    this.maxWeapons = max;
}

NPCShop.prototype.setMinMaxArmors = function(min, max){
    this.minArmors = min;
    this.maxArmors = max;
}


NPCShop.prototype.setupHunterInventory = function(){
    this.setMinMaxItems(3, 7);
    this.setMinMaxWeapons(0, 3);
    this.setMinMaxArmors(0, 2);    
};

NPCShop.prototype.setupForagerInventory = function(){
    this.setMinMaxItems(3, 9);
    this.setMinMaxWeapons(0, 1);
    this.setMinMaxArmors(0, 0);
};

NPCShop.prototype.setupMinerInventory = function(){
    this.setMinMaxItems(3, 9);
    this.setMinMaxWeapons(0, 2);
    this.setMinMaxArmors(0, 2);
};

NPCShop.prototype.setupArmorerInventory = function(){
    this.setMinMaxItems(1, 4);
    this.setMinMaxWeapons(0, 0);
    this.setMinMaxArmors(3, 8);
};

NPCShop.prototype.setupBlacksmithInventory = function(){
    this.setMinMaxItems(1, 4);
    this.setMinMaxWeapons(3, 9);
    this.setMinMaxArmors(2, 5);
};

NPCShop.prototype.setupAlchemistInventory = function(){
    this.setMinMaxItems(3, 7);
    this.setMinMaxWeapons(0, 0);
    this.setMinMaxArmors(0, 0);
};

NPCShop.prototype.setupEnchanterInventory = function(){
    this.setMinMaxItems(3, 7);
    this.setMinMaxWeapons(0, 3);
    this.setMinMaxArmors(0, 2);
};

NPCShop.prototype.setupMerchantInventory = function(){
    this.setMinMaxItems(5, 10);
    this.setMinMaxWeapons(5, 8);
    this.setMinMaxArmors(3, 7);
};


NPCShop.prototype.createRandomInventory = function(){
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

NPCShop.prototype.setRandomItems = function(dataId, data, itemNumber){
    let items = this.getItemList(data); 
    for(let i = 0; i < itemNumber; i++){
        let weightSum = this.getWeightSum(items);
        let item = this.getRandomItem(items, weightSum);
        this.addItem([dataId, item.id, 0, 0]);
        items.splice(items.indexOf(item), 1);
    }
}

NPCShop.prototype.getRandomItem = function(items, weightSum){
    var value = Mythic.Core.RandomNumber(weightSum);
    for(var i = 0; i < items.length; i++){
        value -= items[i].meta[this.type];
        if (value < 0) {
            return  items[i]
        }
    }
}

NPCShop.prototype.getWeightSum = function(items){
    let sum = 0;
    items.map(el => { sum += el.meta[this.type] });
    return sum;
}

NPCShop.prototype.getItemList = function(data){
    let items = [];
    data.map( (item, i) => {
        if(!item) return;
        if(item.meta[this.type]){
            item.meta[this.type] = Mythic.MetaCore.convertNumber(item.meta[this.type]);
            items.push(item);
        } 
    })
    return items;
}


//=============================================================================
// Set Player Meta
//=============================================================================

// Game_Player.prototype.checkEventTriggerThere = function(triggers) {
//     if (this.canStartLocalEvents()) {
//         var direction = this.direction();
//         var x1 = this.x;
//         var y1 = this.y;
//         var x2 = Mythic.Core.GetEventXWhileFlying();
//         var y2 = Mythic.Core.GetEventYWhileFlying();
//         this.startMapEvent(x2, y2, triggers, true);
//         if (!$gameMap.isAnyEventStarting() && $gameMap.isCounter(x2, y2)) {
//             var x3 = $gameMap.roundXWithDirection(x2, direction);
//             var y3 = $gameMap.roundYWithDirection(y2, direction);
//             this.startMapEvent(x3, y3, triggers, true);
//         }
//     }
// };

Mythic.KnightFall.aliasActorInit = Game_Actor.prototype.initialize;
Game_Actor.prototype.initialize = function(actorId) {
    Mythic.KnightFall.aliasActorInit.call(this, actorId);
    Mythic.KnightFall.convertActorMeta.call(this, actorId);
};

Mythic.KnightFall.convertActorMeta = function(actorId){
    let actor = $dataActors[actorId];
    if(!actor) return;
    if(actor.meta._fly) Mythic.MetaCore.convertMetaToProperty(actor, '_movementTypes', '_fly', actor.meta._fly);
    if(actor.meta._walk) Mythic.MetaCore.convertMetaToProperty( actor, '_movementTypes', '_walk', actor.meta._walk);
    if(actor.meta._phase) Mythic.MetaCore.convertMetaToProperty(actor, '_movementTypes', '_phase', actor.meta._phase);
    if(actor.meta._teleport) Mythic.MetaCore.convertMetaToProperty(actor, '_movementTypes', '_teleport', actor.meta._teleport);
    if(actor.meta._swim) Mythic.MetaCore.convertMetaToProperty(actor, '_movementTypes', '_swim', actor.meta._swim);
    if(actor.meta._canTame) Mythic.MetaCore.convertMetaArrayToProperty(actor, '_canTame', Mythic.MetaCore.getArrayFromMetaData(actor.meta._canTame, ','))
}

//=============================================================================
// Set Event Meta
//=============================================================================

Mythic.KnightFall.aliasEventInit = Game_Event.prototype.initialize;
Game_Event.prototype.initialize = function(mapId, eventId) {
    Mythic.KnightFall.aliasEventInit.call(this, mapId, eventId);
    this.setEventMeta(eventId);
};

Game_CharacterBase.prototype.ticksInSeconds = 60;
Game_CharacterBase.prototype.ticksInMinutes = Game_CharacterBase.prototype.ticksInSeconds * 60;

Game_Event.prototype.setEventMeta = function(eventId){
    this.name = $dataMap.events[eventId].name;
    this.meta = $dataMap.events[eventId].meta
    if(!this._flashManager) this._flashManager = new FlashManager(6, this);
    if(this.meta.Breeding) this.setBreedingData();
    if(this.meta.Monster) this.setMonsterData();
    if(this.meta.HarvestItem) this.setHarvestData();
    if(this.meta.Spawn) this._spawn = true;
    if(this.meta.Shop) this._shop = new NPCShop(this.meta.ShopType);
}

Game_Event.prototype.setHarvestData = function(){
    let data = Mythic.MetaCore.getArrayFromMetaData(this.meta.HarvestItem, '-');
    // Mythic.MetaCore.ArrayToObject(data, '_harvestData', );
    this._harvestData = Mythic.MetaCore.convertArrayToObject(['_itemType', '_itemName', '_itemMin', '_itemMax', '_itemRefresh'], data);
}

Game_Event.prototype.setMonsterData = function(){
    this._monsterId = $dataEnemies.find( (el, i) => {
        if(i == 0) return
         return el.name == this.meta.Monster
        }).id
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
    if(this._flashManager) this._flashManager.update();
    if(this.canBreed) this.updateBreeding();
};

Game_Event.prototype.updateBreeding = function() {
    if(this.canBreed){
        $gameMap._events.forEach( (character, i) => {
            if(!character) return;
            if(!this.canBreed) return
            if(this._eventId == i) return;
            if(!this.sameName(character)) return;
            if(this.outOfXBreedingRange(character) && this.outOfYBreedingRange(character)) return
            if (this.isMale == character.isMale) return 
            if (!this.isBreeding && !this.isCoolingDown) this.isBreeding = true;
            if (this.isBreeding && !this.isCoolingDown) this.breed(character);
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
    // let sprite; 
    // SceneManager._scene.children[0]._characterSprites.forEach( (character, i) => {
    //     if(character._character._eventId == this._eventId){
    //         sprite = SceneManager._scene.children[0]._characterSprites[i]
    //     } 
            
    // })
    let sprite = SceneManager._scene.children[0]._characterSprites.find( el => el._character._eventId == this._eventId);   
    return sprite;
}

Game_Event.prototype.breed = function(character){
    if(this.isBreeding == false){
        this.isBreeding = true;
    } 
    else {
        if(this.breedingTime > 0) {
            this.breedingTime = this.breedingTime - 1;
        }
        if (this.breedingTime <= 0) {
            this.completeBreeding(character);
        }
    }
}

Game_Event.prototype.coolDownBreeding = function(){
    if(this.coolDownTime > 0) this.coolDownTime -= 1;
    else if(this.coolDownTime == 0) {
        this.isCoolingDown = false;
        this.coolDownTime = this.breedingCoolDown * this.ticksInSeconds;
    }
}

Game_Event.prototype.completeBreeding = function(character){
    // console.log('Breeding Complete');
    if(this.isMale == 0) this.SpawnEggBehindMonster(character);
    this.isCoolingDown = true;
    this.isBreeding = false;
    this.breedingTime = this.breedingSpeed * this.ticksInSeconds;
}

Game_Event.prototype.sameName = function(character){
    return this.name === character.name;
}

Game_Event.prototype.SpawnEggBehindMonster = function(character){
    // Left
    if(this.direction() == 4) return Mythic.EventSpawner.SpawnEventWithParentData(this, character, 'Egg Green', this._realX + 1, this._realY);
    // Right
    if(this.direction() == 6) return Mythic.EventSpawner.SpawnEventWithParentData(this, character, 'Egg Green', this._realX - 1, this._realY);
    // Down
    if(this.direction() == 2) return Mythic.EventSpawner.SpawnEventWithParentData(this, character, 'Egg Green', this._realX, this._realY - 1);
    // Up
    if(this.direction() == 8) return Mythic.EventSpawner.SpawnEventWithParentData(this, character, 'Egg Green', this._realX, this._realY + 1);
}
//=============================================================================
// Set Game Enemy Meta
//=============================================================================
Game_Enemy.prototype.initialize = function(enemyId, x, y) {
    Game_Battler.prototype.initialize.call(this);
    this.setup(enemyId, x, y);
    Mythic.KnightFall.setEnemyMeta.call(this, enemyId);
    this.recoverAll();
};

Mythic.KnightFall.setEnemyMeta = function(enemyId){
    let meta = $dataEnemies[enemyId].meta;
    this.setStealItems(meta);
    this.setDropItems(meta);
    if(meta.Rank) this._rank = meta.Rank;
    if(meta.Types) this._types = Mythic.MetaCore.getArrayFromMetaData(meta.Types, ',')
    if(meta.CatchDifficulty) this._catchDifficulty = parseInt(meta.CatchDifficulty)
    this._level = Math.floor(Math.random() * $gameMap._maxLvl) + $gameMap._minLvl;
    this.setParams(meta, enemyId);
}

Game_Enemy.prototype.setDropItems = function(meta){
    if(meta.DropItems){
        this._dropItems = Mythic.MetaCore.convertMultiArray.call(this, meta.DropItems, ',', '-')
        this._dropItems.map( (item, i) => { 
            let arr = Mythic.Core.GetGameDataByName(item[0]);
            let dataItem = arr[Mythic.Core.GetIDByName(arr, item[1])]; 
            this._dropItems[i] = Mythic.MetaCore.convertArrayToObject(
                ['item', 'quantity', 'dropChance'],
                [dataItem, item[2], item[3]]
            )
        })
    } 
}

Game_Enemy.prototype.setStealItems = function(meta){
    if(meta.StealItems){
        this._stealItems = Mythic.MetaCore.convertMultiArray.call(this, meta.StealItems, ',', '-')
        this._stealItems.map( (item, i) => { 
            let arr = Mythic.Core.GetGameDataByName(item[0]);
            let dataItem = arr[Mythic.Core.GetIDByName(arr, item[1])]; 
            this._stealItems[i] = Mythic.MetaCore.convertArrayToObject(
                ['item', 'quantity', 'chance'],
                [dataItem, item[2], item[3]]
            )
        })
    } 
}

Game_Enemy.prototype.setParams = function(meta, enemyId){
    this._classParams = [];
    this._baseParams = $dataEnemies[enemyId].params
    if(meta.HpGrowth) this._hpGrowth = parseInt(meta.HpGrowth)
    if(meta.MpGrowth) this._mpGrowth = parseInt(meta.MpGrowth)
    if(meta.TpGrowth) this._tpGrowth = parseInt(meta.TpGrowth)
    if(meta.AtkGrowth) this._atkGrowth = parseInt(meta.AtkGrowth)
    if(meta.DefGrowth) this._defGrowth = parseInt(meta.DefGrowth)
    if(meta.MatGrowth) this._matGrowth = parseInt(meta.MatGrowth)
    if(meta.MdfGrowth) this._mdfGrowth = parseInt(meta.MdfGrowth)
    if(meta.AgiGrowth) this._agiGrowth = parseInt(meta.AgiGrowth)
    if(meta.LukGrowth) this._lukGrowth = parseInt(meta.LukGrowth)

    this.initStatBonuses();

    this._paramPlus[0] = this.addLevels(this._hpGrowth, 0);
    this._paramPlus[1] = this.addLevels(this._mpGrowth, 1);
    this._paramPlus[2] = this.addLevels(this._tpGrowth, 2);
    this._paramPlus[3] = this.addLevels(this._atkGrowth, 3);
    this._paramPlus[4] = this.addLevels(this._defGrowth, 4);
    this._paramPlus[5] = this.addLevels(this._matGrowth, 5);
    this._paramPlus[6] = this.addLevels(this._mdfGrowth, 6);
    this._paramPlus[7] = this.addLevels(this._agiGrowth, 7);
    this._paramPlus[8] = this.addLevels(this._lukGrowth, 8);
    
    this._hp = this._paramPlus[0];
    this._mp = this._paramPlus[1];
    this._tp = this._paramPlus[2];

}

Game_Enemy.prototype.initStatBonuses = function(){
    // needs to reduce chances of getting high numbers.
    // out of 100?
    let statBonus = [0, 3, 5, 7];
    this._statBonuses = [
        this.setBonus(),
        this.setBonus(),
        this.setBonus(),
        this.setBonus(),
        this.setBonus(),
        this.setBonus(),
        this.setBonus(),
        this.setBonus(),
        1
    ]
}

Game_Enemy.prototype.setBonus = function(){
    let score = [45, 70, 92]
    let roll = Math.floor(Math.random() * 100)
    if(roll <= score[0]) return 1
    if(roll <= score[1] && roll >= score[0]) return 3
    if(roll <= score[2] && roll >= score[1]) return 5
    if(roll >= score[2]) return 7
}

Game_Enemy.prototype.addLevels = function(param, ind){
    let newParam = [];
    let result = ind == 8 ? 1 : this._baseParams[ind];
    for (let i = 0; i < 98; i++){
        result += Mythic.Core.RandomNumberNoZero(this._statBonuses[ind] + param);
        newParam.push(result);
    }
    // for(let i = 0; i < this._level; i++){
    //     result += Mythic.Core.RandomNumberNoZero(this._statBonuses[ind] + param);
    // }
    this._classParams.push(newParam);
    return newParam[this._level];
}


//=============================================================================
// Game_Map
//=============================================================================

Mythic.KnightFall.aliasMapSetup = Game_Map.prototype.setup;
Game_Map.prototype.setup = function(mapId) {
    Mythic.KnightFall.aliasMapSetup.call(this, mapId);
    this.setMapMeta($dataMap.meta);
};

Game_Map.prototype.setMapMeta = function(meta){
    this.setLureEncounters(meta);
    if(meta.MinLvl) this._minLvl = parseInt(meta.MinLvl)
    if(meta.MaxLvl) this._maxLvl = parseInt(meta.MaxLvl)
};

Game_Map.prototype.setLureEncounters = function(meta){
    if(meta.LureEncounters){
        this._lureEncounters = Mythic.MetaCore.convertMultiArray(meta.LureEncounters, ';', ',');
        this._lureEncounters.map( 
            (encounter, i) => { 
                this._lureEncounters[i] = 
                Mythic.MetaCore.convertArrayToObject(
                    ['monsterId', 'canEscape', 'canLose'],
                    [encounter[0], encounter[1], encounter[2]]
                )
            })
    }
}

//=============================================================================
// Game_Battler
//=============================================================================

Mythic.KnightFall.aliasGameBattlerInit = Game_BattlerBase.prototype.initMembers;
Game_BattlerBase.prototype.initMembers = function() {
    Mythic.KnightFall.aliasGameBattlerInit.call(this)

    Mythic.KnightFall.initAptitudes.call(this);
    Mythic.KnightFall.initTypes.call(this);
};

Mythic.KnightFall.initAptitudes = function(){
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



Mythic.KnightFall.initTypes = function(){
    this._elementalTypes = {
        _fire: false,
        _water: false,
        _earth: false,
        _air: false,
        _holy: false,
        _unholy: false
    }
}



Mythic.KnightFall.update = function(){
    
};

function ProximityTracker(){
    this.initialize.apply(this, arguments);
}

ProximityTracker.initialize = function(range){
    this._parent = null;
    this.range = range;
}