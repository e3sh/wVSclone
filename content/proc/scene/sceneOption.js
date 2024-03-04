//Scene
//
function sceneOption(state) {

    var dev = state.System.dev;
    //宣言部
    var work = dev.graphics[3];

    //var keys = dev.key_state;

    this.init = scene_init;
    this.reset = scene_reset;
    this.step = scene_step;
    this.draw = scene_draw;

    this.reset_enable = true;

    var menuvf = false;
    var keywait = 10;

    let ret_code = 6; //scenePause
    let retmf = false; //return mode false:pause true:gameS

    let sel = 0;

    //処理部
    function scene_init() {
        //初期化処理
    }

    function scene_reset() {
        dev.graphics[0].setInterval(0);//BG　WORK2
		dev.graphics[1].setInterval(0);//SPRITE
		dev.graphics[2].setInterval(0);//FG
    
        work.setInterval(0);//UI
    }

    function scene_step() {

        keywait--;
        if (keywait > 0) return 0;

        // input key section
        var kstate = dev.key_state.check();

        var zkey = false; //exit button
        if (Boolean(kstate[90])) {//[z]
            if (kstate[90]) zkey = true;
        }
	    if (Boolean(kstate[32])) {//[space]
	        if (kstate[32]) zkey = true;
        }

        var ckey = false; //dispalyclear
        if (Boolean(kstate[67])) {
            if (kstate[67]) {//ckey↓
                ckey = true;
            }
        }

        var vkey = false; //inventry_view
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

        var numkey = false; //menu select num
        var arrowkey = false; //list select 
        for (var i in kstate){
            if (Boolean(kstate[i])){
                numkey = ((i >= 48) && (i <= 57))? true: false; //Fullkey[0]-[9]
                arrowkey = ((i >= 37) && (i <= 40))? true: false; //Arrowkey
            }
        }

        if (zkey || ckey || ikey|| ekey || rkey || vkey || numkey || arrowkey) keywait = 8;

        // select key function section
        if (zkey) {

            work.reset();
            work.clear();
            work.draw();

            if (retmf){
                dev.graphics[0].setInterval(1);//BG　WORK2
                dev.graphics[1].setInterval(1);//SPRITE
                dev.graphics[2].setInterval(1);//FG

                //state.Game.cold = true;
            }
            return ret_code;
            //return 6;//return scenePause
        }

        if (ckey) {
            for (var i=0; i<3; i++){
                dev.graphics[i].reset();
                dev.graphics[i].clear();
                dev.graphics[i].draw();
            }
        }

        if (ikey) {
            //IMPORT
        }
        if (ekey) {
            //EXPORT
            if (retmf){
            let obj1 = state.mapsc.ini_sc();
            let obj2 = state.mapsc.mapChip();

            exportFile("inisc.json",obj1);
            exportFile("mapChip.json",obj2);
            }
        }

        if (rkey) {
            mapsc.change(state.Game.nowstage);
	        mapsc.reset(state.System.time()); //初期マップ展開
            retmf = true;
            ret_code = 2;// TITLE;
        }

        if (numkey) {}
        if (arrowkey) {
            let s = sel;
            for (let i in kstate){
                if (Boolean(kstate[i])){
                    s = s + ((i == 37)? -40 :0)//leftkey 
                    + ((i == 38)? -1 :0) //upkey
                    + ((i == 39)? +40 :0) //rightkey
                    + ((i == 40)? +1 :0);//downkey
                }
            }
            if (s < 0) s = 0;
            //if (s > maxpage) s = maxpage;

            sel = s;
        }

        let s = "";
        for (let i in kstate){
            if (kstate[i]) s = s + "[" + i + "]";
        }
        work.reset();
        work.clear();

        let st = [];
        st.push("INPUT KEY:" + s);
        st.push("=== COMMAND ===");
        st.push("Z: " + (retmf?"RETURN TITLE":"EXIT"));
        st.push("C: CLEAR_SCREEN");
        st.push("I: MAP_IMPORT（"+(ikey?"?":"未実装")+"）" );
        st.push("E:" + (retmf?" MAP_EXPORT":" _"));
        st.push("R: MAP_RESET"  );

        for (let i in st){
            work.kprint(st[i] ,0 ,0 + i*8 );
        }

        mapDraw();
        charDraw(sel);

        work.draw();

        return 0;
        //進行
    }

    function scene_draw() {
        //work.reset();
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
                    //work.fill(150 + o.x/8, o.y/8, 16, 16, "green");
                    z = 1.0;
                }

                work.put(c, x, y, 0,0,255, z);
                work.kprint(s, x, y);

                work.put(c,
                    150 + Math.floor(o.x/8), Math.floor(o.y/8),
                    0,0,255,
                    z);


            }
            
            /*
            obj = state.mapsc.event();

            for (let i in obj) {
                let o = obj[i];
                work.kprint("e" + o.ch, 150 + o.x/8, o.y/8);
            }
                */
            
            
        }
    
        //マップ表示
        function mapDraw() {

            mcp = state.mapsc.mapChip();

            let c = ["dimgray", "steelblue", "orange"];
            for (let i = 0, loopend = mcp.length; i < loopend; i++) {

                let mc = mcp[i];

                if (mc.visible) {
                //    let c = ["dimgray", "steelblue", "orange"];
                    work.fill(150 + mc.x/8, mc.y/8, mc.w/8-1, mc.h/8-1, c[mc.type -10]);
                }
            }
        }
        
        function exportFile(filename = "sample.json", obj){

            const json = JSON.stringify(obj, null, 2);
            const blob = new Blob([json], {type: "application/json"});
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
          }



}


