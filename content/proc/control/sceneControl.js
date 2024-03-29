﻿// sceneControl
function sceneControl(state) {
//sceneが増えてきてmainがすっきりとしなくなったので分離の為作成。2011/05/04
    //var fcnt = 0;

    var scrn = state.System.dev.graphics[4];//Wipescreen

    var titleSce = [];

    var sceneList = [];

    sceneList[1] = new gameScene(state);       titleSce[1] = "Main";//state.Result.load()はここ//hiscoreをlocalstorageから復帰
    sceneList[2] = new sceneTitle(state);      titleSce[2] = "Title";
    sceneList[3] = new sceneGover(state);      titleSce[3] = "Gover";
    sceneList[4] = new sceneConfig(state);     titleSce[4] = "Config";//state.Config.load()はここ//configをlocalstorageから復帰
    sceneList[5] = new sceneResult(state);     titleSce[5] = "Result";
    sceneList[6] = new scenePause(state);      titleSce[6] = "Pause";
    sceneList[7] = new sceneStatusDisp(state); titleSce[7] = "Status";
    sceneList[8] = new sceneOption(state);     titleSce[8] = "Option";
    sceneList[9] = new sceneLvUp(state);       titleSce[9] = "LvUp";

    var wipeEffectCount; 

    var menuvf = false;

    //var clRect = function(x,y,w,h){this.draw = function(device){ device.clearRect(x,y,w,h);}}

    for (var i in sceneList) {
        sceneList[i].init();
    }
    //var scene = sceneList[2];

    const TITLERC = 2;

    var rc = TITLERC; // 最初のSceneはTitle
    var runscene = rc;

    function reset(){
        for (var i in sceneList){
            sceneList[i].reset_enable = true; 
        } 
        //fcnt = 0;       
    }

    this.step = function() {
        //fcnt ++;

        if (rc != 0) {
            //Sceneの切り替えが発生している。
            //wipeEffectCount = scrn.cw/2;

            var fg = false; // continue flag
            if (rc >= 10) { //resultからGameSceneへ戻るときは+10(としてContinueであることを知らせている。過去の名残。returnを
                //状態ステータスのオブジェクト参照とかにすればスマートなのでよいが、困ってないので何か都合が悪い状況になったら修正する。)
                rc = rc % 10;
                fg = true;
               //continue flag on時(次の面に行く場合)にはWipe表示
                wipeEffectCount = scrn.cw/2;
            }
            //(GameStartの時もWipe表示)TITLE画面からGameSceneへ来た時
            if (runscene == TITLERC && rc==1) wipeEffectCount = scrn.cw/2;
            //移動してくるときにWipe有りなしを指定したいのでrc＝{nextscene:num,　continue:bool,　wipeview:bool}
            //みたいに変更する？そのうちに

            runscene = rc;
    
            if (sceneList[runscene].reset_enable) {
                if (runscene == TITLERC) reset();//TITLEに戻るときにすべてのsceneのreset_enableをtrueに戻しておく。
                //GameSceneのPauseから復帰のステータスが残ったままになってしまい、quit後の再実行時不具合になるため。
                sceneList[runscene].reset( fg );
            }
        }
        rc = sceneList[runscene].step();

        wipeEffectCount = (wipeEffectCount > 0) ? 
            wipeEffectCount-(3 * 60/(1000/state.System.deltaTime())) :
            0;
        /*
        var kstate = dev.key_state.check();

        var numkey = false;
        for (var i in kstate){ //Fullkey[0]-[9]
            if (Boolean(kstate[i]) && (i >= 48) && (i <= 57)){
                numkey = true;
            }
        }
        */
    }

    this.draw = function(){

        if (wipeEffectCount > 0){

            EffectWipeFrame(scrn.cw/2-wipeEffectCount);
        } else {
            //scrn.fill(0, 0, scrn.cw, scrn.ch, "black");
            //scrn.fill(192, 120, 640, 400);
        }

        sceneList[runscene].draw();
                
        if (state.Config.debug) {
            //if (fcnt%90 > 30){
            if (state.System.blink()){    
                var st = titleSce[runscene];

                bar = {}

                bar.x = scrn.cw-st.length*8;
                bar.y = 0;
                bar.l = st.length*8;
        
                bar.draw = function(device){
                    device.beginPath();
                    device.fillStyle = "black";
                    device.lineWidth = 1;
                    device.fillRect(this.x, this.y, this.l*8, 8);
                    //device.stroke();
                }
                scrn.putFunc(bar);
                scrn.putchr8(st, scrn.cw-st.length*8, 0);
            }                
        }

        //if (wipeEffectCount > 0){

          //  EffectWipeFrame(scrn.cw/2-wipeEffectCount);
            /*
            var w = wipeEffectCount;
            scrn.fill(0, 0, scrn.cw, scrn.ch, "black");
            scrn.fill(scrn.cw/2 +w, scrn.ch/2 +w, scrn.ch/2-w, scrn.cw/2-w ,"green");
            scrn.putchr8("wec:"+ wipeEffectCount,  320,200)
            //scrn.putFunc(new clRect(w, w, scrn.cw-w, scrn.ch.w ));
            */
        //}
    }

    function EffectWipeFrame(size){
        var cw = scrn.cw;
        var ch = scrn.ch;

        var c = "black";//rgba(0,0,0,"+ ((cw-size*2) /cw) +")";

        scrn.fill(0, 0, cw, ch/2 - size, c);
        scrn.fill(0, ch/2 + size, cw, ch/2 - size, c);

        scrn.fill(0, 0, cw/2 - size, ch, c);
        scrn.fill(cw/2 + size, 0, cw/2-size,ch, c);

        //scrn.fill(0, 0, cw, ch, c);
        //scrn.fill(cw/2 - size, ch/2 - size, size*2, size*2);

        /*
        var fl = {}
        fl.x = cw/2 - size;
        fl.y = ch/2 - size;
        fl.s = size *2;
        fl.draw = function(context){
            // 重なり部分をクリアする設定
            context.globalCompositeOperation = "destination-out";
            context.fillStyle = "rgba(255, 0, 0, 1)";
            //context.fillRect(this.x,this.y,this.s,this.s);
            context.arc(this.x, this.y, this.size/2, 0, Math.PI * 2, false);
            context.fill();
            // 半透明色での塗りつぶし
            context.globalCompositeOperation = "source-over";
            //context.clearRect(this.x,this.y,this.s,this.s);
        }
        scrn.putFunc(fl);
        */
    }
    /*
    function submenuCheck(){
        var kstate = dev.key_state.check();

        var numkey = false;
        for (var i in kstate){ //Fullkey[0]-[9]
            if (Boolean(kstate[i]) && (i >= 48) && (i <= 57)){
                numkey = true;
            }
        }

        if (numkey) {
            var inp = -1;
            for (var i in kstate){
                if (Boolean(kstate[i])){
                    inp = i-48;
                    break;
                }
            }

            ret_code = 0;
            switch (inp){
                case 1:
                    state.Config.debug = (!state.Config.debug);
                    break;
                case 2:
                    state.Config.lamp_use = (!state.Config.lamp_use);
                    break;
                case 3:
                    state.Config.map_use = (!state.Config.map_use);
                    break;
                case 4:
                    //state.System.dev.sound.mute = (!state.System.dev.sound.mute);
                    break;
                case 5:
                    state.Config.bulletmode = (!state.Config.bulletmode);
                    break;
                case 6:
                    state.Game.player.level = (state.Game.player.level++ >= 3) ? 0: state.Game.player.level;
                    break;
                case 8:
                    //ret_code = 7; //sceneStatusDisp
                    break;
                case 9:
                    state.Config.viewlog = (!state.Config.viewlog);
                    break;
                case 0:
                    menuvf = (!menuvf);
                    break;
                default:
                    break;
            }
        }
    }

    function submenuDraw(){

        if (menuvf){
            let arr = [];
            scrn.fill(0, 240, 8 * 22, 8 * 11, "navy");
            scrn.putchr8("Input ["+ inp +"]", 16, 240);

            arr.push("1: Debug Display  :" + (state.Config.debug?"ON":"OFF"));
            arr.push("2: Lamp(nextStage):" + (state.Config.lamp_use?"ON":"OFF"));
            arr.push("3: Map (nextStage):" + (state.Config.map_use?"ON":"OFF"));
            arr.push("4: -");//Mute (NotSupport)   :" + (state.System.dev.sound.mute?"ON":"OFF"));
            arr.push("5: Bullet(inRange):" + (state.Config.bulletmode?"ON":"OFF"));
            arr.push("6: Weapon Level   :+" + state.Game.player.level);
            arr.push("7: -");//Import/Export :NotSupport");
            arr.push("8: Obj Status Disp:->");
            arr.push("9: (Debug)Log View:" + (state.Config.viewlog?"ON":"OFF"));
            arr.push("0: Menu Display   :" + (menuvf?"ON":"OFF"));

            for (let i in arr){
                scrn.putchr8(arr[i], 0, 248 + i * 8);
            }
        }
    }
    */
}

