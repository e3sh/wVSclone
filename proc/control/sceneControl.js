// sceneControl
function sceneControl(state) {
//sceneが増えてきてmainがすっきりとしなくなったので分離の為作成。2011/05/04

    var scrn = state.System.dev.graphics[3];//UIscreen

    var sceneList = [];

    sceneList[1] = new gameScene(state); //state.Result.load()はここ//hiscoreをlocalstorageから復帰
    sceneList[2] = new sceneTitle(state);
    sceneList[3] = new sceneGover(state);
    sceneList[4] = new sceneConfig(state); //state.Config.load()はここ//configをlocalstorageから復帰
    sceneList[5] = new sceneResult(state); 

    var wipeEffectCount; 

    var clRect = function(x,y,w,h){this.draw = function(device){ device.clearRect(x,y,w,h);}}



    for (var i in sceneList) {
        sceneList[i].init();
    }

    //var scene = sceneList[2];

    var rc = 2; // 最初のSceneはTitle
    var runscene = rc;

    this.step = function() {

        if (rc != 0) {
            //Sceneの切り替えが発生している。
            //wipeEffectCount = scrn.cw/2;

            var fg = false; // continue flag
            if (rc >= 10) {
                rc = rc % 10;
                fg = true;

               //次の面に行く場合に
                wipeEffectCount = scrn.cw/2;
            }

            runscene = rc;

            sceneList[runscene].reset( fg );
        }

        rc = sceneList[runscene].step();

        wipeEffectCount = (wipeEffectCount > 0) ? wipeEffectCount-4 : 0;
    }

    this.draw = function(){

        if (wipeEffectCount > 0){

            EffectWipeFrame(scrn.cw/2-wipeEffectCount);
        }

        sceneList[runscene].draw();

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

