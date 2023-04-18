//=============================================================================
// Mythic Games Engine - Monster Rpg Menu
// MGE_MonsterRPGMenu.js
//=============================================================================

var Imported = Imported || {};
Imported.MGE_MonsterRPGMenu = true;

var Mythic = Mythic || {};
Mythic.Menu = Mythic.Menu || {};
Mythic.Menu.version = 1;

//=============================================================================
/*: 
 * @plugindesc Creates The Menus for MonsterRPG
 * @author Richard Guilliams
 *
 * @help This plugin does not provide plugin commands.
 * 
 * Version 1.00:
 * - Finished plugin!
*/
//=============================================================================

//=============================================================================
// Main Menu
//=============================================================================

// Input 
Input.keyMapper['80'] = "customMenu"

Scene_CharacterSelectMenu.aliasSceneMapUpdate = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
    Scene_CharacterSelectMenu.aliasSceneMapUpdate.call(this);
    if(Input.isTriggered('customMenu')) SceneManager.push(Scene_CharacterSelectMenu); 
};

// Scene Character Select Menu

function Scene_CharacterSelectMenu() {
    this.initialize.apply(this, arguments);
}

Scene_CharacterSelectMenu.prototype = Object.create(Scene_MenuBase.prototype);
Scene_CharacterSelectMenu.prototype.constructor = Scene_CharacterSelectMenu;

Scene_CharacterSelectMenu.prototype.initialize = function(parent, x, y) {
    Scene_MenuBase.prototype.initialize.call(this);
    this.setParams(parent);
};

Scene_CharacterSelectMenu.prototype.setParams = function() {
    this._screenWidth = Graphics.boxWidth;
    this._screenHeight = Graphics.boxHeight;
    this._padding = 10;
    this._margin = 10;
    this._height = 140; 
    this._width = 200;
    this._selectWindowRectHeight = 64;
    this._selectWindowRectWidth = 175 + this._padding * 2;
    this._infoWindowTopMargin = 65;
    this._commandWindowHeight = 120;
    this._infoWindowWidth = Graphics.boxWidth - this._selectWindowRectWidth;
    this._infoWindowHeight = Graphics.boxHeight - this._infoWindowTopMargin - this._commandWindowHeight;
    this._commandWindowY = this._infoWindowHeight + this._infoWindowTopMargin;
};

Scene_CharacterSelectMenu.prototype.create = function(){
    Scene_MenuBase.prototype.create.call(this);
    this.createCharacterInfoWindow();
    this.createCharacterHeaderWindow();
    this.createCharacterSelectWindow();
    this.createCharacterCommandWindow();
    this.createCharacterHorzCommandWindow();
}

Scene_CharacterSelectMenu.prototype.createCharacterInfoWindow = function(){
    this._characterInfoWindow = new Window_CharacterInfo(this, this._selectWindowRectWidth, this._infoWindowTopMargin, this._infoWindowWidth, this._infoWindowHeight);
    this.reserveImages();
    this.addWindow(this._characterInfoWindow);
}

Scene_CharacterSelectMenu.prototype.createCharacterHeaderWindow = function(){
    this._characterHeaderWindow = new Window_CharacterHeader(this, this._selectWindowRectWidth, 0, this._infoWindowWidth, this._infoWindowTopMargin);
    this.reserveImages();
    this.addWindow(this._characterHeaderWindow);
}

Scene_CharacterSelectMenu.prototype.createCharacterSelectWindow = function(){
    this._characterSelectWindow = new Window_CharacterSelect(this, 0, 0, this._selectWindowRectWidth, this._selectWindowRectHeight * Window_CharacterSelect.prototype.maxPageRows() + (this._padding * 2));
    this._characterSelectWindow.show();
    this._characterSelectWindow.select(0);
    this._characterSelectWindow.activate();
    this._characterSelectWindow.setHandler('ok', this.command1.bind(this));
    this._characterSelectWindow.setHandler('cancel', this.commandBack.bind(this));
    this._characterSelectWindow._parent = this;
    ImageManager.reserveFace('Actor2');
    this.addWindow(this._characterSelectWindow);
}

