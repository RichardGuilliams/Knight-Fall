//=============================================================================
// Mythic Games Engine - Game Message
// MGE_GameMessage.js
//=============================================================================

var Imported = Imported || {};
Imported.MGE_HarvestManager = true;

var Mythic = Mythic || {};
Mythic.GameMessage = Mythic.GameMessage || {};
Mythic.GameMessage.version = 1;

//=============================================================================
/*: 
* @plugindesc This plugin add functionality and custom mechanics to the Game_Message prototype
* @author Richard Guilliams
*
* @help This plugin does not provides script calls to populate npc events with.
 * 
 * Version 1.00:
 * - Finished plugin!
*/
//=============================================================================

//=============================================================================
// Game Message
//=============================================================================

Game_Message.prototype.getRandomDialogue = function(){
    
};

Game_Event.prototype.createDialogueManager = function(type){
    this._dialogueManager = new DialogueManager(type);
}
//=============================================================================
// Dialogue Manager
//=============================================================================

function DialogueManager(){
    this.initialize.apply(this, arguments);
}

DialogueManager.prototype.CODE = 101;

DialogueManager.prototype.initialize = function(type){
    this.type = '';
    this.setup(type);
}

DialogueManager.prototype.hunter = function(){
    let obj = {
        _faceName: 'Actor1',
        _faceIndex: 4,
        _dialogue: []
    };
    let length = MapEvent()._shop.inventory.length 
    if(length == 0){
        obj._dialogue.push(`I'm afraid I dont have anything to sell\nanymore.`);
        obj._dialogue.push(`Sorry, you bought me all out`);
        obj._dialogue.push(`Thanks for your patronage`);
        obj._dialogue.push(`Come back later, I might have more in stock`);
    } 
    else if(length <= 5 && length > 0){
        obj._dialogue.push(`There ain't nothing crawling in these lands.`);
        obj._dialogue.push(`Haven't got much today but your welcome to\nhave look.`);
        obj._dialogue.push(`Terrible day friend, don't have much for ya.`);
        obj._dialogue.push(`Haven't had much luck today im afraid.`);
        obj._dialogue.push(`I should just give up hunting.\n Should've been a fisherman like\nmy father.`);
        obj._dialogue.push(`There's nothing worth while in this place...\nYou should head back to where\nyou came from.`);
        obj._dialogue.push(`I barely have anything but your welcome to look.`);
        obj._dialogue.push(`Luck isn't on my side today.\nI'm heading back in for the day`);
        
    } 
    else if(length > 5 && length < 10){
        obj._dialogue.push(`I've got a pretty decent selection today.\nHave a look`);
        obj._dialogue.push(`It's been a good day. Care to buy some\ngoods?`);
        obj._dialogue.push(`It's been a fair day friend, take a look.`);
        obj._dialogue.push(`I've got a fair selection for you today.`);
        obj._dialogue.push(`Hey there, care to buy?.`);
        obj._dialogue.push(`Got a few items or you friend. Take a look.`);
        obj._dialogue.push(`Having okay luck today. Take a look.`);
        obj._dialogue.push(`Hey you need some goods? I've got\na decent pick.`);
        obj._dialogue.push(`I was tracking a big beast but I\nlost the trail.`);
    } 
    else if(length >= 10){
        obj._dialogue.push(`I have a lot of good to show you today`);
        obj._dialogue.push(`I've had a great day today.\nCare to buy anything?`);
        obj._dialogue.push(`Plenty of goods for you today friend.`);
        obj._dialogue.push(`I hit the jackpot today friend.\nHave a look`);
        obj._dialogue.push(`I'm the best hunter ever...\nI have plenty to trade today.`);
        obj._dialogue.push(`The spirits have smiled upon me today.`);
        obj._dialogue.push(`It's been a bountiful day.\nPlenty of goods to trade.`);
        obj._dialogue.push(`The land is prosperous today.`);
    } 
    return obj
}

DialogueManager.prototype.foragerDialogue = function(){
    return [
        `Hello ${Mythic.Core.PartyLeader._name()}, I foraged a fair bounty so far. Take a look?`
    ]
}

DialogueManager.prototype.setup = function(type){
    this.type = type;
    switch (type){
        case 'Hunter': return this.setupDialogue(DialogueManager.prototype.hunter());
    }
}

DialogueManager.prototype.initShowText = function(faceName, faceIndex){
    return {
        code: 101,
        indent: 0,
        parameters: [
            faceName,
            faceIndex,
            0,
            2
        ]
    }
}

DialogueManager.prototype.addMessage = function(text){
    return {
        code: 401,
        indent: 0,
        parameters: [
            text
        ]
    }
}

// $dataMap.events[MapEvent()._eventId].pages[1].conditions.selfSwitchCh = 'A'
// $dataMap.events[MapEvent()._eventId].pages[1].list.splice(1, 0, {code: 401, indent: 0, parameters:['hi']})

DialogueManager.prototype.setupDialogue = function(dialogueOptions){
    let chosenDialogue = dialogueOptions._dialogue[Mythic.Core.RandomNumber(dialogueOptions._dialogue.length)];
    if(!$dataMap.events[MapEvent()._eventId].pages[1].list[3]) $dataMap.events[MapEvent()._eventId].pages[1].list[3] = $dataMap.events[MapEvent()._eventId].pages[1].list[1];
    $dataMap.events[MapEvent()._eventId].pages[1].list[1] =  this.initShowText(dialogueOptions._faceName, dialogueOptions._faceIndex);
    $dataMap.events[MapEvent()._eventId].pages[1].list[2] =  this.addMessage(chosenDialogue);
    // $dataMap.events[MapEvent()._eventId].pages[1].list.splice(1, 0, this.initShowText(dialogueOptions._faceName, dialogueOptions._faceIndex));
    // $dataMap.events[MapEvent()._eventId].pages[1].list.splice(2, 0, this.addMessage(chosenDialogue));
};


//=============================================================================
// Game_Event
//=============================================================================
