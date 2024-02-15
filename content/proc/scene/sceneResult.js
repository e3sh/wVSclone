//Scene(result)
//
function sceneResult(state) {
    
    var dev = state.System.dev;
    //宣言部
    var work = dev.graphics[3];//メニュー(最上面)
    var work2 = dev.graphics[2];//メイン描画面(FG)
	//var text = dev.text;
    //var text = dev.graphics[3];//文字表示面

    //var inp = dev.mouse_state;
    var keys = dev.key_state;

    this.init = scene_init;
    this.reset = scene_reset;
    this.step = scene_step;
    this.draw = scene_draw;

    this.reset_enable = true;

    var keylock;

    var wtxt;

    var wipef;
    var wipecnt;

    var ret_code;

    var counter = 0;

    var menu = [];
    var diag;
    
    var m = {
        title: "[   ok.  ]",
        x: 320-80 ,y: 280 ,w: 120 ,h: 16,
        sel: false,
        func: function () {
            return 11; //GameScene:1 + ContinueFlag:+10
        }
    };
    menu.push(m);

    //処理部
    function scene_init() {
        //初期化処理
        diag = new DialogControl(
            [
            { keynum:38, text:"dummy", icon:"Mayura1", x:320-80, y:160, w:200, h:100, keyon:false }//upkey
            ,{ keynum:40, text:"テストです。地図", icon:"Map", x:320-80, y:360, w:200, h:100, keyon:false }//downkey
            ]
        );
    }

    function scene_reset() {

        for (var i in menu) {
            menu[i].sel = false;
        }

        //wipef = false;
        wipef = true;

        wipecnt = 2;
        ret_code = 0;

        //        work2.clear();

        var o = {};

        o.cw = work2.cw;
        o.ch = work2.ch;

        o.draw = function (device) {

            for (var i = 0; i < this.ch; i += 4) {
                device.beginPath();
                device.lineWidth = 1;
                device.moveTo(0, i);
                device.lineTo(this.cw, i);

                //                device.strokeStyle = "lightgray";
                device.strokeStyle = "darkblue";

                device.stroke();
            }
        }
        //ゲーム画面の描画を停止(Flip/Drawを自動で実行するのを停止)
        dev.graphics[0].setInterval(0);//BG
        dev.graphics[1].setInterval(0);//SPRITE
        work2.setInterval(0);//<-dev.g2　FG

        work2.putFunc(o);
        work2.draw();
    }

    function scene_step() {
        //進行
        wtxt = [];

 //       var mstate = inp.check_last();
        var kstate = keys.check();

        var zkey = false; if (Boolean(kstate[90])) { if (kstate[90]) zkey = true; }
        var xkey = false; if (Boolean(kstate[88])) { if (kstate[88]) xkey = true; }
        var ckey = false; if (Boolean(kstate[67])) { if (kstate[67]) ckey = true; }

        zkey = zkey || xkey || ckey; //any key

        //diag.step(kstate);

//        if ((mstate.button == 0) && (!keylock)) {
        counter ++;
        if (counter > 30) {
            if (!dev.sound.running()){
                if ((zkey)&&(!keylock)) {
                    for (var i in menu) {

                        if (menu[i].sel) {
                            var n = menu[i].func();
                            if (n != 0) {
                                //wipef = true;
                                ret_code = n;
                                return n;
                            }
                        }
                    //return 2;
                    }
                }
            }
        }

        if (!zkey) keylock = false;

        if (wipef) {

            var o = {};

            o.cw = work2.cw;
            o.ch = work2.ch;
            o.y1 = wipecnt + 1;
            o.y2 = work2.ch - wipecnt - 2; 

            o.draw = function (device) {

                device.strokeStyle = "black";
//                device.fillStyle = "black";

                device.beginPath();
                device.lineWidth = 8;
                device.moveTo(0, this.y1);
                device.lineTo(this.cw, this.y1);
                device.stroke();

                device.beginPath();
                device.lineWidth = 8;
                device.moveTo(0, this.y2);
                device.lineTo(this.cw, this.y2);
                //    device.stroke();
                device.stroke();
            }
            work2.putFunc(o);

            work2.draw();
            work2.reset();

            wipecnt += 3 * (60/(1000/state.System.deltaTime()));

            //if (work2.ch / 2 - wipecnt < 0) { return ret_code; }
            if (wipecnt > work2.ch/3) wipef = false;//return ret_code; }
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
        wtxt.push(" == Stage -" + stage + "- Clear ==");
//      wtxt.push(" == Result Scene (Stage Clear) ==");
//      wtxt.push("---------------");
//      wtxt.push("Push rMouse Button to Start");


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
            work.putchr(wtxt[s], 320-150, 120 + 16 * s );// + (150 - counter) );
            //			work.putchr8(wtxt[s],0,0 + 8*s);
            //		        work.print(wtxt[s],0,0 + 16*s +200);	
        }

        //diag.draw(work);
        //表示

    }

    function DialogControl(mlist){

        var menulist = mlist;

        this.step = function(keystate){

            for (let i in menulist){

                let m = menulist[i];

                if (Boolean(keystate[m.keynum])){
                    menulist[i].keyon = (keystate[m.keynum]) ? true: false ; 
                }
            }
        }

        this.draw = function(device){

            for (let i in menulist){

                let m = menulist[i];

                if (m.keyon) {
                    var o = {x: m.x, y: m.y, w: m.w, h:m.h };                    
                    o.draw = function (device) {
                        device.beginPath();
                        device.fillStyle = "orange";
                        device.fillRect(this.x, this.y, this.w, this.h);
                    }
                    device.putFunc(o);
                }
                var o = {x: m.x, y: m.y, w: m.w, h:m.h };                    
                o.draw = function (device) {
                    device.beginPath();
                    device.strokeStyle = "White";
                    device.strokeRect(this.x, this.y, this.w, this.h);
                }
                device.putFunc(o);
    
                //onsole.log(m);

                device.kprint(m.text, m.x + 10 , m.y + 20);
                device.put(m.icon, m.x + 10, m.y+ 10);

            }

        }
    }

}