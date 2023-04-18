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

//=============================================================================
// Actor
//=============================================================================

Mythic.CopyCore.Actor = function(actorId){
    let newActor = Mythic.Core.CopyObject($dataActors[actorId]);
    newActor.id = $dataActors.length;
    $dataActors.push(newActor);
    $gameParty.addActor(newActor.id);
}

//=============================================================================
// Item
//=============================================================================

Mythic.CopyCore.Item = function(dataArr){
    let newItem = Mythic.Core.CopyObject(dataArr[itemId]);
    newItem.id = dataArr.length;
    dataArr.push(newItem);
    $gameParty.gainItem(dataArr[newItem.id], 1, false);
}

// effect: {code: 0, dataId: 0, value1: 0, value2: 0}
Mythic.CopyCore.addTraitToItem = function(item, effect){
    [code, dataId, value1, value2] = effect;
    let effectToAdd = {
        code: code,
        dataId: dataId,
        value1: value1,
        value2: value2
    }
    item.effects.push(effectToAdd);
}
