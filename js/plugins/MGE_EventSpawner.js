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
    let newEvent = Mythic.Core.CopyObject(Mythic.Core.MapData.events[Mythic.Core.GetIDByName(Mythic.Core.MapData.events, eventName)])
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