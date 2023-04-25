//=============================================================================
// Mythic Games Engine - Meta Core
// MGE_MetaCore.js
//=============================================================================

var Imported = Imported || {};
Imported.MGE_MetaCore = true;

var Mythic = Mythic || {};
Mythic.MetaCore = Mythic.MetaCore || {};
Mythic.MetaCore.version = 1;

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

//=============================================================================
// Meta
//=============================================================================

Mythic.MetaCore.convertMetaToProperty = function(actor, propertyLocation, propertyName, propertyValue){
    if(!actor[propertyLocation]) {
        actor[propertyLocation] = {};
    }
    actor[propertyLocation][propertyName] = propertyValue;
}

Mythic.MetaCore.CleanMetaData = function(meta, symbol){
    return meta.replaceAll('\n', '');
}

Mythic.MetaCore.getArrayFromMetaData = function(meta, symbol){
    meta = Mythic.MetaCore.CleanMetaData(meta);
    return meta.split(symbol)
}


Mythic.MetaCore.ConvertStringToNum = function(item){
    item.map( (el, i) => {
        if(!isNaN(item[i])) item[i] = parseInt(item[i]);
    })
}