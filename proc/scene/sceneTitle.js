//Scene
//
function sceneTitle(state) {

    var dev = state.System.dev;
    //宣言部
    var work = dev.graphics[1];
    var work2 = dev.graphics[0];
    var ForgroundBG = dev.graphics[2];

    var inp = dev.mouse_state;
    var keys = dev.key_state;

    this.init = scene_init;
    this.reset = scene_reset;
    this.step = scene_step;
    this.draw = scene_draw;

    var keylock;
    var keywait = 0;

    var wtxt;

    var wipef;
    var wipecnt;

    var menusel = 0;

    var menu = [];
/*
    var m = {};
    m.title = "GameStart.";
    m.x = 100;
    m.y = 320;
    m.w = 120;
    m.h = 16;
    m.sel = false;
    m.func = function () { return 1; };

    menu.push(m);

    m = {};
    m.title = "Config.";
    m.x = 100;
    m.y = 340;
    m.w = 120;
    m.h = 16
    m.sel = false;
    m.func = function () {
        return 2; 
    };

    menu.push(m);
*/
//	var mttl = ["GameStart.","Config","Dummy.","Result.","Gameover."];
//	var mjmp = [1,4,0,5,3];
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

        dev.graphics[3].clear();


        for (var i in menu) {
            menu[i].sel=false;
        }

        wipef = false;
        wipecnt = 0;
        cur_cnt = 0;

        work2.clear("black");
        ForgroundBG.clear();
/*
        cl = {};
        cl.w = work.cw;
        cl.h = work.ch;
        cl.draw = function (device) {
            var max = this.h;
            if (max < this.w) max = this.w;

            device.beginPath();

            for (var i = 0; i < max; i += 16) {
                device.moveTo(i, 0);
                device.lineTo(i, this.h);
                device.moveTo(0, i);
                device.lineTo(this.w, i);
            }
            device.strokeStyle = "lightgray";
            device.stroke();
        }
        work2.putFunc(cl);
*/


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
        //       work2.putchr("5en Coin", 320, 256 - 8);
        //       work2.putchr("10en Coin", 320, 272 - 8);
        work2.putchr("Ball/Item", 320, 272 - 8);
        work2.putchr("Key", 320, 304 - 8);
        work2.putchr8("Press <z> key or [Space]key to", 320 - 100 - 8, 336);

        if (state.Game.load() == 0) {
            //work2.putchr8("Savedata Found.", 0, 0);

            menu[1].title = "Continue";
            menu[1].jp = 11;
        } else {
            menu[1].title = "";
            menu[1].jp = 0;
        }
        
        work2.draw();
        work2.reset();

        state.Game.cold = true;

        keylock = true;
        keywait = 30;

        menusel = 0;

        //dev.sound.change(0);
        //reset処理を記述予定
    }

    function scene_step() {

        wtxt = [];

        //var mstate = inp.check_last();
        var kstate = keys.check();

        //		wtxt.push("mousemove x:" + mstate.x + " y:" + mstate.y + " t:" + tsel);
        //		wtxt.push("b:" + mstate.button + " w:" + mstate.wheel + " r:" + Math.floor(mstate.deg) + " d:"+Math.ceil(mstate.distance));
        //		wtxt.push("key:" + kstate);
/*
        if (mstate.wheel != 0) {
            tsel += (mstate.wheel > 0) ? 1 : -1;
        }
        var x = mstate.x;
        var y = mstate.y;
*/

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
            //画面タップでもスタートするように
            /*
            if (mstate.button == 0) {
                zkey = true;
            }
            */

            if (keylock) {
                dev.sound.effect(9);
            }

        }

        if ((zkey)&&(!keylock)) {
        //if ((mstate.button == 0) && (!keylock)) {
            //    wipef = true;
            //            return 1; //gameScene
            //			ball.set_s( x - inp.o_Left, y - inp.o_Top, Math.random()*360, tsel ); // button--1 then button up
            //tsel = 0:normal else tower
            for (var i in menu) {

                if (menu[i].sel) {
                    var n = menu[i].func();
                    //dev.sound.change(0);
                    //dev.sound.play(0);
                    if (n != 0) return n;
                }
            }
        }
        /*
        if (mstate.button == 1) {
            //			ball.set_s( x - inp.o_Left, y , 0 - inp.o_Top); // button--1 then button up
            //			var ao = new Audio("sound/shot.wav");
            //			ao.play();
        }
        */
        //if (mstate.button == -1) keylock = false;
        if (keywait > 0) keywait--;

        //if (mstate.button == -1) keylock = false;
        if ((!zkey) && (keywait == 0)) keylock = false;

        if (wipef) {

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

            if (work2.ch / 2 - wipecnt < 0) { return 1; }

        }

        for (i in menu) {
            if (i == menusel) {
                menu[i].sel = true;
            } else {
                menu[i].sel = false;
            }
/*
            if ((mstate.x >= menu[i].x) && (mstate.x <= menu[i].x + menu[i].w)
                && (mstate.y >= menu[i].y) && (mstate.y <= menu[i].y + menu[i].h)) {

                menu[i].sel = true;
            } else {
                menu[i].sel = false;
            }
            */
        }

        wtxt.push("==WebDungeonActionG==");
        wtxt.push("-----------------&");

        if (state.Config.use_audio) {
            //wtxt.push("audio on");
        } else {
            wtxt.push("audio off");
        }

//        wtxt.push("Push rMouse Button to Start");

        return 0;
        //進行
    }

    function scene_draw() {
    /*
        //Cursur Draw		
        cl = {};
        cl.x = 120; //- inp.o_Left;
        cl.y = 160; //- inp.o_Top;
        cur_cnt++;
        cl.mode = cur_cnt % 200;
        cl.draw = star_draw;
        work.putFunc(cl);
*/

        for (var s in wtxt) {
            work.putchr(wtxt[s], 0, 132 + 16 * s);
            //			work.putchr8(wtxt[s],0,0 + 8*s);
            //		        work.print(wtxt[s],0,0 + 16*s +200);	
        }

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
                work.putchr(menu[i].title, menu[i].x, menu[i].y);

            }


//            work.spptn_test();
//            work.putchr(menu[i].title, menu[i].x, menu[i].y);

        }
        //表示
    }
}

function star_draw(device) {

    device.save();

    device.setTransform(1, 0, 0, 1, this.x, this.y);

    device.rotate(1.8 * (Math.PI / 180) * this.mode);
/*
    device.beginPath();
    device.fillStyle = "orange";
    device.fillRect(-80, -80, 160, 160);
*/

    device.rotate(45 * (Math.PI / 180));

    device.beginPath();
    device.fillStyle = "orange";

    device.fillRect(-80, -80, 160, 160);



    device.restore();
}