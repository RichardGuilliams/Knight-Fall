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

Mythic.CopyCore.CopyObjectData = function(data){
    return JSON.parse(JSON.stringify(data));
}

//=============================================================================
// Actor
//=============================================================================

Mythic.CopyCore.CopyToData = function(objArr, objId){
    let obj = Mythic.CopyCore.CopyObjectData(objArr[objId]);
    obj.id = objArr.length;
    objArr.push(obj);
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
