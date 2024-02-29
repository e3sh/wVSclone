# wVSclone

Upgraded version of repository JavascriptActionGame

https://e3sh.github.io/wVSclone/main.html

## Operation method: keyboard operation / gamepad operation
- Move: direction key (arrow key)* / cross key
- Attack (Action): [Z] or [Space] / (X)｜(□)
- Use item: [X] or [Ctrl] / (B)｜(○)
- Jump: [C] / (A)｜(×)
- Pause: [ESC] / (START)｜(三)  

* You can also move with WASD or the numeric keypad.

・ Attack (action) operation: Consume the ball (Staff: Attack / Other weapons: Collect items on the screen)

## ITEMS: Uses and effects of items
- ( ): Ball: (light yellow) Staff: Consume to attack / Other Weapons: Consume and collect items on the screen
- (L): green ball: stamina recovery +3 / upper limit increase +1 (life)
- (S): Blue Ball: Creates a temporary barrier (shield).
- (B): Red Ball: Damage enemies within sight (Bomd)
- Lamp: Display the location of enemies, items and keys on the map (lamp)
- Map: Map display (map)
- Key: Allows you to enter the door and move to the next side (key)
- Coins: Score items

## Weapons: Weapon types and effects
(manual attack)
- Staff: Consume balls to attack from a distance.
 
(auto attack)
- Sword: 90 degree forward melee attack
- Spear: melee attack in a straight line in the direction of travel
- Axe: unique circular melee attack
- Bow (BOW/ARROW): range attack in 3 directions forward (range attack in 1 direction if used by enemy)
- Boomerang: Area attack in the direction of travel

・Strengthen by acquiring the same type of weapon continuously (shortening attack interval) (maximum +3)
・(In the case of staff, add 7 balls)

## ENEMYS: About Enemies
- Some enemies pick up and use weapons.
- Some enemies shoot bullets.
- Most enemies pick up items. (Picking it up will drop it into the treasure chest.)
- If it's a multiple of 5, the enemy already has the key. (boss)
- Blue enemies emit a certain number of enemies from enemy nests (generators).
- Enemies may appear in some treasure chests on the field.

## Debug mode:
Can be set on the title screen setting screen and pause screen

### Title screen settings:
- DebugStatus : ON to display debug status
                 Displays the control status of each off-screen buffer, fps/load display, hit detection range, etc.
- BulletErace: If checked, bullets coming from off screen will be erased.
                 If the spawned bullet is not within the viewing screen, it will disappear immediately.


### Pause screen:
Switch on/off with the number keys on the full keyboard side.

- 1: Debug display Debug status display
- 2: Lamp (at the time of floor change) Possession of lamp (effective after side change)
- 3: Map (at the time of floor change) Possession of map (valid even after side change)
- 4 : Mute (NotSupport) Mutes sound effects/BGM
- 5 : BulletMode(offRange) Remove bullets outside the screen.
- 6 : Weapon Level Increase/Decrease Power Up State
- 7 : Map Option Menu Transit to the Option screen.
- 8 : Obj Status Disp Transit to the status confirmation screen.
- 9 : (Debug)Log View Switches log display during debug display.
- 0: Show menu Show this menu Off On


### Status display screen:
(Screen entered from the pause screen of 8: ObjStatusDisp)
Screen for checking the internal state with DEBUG (checking the operating state of each character)

Operations on this screen
- Full keyboard [1] to [9] page selection
- Full keyboard [0] Select number to go to detail screen
- [C] Clear background display (clear screen)
- [V] Inventory status display for each character (excluding own ship)
- [Z] [SPACE] Return to previous screen (return to pause screen)

## Supported browsers:
edge/chrome

---------
以下、原文
上の翻訳はGoogle翻訳で実施。
再翻訳を繰り返して調整しているので若干表記変更あり。

# wVSclone
repositorie JavascriptActionGameのバージョンアップ版

https://e3sh.github.io/wVSclone/main.html

