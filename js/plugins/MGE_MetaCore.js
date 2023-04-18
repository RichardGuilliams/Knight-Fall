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

Mythic.MetaCore.aliasActorInit = Game_Actor.prototype.initialize;
Game_Actor.prototype.initialize = function(actorId) {
    Mythic.MetaCore.aliasActorInit.call(this, actorId);
    Mythic.MetaCore.convertActorMeta(actorId);
};

Mythic.MetaCore.convertActorMeta = function(actorId){
    let actor = $dataActors[actorId];
    if(!actor) return;
    if(actor.meta._fly) Mythic.MetaCore.convertMetaToProperty(actor, '_movementTypes', '_fly', actor.meta._fly);
    if(actor.meta._walk) Mythic.MetaCore.convertMetaToProperty( actor, '_movementTypes', '_walk', actor.meta._walk);
    if(actor.meta._phase) Mythic.MetaCore.convertMetaToProperty(actor, '_movementTypes', '_phase', actor.meta._phase);
    if(actor.meta._teleport) Mythic.MetaCore.convertMetaToProperty(actor, '_movementTypes', '_teleport', actor.meta._teleport);
    if(actor.meta._swim) Mythic.MetaCore.convertMetaToProperty(actor, '_movementTypes', '_swim', actor.meta._swim);
    console.log(actor);
}


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

Mythic.MetaCore.ParseProperties = function(obj, propertyName, ...properties){
    console.log(obj)
}