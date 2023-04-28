//=============================================================================
// Mythic Games Engine - Copy Core
// MGE_Core.js
//=============================================================================

var Imported = Imported || {};
Imported.MGE_CopyData = true;

var Mythic = Mythic || {};
Mythic.CopyCore = Mythic.CopyCore || {};
Mythic.CopyCore.version = 1;

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

// TODO:Take all Game_Party methods out. They are to be used specifically in the games script.


//=============================================================================
// Core Functions
//=============================================================================

Mythic.Core.CopyObjectData = function(data){
    return JSON.parse(JSON.stringify(data));
}

//=============================================================================
// Actor
//=============================================================================

Mythic.CopyCore.CopyToData = function(objArr, objId){
    let obj = Mythic.Core.CopyObjectData(objArr[objId]);
    obj.id = objArr.length;
    objArr.push(obj);
}


Mythic.CopyCore.Actor = function(actorId){
    let newActor = Mythic.Core.CopyObjectData($dataActors[actorId]);
    newActor.id = $dataActors.length;
    $dataActors.push(newActor);
}

Mythic.CopyCore.Class = function(classId){
    let newClass = Mythic.Core.CopyObjectData($dataClasses[classId]);
    newClass.id = $dataClass.length;
    $dataActors.push(newActor);
}

Mythic.CopyCore.Monster = function(monster, actorId){
    let newActor = Mythic.Core.CopyObjectData($dataActors[actorId]);
    newActor.id = $dataActors.length;
    $dataActors.push(newActor);
};

//=============================================================================
// Item
//=============================================================================

Mythic.CopyCore.Item = function(dataArr){
    let newItem = Mythic.Core.CopyObjectData(dataArr[itemId]);
    newItem.id = dataArr.length;
    dataArr.push(newItem);
    // $gameParty.gainItem(dataArr[newItem.id], 1, false);
}

// effect: {code: 0, dataId: 0, value1: 0, value2: 0}
Mythic.CopyCore.addTraitToItem = function(item, effect){
    [code, dataId, value1, value2] = effect;
    let effectToAdd = {
        code,
        dataId,
        value1,
        value2
    }
    item.effects.push(effectToAdd);
}