## 操作方法： キーボード操作　/　ゲームパッド操作
- 移動(Move):　方向キー(ArrowKey)＊　/ 十字キー
- 攻撃(Action):　　　[Z] or [Space]　/ (X)｜(□)
- アイテム使用(Use):　[X] or [Ctrl]  / (B)｜(○)
- ジャンプ(Jump):　　　[C]　　　　    / (A)｜(×)
- 一時停止(Pause):　　　[ESC]　　　/ (START)｜(三)  

-＊ WASDとテンキーでも移動可能。

・ 攻撃(Action)操作:玉を消費（WAND:攻撃 / 他武器:画面内アイテム回収)

## ITEMS:アイテムの用途や効果
- ( ):玉　：(薄黄色)　WAND:消耗して攻撃 / 他武器:消耗して画面内アイテム回収
- (L):緑玉:体力回復+3/上限値上昇+1(Life)
- (S):青玉:一定時間バリアを貼る(Shield)
- (B):赤玉:視界内の敵にダメージ(Bomd)
- ランプ：敵、アイテム、鍵の位置を地図に表示(Lamp)
- 地図：マップ表示(Map)
- 鍵:持った状態で扉に入ると次の面へ(Key)
- Coin: 得点（SHOPとかSKILLとか実装すると意味を持たせられるかも）

## WEAPONS:武器の種類と効果
(手動攻撃)
- 杖(WAND)：玉消費して遠隔攻撃
　
 
(自動攻撃)
- 剣(SWORD):移動方向前面90度近接攻撃　
- 槍(SPEAR):移動方向直線の近接攻撃　
- 斧(AXE):自分の全周回転近接攻撃　
- 弓(BOW/ARROW):移動方向前面3方向の遠隔攻撃(敵使用時は1方向遠隔攻撃)　
- ブーメラン:移動方向への遠隔攻撃　

・ 連続して同じ種類の武器を入手すると強化(攻撃間隔の短縮)(Maxは+3)　
・ (WANDの場合は、玉を7個追加）

## ENEMYS:敵について
- 一部の敵は武器を拾うと使用する。
- 一部の敵は弾を打つ。
- ほとんどの敵はアイテムを拾う。(拾っている場合は宝箱を出す。)
- 5の倍数面では最初から敵が鍵を持っている。(BOSS)
- 青い色の敵は敵の巣(Generator)で一定数敵を排出する。
- 最初からフィールドにある宝箱は敵入り(Mimic)(見たら判るようにはしている)

## DEBUG mode:
タイトル画面のConfigと一時停止(Pause)画面で設定可能

### タイトル画面のConfig:
- DebugStatus :ONでデバッグステータス表示
  各offscreenバッファーの制御状態とfps/loadの表示/当たり判定範囲などを表示
- BulletErace :ONで画面外からの弾を消す
  発生した弾が表示画面内でない場合は即座に消滅するようになる。


### 一時停止(Pause)画面:
フルキーボード側の数字キーでオフオンの切り替え
　
- 1 : Debug Display        デバッグステータス表示　    
- 2 : Lamp(on FloorChange) ランプ所持(面切り替え後に有効) 　
- 3 : Map (on FloorChange) 地図所持(面切り替え後に有効)　 
- 4 : Mute (NotSupport)    効果音・BGMのMUTE（今のところ、うまく動かないので効果なし) 
- 5 : BulletMode(offRange) 画面外からの弾を消す　 
- 6 : Weapon Level         パワーアップ状態の増減
- 7 : Map Option Menu      Option画面に推移する。
- 8 : Obj Status　Disp     状態確認画面に推移する。　 
- 9 : (Debug)Log View      デバッグ表示時のログ表示切替
- 0 : Menu Display         本メニューの表示オフオン 　


### 状態確認(StatusDisplay)画面:
(一時停止画面から8:ObjStatusDispで入る画面の)
DEBUGで内部状態確認用画面(各キャラクターの動作状態確認)

当画面での操作
- フルキーボード[1]～[9] Page選択
- フルキーボード[0]      番号選択で詳細画面に推移 　
- [C]  背景表示消去(画面クリア)　　　　
- [V]  各キャラクターのINVENTRY状態表示(自機を除く)　　　　　
- [Z][SPACE]　前の画面に戻る(Pause画面に戻る)

## 動作確認したブラウザ: 
Edge/Chrome
