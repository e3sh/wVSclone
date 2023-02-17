# wVSclone
repositorie JavascriptActionGameのバージョンアップ版

https://e3sh.github.io/wVSclone/main.html

## 開発状況
- (2023/02/17)Gamepad対応(Gamepadの入力をキーボード入力に割り当て追加)。
- iPad(Safari)でもゲームコントローラで操作可能となったが音は出ず。
- memo: PS5コントローラはBluetouthでNotePCやiOS機器と接続できるので動作確認で使用できる。(ボタンアサインはLogicoolやXboxコントローラと同じ位置の模様)

## 操作方法： キーボード操作　/　ゲームパッド操作
- 移動(Move):　方向キー(ArrowKey)　/ 十字キー
- 攻撃(Action):　　　[Z] or [Space]　/ (A)｜(×) 　
- アイテム使用(Use):　[X] or [Ctrl]　 / (B)｜(○)
- ジャンプ(Jump):　　　[C]　　　　 / (X)｜(□)
- 一時停止(Pause):　　　[ESC]　　　/ (START)｜(三)  

・ 攻撃(Action)操作:玉を消費（WAND:攻撃 / 他武器:画面内アイテム回収)

## ITEMS:
- ( ):玉　：(薄黄色)　WAND:消耗して攻撃 / 他武器:消耗して画面内アイテム回収
- (L):緑玉:体力回復+3/上限値上昇+1(Life)
- (S):青玉:一定時間バリアを貼る(Shield)
- (B):赤玉:視界内の敵にダメージ(Bomd)
- ランプ：敵、アイテム、鍵の位置を地図に表示(Lamp)
- 地図：マップ表示(Map)
- 鍵:持った状態で扉に入ると次の面へ(Key)
- Coin: 得点（SHOPとかSKILLとか実装すると意味を持たせられるかも）

## WEAPONS:
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

## 敵/ENEMYS:
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
- 0 : Menu Display         本メニューの表示オフオン 　
  
## 動作確認ブラウザ: 
Edge/Chrome
