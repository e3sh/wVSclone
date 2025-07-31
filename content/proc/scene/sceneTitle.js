//Scene
//
function sceneTitle(state) {

    const dev = state.System.dev;
    //宣言部
    const UI_layer = dev.graphics[state.Constant.layer.UI];
    const BUI_layer = dev.graphics[state.Constant.layer.BUI];
    //let ForgroundBG = dev.graphics[2];

    //let inp = dev.mouse_state;
    //let keys = dev.key_state;

    this.init = scene_init;
    this.reset = scene_reset;
    this.step = scene_step;
    this.draw = scene_draw;

    this.reset_enable = true;

    let keylock;
    let keywait = 0;

    let wtxt;

    let wipef;
    let wipecnt;

    let ret_code = 0;

    let menusel = 0;
    let psel = {};

    const DSP_X = 320;
    const DSP_Y = 112;

    let menu = [];
    let mttl = ["NewGame", "LoadGame", "Config"];
	let mjmp = [state.Constant.scene.MAIN, state.Constant.scene.MAIN+10, state.Constant.scene.CONFIG];

	for (let i=0; i < mttl.length;i++){
	    m = {};
	    m.title = mttl[ i ];
	    m.x = 320 - 50;
	    m.y = 260 + i*20 + 32;
	    m.w = 120;
	    m.h = 16;
		m.jp = mjmp[ i ];
	    m.sel = false;
	    m.func = function () {

	        return this.jp;
	    };
	    menu.push(m);
	}	

    //let cnt;

    let tsel = new Number(0.0);
    //処理部

    function scene_init() {
        tsel = 0.0;

        //初期化処理
    }

    function scene_reset() {

        state.Config.load();

        //dev.graphics[0].setInterval(0);//BG　WORK2
		//dev.graphics[1].setInterval(0);//SPRITE
		//dev.graphics[2].setInterval(0);//FG
        dev.pauseBGSP();

		dev.graphics[state.Constant.layer.UI].setInterval(1);//UI //
        //DeviceControlで[0]のBackgroundColor”Black”と設定している。
        //今後は各Sceneで設定したほうが良い。
        //TitleにはすべてのSceneから戻ってくる可能性があるので画面状態が分からない。手動にした画面を一度クリア。

        //dev.graphics[0].reset(); dev.graphics[0].clear(); dev.graphics[0].draw();//BG　WORK2
		//dev.graphics[1].reset(); dev.graphics[1].clear(); dev.graphics[1].draw();//SPRITE
		//dev.graphics[2].reset(); dev.graphics[2].clear(); dev.graphics[2].draw();//FG
        //↑drawまでしないと、Canvasには反映しません。
        dev.clearBGSP();

        //dev.graphics[3].clear();
        //document.getElementById("manual_1").style.visibility =  'visible';
        //document.getElementById("manual_2").style.visibility =  'visible';

        for (let i in menu) {
            menu[i].sel=false;
        }

        wipef = false;
        wipecnt = 0;
        cur_cnt = 0;
        ret_code = 0;

        BUI_layer.reset();
        BUI_layer.clear("black");
        //ForgroundBG.clear();
        wtxt = [];
        
        //wtxt.push("==WebDungeonActionG==");
        //wtxt.push("--------------------&");
        
        if (state.Config.use_audio) {
           wtxt.push("audio on:" + dev.sound.loadCheck());
        } else {
           wtxt.push("audio off:" + dev.sound.loadCheck());
        }
        
        const DSP_X = 320;
        const DSP_Y = 128;
          
        BUI_layer.put("Mayura1",DSP_X -32 ,DSP_Y +40);
        BUI_layer.put("Unyuu1", DSP_X -32     ,DSP_Y +72);
        BUI_layer.put("Unyuu3", DSP_X -32 -32 ,DSP_Y +72);
        /*
        BUI_layer.put("Spear", DSP_X - 132 + 0 -16, DSP_Y +72);
        BUI_layer.put("Wand" , DSP_X - 132 +64 -16, DSP_Y +72);
        BUI_layer.put("Axe"  , DSP_X - 132 +80 -16, DSP_Y +72);
        BUI_layer.put("Boom" , DSP_X - 132 +96 -16, DSP_Y +72);
        BUI_layer.put("Knife", DSP_X - 132 +112-16, DSP_Y +72);
        BUI_layer.put("Bow"  , DSP_X - 132 +32 -16, DSP_Y +72);

        BUI_layer.put("Ball1" , DSP_X - 100 + 0 -16, DSP_Y +104);
        BUI_layer.put("BallB1", DSP_X - 100 + 16 - 16, DSP_Y +104);
        BUI_layer.put("BallS1", DSP_X - 100 + 32 - 16, DSP_Y +104);
        BUI_layer.put("BallL1", DSP_X - 100 + 48 - 16, DSP_Y +104);
        BUI_layer.put("Lamp"  , DSP_X - 100 + 72 - 16, DSP_Y +104);
        BUI_layer.put("Map"   , DSP_X - 100 + 96 - 16, DSP_Y +104);
        */
        //BUI_layer.put("TrBox", 320 - 50 + 0 - 8, 304);
        BUI_layer.put("Key"   , DSP_X - 50 + 16 , DSP_Y +104);
        
        BUI_layer.putchr("Player", DSP_X, DSP_Y  + 40 );
        BUI_layer.putchr("Enemy" , DSP_X, DSP_Y  + 72 );
        
        //BUI_layer.putchr("Weapon", DSP_X, DSP_Y  + 72 -8);
        //BUI_layer.putchr("Item"  , DSP_X, DSP_Y  +104 -8);
        BUI_layer.putchr("Key"   , DSP_X, DSP_Y  +100 );
        

        BUI_layer.put("TitleLogo", DSP_X, DSP_Y);
        BUI_layer.kprint("土日ダンジョン　令和版",DSP_X +50, DSP_Y + 20)

        //BUI_layer.putchr8("Press <z> key or [Space]key to", 320 - 100 - 8, 336);
        
        for (let s in wtxt) {
            //BUI_layer.putchr(wtxt[s], 0, DSP_Y  - 80 + 16 * s);        
        }

        BUI_layer.draw();

        if (state.Game.load() == 0) {
            menu[1].title = "LoadGame";
            menu[1].jp = 11;
        } else {
            menu[1].title = "";
            menu[1].jp = 0;
        }

        state.Game.cold = true;

        keylock = true;
        keywait = 30;

        menusel = 0;

        psel = { mode:0, x:0 };

        //savedata check
        let res = state.Game.preload();
        if (res.load){
        let t = state.Game.dataview2(res);
            for (let i in t){
                BUI_layer.kprint(t[i],8, i*8 + 8);
            }
            BUI_layer.draw();
        }
        //cnt = 0;

        //dev.sound.change(0);
        //reset処理を記述予定
    }

    function scene_step(g, input) {

        BUI_layer.draw();

        wtxt = [];

        let zkey = input.trigger.weapon;

        if (!keylock) {

            const c = input//dev.directionM( kstate );

            if (c.up || c.down || c.left || c.right){
               if (c.up) {//↑
                    menusel--;
                    if (menusel < 0) menusel = menu.length - 1;
                }

                if (c.down) {//↓
                    menusel++;
                    if (menusel > menu.length- 1) menusel = 0;
                }

                if (c.left) {// <-
                    psel.mode = 0;
                }

                if (c.right) {// ->
                    psel.mode = 1;
                    psel.x += 2;
                }
                keylock = true;
                keywait = 10
            }

            if (keylock) {
                dev.sound.effect(state.Constant.sound.CURSOR);
            }

        }

        if ((zkey)&&(!keylock)) {

            for (let i in menu) {

                if (menu[i].sel) {
                    let n = menu[i].func();
                    //dev.sound.change(0);
                    //dev.sound.play(0);
                    if (n != 0) {
                        //document.getElementById("manual_1").style.visibility =  'hidden';
                        //document.getElementById("manual_2").style.visibility =  'hidden';
                        wipef = true;
                        state.Game.mode = psel.mode;
                        //console.log(state.Game.mode);
                        ret_code = n;
                        //return n;
                    }
                }
            }
        }
        if (keywait > 0) keywait--;

        if ((!zkey) && (keywait == 0)) keylock = false;

        if (wipef) {
            return ret_code;
            /*
            let o = {};

            o.cw = BUI_layer.cw;
            o.ch = BUI_layer.ch;
            o.y1 = BUI_layer.ch / 2 - wipecnt
            o.y2 = BUI_layer.ch / 2 + wipecnt

            o.draw = function (device) {

                device.strokeStyle = "black";

                device.beginPath();
                device.moveTo(0, this.y1);
                device.lineTo(this.cw, this.y1);
                device.stroke();

                device.beginPath();
                device.moveTo(0, this.y2);
                device.lineTo(this.cw, this.y2);
                device.stroke();
            }
            BUI_layer.putFunc(o);

            BUI_layer.draw();
            BUI_layer.reset();

            wipecnt += 4;

            if (BUI_layer.ch / 2 - wipecnt < 0) { return ret_code; }
            */
        }

        for (i in menu) {
            if (i == menusel) {
                menu[i].sel = true;
            } else {
                menu[i].sel = false;
            }
        }

        return 0;
        //進行
    }

    function scene_draw() {
        //let bvf = false; //blinkViewFlag 
        //cnt++;

        //if (cnt > 30){
        //    bvf = true;
        //    cnt = (cnt > 90)? 0 : cnt;
       // }

        for (let i in menu) {

            if (menu[i].sel) {

                let o = {}
                o.x = menu[i].x -6;
                o.y = menu[i].y;
                o.w = menu[i].w;
                o.h = menu[i].h;
                o.draw = function (device) {
                    device.beginPath();
                    device.fillStyle = "orange";
                    device.fillRect(this.x, this.y, this.w, this.h);
                }
                UI_layer.putFunc(o);

                UI_layer.putchr(menu[i].title, menu[i].x - 4, menu[i].y -1);

            } else {
                UI_layer.putchr(menu[i].title, menu[i].x - 4, menu[i].y -1);    
            }
        }

        if (psel.x > 0){
            if (psel.mode == 1){
                if (psel.x < DSP_X - 32 -32){ psel.x += 6;}else{ psel.x = DSP_X - 32 -32; }
            }else{
                psel.x -= 6;
            }
            UI_layer.put("Unyuu3", psel.x, DSP_Y +40 +16);
        }else{
            psel.x = 0;
        }

        if (state.System.blink()){ 
            //if (bvf) 
            UI_layer.putchr8("Press <z> key or [Space]key to", 320 - 100 - 8, 270);
        }
        //表示
    }
}
