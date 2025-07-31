//Scene(gameover)
//
function sceneGover(state) {
    const dev = state.System.dev;

    //宣言部
    const UI_layer = dev.graphics[state.Constant.layer.UI]; //文字表示面で使用
    const BUI_layer = dev.graphics[state.Constant.layer.BUI]; //メイン画面

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

    let ret_code;

    let menusel;

    let menu = [];
    
    let m = {};
    /*
    m.title = "Continue.";
    m.x = 320-50;
    m.y = 180;
    m.w = 120;
    m.h = 16;
    m.sel = false;
    m.func = function () { return 11; };

    menu.push(m);
    */
   
    m = {};
    m.title = "End.";
    m.x = 320-50;
    m.y = 200;
    m.w = 120;
    m.h = 16
    m.sel = false;
    m.func = function () { return state.Constant.scene.TITLE; };

    menu.push(m);

    //処理部

    function scene_init() {

        //初期化処理
    }

    function scene_reset() {

        for (let i in menu) {
            menu[i].sel = false;
        }

        wipef = true;//false;
        wipecnt = 2;
        ret_code = 0;

//        BUI_layer.clear();

        let o = {};

        o.cw = BUI_layer.cw;
        o.ch = BUI_layer.ch;

        o.draw = function (device) {

            for (let i = 0; i < this.ch; i += 4) {
                device.beginPath();
                device.lineWidth = 1;
                device.moveTo(0, i);
                device.lineTo(this.cw, i);

//                device.strokeStyle = "lightgray";
                device.strokeStyle = "black";

                device.stroke(); 
            }
        }
        //ゲーム画面の描画を停止(Flip/Drawを自動で実行するのを停止)
        //dev.graphics[0].setInterval(0);//BG
        //dev.graphics[1].setInterval(0);//SPRITE
        dev.pauseBGSP();

        BUI_layer.setInterval(0);//<-dev.g2　FG
        BUI_layer.putFunc(o);
        BUI_layer.draw();

        state.Game.cold = true;

        keylock = true;
        keywait = 30;

        menusel = 0;

        //reset処理を記述予定
    }

    function scene_step(g, input) {
        //進行
        wtxt = [];

        //let mstate = inp.check_last();
        let kstate = input.keycode;//keys.check();

        let zkey = input.trigger.weapon;//false;
        let xkey = input.trigger.useitem;
        let ckey = input.trigger.jump;


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
                    if (menusel > menu.length - 1) menusel = 0;
                    keylock = true;
                    keywait = 10
                }
            }

            //let zkey = false;
            /*
            if (Boolean(kstate[90])) {
                if (kstate[90]) {//↓
                    zkey = true;
                }
            }
            */
           /*
            if (Boolean(kstate[32])) {
                if (kstate[32]) {//↓
                    zkey = true;
                }
            }

                              if (Boolean(kstate[90])) { if (kstate[90]) zkey = true; }
            */
            //let xkey = false; if (Boolean(kstate[88])) { if (kstate[88]) xkey = true; }
            //let ckey = false; if (Boolean(kstate[67])) { if (kstate[67]) ckey = true; }
    
            zkey = zkey || xkey || ckey; //any key

            if (keylock) {
                dev.sound.effect(state.Constant.sound.CURSOR);
            }
        }
//        if ((mstate.button == 0) && (!keylock)) {
        if ((zkey)&&(!keylock)) {
            for (let i in menu) {

                if (menu[i].sel) {
                    let n = menu[i].func();
                    if (n != 0) {
                        //wipef = true;
                        ret_code = n;
                        return n;
                    }
                }
        //return 2;
            }
        }

        if (keywait > 0) keywait--;

        //if (mstate.button == -1) keylock = false;
        if ((!zkey)&&(keywait == 0)) keylock = false;

        if (wipef) {

            let o = {};

            o.cw = BUI_layer.cw;
            o.ch = BUI_layer.ch;
            o.y1 = wipecnt + 1;
            o.y2 = BUI_layer.ch - wipecnt - 2;

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
            BUI_layer.putFunc(o);

            BUI_layer.draw();
            BUI_layer.reset();

            wipecnt += 3 * (60/(1000/state.System.deltaTime()));

            //if (BUI_layer.ch / 2 - wipecnt < 0) { return ret_code; }
            if (wipecnt > BUI_layer.ch/3) wipef = false;//return ret_code; }
        }

        for (i in menu) {

            if ( i == menusel){
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
/*
        let wsc = this.score;
        let wd = [];
        let wt = "";

        for (i = 0; i < 7; i++) {
            let num = wsc % 10;
            wd[7 - i] = num;
            wsc = (wsc - num) / 10;
        }

        for (i in wd) {
            wt = wt + "" + wd[i];
        }
        UI_layer.putchr("Score:" + wt, 240, 0);
*/
        wtxt.push("== Game Over ==");
        wtxt.push("---------------");
//        wtxt.push("Push rMouse Button to Start");

        return 0; //戻すコードで推移する画面を選ぶようにするか？
    }

    function scene_draw() {

        for (let i in menu) {

            if (menu[i].sel) {
                let o = {}
                o.x = menu[i].x;
                o.y = menu[i].y;
                o.w = menu[i].w;
                o.h = menu[i].h;
                o.c = "orange";
                o.draw = function (device) {
                    device.beginPath();
                    device.fillStyle = this.c;
                    device.fillRect(this.x, this.y, this.w, this.h);
                }
                UI_layer.putFunc(o);
            }

            UI_layer.putchr(menu[i].title, menu[i].x, menu[i].y);

        }

        for (let s in wtxt) {
            let o = {}
            o.x = 320-72;
            o.y = 132 + 16 * s;
            o.w = 12 * wtxt[i].length;
            o.h = 16;
            o.draw = function (device) {
                device.beginPath();
                device.fillStyle = "navy";
                device.fillRect(this.x, this.y, this.w, this.h);
            }
            UI_layer.putFunc(o);

            UI_layer.putchr(wtxt[s], 320-72, 132 + 16 * s);
            //			UI_layer.putchr8(wtxt[s],0,0 + 8*s);
            //		        UI_layer.print(wtxt[s],0,0 + 16*s +200);	
        }

        //表示

    }

}