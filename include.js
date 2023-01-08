//============================================
//include
//============================================

var w = [
//WebGameCoreSystemMinifyFile
"controller/coremin.js",
/*
//WebGameCoreSystem Files
    //SystemControl
    "controller/GameAssetManager.js",
    "controller/GameTaskControl.js",
    "controller/GameCore.js",

    //deviceControls
    "controller/inputKeyboard.js",
    "controller/inputMouse.js",
    "controller/DisplayControl.js",
    "controller/soundControl.js",
    "controller/offScreen.js",
    "controller/offScreenTypeB.js",
    "controller/spriteControl.js",
    "controller/spriteFontControl.js",

    //class
    "controller/GameTaskClass.js",
*/
//画面表示や入力関係処理部
 "dev/deviceControl.js",
 "dev/screen.js",
 //"dev/inputControl.js",
 //"dev/inputKeyboard.js",
 "dev/soundControl.js",
 "dev/images.js",
 //"dev/vartualkeyControl.js",
//データ部(キャラクタやスプライトパターン制御用の設定）
 "dev/geometoryTr.js",
 "dev/Layout.js",
 "data/spdata.js",
 "data/character.js",
 "data/motionPtn.js",
//データ部(ステージの敵の動きなどの設定)
 "data/stage/Stage1.js",
 "data/stage/Dangeon.js",
//データ部(キャラクタの動きなどの設定）
 "data/scenario.js",
 "data/scenario/player.js",
 "data/scenario/player_bullet.js",
 "data/scenario/friend.js",
 "data/scenario/enemy.js",
 "data/scenario/enemy_bullet.js",
 "data/scenario/boss.js",
 "data/scenario/common.js",
 "data/scenario/item.js",
 "data/scenario/effect.js",
 "data/scenario/message.js",
 "data/scenario/exevent.js",
//処理部
 "proc/control/gObjCntl.js",
 "proc/class/gObjClass.js",
 "proc/control/mapSceCntl.js",
 "proc/control/sceneControl.js",

 "proc/class/ocl_scmove.js",
//処理部（それぞれの場面）
 "proc/scene/gameScene.js",
 "proc/scene/sceneTitle.js",
 "proc/scene/sceneGover.js",
 "proc/scene/sceneConfig.js",
 "proc/scene/sceneResult.js",
//処理部（状態管理）
 "proc/state/stateConfig.js",
 "proc/state/stateResult.js",
 "proc/state/stateSystem.js", 
 "proc/state/stateGame.js",
 "proc/control/stateControl.js",
 //"proc/bench.js",
 "proc/CL4TreeM.js",
//tasks
 "task/MainLoopTask.js",
 "task/GameTask.js",

 //メイン
 "controller/main.js"
// "proc/main_r.js" //non WGCS version
];

for (var i in w) {
    document.write('<script type="text/javascript" src="' + w[i] + '"></script>');
};


