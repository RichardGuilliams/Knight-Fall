//=============================================================================
// Mythic Games Engine - Knight Fall Menu
// MGE_KnightFall.js
//=============================================================================

var Imported = Imported || {};
Imported.MGE_KnightFallMenu = true;

var Mythic = Mythic || {};
Mythic.Menu = Mythic.Menu || {};
Mythic.Menu.version = 1;

//=============================================================================
/*: 
 * @plugindesc Creates The Menus for KnightFall
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
    this._nextRowSpacing = this._padding + this._textSpacing * 1.5;
    this._equipTextSpacing = this._textSpacing + 24;
}

Window_CharacterInfo.prototype.setClassData = function(){
    this._actor = new Game_Actor(SceneManager._scene.index + 1);
    this._profileText = this._actor._profile.split('-');
    this.setCharacterEquip();
}

Window_CharacterInfo.prototype.setCharacterEquip = function(){
    this._actor._weapon = 'None'
    this._actor._head = 'None'
    this._actor._shield = 'None'
    this._actor._body = 'None'
    this._actor._accessory = 'None'

    this._actor._equips.map( (el, i) => {
        if (el._dataClass === 'weapon'){
            this._actor._weapon = $dataWeapons[el._itemId].name 
        }
        if(el._dataClass === 'armor' && el._itemId != null && el._itemId != 0){
            let armor = $dataArmors[el._itemId];
            if($dataArmors[el._itemId].etypeId === 2){
                this._actor._shield = armor.name 
            }
            if($dataArmors[el._itemId].etypeId === 3){
                this._actor._head = armor.name 
            }
            if($dataArmors[el._itemId].etypeId === 4){
                this._actor._body = armor.name 
            }
            if($dataArmors[el._itemId].etypeId === 5){
                this._actor._accessory = armor.name 
            }
        } 
    })
}

Window_CharacterInfo.prototype.drawAllItems = function(){
    this.contents.clear();
    this.setClassData();
    this.drawFace(this._actor._faceName, this._actor._faceIndex, this._padding, this._padding, this._faceWidth, this._faceHeight);
    this.drawCharacterNameAndDesc();
    this.drawCharacterStats();
    this.drawCharacterEquipment();
}

Window_CharacterInfo.prototype.drawCharacterNameAndDesc = function(){
    this.changeFontSize(24);
    this.drawText(`${this._actor._name}`, this._padding * 2 + this._faceWidth, 0, this._width - this._padding * 2, 'start');
    this.changeFontSize(16);
    this._profileText.forEach( (text, i) => {
        this.drawText(text, this._padding * 2 + this._faceWidth, this._padding + (24 * (i + 1)), this._width - this._padding * 2, 'start');
    });
}

Window_CharacterInfo.prototype.drawCharacterStats = function(){
    this.drawText(`HP:`, this._padding, this._faceHeight + this._padding, 0, 'start')
    this.drawText(`${this._actor.hp}`, this._textSpacing, this._faceHeight + this._padding, 0, 'start');
    this.drawText(`ATK:`, this._padding, this._faceHeight + this._padding * 3, 0, 'start')
    this.drawText(`${this._actor.atk}`, this._textSpacing, this._faceHeight + this._padding * 3, 0, 'start');
    this.drawText(`DEF:`, this._padding, this._faceHeight + this._padding * 5, 0, 'start')
    this.drawText(`${this._actor.def}`, this._textSpacing, this._faceHeight + this._padding * 5, 0, 'start');
    this.drawText(`MATK:`, this._padding, this._faceHeight + this._padding * 7, 0, 'start')
    this.drawText(`${this._actor.mat}`, this._textSpacing, this._faceHeight + this._padding * 7, 0, 'start');
    this.drawText(`MDEF:`, this._padding, this._faceHeight + this._padding * 9, 0, 'start')
    this.drawText(`${this._actor.mdf}`, this._textSpacing, this._faceHeight + this._padding * 9, 0, 'start');
    
    this.drawText(`MP:`, this._nextRowSpacing, this._faceHeight + this._padding, 0, 'start')
    this.drawText(`${this._actor.mp}`, this._nextRowSpacing + this._textSpacing, this._faceHeight + this._padding, 0, 'start');
    this.drawText(`AGIL:`, this._nextRowSpacing, this._faceHeight + this._padding * 3, 0, 'start')
    this.drawText(`${this._actor.agi}`,this._nextRowSpacing + this._textSpacing, this._faceHeight + this._padding * 3, 0, 'start');
    this.drawText(`ACC:`, this._nextRowSpacing, this._faceHeight + this._padding * 5, 0, 'start')
    this.drawText(`${this._actor.hit * 100}%`,this._nextRowSpacing + this._textSpacing, this._faceHeight + this._padding * 5, 0, 'start');
    this.drawText(`EV:`, this._nextRowSpacing, this._faceHeight + this._padding * 7, 0, 'start')
    this.drawText(`${this._actor.eva * 100}%`,this._nextRowSpacing + this._textSpacing, this._faceHeight + this._padding * 7, 0, 'start');
    this.drawText(`CRIT:`, this._nextRowSpacing, this._faceHeight + this._padding * 9, 0, 'start')
    this.drawText(`${this._actor.cri * 100}%`, this._nextRowSpacing + this._textSpacing, this._faceHeight + this._padding * 9, 0, 'start'); 
}

Window_CharacterInfo.prototype.drawCharacterEquipment = function(){
    // _equips _skills
    this.drawText(`Weapon:`, this._nextRowSpacing * 2.5, this._faceHeight + this._padding, 0, 'start')
    this.drawText(`${this._actor._weapon}`, this._nextRowSpacing * 2.5 + this._equipTextSpacing, this._faceHeight + this._padding, 0, 'start'); 
    this.drawText(`Shield:`, this._nextRowSpacing * 2.5, this._faceHeight + this._padding * 3, 0, 'start')
    this.drawText(`${this._actor._shield}`, this._nextRowSpacing * 2.5 + this._equipTextSpacing, this._faceHeight + this._padding * 3, 0, 'start'); 
    this.drawText(`Head:`, this._nextRowSpacing * 2.5, this._faceHeight + this._padding * 5, 0, 'start')
    this.drawText(`${this._actor._head}`, this._nextRowSpacing * 2.5 + this._equipTextSpacing, this._faceHeight + this._padding * 5, 0, 'start'); 
    this.drawText(`Body:`, this._nextRowSpacing * 2.5, this._faceHeight + this._padding * 7, 0, 'start')
    this.drawText(`${this._actor._body}`, this._nextRowSpacing * 2.5 + this._equipTextSpacing, this._faceHeight + this._padding * 7, 0, 'start'); 
    this.drawText(`Accessory:`, this._nextRowSpacing * 2.5, this._faceHeight + this._padding * 9, 0, 'start')
    this.drawText(`${this._actor._accessory}`, this._nextRowSpacing * 2.5 + this._equipTextSpacing, this._faceHeight + this._padding * 9, 0, 'start'); 



}

Window_CharacterInfo.prototype.drawSkills = function(){
    
}

Window_CharacterInfo.prototype.drawSkills = function(){
    
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
// Crafting Menu
//=============================================================================

//=============================================================================
// Upgrade Menu
//=============================================================================

//=============================================================================
// Fusion Menu
//=============================================================================

//=============================================================================
// Main Menu
//=============================================================================

Input.keyMapper['79'] = "mainMenu"

Scene_MainMenu.aliasSceneMapUpdate = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
    Scene_MainMenu.aliasSceneMapUpdate.call(this);
    if(Input.isTriggered('mainMenu')) SceneManager.push(Scene_MainMenu); 
};

function Scene_MainMenu() {
    this.initialize.apply(this, arguments);
}

Scene_MainMenu.prototype = Object.create(Scene_MenuBase.prototype);
Scene_MainMenu.prototype.constructor = Scene_MainMenu;

Scene_MainMenu.prototype.initialize = function(parent, x, y) {
    Scene_MenuBase.prototype.initialize.call(this);
    this.setParams(parent);
};

Scene_MainMenu.prototype.setParams = function() {
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

Scene_MainMenu.prototype.create = function(){
    Scene_MenuBase.prototype.create.call(this);
    this.createMainMenuCommandWindow();
}

Scene_MainMenu.prototype.createMainMenuCommandWindow = function(){
    this._mainMenuWindow = new Window_MainMenuCommand(0, 0);
    this._mainMenuWindow.show();
    this._mainMenuWindow.select(0);
    this._mainMenuWindow.activate();
    this._mainMenuWindow.setHandler('ok', this.command1.bind(this));
    this._mainMenuWindow.setHandler('cancel', this.commandBack.bind(this));
    this.addWindow(this._mainMenuWindow);
}

Scene_MainMenu.prototype.commandBack = function(){
    if(this._mainMenuWindow.visible) {
        this._mainMenuWindow.hide();
        this._mainMenuWindow.deactivate();
        this.popScene();
    }
}

Scene_MainMenu.prototype.command1 = function(){
    if(!this._mainMenuWindow.visible) {
        this._mainMenuWindow.show();
        this._mainMenuWindow.activate();
    }
}
// Window_Command.prototype.initialize = function(x, y) {
//     this.clearCommandList();
//     this.makeCommandList();
//     var width = this.windowWidth();
//     var height = this.windowHeight();
//     Window_Selectable.prototype.initialize.call(this, x, y, width, height);
//     this.refresh();
//     this.select(0);
//     this.activate();
// };

function Window_MainMenuCommand() {
    this.initialize.apply(this, arguments);
}

Window_MainMenuCommand.prototype = Object.create(Window_Command.prototype);
Window_MainMenuCommand.prototype.constructor = Window_MainMenuCommand;

Window_MainMenuCommand.prototype.initialize = function(x, y) {
    Window_Command.prototype.initialize.call(this, x, y);
    this.setParams(parent);
};

Window_MainMenuCommand.prototype.setParams = function(parent){
    this._parent = parent;
}

Window_MainMenuCommand._lastCommandSymbol = null;

Window_MainMenuCommand.prototype.initCommandPosition = function() {
    this._lastCommandSymbol = null;
};

Window_MainMenuCommand.prototype.makeCommandList = function() {
    this.addCommand('Items', 'commandItems');
    this.addCommand('Party', 'commandParty');
    this.setLeaderCommands();
    this.addCommand('Craft', 'commandCraft');
    this.addCommand('Options', 'commandOptions');
    this.addCommand('Save', 'commandSave');
    this.addCommand('End Game', 'commandEndGame');
}

Window_MainMenuCommand.prototype.setLeaderCommands = function(){
    switch($dataClasses[$dataActors[$gameParty._actors].classId].name){
        case "Geomancer":
            this.addCommand('Geomancy', 'commandGeomancy');
            return

        case "Rogue":
            this.addCommand('Alchemy', 'commandAlchemy');
            return

        case "White Mage":
            this.addCommand('Enchanting', 'commandEnchanting');
            return

        case "Dark Mage":
            this.addCommand('Enchanting', 'commandEnchanting');
            return

        case "Beastmaster":
            this.addCommand('Survival', 'commandSurvival');
            return           
    }
};

//=============================================================================
// Window for monster info during battle
//=============================================================================

function Window_EnemyStatus(){
    this.initialize.apply(this, arguments);
}

Window_EnemyStatus.prototype = Object.create(Window_Base.prototype);
Window_EnemyStatus.prototype.constructor = Window_EnemyStatus;

// height 60
// var _enemyStatus = new Window_EnemyStatus($gameTroop._enemies[0]._screenX - 100, $gameTroop._enemies[0]._screenY - 100, 200, 100)
// var _enemyStatus = new Window_EnemyStatus($gameTroop._enemies[0]._screenX - 100, $gameTroop._enemies[0]._screenY - 100, 200, 100)
BattleManager.setEnemyStatusWindow = function(logWindow) {
    this._enemyStatusWindow = _enemyStatusWindow;
};

Mythic.KnightFall.aliasBattleCreateWindows = Scene_Battle.prototype.createAllWindows
Scene_Battle.prototype.createAllWindows = function() {
    Mythic.KnightFall.aliasBattleCreateWindows.call(this);
    this.createEnemyStatusWindow();
};

Scene_Battle.prototype.createEnemyStatusWindow = function() {
    this._enemyStatusWindow = new Window_EnemyStatus(0, 0, 0, 0);
    this.addWindow(this._enemyStatusWindow);
};

Scene_Battle.prototype.update = function() {
    var active = this.isActive();
    $gameTimer.update(active);
    $gameScreen.update();
    this.updateStatusWindow();
    this.updateEnemyStatusWindow();
    this.updateWindowPositions();
    if (active && !this.isBusy()) {
        this.updateBattleProcess();
    }
    Scene_Base.prototype.update.call(this);
};

Scene_Battle.prototype.updateEnemyStatusWindow = function(){
    this._enemyStatusWindow.update();
};



Window_EnemyStatus.prototype.initialize = function(x, y, width, height){
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this.setParams();
    this.createWindows();
    this.drawAllItems();
}

Window_EnemyStatus.prototype.update = function(){
    if(this._enemy0Info) this._enemy0Info.drawAllItems($gameTroop._enemies[0]);
    if(this._enemy1Info) this._enemy1Info.drawAllItems($gameTroop._enemies[1]);
    if(this._enemy2Info) this._enemy2Info.drawAllItems($gameTroop._enemies[2]);
    if(this._enemy3Info) this._enemy3Info.drawAllItems($gameTroop._enemies[3]);
}

Window_EnemyStatus.prototype.createWindows = function(){
    $gameTroop._enemies.forEach( (el, i) => {
        let x = el._screenX - 48;
        let y = el._screenY;
        this[`_enemy${i}Info`] = new Window_EnemyInfo(el, x - 50, y - 10, 250, 100);
        this.addChild(this[`_enemy${i}Info`]);
    })
}

Window_EnemyStatus.prototype.setParams = function(){
    this._height = 60;
    this._width = 100;
    this._textSize = 14;
}


Window_EnemyStatus.prototype.drawAllItems = function(){
    this.contents.clear();
    // this.setClassData();
}

//=============================================================================
// Extending Window_Base Functionality
//=============================================================================

function Window_EnemyInfo(){
    this.initialize.apply(this, arguments);
}

Window_EnemyInfo.prototype = Object.create(Window_Base.prototype);
Window_EnemyInfo.prototype.constructor = Window_EnemyInfo;

Window_EnemyInfo.prototype.initialize = function(subject, x, y, width, height){
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this._windowFrameSprite.visible = false;
    this._windowBackSprite.visible = false;
    this.drawAllItems(subject);
}

Window_EnemyInfo.prototype.drawAllItems = function(subject){
    if(subject.hp > 0){
        this.contents.clear();
        this.changeFontSize(15);
        this.drawText(`Lvl: ${subject._lvl}`, 0, 0, 40, 'start')
        this.drawText(`Hp:`, 50, 0, 40, 'start');
        this.drawGauge(80, -12, 100, subject.hpRate(), 'red', 'red');
        this.drawText(`${subject.hp}`, 80, -12, 100, 'start');
        this.drawText('/', 95, -12, 100, 'start');
        this.drawText(`${subject.mhp}`, 110, -12, 100, 'start');
    }
    else this.contents.clear();

}


//=============================================================================
// Extending Window_Base Functionality
//=============================================================================

Window_Base.prototype.changeFontSize = function(size) {
        this.contents.fontSize = size;
};




