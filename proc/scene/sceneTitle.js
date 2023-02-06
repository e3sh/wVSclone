//Scene
//
function sceneTitle(state) {

    var dev = state.System.dev;
    //宣言部
    var work = dev.graphics[3];
    var work2 = dev.graphics[0];
    //var ForgroundBG = dev.graphics[2];

    //var inp = dev.mouse_state;
    var keys = dev.key_state;

    this.init = scene_init;
    this.reset = scene_reset;
    this.step = scene_step;
    this.draw = scene_draw;

    this.reset_enable = true;

    var keylock;
    var keywait = 0;

    var wtxt;

    var wipef;
    var wipecnt;

    var ret_code = 0;

    var menusel = 0;

    var menu = [];
    var mttl = ["GameStart.", "Continue", "Config"];
	var mjmp = [1, 11, 4];

	for (var i=0; i < mttl.length;i++){
	    m = {};
	    m.title = mttl[ i ];
	    m.x = 320 - 50;
	    m.y = 320 + i*20 + 32;
	    m.w = 120;
	    m.h = 16;
		m.jp = mjmp[ i ];
	    m.sel = false;
	    m.func = function () {

	        return this.jp;
	    };
	    menu.push(m);
	}	

    var cur_cnt;

    var tsel = new Number(0.0);
    //処理部

    function scene_init() {

        tsel = 0.0;

        //初期化処理
    }

    function scene_reset() {
        dev.graphics[0].setInterval(0);//BG　WORK2
		dev.graphics[1].setInterval(0);//SPRITE
		dev.graphics[2].setInterval(0);//FG
		dev.graphics[3].setInterval(6);//UI //
        //DeviceControlで[0]のBackgroundColor”Black”と設定している。
        //今後は各Sceneで設定したほうが良い。
        //TitleにはすべてのSceneから戻ってくる可能性があるので画面状態が分からない。手動にした画面を一度クリア。
        dev.graphics[0].reset(); dev.graphics[0].clear(); dev.graphics[0].draw();//BG　WORK2
		dev.graphics[1].reset(); dev.graphics[1].clear(); dev.graphics[1].draw();//SPRITE
		dev.graphics[2].reset(); dev.graphics[2].clear(); dev.graphics[2].draw();//FG
        //↑drawまでしないと、Canvasには反映しません。

        //dev.graphics[3].clear();
        //document.getElementById("manual_1").style.visibility =  'visible';
        //document.getElementById("manual_2").style.visibility =  'visible';

        for (var i in menu) {
            menu[i].sel=false;
        }

        wipef = false;
        wipecnt = 0;
        cur_cnt = 0;
        ret_code = 0;

        work2.reset();
        work2.clear("black");
        //ForgroundBG.clear();
        wtxt = [];
        wtxt.push("==WebDungeonActionG==");
        wtxt.push("-----------------&");

        if (state.Config.use_audio) {
            //wtxt.push("audio on");
        } else {
            wtxt.push("audio off");
        }
        work2.put("Mayura1", 320 - 50 +8 , 208);
        work2.put("Unyuu1", 320 - 50 +8, 240);

        work2.put("Ball1", 320 - 100 + 0 -16, 272);
        work2.put("BallB1", 320 - 100 + 16 - 16, 272);
        work2.put("BallS1", 320 - 100 + 32 - 16, 272);
        work2.put("BallL1", 320 - 100 + 48 - 16, 272);
        work2.put("Lamp", 320 - 100 + 72 - 16, 272);
        work2.put("Map", 320 - 100 + 96 - 16, 272);

        //work2.put("TrBox", 320 - 50 + 0 - 8, 304);
        work2.put("Key", 320 - 50 + 16 - 8, 304);

        work2.putchr("Player", 320, 208 - 8);
        work2.putchr("Enemy", 320, 240 - 8);
        work2.putchr("Ball/Item", 320, 272 - 8);
        work2.putchr("Key", 320, 304 - 8);
        work2.putchr8("Press <z> key or [Space]key to", 320 - 100 - 8, 336);

        for (var s in wtxt) {
            work2.putchr(wtxt[s], 0, 132 + 16 * s);        
        }

        work2.draw();

        if (state.Game.load() == 0) {
            menu[1].title = "Continue";
            menu[1].jp = 11;
        } else {
            menu[1].title = "";
            menu[1].jp = 0;
        }

        state.Game.cold = true;

        keylock = true;
        keywait = 30;

        menusel = 0;

        //dev.sound.change(0);
        //reset処理を記述予定
    }

    function scene_step() {

        work2.draw();

        wtxt = [];

        var kstate = keys.check();

        var zkey = false;

        if (!keylock) {
            if (Boolean(kstate[38])) {
                if (kstate[38]) {//↑
                    menusel--;
                    if (menusel < 0) menusel = menu.length - 1;
                    keylock = true;
                    keywait = 10;
                }
            }

            if ((kstate[40])) {
                if (kstate[40]) {//↓
                    menusel++;
                    if (menusel > menu.length- 1) menusel = 0;
                    keylock = true;
                    keywait = 10
                }
            }

            var zkey = false;
            if (Boolean(kstate[90])) {
                if (kstate[90]) {//↓
                    zkey = true;
                }
            }
            if (Boolean(kstate[32])) {
                if (kstate[32]) {//↓
                    zkey = true;
                }
            }

            if (keylock) {
                dev.sound.effect(9);
            }

        }

        if ((zkey)&&(!keylock)) {

            for (var i in menu) {

                if (menu[i].sel) {
                    var n = menu[i].func();
                    //dev.sound.change(0);
                    //dev.sound.play(0);
                    if (n != 0) {
                        //document.getElementById("manual_1").style.visibility =  'hidden';
                        //document.getElementById("manual_2").style.visibility =  'hidden';
                        wipef = true;
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
            var o = {};

            o.cw = work2.cw;
            o.ch = work2.ch;
            o.y1 = work2.ch / 2 - wipecnt
            o.y2 = work2.ch / 2 + wipecnt

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
            work2.putFunc(o);

            work2.draw();
            work2.reset();

            wipecnt += 4;

            if (work2.ch / 2 - wipecnt < 0) { return ret_code; }
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

        for (var i in menu) {

            if (menu[i].sel) {

                var o = {}
                o.x = menu[i].x;
                o.y = menu[i].y;
                o.w = menu[i].w;
                o.h = menu[i].h;
                o.draw = function (device) {
                    device.beginPath();
                    device.fillStyle = "orange";
                    device.fillRect(this.x, this.y, this.w, this.h);
                }
                work.putFunc(o);

                work.putchr(menu[i].title, menu[i].x - 4, menu[i].y -1);

            } else {
                work.putchr(menu[i].title, menu[i].x - 4, menu[i].y -1);    
            }

        }
        //表示
    }
}
