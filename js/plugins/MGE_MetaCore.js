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

Mythic.MetaCore.convertNumber = function (meta) {
    if(isNaN(meta)) return parseInt(this.removeSpaces(meta));
    else return meta;
}

Mythic.MetaCore.convertMetaToProperty = function(actor, propertyLocation, propertyName, propertyValue){
    if(!actor[propertyLocation]) {
        actor[propertyLocation] = {};
    }
    actor[propertyLocation][propertyName] = propertyValue;
}

Mythic.MetaCore.convertMetaArrayToProperty = function(actor, propertyLocation, arr){
    if(!actor[propertyLocation]) {
        actor[propertyLocation] = [];
    }
    arr.map( (el, i) => { actor[propertyLocation][i] = el });
};

Mythic.MetaCore.removeSpaces = function(meta){
    return meta.replaceAll(' ', '');
}

Mythic.MetaCore.CleanMetaData = function(meta){
    return meta.replaceAll('\n', '');
}

Mythic.MetaCore.getArrayFromMetaData = function(meta, symbol){
    meta = Mythic.MetaCore.CleanMetaData(meta).split(symbol);
    return meta
}

Mythic.MetaCore.convertArrayToObject = function(propertyNames, properties){
    let obj = {}
    propertyNames.map( (name, i) => { obj[name] = properties[i] })
    return obj;
}

Mythic.MetaCore.convertMultiArray = function(meta, ...symbols){
    let arr = []
    symbols.map( symbol => {
        if(meta[0].length > 1) meta.map( item => {
            arr.push(Mythic.MetaCore.getArrayFromMetaData(item, symbol)); 
        })
        else meta = Mythic.MetaCore.getArrayFromMetaData(meta, symbol);
    });
    arr.map( el => {
        el.map( (item, i) => {
            if(!isNaN(item)) el[i] = parseInt(item);
        })
    })
    return arr;
}

Mythic.MetaCore.ConvertStringToNum = function(item){
    item.map( (el, i) => {
        if(!isNaN(item[i])) item[i] = parseInt(item[i]);
    })
}