Scene_CharacterSelectMenu.prototype.commandBack = function(){
    if(this._characterCommandWindow.visible) {
        this._characterCommandWindow.hide();
        this._characterCommandWindow.deactivate();
    }
}

Scene_CharacterSelectMenu.prototype.createCharacterCommandWindow = function(){
    this._characterCommandWindow = new Window_CharacterCommand(this, this._selectWindowRectWidth, this._commandWindowY);
    this._characterCommandWindow.setHandler('command1', this.command1.bind(this));
    this._characterSelectWindow.setHandler('cancel', this.cancel.bind(this));
    this.addWindow(this._characterCommandWindow);
    this._characterCommandWindow.deactivate();
}

Scene_CharacterSelectMenu.prototype.createCharacterHorzCommandWindow = function(){
    this._characterHorzCommandWindow = new Window_CharacterCommandHorz(this, 0, 0);
    this._characterHorzCommandWindow.setHandler('command1', this.command1.bind(this));
    this.addWindow(this._characterHorzCommandWindow);
    this._characterHorzCommandWindow.deactivate();
}


Scene_CharacterSelectMenu.prototype.reserveImages = function(){
    ImageManager.reserveFace('Actor3');
    ImageManager.reserveCharacter('People1');
}

Scene_CharacterSelectMenu.prototype.index = 0;

Scene_CharacterSelectMenu.prototype.start = function(){
    Scene_MenuBase.prototype.start.call(this);
    this._characterHeaderWindow.drawItem();
    this._characterSelectWindow.refresh();
    this._characterInfoWindow.drawAllItems();
}   

Scene_CharacterSelectMenu.prototype.update = function(){
    Scene_MenuBase.prototype.update.call(this);
    if(Input.isTriggered('cancel')) this.cancel();

    if(this.index != this._characterSelectWindow.index()) {
        this.index = this._characterSelectWindow.index();
        this._characterInfoWindow.drawAllItems();
    }
}

// Commands
Scene_CharacterSelectMenu.prototype.cancel = function(){
    if(this._characterCommandWindow.visible) {
        this._characterCommandWindow.hide();
        this._characterCommandWindow.deactivate();
        this._characterSelectWindow.activate();
    }
    else {
        this.popScene();
    }
}

Scene_CharacterSelectMenu.prototype.command1 = function(){
    if(!this._characterCommandWindow.visible) {
        this._characterCommandWindow.show();
        this._characterCommandWindow.activate();
    }
    else {
        $gameParty.removeActor($gameParty._actors[0]);
        $gameParty.addActor(this.index + 1);
    } 
}

Scene_CharacterSelectMenu.prototype.command2 = function(){
    if(!this._characterHorzCommandWindow.visible) this._characterHorzCommandWindow.activate();
}

//=============================================================================
// Window
//=============================================================================

//
// CharacterInfo Window
//  

function Window_CharacterInfo(){
    this.initialize.apply(this, arguments);
}

Window_CharacterInfo.prototype = Object.create(Window_Base.prototype);
Window_CharacterInfo.prototype.constructor = Window_CharacterInfo;


Window_CharacterInfo.prototype.initialize = function(parent, x, y, width, height){
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this.setParams(parent);
    this.drawAllItems();
}

Window_CharacterInfo.prototype.setParams = function(parent){
    this._parent = parent;
    this._character = $dataActors[1];
    this._profileText = this._character.profile.split('-');
    this._padding = 12;
    this._margin = 12;
    this._faceWidth = 120;
    this._faceHeight = 120;
    this._textSpacing = this._padding + 46;
    this._nextRowSpacing = this._padding + this._textSpacing * 2;
}

Window_CharacterInfo.prototype.setClassData = function(){
    this._character = $dataActors[SceneManager._scene.index + 1];
    this._profileText = this._character.profile.split('-');
    console.log(this._profileText);
}

Window_CharacterInfo.prototype.drawAllItems = function(){
    this.contents.clear();
    this.setClassData();
    this.drawFace(this._character.faceName, this._character.faceIndex, this._padding, this._padding, this._faceWidth, this._faceHeight);
    this.drawCharacterNameAndDesc();
    this.drawCharacterStats();
}

