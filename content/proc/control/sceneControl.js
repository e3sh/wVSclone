// sceneControl
function sceneControl(state) {
    //sceneが増えてきてmainがすっきりとしなくなったので分離の為作成。2011/05/04
    //let fcnt = 0;

    let scrn = state.System.dev.graphics[4];//Wipescreen

    let titleSce = [];

    let sceneList = [];

    sceneList[1] = new gameScene(state);       titleSce[1] = "Main";//state.Result.load()はここ//hiscoreをlocalstorageから復帰
    sceneList[2] = new sceneTitle(state);      titleSce[2] = "Title";
    sceneList[3] = new sceneGover(state);      titleSce[3] = "Gover";
    sceneList[4] = new sceneConfig(state);     titleSce[4] = "Config";//state.Config.load()はここ//configをlocalstorageから復帰
    sceneList[5] = new sceneResult(state);     titleSce[5] = "Result";
    sceneList[6] = new scenePause(state);      titleSce[6] = "Pause";
    sceneList[7] = new sceneStatusDisp(state); titleSce[7] = "Status";
    sceneList[8] = new sceneOption(state);     titleSce[8] = "Option";
    sceneList[9] = new sceneLvUp(state);       titleSce[9] = "LvUp";

    let wipeEffectCount; 

    let menuvf = false;

    //let clRect = function(x,y,w,h){this.draw = function(device){ device.clearRect(x,y,w,h);}}

    for (let i in sceneList) {
        sceneList[i].init();
    }
    //let scene = sceneList[2];

    const TITLERC = 2;

    let rc = TITLERC; // 最初のSceneはTitle
    let runscene = rc;

    function reset(){
        for (let i in sceneList){
            sceneList[i].reset_enable = true; 
        } 
        //fcnt = 0;       
    }

    this.step = function(g, input) {
        //fcnt ++;

        if (rc != 0) {
            //Sceneの切り替えが発生している。
            //wipeEffectCount = scrn.cw/2;

            let fg = false; // continue flag
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
        rc = sceneList[runscene].step(g, input);

        wipeEffectCount = (wipeEffectCount > 0) ? 
            wipeEffectCount-(3 * 60/(1000/state.System.deltaTime())) :
            0;
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
                let st = titleSce[runscene];

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
    }

    function EffectWipeFrame(size){
        let cw = scrn.cw;
        let ch = scrn.ch;

        let c = "black";//rgba(0,0,0,"+ ((cw-size*2) /cw) +")";

        scrn.fill(0, 0, cw, ch/2 - size, c);
        scrn.fill(0, ch/2 + size, cw, ch/2 - size, c);

        scrn.fill(0, 0, cw/2 - size, ch, c);
        scrn.fill(cw/2 + size, 0, cw/2-size,ch, c);
    }
}

