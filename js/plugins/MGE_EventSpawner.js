//=============================================================================
// Mythic Games Engine - Event Spawner
// MGE_Core.js
//=============================================================================

var Imported = Imported || {};
Imported.MGE_EventSpawner = true;

var Mythic = Mythic || {};
Mythic.EventSpawner = Mythic.EventSpawner || {};
Mythic.EventSpawner.version = 1;

//=============================================================================
/*: 
 * @plugindesc Creates and Modifies important parameters of the games base objects.
 * @author Richard Guilliams
 *
 * @help This plugin does not provide plugin commands.
 * 
 * Version 1.00:
 * - Finished plugin!
*/
//=============================================================================

//=============================================================================
// Spawner Class
//=============================================================================


// Mythic.KnightFall.monsterSpawner = {
//     mapName: '',
//     spawnTime: 0,
//     timer: 0,
//     spawnLimit: 0,
//     monsters: [],
//     neutrals: [],
//     shops: [],
//     plants: [],
//     lootBoxes: [],
// }


function EventSpawner(){
    this.initialize.apply(this, arguments);
};

EventSpawner.prototype.initialize = function(spawnTime, spawnLimit, initialSpawnCount){
    this.timer = 0
    this.spawnTime = spawnTime;
    this.spawnLimit = spawnLimit;
    this.initialSpawnCount = initialSpawnCount;
    this.spawnCount = 0;
    this.spawns = [];
    this.setTimer();
}

EventSpawner.prototype.addSpawn = function(name, region, limit, chance){
    let newSpawn = { name, region, limit, chance };
    this.spawns.push(newSpawn);
}

EventSpawner.prototype.setTimer = function(){
    this.timer = this.spawnTime * Mythic.Core.timeInSeconds;
}

EventSpawner.prototype.update = function(){
    if(this.initialSpawnCount > 0) this.initialSpawn();
    if(this.spawnCount < this.spawnLimit){
        if(this.timer > 0){
            this.timer -= 1;
        }
        else{
            this.spawn(this.roll());
            this.setTimer();
        }
    }
};

EventSpawner.prototype.roll = function () {
    return Mythic.Core.RandomNumber(this.spawns.length);
}

EventSpawner.prototype.spawn = function(id){
    Mythic.EventSpawner.SpawnEventInRegion(this.spawns[id].region, this.spawns[id].name);
    this.spawnCount++;
}

EventSpawner.prototype.initialSpawn = function(){
    for(let i = 0; i < this.initialSpawnCount; i++){
        this.spawn(this.roll());
    }
    this.initialSpawnCount = 0;
}

//=============================================================================
// Game_Map
//=============================================================================

EventSpawner.prototype.aliasMapUpdate = Game_Map.prototype.update; 
Game_Map.prototype.update = function(sceneActive) {
    EventSpawner.prototype.aliasMapUpdate.call(this, sceneActive);
    if(!Mythic.Core.MapData.events) return;
    if(this._monsterSpawner) this._monsterSpawner.update();
};

//=============================================================================
// Spawn Event
//=============================================================================


Mythic.EventSpawner.EqualizeEventLocations = function(){
    $dataMap.events.forEach((e, i) => {
        if(e == null) i = 1;
        else {
            $dataMap.events[i].x = $gameMap._events[i]._realX;
            $dataMap.events[i].y = $gameMap._events[i]._realY;
        }
    })
}

Mythic.EventSpawner.EraseEventData = function(){
    $dataMap.events.splice($gameMap._interpreter.eventId(), 1);
    $gameMap._events.splice($gameMap._interpreter.eventId(), 1);
    Mythic.Core.UpdateEventNames();
}