Window_CharacterInfo.prototype.drawCharacterNameAndDesc = function(){
    this.changeFontSize(24);
    this.drawText(`${this._character.name}`, this._padding * 2 + this._faceWidth, 0, this._width - this._padding * 2, 'start');
    this.changeFontSize(16);
    this._profileText.forEach( (text, i) => {
        this.drawText(text, this._padding * 2 + this._faceWidth, this._padding + (24 * (i + 1)), this._width - this._padding * 2, 'start');
    });
}

Window_CharacterInfo.prototype.drawCharacterStats = function(){
    let actor = new Game_Actor(this._character.classId);
    console.log(actor);
    console.log(this._character);
    this.drawText(`HP:`, this._padding, this._faceHeight + this._padding, 0, 'start')
    this.drawText(`${actor.hp}`, this._textSpacing, this._faceHeight + this._padding, 0, 'start');
    this.drawText(`ATK:`, this._padding, this._faceHeight + this._padding * 3, 0, 'start')
    this.drawText(`${actor.atk}`, this._textSpacing, this._faceHeight + this._padding * 3, 0, 'start');
    this.drawText(`DEF:`, this._padding, this._faceHeight + this._padding * 5, 0, 'start')
    this.drawText(`${actor.def}`, this._textSpacing, this._faceHeight + this._padding * 5, 0, 'start');
    this.drawText(`MATK:`, this._padding, this._faceHeight + this._padding * 7, 0, 'start')
    this.drawText(`${actor.mat}`, this._textSpacing, this._faceHeight + this._padding * 7, 0, 'start');
    this.drawText(`MDEF:`, this._padding, this._faceHeight + this._padding * 9, 0, 'start')
    this.drawText(`${actor.mdf}`, this._textSpacing, this._faceHeight + this._padding * 9, 0, 'start');
    
    this.drawText(`MP:`, this._nextRowSpacing, this._faceHeight + this._padding, 0, 'start')
    this.drawText(`${actor.mp}`, this._nextRowSpacing + this._textSpacing, this._faceHeight + this._padding, 0, 'start');
    this.drawText(`AGIL:`, this._nextRowSpacing, this._faceHeight + this._padding * 3, 0, 'start')
    this.drawText(`${actor.agi}`,this._nextRowSpacing + this._textSpacing, this._faceHeight + this._padding * 3, 0, 'start');
    this.drawText(`ACC:`, this._nextRowSpacing, this._faceHeight + this._padding * 5, 0, 'start')
    this.drawText(`${actor.hit * 100}%`,this._nextRowSpacing + this._textSpacing, this._faceHeight + this._padding * 5, 0, 'start');
    this.drawText(`EV:`, this._nextRowSpacing, this._faceHeight + this._padding * 7, 0, 'start')
    this.drawText(`${actor.eva * 100}%`,this._nextRowSpacing + this._textSpacing, this._faceHeight + this._padding * 7, 0, 'start');
    this.drawText(`CRIT:`, this._nextRowSpacing, this._faceHeight + this._padding * 9, 0, 'start')
    this.drawText(`${actor.cri * 100}%`, this._nextRowSpacing + this._textSpacing, this._faceHeight + this._padding * 9, 0, 'start'); 
}

//=============================================================================
// Character Select Header Window
//=============================================================================

function Window_CharacterHeader(){
    this.initialize.apply(this, arguments);
}

Window_CharacterHeader.prototype = Object.create(Window_Base.prototype);
Window_CharacterHeader.prototype.constructor = Window_CharacterHeader;

Window_CharacterHeader.prototype.initialize = function(parent, x, y, width, height){
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this.drawItem();
}

Window_CharacterHeader.prototype.drawItem = function(){
    this.contents.clear();
    this.changeFontSize(18);
    this.drawText(`Choose A Class`, 0, 0, this._width - this._padding * 2, 'center');
}

//=============================================================================
// Character Select Window
//=============================================================================

