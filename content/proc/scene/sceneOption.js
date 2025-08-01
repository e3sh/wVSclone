//Scene
//
function sceneOption(state) {

    const dev = state.System.dev;
    //宣言部
    const UI_layer = dev.graphics[state.Constant.layer.UI];

    //let keys = dev.key_state;

    this.init = scene_init;
    this.reset = scene_reset;
    this.step = scene_step;
    this.draw = scene_draw;

    this.reset_enable = true;

    let keywait = 10;

    let mobvf = true;

    let ret_code = state.Constant.scene.PAUSE; //scenePause
    let retmf = false; //return mode false:pause true:gameS

    let sel = 0;

    let cmapdf = false;
    
    let nowstage = state.Game.nowstage;

    //処理部
    function scene_init() {
        //初期化処理
    }

    function scene_reset() {
        //dev.graphics[0].setInterval(0);//BG　WORK2
		//dev.graphics[1].setInterval(0);//SPRITE
		//dev.graphics[2].setInterval(0);//FG
        dev.pauseBGSP();

        UI_layer.setInterval(0);//UI

        sel = 0;
        nowstage = state.Game.nowstage;

        ret_code = state.Constant.scene.PAUSE; //scenePause
        retmf = false; //return mode false:pause true:gameS
    }

    function scene_step(g, input) {

        keywait--;
        if (keywait > 0) return 0;

        // input key section
        let kstate = input.keycode;//dev.key_state.check();

        let zkey = false; //exit button
        if (Boolean(kstate[90])) {//[z]
            if (kstate[90]) zkey = true;
        }
	    if (Boolean(kstate[32])) {//[space]
	        if (kstate[32]) zkey = true;
        }

        let ckey = false; //dispalyclear
        if (Boolean(kstate[67])) {
            if (kstate[67]) {//ckey↓
                ckey = true;
            }
        }

        let vkey = false; //inventry_view
        if (Boolean(kstate[86])) {
            if (kstate[86]) {//vkey↓
                vkey = true;
            }
        }
      
        let ikey = false; //map_reset
        if (Boolean(kstate[73])) {
            if (kstate[73]) {//rkey
                ikey = true;
            }
        }

        let ekey = false; //map_reset
        if (Boolean(kstate[69])) {
            if (kstate[69]) {//rkey
                ekey = true;
            }
        }

        let rkey = false; //map_reset
        if (Boolean(kstate[82])) {
            if (kstate[82]) {//rkey
                rkey = true;
            }
        }

        let numkey = false; //menu select num
        let arrowkey = false; //list select 
        for (let i in kstate){
            if (Boolean(kstate[i])){
                numkey = ((i >= 48) && (i <= 57))? true: false; //Fullkey[0]-[9]
                arrowkey = ((i >= 37) && (i <= 40))? true: false; //Arrowkey
            }
        }

        if (zkey || ckey || ikey|| ekey || rkey || vkey || numkey || arrowkey) keywait = 8;

        // select key function section
        if (zkey) {

            UI_layer.reset();
            UI_layer.clear();
            UI_layer.draw();

            if (retmf){
                //dev.graphics[0].setInterval(1);//BG　WORK2
                //dev.graphics[1].setInterval(1);//SPRITE
                //dev.graphics[2].setInterval(1);//FG
                dev.resumeBGSP();

                //state.Game.cold = true;
            }
            return ret_code;
            //return 6;//return scenePause
        }

        if (ckey) {
            dev.clearBGSP();
            //for (let i=0; i<3; i++){
                //dev.graphics[i].reset();
                //dev.graphics[i].clear();
                //dev.graphics[i].draw();
            //}
        }

        if (vkey) {
            mobvf = (!mobvf);
        }


        if (ikey) {
            cmapdf = (cmapdf)?false:true;
            //IMPORT
        }
        if (ekey) {
            //EXPORT
            state.mapsc.mapexport(nowstage);
            //if (retmf){
            //let obj1 = state.mapsc.ini_sc();
            //let obj2 = state.mapsc.mapChip();
             //let obj1 = state.mapsc.StageChache();
             //   exportFile("stage.json",state.mapsc.StageChache());
            //exportFile("mapChip.json",obj2);
            //}
        }

        if (rkey) {
            /*
            mapsc.change(state.Game.nowstage);
	        mapsc.reset(state.System.time()); //初期マップ展開
            retmf = true;
            ret_code = 2;// TITLE;
            */
        }

        if (numkey) {}
        if (arrowkey) {
            let s = sel;
            for (let i in kstate){
                if (Boolean(kstate[i])){
                    s = s // + ((i == 37)? -40 :0)//leftkey 
                    + ((i == 38)? -1 :0) //upkey
                    //((i == 39)? +40 :0) //rightkey
                    + ((i == 40)? +1 :0);//downkey
                }

            }
            if (s < 0) s = 0;
            sel = s;

            s = nowstage;
            for (let i in kstate){
                if (Boolean(kstate[i])){
                    s = s + ((i == 37)? -1 :0)//leftkey 
                    //+ ((i == 38)? -1 :0) //upkey
                    + ((i == 39)? +1 :0) //rightkey
                    //+ ((i == 40)? +1 :0);//downkey
                    ;
                }
            }
            retmf = true;
            ret_code = state.Constant.scene.TITLE;// TITLE;

            if (s < 0) s = 0;
            nowstage = s;
            state.mapsc.change(s);//
        }

        let s = "";
        for (let i in kstate){
            if (kstate[i]) s = s + "[" + i + "]";
        }
        UI_layer.reset();
        UI_layer.clear();

        let st = [];
        st.push("INPUT KEY:" + s);
        st.push("=== COMMAND ===");
        st.push("Z: " + (retmf?"RETURN TITLE":"EXIT"));
        st.push("C: CLEAR_SCREEN");
        st.push("V: MOB  VIEW: " + ((mobvf)?"ON":"OFF"));
        st.push("I: CMAP VIEW: " + ((cmapdf)?"ON":"OFF"));

        //st.push("I: MAP_IMPORT（"+(ikey?"?":"未実装")+"）" );
        st.push("E: MAP_EXPORT");
        //st.push("R: -//MAP_RESET" );

        for (let i in st){
            UI_layer.kprint(st[i] ,0 ,0 + i*8 );
        }

        mapDraw();
        if (mobvf) charDraw(sel);
        if (cmapdf) cmapDraw();
        UI_layer.kprint("Stage:" + state.mapsc.chacheUseStatus() ,150 ,0);
        UI_layer.kprint("Stage:" + nowstage ,150 ,8);

        UI_layer.draw();

        return 0;
        //進行
    }

    function scene_draw() {
        //UI_layer.reset();
    }

        // drawPoint ==================================
        // マップ用オブジェクト位置描画 sce
        function charDraw(sel) {

            const ctable = {
                0: "Mayura1", //自機
                1: "Unyuu1" , //敵
                14:"Unyuu3", //Boss
                15:"Wand"   , //Wand
                16:"Knife"  , //Knife
                17:"Axe"    , //Axe
                18:"Spear"  , //Spear
                19:"Boom"   , //Boom
                20:"Ball1"  , //玉
                21:"miniMay", //1UP
                22:"Key",    //Key
                23:"BallB1",  //爆弾
                24:"BallS1",  //ﾊﾞﾘｱ
                25:"BallL1",  //回復
                26:"Lamp",    //Lamp
                27:"Map",     //Map
                34:"Unyuu2",  //sBoss
                35:"Coin1",   //Coin
                40:"TrBox",   //TrBox
                50:"Bow"      //Bow
                ,51:"AmuletR"// MP50 AmuletR
                ,52:"AmuletG"// MP51,AmuletG
                ,53:"AmuletB"// MP52,AmuletB
                ,54:"CandleR"
                ,55:"CandleB"
                ,56:"RingR"
                ,57:"RingB"
                ,58:"Mirror"
            }
                
            let obj = state.mapsc.ini_sc();

            for (let i in obj) {
                let o = obj[i];

                let c = "" + o.ch;
                if (Boolean(ctable[o.ch])) c = ctable[o.ch];

                let x = (i>39)?540:16;
                let y = ((i>39)?(i-40)*8:i*8+64); 
                let s = "  :" + o.sc;
                let z = 0.5;

                if ( i == sel) {
                    s = "  :[SELECT]";
                    //UI_layer.fill(150 + o.x/8, o.y/8, 16, 16, "green");
                    z = 1.0;
                }

                UI_layer.put(c, x, y, 0,0,255, z);
                UI_layer.kprint(s, x, y);

                UI_layer.put(c,
                    150 + Math.floor(o.x/8), Math.floor(o.y/8),
                    0,0,255,
                    z);


            }
            
            /*
            obj = state.mapsc.event();

            for (let i in obj) {
                let o = obj[i];
                UI_layer.kprint("e" + o.ch, 150 + o.x/8, o.y/8);
            }
                */
            
            
        }
    
        //マップ表示
        function mapDraw() {

            mcp = state.mapsc.mapChip();
            //0:floor 1:wall 2:door 3:ciel 4:circle,5:?,6:stoneb
            let c = ["dimgray", "steelblue", "orange"," rgba(255,0,0,0.3)","white", "gray","cyan"];
            for (let i = 0, loopend = mcp.length; i < loopend; i++) {

                let mc = mcp[i];

                //mc.colitem && mc.colitem.remove();//EXPORTに支障が出るため
                //mc.colitem = null;//一律リセット

                if (mc.visible) {
                //    let c = ["dimgray", "steelblue", "orange"];
                    UI_layer.fill(150 + mc.x/8, mc.y/8, mc.w/8-1, mc.h/8-1, c[mc.type -10]);
                }
            }
        }
        //colmap 表示
       function cmapDraw(){
            let cmap = state.mapsc.cmap();

            for (let i in cmap){ // xline
                for (let j in cmap[i]){ //yline
                    UI_layer.fill(150 + 12 + i*4, 12 + j*4, 3, 3, (cmap[i][j])?"blue":"darkblue");
                }
            }
       } 

       //export file
        //function exportFile(filename = "sample.json", obj){

        //    const json = JSON.stringify(obj, null, 2);
        //    const blob = new Blob([json], {type: "application/json"});
        //    const url = URL.createObjectURL(blob);
        //    const a = document.createElement("a");
        //    a.href = url;
        //    a.download = filename;
        //    a.click();
        //    URL.revokeObjectURL(url);
        //}

        //import file
        function importFile(){
            //
        }
}