Mythic.EventSpawner.SpawnEvent = function(eventName, x, y){
    Mythic.Core.CleanArray($dataMap.events);
    let newEvent = Mythic.CopyCore.CopyObjectData(Mythic.Core.MapData.events[Mythic.Core.GetIDByName(Mythic.Core.MapData.events, eventName)])
    if (newEvent == null) debugger;
    newEvent.id = $dataMap.events.length;
    $dataMap.events.push(newEvent);
    $dataMap.events[newEvent.id].x = x;
    $dataMap.events[newEvent.id].y = y;
    DataManager.extractMetadata($dataMap.events[newEvent.id]);
    Mythic.Core.MapData.dataMap = $dataMap;
    Mythic.Core.UpdateMapData($gameMap._mapId, $dataMap);
    $gameMap._events.push(new Game_Event($gameMap._mapId, newEvent.id));
    SceneManager._scene.children[0].createCharacters();
}


Mythic.EventSpawner.setDataMap = function(newEvent, x, y){
    $dataMap.events.push(newEvent);
    newEvent.id = $dataMap.events.length - 1;
    $dataMap.events[newEvent.id].x = x;
    $dataMap.events[newEvent.id].y = y;
}

Mythic.EventSpawner.setEventParentData = function(newEvent, parent1, parent2){
    DataManager.extractMetadata($dataMap.events[newEvent.id]);
    newEvent['parents'] = {
        mother: parent1,
        father: parent2
    }
    newEvent._monsterId = parent1._monsterId;
    Mythic.Core.MapData.dataMap = $dataMap;
}

Mythic.EventSpawner.CreateNewEvent = function(eventName){
    return Mythic.CopyCore.CopyObjectData(Mythic.Core.MapData.events[Mythic.Core.GetIDByName(Mythic.Core.MapData.events, eventName)])
}

Mythic.EventSpawner.SpawnEventWithParentData = function(parent1, parent2, eventName, x, y){
    Mythic.Core.CleanArray($dataMap.events);
    let newEvent = Mythic.EventSpawner.CreateNewEvent(eventName); 
    console.log(newEvent)
    Mythic.EventSpawner.setDataMap(newEvent, x, y);
    Mythic.EventSpawner.setEventParentData(newEvent, parent1, parent2)
    Mythic.Core.UpdateMapData($gameMap._mapId, $dataMap);
    $gameMap._events.push(new Game_Event($gameMap._mapId, newEvent.id));
    // SceneManager._scene.children[0].addChild()
    SceneManager._scene.children[0].createCharacters();
}


Mythic.EventSpawner.SpawnEventAtRandomLocation = function(){
    let eventName = $dataSkills[$gameParty.targetActor().lastMenuSkill().id].meta.MGE_SpawnName;
    let maxX = $dataMap.width;
    let maxY = $dataMap.height;
    let x = Mythic.Core.RandomNumber(maxX);
    let y = Mythic.Core.RandomNumber(maxY);
    if($gameMap.isPassable(x, y)) Mythic.EventSpawner.SpawnEvent(eventName, x, y);
    else Mythic.EventSpawner.SpawnEventAtRandomLocation(eventName);
}

Mythic.EventSpawner.SpawnEventInRegion = function(regionId, eventName){

    let x = Mythic.Core.RandomNumber($gameMap.width());
    let y = Mythic.Core.RandomNumber($gameMap.height());
    if($gameMap.regionId(x, y) == regionId) return Mythic.EventSpawner.SpawnEvent(eventName, x, y)
    else Mythic.EventSpawner.SpawnEventInRegion(regionId, eventName);
}

Mythic.EventSpawner.SpawnInFrontOfPlayer = function(){
    let eventName = $dataSkills[$gameParty.targetActor().lastMenuSkill().id].meta.MGE_SpawnName;
    let direction = $gamePlayer.direction();
    
    // Left
    if(direction == 4) return Mythic.EventSpawner.SpawnEvent(eventName, $gamePlayer._realX - 1, $gamePlayer._realY);
    // Right
    if(direction == 6) return Mythic.EventSpawner.SpawnEvent(eventName, $gamePlayer._realX + 1, $gamePlayer._realY);
    // Down
    if(direction == 2) return Mythic.EventSpawner.SpawnEvent(eventName, $gamePlayer._realX, $gamePlayer._realY + 1);
    // Up
    if(direction == 8) return Mythic.EventSpawner.SpawnEvent(eventName, $gamePlayer._realX, $gamePlayer._realY - 1);
}