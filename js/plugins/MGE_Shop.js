//=============================================================================
// Mythic Games Engine - Knight Fall Shop
// MGE_Shop.js
//=============================================================================

var Imported = Imported || {};
Imported.MGE_Shop = true;

var Mythic = Mythic || {};
Mythic.Shop = Mythic.Shop || {};
Mythic.Shop.version = 1;

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

Scene_Shop.prototype.prepare = function(goods, purchaseOnly) {
    this._goods = goods;
    this._purchaseOnly = purchaseOnly;
    this._item = null;
};

Scene_Shop.prototype.doBuy = function(number) {
    $gameParty.loseGold(number * this.buyingPrice());
    $gameParty.gainItem(this._item, number);
    if(this._goods[this._buyWindow.index()][4] > 1 && this._goods[this._buyWindow.index()][4] != number) this._goods[this._buyWindow.index()][4] -= number;
    else {
        this._goods.splice(this._buyWindow.index(), 1);
        if(this._buyWindow._index > this._goods.length - 1) this._buyWindow._index -= 1; 

    }
};

Scene_Shop.prototype.doSell = function(number) {
    $gameParty.gainGold(number * this.sellingPrice());
    $gameParty.loseItem(this._item, number);
};

Window_ShopNumber.prototype.changeNumber = function(amount) {
    var lastNumber = this._number;
    this._number = (this._number + amount).clamp(1, SceneManager._scene._numberMax);
    if (this._number !== lastNumber) {
        SoundManager.playCursor();
        this.refresh();
    }
};

Window_Selectable.prototype.hasInventory = function() {
}

Window_Selectable.prototype.select = function(index) {
    if(MapEvent()){
        if(MapEvent()._shop){
            if(MapEvent()._shop.inventory.length <= 0 && SceneManager._scene.constructor == Scene_Shop) return SceneManager._scene.popScene();
        } 
    }
    if(isShopScene() && nonNegative(index)){
        SceneManager._scene._numberMax = MapEvent()._shop.inventory[index][4] 
    }
    this._index = index;
    this._stayCount = 0;
    this.ensureCursorVisible();
    this.updateCursor();
    this.callUpdateHelp();
};


Window_Selectable.prototype.drawAllItems = function() {
    var topIndex = this.topIndex();
    for (var i = 0; i < this.maxPageItems(); i++) {
        var index = topIndex + i;
        if (index < this.maxItems()) {
            this.drawItem(index);
        }
    }
};

Window_ShopBuy.prototype.drawItem = function(index) {
    var item = this._data[index];
    var rect = this.itemRect(index);
    var priceWidth = 96;
    rect.width -= this.textPadding();
    this.changePaintOpacity(this.isEnabled(item));
    this.changeFontSize(16);
    this.drawItemName(item, rect.x, rect.y, rect.width - priceWidth);
    this.drawText(`Price: ${this.price(item)}`, rect.x + 200, rect.y, priceWidth, 'left');
    this.drawText(`Amount: ${MapEvent()._shop.inventory[index][4]}`, rect.x + 300, rect.y, priceWidth, 'left');
    this.changePaintOpacity(true);
};

