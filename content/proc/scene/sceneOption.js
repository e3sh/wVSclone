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

        if (zkey || ckey || rkey || vkey || numkey || arrowkey) keywait = 8;

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

        if (rkey) {
            mapsc.change(state.Game.nowstage);
	        mapsc.reset(state.System.time()); //初期マップ展開
            retmf = true;
            ret_code = 2;// TITLE;
        }

        if (numkey) {}
        if (arrowkey) {}

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
        st.push("I: MAP_IMPORT（未実装）" );
        st.push("E: MAP_EXPORT（未実装）" );
        st.push("R: MAP_RESET （不具合有）"  );

        for (let i in st){
            work.kprint(st[i] ,0 ,0 + i*8 );
        }

        mapDraw();
        charDraw();

        work.draw();

        return 0;
        //進行
    }

    function scene_draw() {
        //work.reset();
    }


	function work1(){
    
        var obCtrl = state.obCtrl; //= new gObjectControl(dev.graphics1, state);
        var mapsc  = state.mapsc; //= new mapSceControl();
    
        var itemtable = {//表示用のアイテムリスト
            //  (ITEMLIST) 
                15:"杖"  ,  // MP38 Wand
                16:"剣"  , // MP15 Knife
                17:"戦斧",   // MP37 Axe
                18:"槍"  , // MP35 Spear
                19:"ﾌﾞｰﾒﾗﾝ",  // MP36 Boom
                20:"球"  ,  // MP26 Ball1-3
                21:"1UP" ,   // MP 1 Mayura1-4
                22:"鍵"  ,   // MP27 Key
                23:"爆弾",// MP28 BallB1-3
                24:"ﾊﾞﾘｱ",// MP29 BallS1-3
                25:"回復",// MP30 BallL1-3
                26:"ﾗﾝﾌﾟ",  // MP33 Lamp
                27:"地図",   // MP34 Map
                35:"ｺｲﾝ",  // MP32 Coin1-4
                40:"宝箱", // MP39 TrBox
                50:"弓矢"    // MP43 Bow
        }
    }
        // drawPoint ==================================
        // マップ用オブジェクト位置描画 sce
        function charDraw() {

            let obj = state.obCtrl.obj;

            for (var i in obj) {
                var o = obj[i];
    
                if (o.visible) {
    
                    if ((o.type == 1) || (o.type == 3) || (o.type == 5)) continue;
    
                    if ((o.type != 98) && (!flag)) continue;
    
                    if (o.normal_draw_enable) {
                        work.kprint( o.ch, o.x/8, o.y/8);
                    }
                }
            }
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
    
}


