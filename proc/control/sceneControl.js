// sceneControl
function sceneControl(state) {
//sceneが増えてきてmainがすっきりとしなくなったので分離の為作成。2011/05/04
    var fcnt = 0;

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

    var wipeEffectCount; 

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
        fcnt = 0;       
    }

    this.step = function() {
        fcnt ++;

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

        wipeEffectCount = (wipeEffectCount > 0) ? wipeEffectCount-3 : 0;
    }

    this.draw = function(){

        if (wipeEffectCount > 0){

            EffectWipeFrame(scrn.cw/2-wipeEffectCount);
        }

        sceneList[runscene].draw();
                
        if (state.Config.debug) {
            if (fcnt%90 > 30){
                var st = titleSce[runscene];

                bar = {}

                bar.x = 640-st.length*8;
                bar.y = 0;
                bar.l = st.length*8;
        
                bar.draw = function(device){
                    device.beginPath();
                    device.fillStyle = "black";
                    device.lineWidth = 1;
                    device.fillRect(this.x, this.y, this.l*8, 8);
                    device.stroke();
                }
                scrn.putFunc(bar);
                scrn.putchr8(st, 640-st.length*8, 0);
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

        scrn.fill(0, 0, cw, ch/2 - size, "black");
        scrn.fill(0, ch/2 + size, cw, ch/2 - size, "black");

        scrn.fill(0, 0, cw/2 - size, ch, "black");
        scrn.fill(cw/2 + size, 0, cw/2-size,ch, "black");
    }
}

