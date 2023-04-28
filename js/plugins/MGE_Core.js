
//=============================================================================
// Mythic Games Engine - Core
// MGE_Core.js
//=============================================================================

var Imported = Imported || {};
Imported.MGE_Core = true;

var Mythic = Mythic || {};
Mythic.Core = Mythic.Core || {};
Mythic.Core.version = 1;

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

Mythic.Core.MapData = {
    dataMap: null,
    mapId: null,
    events: null,
    dataMaps: []
};

Mythic.Core._makeSaveContents = DataManager.makeSaveContents;
DataManager.makeSaveContents = function() {
    var contents = MGE.Core._makeSaveContents.call(this);
    contents.dataActors   = $dataActors;
    contents.dataItems    = $dataItems;
    contents.dataWeapons  = $dataWeapons;
    contents.dataArmors   = $dataArmors;
    contents.dataSkills   = $dataSkills;
    contents.mapData  = Mythic.Core.MapData;
    return contents;
};

Mythic.Core._extractSaveContents = DataManager.extractSaveContents;
DataManager.extractSaveContents = function(contents) {
    MGE.Core._extractSaveContents.call(this, contents);
    $dataActors             = contents.dataActors;
    $dataItems              = contents.dataItems;
    $dataWeapons            = contents.dataWeapons;
    $dataArmors             = contents.dataArmors;
    $dataSkills             = contents.dataSkills;
    Mythic.Core.MapData     = contents.mapData;
};

Mythic.Core.ToBoolean = function(str){
    if(str === 'true') return true;
    return false;
}

Mythic.Core.GetIDByName = function(dataArray, name){
    let id = 0;
    dataArray.findIndex((obj, i) => {
        if(obj == null) return;
        if(obj.name.toLowerCase() == name.toLowerCase()) id = i;
    });
    return id;
} 

Mythic.Core.GetIDByCharacterName = function(name){
    let id = 0;
    $dataActors.findIndex((obj, i) => {
        if(obj == null) return;
        if(obj.characterName.toLowerCase() == name.toLowerCase()) id = i;
    });
    return id;
}

Mythic.Core.GetDataFromConstructor = function(constructor){
    switch(constructor){
        case Game_Player:
            return $dataActors;
        case Game_Event:
            return $dataMap.events;
        case Game_Item:
            return $dataItems;
        case Game_Enemy:
            return $dataEnemies;
    }
}

Mythic.Core.GetGameDataByName = function(name){
    switch(name){
        case 'Actor':
            return $dataActors;
        case 'Event':
            return $dataMap.events;
        case 'Item':
            return $dataItems;
        case 'Armor':
            return $dataArmors;
        case 'Weapon':
            return $dataWeapons;
        case 'Enemy':
            return $dataEnemies;
    }
}

Mythic.Core.isSpritePlayer = function(sprite){
   if(sprite._character.isPlayer()) return true;
   return false;
}

Mythic.Core.isSpriteEvent = function(sprite){
    if(sprite._character.isEvent()) return true;
    return false;
}

Mythic.Core.hasMetaProperty = function(arr, i, propertyName){
    if(arr[i] == null) i++;
    if(arr[i].meta.hasOwnProperty(propertyName)){
        return true;
    }
    return false;
}

Mythic.Core.UpdateEventNames = function(){
    $dataMap.events.forEach((e, i, arr) => {
        if(e == null) return;
        else {
            arr[i].id = i;
            $gameMap._events[i]._eventName = i;
        }
    })
}

Mythic.Core.RandomNumber = function(max){
    return Math.floor(Math.random() * max);
}

Mythic.Core.RandomNumberNoZero = function(max){
    let result = this.RandomNumber(max)
    if(result > 0) return result;
    else return 1
}

Game_Map.prototype.setupStartingMapEvent = function() {
    var events = this.events();
    for (var i = 0; i < events.length; i++) {
        var event = events[i];
        if (event.isStarting()) {
            event.clearStartingFlag();
            this._interpreter.setup(event.list(), event.eventId());
            return true;
        }
    }
    return false;
};

Mythic.Core.CleanArray = function(arr){
    arr.map( (el, i) => {
        if(i === 0) return;
        if(el != null) {
            el.id = i;
        }
    })
}

Mythic.Core.GetEventXWhileFlying = function(){
    const direction = $gamePlayer.direction();
    switch(direction){
        // Down
        case 2:
        return $gamePlayer.x
            
        // Left
        case 4:
            return $gamePlayer.x - 1
                
        // Right
        case 6:
            return $gamePlayer.x + 1
                    
        // Up
        case 8:
            return $gamePlayer.x
    }
}

