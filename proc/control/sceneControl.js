// sceneControl
function sceneControl(state) {
//sceneが増えてきてmainがすっきりとしなくなったので分離の為作成。2011/05/04

    var sceneList = [];

    sceneList[1] = new gameScene(state); //state.Result.load()はここ//hiscoreをlocalstorageから復帰
    sceneList[2] = new sceneTitle(state);
    sceneList[3] = new sceneGover(state);
    sceneList[4] = new sceneConfig(state); //state.Config.load()はここ//configをlocalstorageから復帰
    sceneList[5] = new sceneResult(state); 

    for (var i in sceneList) {
        sceneList[i].init();
    }

    //var scene = sceneList[2];

    var rc = 2; // 最初のSceneはTitle
    var runscene = rc;

    this.step = function() {

        if (rc != 0) {
            //Sceneの切り替えが発生している。

            var fg = false; // continue flag
            if (rc >= 10) {
                rc = rc % 10;
                fg = true;
            }

            runscene = rc;

            sceneList[runscene].reset( fg );
        }

        rc = sceneList[runscene].step();
    }

    this.draw = function(){

        sceneList[runscene].draw();

    }
}