function Window_CharacterSelect(){
    this.initialize.apply(this, arguments);
}

Window_CharacterSelect.prototype = Object.create(Window_Selectable.prototype);
Window_CharacterSelect.prototype.constructor = Window_CharacterSelect;

Window_CharacterSelect.prototype.initialize = function(parent, x, y, width, height){
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this.changeFontSize(18);
    this.setParams(parent);
    this.refresh();
    this.hide();
}

Window_CharacterSelect.prototype.setParams = function(parent){
    this._parent = parent;
    this.characters = [
        new Game_Actor(1),
        new Game_Actor(2),
        new Game_Actor(3),
        new Game_Actor(4),
        new Game_Actor(5),
    ]
    console.log(this.characters);
    this.rectWidth = this._parent._selectWindowRectWidth;
    this.rectHeight = 60;
}

Window_CharacterSelect.prototype.maxItems = function(){
    return 5;
}

Window_CharacterSelect.prototype.maxPageRows = function(){
    return 5;
}

Window_CharacterSelect.prototype.maxPageItems = function(){
    return this.maxPageRows() * this.maxCols();
}

Window_CharacterSelect.prototype.drawItem = function(index){
    var itemRect = this.itemRect(index);
    // this.drawText(this.characters[index][0], itemRect.x + 48 + 6, itemRect.y, itemRect.width * .75, itemRect.height / 2);
    // this.drawCharacter(this.characters[index][1], this.characters[index][2], itemRect.x + 24, itemRect.y + itemRect.height);
    this.drawText(this.characters[index]._name, itemRect.x + 48 + 6, itemRect.y, itemRect.width * .75, itemRect.height / 2);
    this.drawCharacter(this.characters[index]._characterName, this.characters[index]._characterIndex, itemRect.x + 24, itemRect.y + itemRect.height);

}

Window_CharacterSelect.prototype.itemHeight = function(){
    return (this.height - this.padding * 2) / this.maxPageRows();
}

Window_CharacterSelect.prototype.itemRect = function(index) {
    var rect = new Rectangle();
    var maxCols = this.maxCols();
    rect.width = this.rectWidth;
    rect.height = 60;
    rect.y = Math.floor(index / maxCols) * rect.height - this._scrollY;
    return rect;
};




//=============================================================================
// Character Select Command Window
//=============================================================================

function Window_CharacterCommand(){
    this.initialize.apply(this, arguments);
}

Window_CharacterCommand.prototype = Object.create(Window_Command.prototype);
Window_CharacterCommand.prototype.constructor = Window_CharacterCommand;

Window_CharacterCommand.prototype.initialize = function(parent, x, y){
    Window_Command.prototype.initialize.call(this, x, y);
    this.hide();
    this.setParams(parent);
}

Window_CharacterCommand.prototype.setParams = function(parent){
    this._parent = parent;
}

Window_CharacterCommand.prototype.makeCommandList = function(x, y){
    this.addCommand('Yes', 'command1');
    this.addCommand('no', 'command2');
}

//=============================================================================
// Character Select Command Horz Window
//=============================================================================

function Window_CharacterCommandHorz(){
    this.initialize.apply(this, arguments);
}

Window_CharacterCommandHorz.prototype = Object.create(Window_HorzCommand.prototype);
Window_CharacterCommandHorz.prototype.constructor = Window_CharacterCommandHorz;

Window_CharacterCommandHorz.prototype.initialize = function(parent, x, y){
    Window_HorzCommand.prototype.initialize.call(this, x, y);
    this.hide();
    this.setParams(parent);
}

Window_CharacterCommandHorz.prototype.setParams = function(parent){
    this._parent = parent;
}

Window_CharacterCommandHorz.prototype.makeCommandList = function(x, y){
    // adding a false argument disables the command;
    // this.addCommand('no', 'command3', false);
    this.addCommand('Yes', 'command1');
    this.addCommand('no', 'command2');
}

//=============================================================================
// Extending Window_Base Functionality
//=============================================================================

Window_Base.prototype.changeFontSize = function(size) {
        this.contents.fontSize = size;
};