Mythic.Core.GetEventYWhileFlying = function(){
    const direction = $gamePlayer.direction();
    switch(direction){
        // Down
        case 2:
        return $gamePlayer.y + 1
            
        // Left
        case 4:
            return $gamePlayer.y + 1
                
        // Right
        case 6:
            return $gamePlayer.y + 1
                    
        // Up
        case 8:
            return $gamePlayer.y - 1
    }
}

//=============================================================================
// MapData
//=============================================================================
Mythic.Core.LoadMapData = function(name, src) {
    var xhr = new XMLHttpRequest();
    var url = 'data/' + src;
    xhr.open('GET', url);
    xhr.overrideMimeType('application/json');
    xhr.onload = function() {
        if (xhr.status < 400) {
            let mapData = JSON.parse(xhr.responseText);
            Mythic.Core.MapData.events = mapData.events;
            Mythic.Core.MapData.mapId = $gameMap._mapId;
        }
    };
    xhr.send();
};

Mythic.Core.UpdateMapData = function(index, mapData){
    Mythic.Core.MapData.dataMaps[index] = mapData;
}

Mythic.Core.MapExists = function(src){
    if(Mythic.Core.MapData.dataMaps[Mythic.Core.GetMapIdFromFileName(src)] != undefined){
        return true;
    }
    else return false;
}

Mythic.Core.DataMapsEmpty = function(){
    if(Mythic.Core.MapData.dataMaps.length == 0) return true;
    return false; 
}

Mythic.Core.GetMapIdFromFileName = function(src){
    let id = 0;
    let srcArr = src.split('.');
    srcArr.pop();
    srcArr = Array.from(srcArr[0]);
    srcArr.splice(0, 3);
    src = srcArr.join(``);
    $dataMapInfos.forEach((e, i) => {
        if($dataMapInfos[i] == null) return;
        if($dataMapInfos[i].id == parseInt(src)) id = $dataMapInfos[i].id;
    });
    return id;
}

Mythic.Core.DoesSourceMatchMapInfo = function(src){
    // Stop function if array has no data
    if(Mythic.Core.MapData.dataMaps.length == 0) return;
    Mythic.Core.MapData.dataMaps.forEach((e, i, arr) => {
        if(`${$dataMapInfos[i].name}.json`.toLowerCase() == src.toLowerCase()) {
            return true;
        }
    })
}

Mythic.Core.LoadMapData = function(name, src) {
    var xhr = new XMLHttpRequest();
    var url = 'data/' + src;
    xhr.open('GET', url);
    xhr.overrideMimeType('application/json');
    xhr.onload = function() {
        if (xhr.status < 400) {
            let mapData = JSON.parse(xhr.responseText);
            Mythic.Core.MapData.events = mapData.events;
            Mythic.Core.MapData.mapId = $gameMap._mapId;
        }
    };
    xhr.send();
};

Mythic.Core.UpdateMapData = function(index, mapData){
    Mythic.Core.MapData.dataMaps[index] = mapData;
}

// Game Character 

Game_CharacterBase.prototype.isPlayer = function() {
    return this.constructor === Game_Character ? true : false;
};

Game_CharacterBase.prototype.isEvent = function() {
    return this.constructor === Game_Event ? true : false;
};

//=============================================================================
// DataManager
//=============================================================================

DataManager.prototype.checkMapData = function(name, src, xhr){
    if(name == '$dataMap' && Mythic.Core.MapExists(src)){
        $dataMap = Mythic.Core.MapData.dataMaps[Mythic.Core.GetMapIdFromFileName(src)];
    }
    else if (xhr.status < 400) {
        window[name] = JSON.parse(xhr.responseText);
        if(name == '$dataMap' && !Mythic.Core.MapExists(src)){
            Mythic.Core.MapData.dataMaps[Mythic.Core.GetMapIdFromFileName(src)] = window[name];
        }
        DataManager.onLoad(window[name]);
    }
};

DataManager.loadDataFile = function(name, src) {
    var xhr = new XMLHttpRequest();
    var url = 'data/' + src;
    xhr.open('GET', url);
    xhr.overrideMimeType('application/json');
    xhr.onload = function() {
        DataManager.prototype.checkMapData(name, src, xhr);
    };
    xhr.onerror = this._mapLoader || function() {
        DataManager._errorUrl = DataManager._errorUrl || url;
    };
    window[name] = null;
    xhr.send();
};

//=============================================================================
// Sprite
//=============================================================================

Sprite_Character.prototype.characterName = function(){
    return this._character._characterName;
}

Sprite_Character.prototype.hasName = function(){
    if(this._character._characterName != ``) return true;
    else return false;
}


//=============================================================================
// Map
//=============================================================================

Game_Map.prototype.eventId = function(){
    return $gameMap._interpreter._eventId;
}

Game_Map.prototype.event = function(){
       return $gameMap._events[this.eventId()];
}