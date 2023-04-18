/*
Game messages have special commands that will affect the display in various ways
heres a list of string commands and what they will do to the text.

Commands:

\C[n] Show a text color. n=a number(1 to 19)
\S[n] Set the text speed. n=a number(1 to 20) 1 is the fastest(without pauses) and 20 is the slowest.
\N[n] Show the name of a hero. n=hero's number.Note that 0 will write the name of your party's leader.
\V[n] Show a variable value. n=variable's number.
\$ A box appears showing your current money.
\! Put that before a word. You will have to press enter to show that word but it will be in the same box than the others.
\. 1/4 of delay before the next letter.
\| 1 delay before the next letter.
\^ The message end without you need to press enter.
\> \< Displays the part of the message between \> and \< instantly.
\\ Shows "\".
\_ Shows half a space.

`${}` will add the variable into the text


Colors:

\C[0] Normal color(Light blue)
\C[1] Blue
\C[2] Orange
\C[3] Grey
\C[4] Yellow
\C[5] Dark red
\C[6] Purple
\C[7] Pink
\C[8] Shinning orange
\C[9] Green
\C[10] Dark blue
\C[11] Red
\C[12] Snots green
\C[13] Dark purple
\C[14] Gold
\C[15] Light green
\C[16] Dark dark purple
\C[17] Grey-blue
\C[18] Dark green
\C[19] Brown
*/

//Mythic Games Engine

// <Ingredients:ItemType,ItemId,itemQuantity>
// There are three different types of items
// 'Item', 'Weapon', 'Armor

// Returns id of object the given array
// $dataActors.forEach(actor => {if(actor == undefined) return; 
//  else if(Object.values(actor).contains('Lavis')) return actor.id})

// Refresh shop items window
// SceneManager._scene._buyWindow.refresh()
// Shop Data Goods
// [itemType, itemid, itemdefaultvalue, itemcustomvalue]
// _data {itypeid, id, price, }

//$gameMap._interpreter._list

// Trait codes for skills, Items
// Recover HP           -- Code:11
// Recover MP           -- Code:12
// Gain TP              -- Code:13
// Add State            -- Code:21
// Remove State         -- Code:22
// Add Buff             -- Code:31
// Add Debuff           -- Code:32
// Remove Buff          -- Code:33
// Remove Debuff        -- Code:34
// Special Effect       -- Code:41
// Grow                 -- Code:42
// Learn Skill          -- Code:43
// Common Event         -- Code:44

// Trait Codes for Classes, Weapons, Armors, Enemies, States 
// Element Rate         -- Code:11
// Debuff Rate          -- Code:12
// State Rate           -- Code:13
// State Resist         -- Code:14
// Parameter            -- Code:21
// Ex-Parameter         -- Code:22
// Sp-Parameter         -- Code:23
// Attack Element       -- Code:31
// Attack State         -- Code:32
// Attack Speed         -- Code:33
// Attack Time          -- Code:34
// Add Skill Type       -- Code:41
// Seal Skill Type      -- Code:42
// Add Skill            -- Code:43
// Seal Skill           -- Code:44
// Equip Weapon         -- Code:51
// Equip Armor          -- Code:52
// Lock Equip           -- Code:53
// Seal Equip           -- Code:54
// Slot Type            -- Code:55
// Action Times +       -- Code:61
// Special Flag         -- Code:62
// Collapse Effect      -- Code:63
// Party Ability        -- Code:64



// Move BattlerSprite
// SceneManager._scene._spriteset._actorSprites[0].children[2].x = -100

// Move Shadow Sprite
// SceneManager._scene._spriteset._actorSprites[0].children[0].x = -100

// Double size of battler
// SceneManager._scene._spriteset._actorSprites[0].children[2].transform.scale.y = 2
// SceneManager._scene._spriteset._actorSprites[0].children[2].transform.scale.x = 2

// Undrenders screen causing it to go black when set to false
// SceneManager._scene.renderable = false

// Causes a battle to start. args(troopId, canEscape, canLose)
// BattleManager.setup(1, true, true);
// SceneManager.push(Scene_Battle);

// Map Manipulation
//changes position of map on screen
//SceneManager._scene.children[0]._tilemap.x = 0

// Show Picture
// $gameScreen.showPicture
// (1, 'blueDragon', 0, 65, 65, 75, 75, 255, 0)

// Change Picture Tint
// $gameScreen.picture(1).tint([0,0,0,0], 5)
// args ([r,g,b,a], duration)


// let newEvent = new Game_Event(1, MGE_MapData[1].id)
// (mapId, EventId)

// MGE_LoadMapData("$dataMap", "Map002.json");
// let newEvent = JSON.parse(JSON.stringify(MGE_MapData[1]));
// newEvent.id = $gameMap._events.length;
// $dataMap.events.push(newEvent);
// $gameMap.setupEvents();

// CHanges tint of screen
SceneManager._scene.children[0]._toneFilter.adjustTone(50, 0, 200)

// Changes tint of all character sprites on screen
SceneManager._scene.children[0]._characterSprites.forEach(character => {
    character.tint = 0x6B0D98
})

// Changes brights of screen
$gameScreen._brightness = 100

// Creates a flash effect on screen
$gameScreen._flashColor = [200, 200, 200, 200]
$gameScreen._flashDuration = 20

// creates weather effect on screen
// possible effects are `storm`, `rain`, `snow` and `none`
$gameScreen.changeWeather(`storm`, 20, 1)

