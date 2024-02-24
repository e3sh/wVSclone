//============================================
//include
//============================================

var w = [
//WebGameCoreSystem Files
    //SystemControl
    /*
    "system/proc/func/GameAssetManager.js",
    "system/proc/func/GameTaskControl.js",
    "system/proc/GameCore.js",
    "system/proc/dev/inputKeyboard.js",
    "system/proc/dev/inputMouse.js",
    "system/proc/dev/inputGamepad.js",
    "system/proc/dev/inputTouchPad.js",
    "system/proc/dev/inputVPad.js",
    "system/proc/func/DisplayControl.js",
    "system/proc/dev/soundControl.js",
    "system/proc/dev/offScreen.js",
    "system/proc/dev/offScreenTypeC.js",
    "system/proc/func/spriteControl.js",
    "system/proc/func/spriteFontControl.js",
    "system/proc/func/fontPrintControl.js",
    "system/proc/task/GameTaskClass.js",
    */
    "system/coremin.js",
 //画面表示や入力関係処理部(compatible-convert)
 "content/proc/conv/deviceControl.js",
 "content/proc/conv/screen.js",
 "content/proc/conv/soundCntl.js",
 "content/proc/conv/geometoryTr.js",
 "content/proc/conv/Layout.js",
//データ部(キャラクタやスプライトパターン制御用の設定）
 "content/asset/param/spdata.js",
 "content/asset/param/character.js",
 "content/asset/param/motionPtn.js",
 //データ部(ステージの敵の動きなどの設定)
 "content/asset/param/stage/Stage1.js",
 "content/asset/param/stage/Dangeon.js",
 "content/asset/param/stage/Stage1_tod.js",
 "content/asset/param/stage/Dangeon_tod.js",
 "content/asset/param/stage/Stage1_test.js",
//データ部(キャラクタの動きなどの設定）
 "content/asset/param/scenario.js",
 "content/asset/param/scenario/player.js",
 "content/asset/param/scenario/player_bullet.js",
 "content/asset/param/scenario/friend.js",
 "content/asset/param/scenario/enemy.js",
 "content/asset/param/scenario/enemy_bullet.js",
 "content/asset/param/scenario/boss.js",
 "content/asset/param/scenario/common.js",
 "content/asset/param/scenario/item.js",
 "content/asset/param/scenario/effect.js",
 "content/asset/param/scenario/message.js",
 "content/asset/param/scenario/exevent.js",
//処理部
 "content/proc/control/gObjCntl.js",
 "content/proc/class/gObjClass.js",
 "content/proc/control/mapSceCntl.js",
 "content/proc/control/sceneControl.js",
//処理部（それぞれの場面）
 "content/proc/scene/gameScene.js",
 "content/proc/scene/sceneTitle.js",
 "content/proc/scene/sceneGover.js",
 "content/proc/scene/sceneConfig.js",
 "content/proc/scene/sceneResult.js",
 "content/proc/scene/scenePause.js",
 "content/proc/scene/sceneStatusDisp.js",
 "content/proc/scene/sceneOption.js",
 //処理部（状態管理）
 "content/proc/state/stateConfig.js",
 "content/proc/state/stateResult.js",
 "content/proc/state/stateSystem.js", 
 "content/proc/state/stateGame.js",
 "content/proc/control/stateControl.js",
 "content/proc/CL4TreeM.js",
//tasks
 "content/MainLoopTask.js",
 "system/proc/task/GameTask.js",

 //メイン
 "content/main.js"
];

for (var i in w) {
    document.write('<script type="text/javascript" src="' + w[i] + '"></script>');
};
