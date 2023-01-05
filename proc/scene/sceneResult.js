//Scene(result)
//
function sceneResult(state) {
    
    var dev = state.System.dev;
    //宣言部
    var work = dev.graphics[1];//
    var work2 = dev.graphics[0];
	//var text = dev.text;
    var text = dev.graphics[3];

    var inp = dev.mouse_state;
    var keys = dev.key_state;

    this.init = scene_init;
    this.reset = scene_reset;
    this.step = scene_step;
    this.draw = scene_draw;

    var keylock;

    var wtxt;

    var wipef;
    var wipecnt;

    var ret_code;

    var counter = 0;

    var menu = [];
    
    var m = {};
    m.title = "[   ok.  ]";
    m.x = 320-80;
    m.y = 320;
    m.w = 120;
    m.h = 16;
    m.sel = false;
    m.func = function () {
	text.clear();
	 return 11; 
};

    menu.push(m);
/*
    m = {};
    m.title = "End.";
    m.x = 100;
    m.y = 180;
    m.w = 120;
    m.h = 16
    m.sel = false;
    m.func = function () { return 2; };

    menu.push(m);
*/
    //処理部

    function scene_init() {

        //初期化処理
    }

    function scene_reset() {

        for (var i in menu) {
            menu[i].sel = false;
        }

        wipef = false;
        wipecnt = 2;
        ret_code = 0;

        //        work2.clear();

        var o = {};

        o.cw = work2.cw;
        o.ch = work2.ch;

        o.draw = function (device) {
            /*
            var imgdt = device.getImageData(0, 0, this.cw, this.ch);
            convert_image_to_gray_scale(imgdt.data);

            device.putImageData(imgdt, 0, 0);
            */

            for (var i = 0; i < this.ch; i += 4) {
                device.beginPath();

                device.moveTo(0, i);
                device.lineTo(this.cw, i);

                //                device.strokeStyle = "lightgray";
                device.strokeStyle = "darkblue";

                device.stroke();
            }
        }
        work2.putFunc(o);
/*
        var wsc = state.Result.score;
        var wd = [];
        var wt = "";

        for (i = 0; i < 7; i++) {
            var num = wsc % 10;
            wd[7 - i] = num;
            wsc = (wsc - num) / 10;
        }

        for (i in wd) {
            wt = wt + "" + wd[i];
        }
        work2.putchr("Score:" + wt, dev.layout.score_x, dev.layout.score_y);

        wsc = state.Result.highscore;
        wd = [];
        wt = "";

        for (i = 0; i < 7; i++) {
            var num = wsc % 10;
            wd[7 - i] = num;
            wsc = (wsc - num) / 10;
        }

        for (i in wd) {
            wt = wt + "" + wd[i];
        }
        work2.putchr("Hi-Sc:" + wt, dev.layout.hiscore_x, dev.layout.hiscore_y);
*/
        work2.draw();
        work2.reset();
/*
        var w_mes = ["dummy", "dummy", "敵機撃破", "dummy", "スコアアイテム取得", "dummy"];

        var wtxt = [];
        /*
        for (i in this.result.item) {
        wtxt.push("item[" + i + "]:" + this.result.item[i]);
        }
        */
/*
        for (i in this.result.combo) {
            wtxt.push("連続" + w_mes[i] + "数 : " + this.result.combo[i]);
        }

        for (i in this.result.combomax) {
            wtxt.push("最大連続" + w_mes[i] + "数 : " + this.result.combomax[i]);
        }

        var n1 = 0;
        for (i in this.result.total) {
            if (i == 2) n1 = this.result.total[i];
            //    wtxt.push("total[" + i + "]:" + obCtrl.total[i]);
        }

        var n2 = 1;
        for (i in this.result.obCount) {
            if (i == 2) n2 = this.result.obCount[i];
            //    wtxt.push("ob[" + i + "]:" + obCtrl.obCount[i]);
        }
        wtxt.push("敵機撃墜率 : " + Math.floor((n1 / n2) * 100) + " %");

        wtxt.push("被弾回数 : " + this.result.hidan);

        text.reset();

        for (var s in wtxt) {
            text.print(wtxt[s], 100, 150 + 16 * s, "yellow");
        }

        text.clear();
        text.draw();
        text.reset();
*/
        keylock = true;

        counter = 0;

        //reset処理を記述予定
    }

    function scene_step() {
        //進行
        wtxt = [];

 //       var mstate = inp.check_last();
        var kstate = keys.check();

        var zkey = false;
        if (Boolean(kstate[90])) {
            if (kstate[90]) {//↓
                zkey = true;
            }
        }

//        if ((mstate.button == 0) && (!keylock)) {
        counter ++;
//        if (counter > 125) {
          if (!dev.sound.running()){
//        if ((zkey)&&(!keylock)) {
            for (var i in menu) {

                if (menu[i].sel) {
                    var n = menu[i].func();
                    if (n != 0) {
 //                       wipef = true;
 //                       ret_code = n;
                        return n;
                    }
                }
                //            return 2;
            }
        }

        if (!zkey) keylock = false;

        if (wipef) {

            var o = {};

            o.cw = work2.cw;
            o.ch = work2.ch;
            o.y1 = work2.ch/2 - wipecnt
            o.y2 = work2.ch / 2 + wipecnt

            o.draw = function (device) {

                device.strokeStyle = "black";
//                device.fillStyle = "black";

                device.beginPath();
                device.moveTo(0, this.y1);
                device.lineTo(this.cw, this.y1);
                device.stroke();

                device.beginPath();
                device.moveTo(0, this.y2);
                device.lineTo(this.cw, this.y2);
                //    device.stroke();
                device.stroke();
            }
            work2.putFunc(o);

            work2.draw();
            work2.reset();

            wipecnt += 8;

            if (work2.ch / 2 - wipecnt < 0) { return ret_code; }

        }

        for (i in menu) {
        
        //    if ((mstate.x >= menu[i].x) && (mstate.x <= menu[i].x + menu[i].w)
          //      && (mstate.y >= menu[i].y) && (mstate.y <= menu[i].y + menu[i].h)) {

                if (!keylock) menu[i].sel = true;
            //} else {
              //  menu[i].sel = false;
            //}

            }

            var stage = state.Game.nowstage;
            wtxt.push(" == Floor -" + stage + "- Clear ==");
//        wtxt.push(" == Result Scene (Stage Clear) ==");
//        wtxt.push("---------------");
//        wtxt.push("Push rMouse Button to Start");

        return 0; //戻すコードで推移する画面を選ぶようにするか？
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
            }

            work.putchr(menu[i].title, menu[i].x, menu[i].y);

        }

        for (var s in wtxt) {
            work.putchr(wtxt[s], 320-150, 160 + 16 * s );// + (150 - counter) );
            //			work.putchr8(wtxt[s],0,0 + 8*s);
            //		        work.print(wtxt[s],0,0 + 16*s +200);	
        }

        //表示

    }
}