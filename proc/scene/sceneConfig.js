//Scene
//
function sceneConfig(state) {

    var dev = state.System.dev;

    //宣言部
    var work = dev.graphics[1];
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
    var keywait = 0;

    this.score = 0;

    this.config = state.Config;

    var w_config = [];
    var w_number = [];
    var before_wn = [];

    var wtxt;

    var save_on = false;
    var reset_on = false;

    var menusel = 0;

    var wipef;
    var wipecnt;

    var sndtst;
    //
    function btn() {

        //
        this.title = "button"; //button title
        this.x = 0;
        this.y = 0;
        this.w = 100;
        this.h = 16;

        this.select = false;
        this.click = false;

        this.setup = function (s, x, y, w, h) {

            this.title = s;
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;

            this.select = false;
            this.click = false;
            this.lamp = false;
        }

        this.status_reset = function () {
            this.select = false;
            this.click = false;
        }

        this.func = function () {
            return 0;
        }
    }

    function sel_menu() {

        var res;
        var bl = [];
        this.button = bl;

        var tmes;
        var tmsx;
        var tmsy;

        this.setup = function (num, s, msg, x, y, msx, msy) {

            res = num;

            tmes = msg;
            tmsx = msx;
            tmsy = msy;

            m = new btn();
            m.setup(s, x, y, 120, 16);
            m.msg = msg;

            menu.push(m);
            bl.push(m);

            for (var j = 0; j < 2; j++) {
                m = new btn();
                m.setup((j == 0) ? "  On" : "  Off",
                x + 160 + 80 * j, y, 80, 16);
                m.msg = msg + ((j == 0) ? "有効" : "無効");
                m.sw = (j == 0) ? true : false;
                m.num = num;

                menu.push(m);
                bl.push(m);
            }
        }

        this.set = function(r){

            res = r;

        }

        this.result = function () {

            if ((bl[0].select) || (bl[1].select) || (bl[2].select)) {

                if (bl[1].click) {
                    res = true;
                    keylock = true;
                    bl[1].click = false;
                }

                if (bl[2].click) {
                    res = false;
                    keylock = true;
                    bl[2].click = false;
                }

                text.clear();
                text.reset();
                text.print(tmes, tmsx, tmsy, "white");
                text.draw();
            }

            if (res) {
                bl[1].lamp = true;
                bl[2].lamp = false;
            } else {
                bl[1].lamp = false;
                bl[2].lamp = true;
            }
            return res;
        }
    }

        function sel_number() {

            var res;
            var bl = [];
            this.button = bl;

            var tmes;
            var tmsx;
            var tmsy;
            var ts;

            this.setup = function (num, s, msg, x, y, msx, msy) {

                res = num;
                
                ts = s;
                tmes = msg;
                tmsx = msx;
                tmsy = msy;

                m = new btn();
                m.setup(s, x, y, 120, 16);
                m.msg = msg;

                menu.push(m);
                bl.push(m);

                for (var j = 0; j < 2; j++) {
                    m = new btn();
                    m.setup((j == 0) ? "  +1" : "  -1",
                x + 160 + 80 * j, y, 80, 16);
                    m.msg = msg; //; + ((j == 0) ? "有効" : "無効");
                    m.sw = (j == 0) ? 1 : -1;
                    m.num = num;

                    menu.push(m);
                    bl.push(m);
                }
            }

            this.set = function (r) {

                res = r;
                bl[0].title = ts + res;

            }


            this.result = function () {

                var o_res = res;

                if ((bl[0].select) || (bl[1].select) || (bl[2].select)) {

                    if (bl[1].click) {
                        res += bl[1].sw;
                        bl[1].click = false;
                        keylock = true;
                        bl[1].lamp = true;
                        bl[2].lamp = false;

                    }

                    if (bl[2].click) {
                        res += bl[2].sw;
                        bl[2].click = false;
                        keylock = true;
                        bl[1].lamp = false;
                        bl[2].lamp = true;
                    }

                    if (res < 0) res = 0;

                    bl[0].title = ts + res;

                    text.clear();
                    text.reset();
                    text.print(tmes + res, tmsx, tmsy, "white");
                    text.draw();
                }

                //     bl[1].lamp = false;
                //    bl[2].lamp = false;

                return res;
            }
        }

    var menu = []
    var mttl = ["LampUse.", "MapUse.", "ItemReset.", "ShotFree.", "SoundTest.", "StartStage."];
    var w_message = ["面の開始からランプを所持する:  ", "面の開始から地図を所持する: ",
	"死んだときにアイテム放出する: ", "弾を消費しない。:", "サウンドテスト : ", "開始面 : "];
    var mtyp = [0, 0, 0, 0, 1, 1];//menu type 0:select 1:number

    w_number[5] = 1; //開始面初期値

    var confmenu = [];

    var menu_x = 60;
    var menu_y = 180;

    for (var i = 0; i < mttl.length ; i++) {

        if (mtyp[i] == 0) {
            var wcm = new sel_menu();
            wcm.setup(i, mttl[i], w_message[i], menu_x, menu_y + i * 20, 100, 320);
        } else {
            var wcm = new sel_number();
            wcm.setup(i, mttl[i], w_message[i], menu_x, menu_y + i * 20, 100, 320);
        }

        confmenu.push(wcm);
    }

    m = new btn();
    m.setup("Save.", 100, 360, 120, 16); 
    m.msg = "Save.";
//    m.config = this.config;
//    m.result = this.result;
    m.func = function () {
        save_on = true;
        keylock = true;
        return 0;
    };
    menu.push(m);

    m = new btn();
    m.setup("Reset.", 100, 380, 120, 16);
    m.msg = "Reset.";
    m.func = function () {
        reset_on = true;
        keylock = true;
        return 0;
    }
    menu.push(m);

    m = new btn();
    m.setup("Exit.", 100, 400, 120, 16);
    m.msg = "Exit.";
    m.jp = 2; //Return Scene
    m.func = function () {
        text.clear();
        text.reset();
        return this.jp;
    };
    menu.push(m);

    //

    var cur_cnt;

    var tsel = new Number(0.0);


    //処理部
/*
    this.config_load = function () {

        if (Boolean(localStorage)) {

            var t = ["fullpower", "sideshot", "itemreset", "option", "dummy", "startstage"];

            var f = false;

            for (var i = 0; i <= 3; i++) {
                if (Boolean(localStorage.getItem(t[i]))) {
                    f = true;
                    w_config[i] = (localStorage.getItem(t[i]) == "on") ? true : false;
                    this.config[t[i]] = w_config[i];
                }
            }

            if (Boolean(localStorage.getItem(t[5]))) {
                f = true;
                w_number[5] = parseInt(localStorage.getItem(t[5]));
                this.config[t[5]] = w_number[5];

//                wm.title = mttl[5] + w_number[5];
            }

//            alert(f ? "load" : "nondata");
        } else {
 //           alert("non localstorage");
        }
    }
*/
    function scene_init() {
    /*
        this.config.fullpower = false;
        this.config.sideshot = false;
        this.config.itemreset = true;
        this.config.option = false;
        this.config.startstage = 1;

        this.config.cold = true;
        this.config.debug = false;
//        this.config.debug = true;
    */
        state.Config.reset();
        state.Config.load();
        //===================
        w_config[0] = state.Config.lamp_use;
        w_config[1] = state.Config.map_use;
        w_config[2] = state.Config.itemreset;
        w_config[3] = state.Config.shotfree;
        w_config[4] = false;
        w_config[5] = false;

        w_number[4] = 0;
        w_number[5] = state.Config.startstage;

        //        tsel = 0.0;

        //初期化処理
    }

    function scene_reset() {

        for (var i in menu) {
            menu[i].sel = false;
            menu[i].lamp = false;
        }

        wipef = false;
        wipecnt = 0;
        cur_cnt = 0;

        work2.clear("darkblue");

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
            device.lineWidth = "1";
            device.stroke();
        }
        work2.putFunc(cl);
        work2.draw();

        work2.reset();

        for (i in w_number) {
            if (Boolean(w_number[i])) {
                before_wn[i] = w_number[i];
            }
        }

        for (var i = 0; i < mtyp.length; i++) {

            if (mtyp[i] == 0) {
                
                confmenu[i].set(w_config[i]);
            } else {
                var wcm = new sel_number();
                confmenu[i].set(w_number[i]);
            }
        }

        keylock = true;

        menusel = 0;
        keylock = 10;

        //dev.sound.change(Math.floor(Math.random() * 6));
        //dev.sound.play(0);

    }

    function scene_step() {

        wtxt = [];

        var mstate = inp.check_last();
        var kstate = keys.check();

        var x = mstate.x;
        var y = mstate.y;

        var zkey = false;
        var lkey = false;
        var rkey = false;

        if (!keylock) {
            if (Boolean(kstate[37])) {
                if (kstate[37]) {//<=
                    lkey = true;
                    keywait = 10;
                }
            }
            if (Boolean(kstate[39])) {
                if (kstate[39]) {//=>
                    rkey = true;
                    keywait = 10;
                }
            }

            if (Boolean(kstate[38])) {
                if (kstate[38]) {//↑
                    menusel--;

                    if (menusel < mttl.length * 3) {
                        menusel--;
                        menusel--;
                    }
                    if (menusel < 0) menusel = menu.length - 1;
                    keylock = true;
                    keywait = 10;
                }
            }

            if ((kstate[40])) {
                if (kstate[40]) {//↓
                    menusel++;

                    if (menusel < mttl.length * 3) {
                        menusel++;
                        menusel++;
                    }
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

        if ((zkey||(lkey || rkey)) && (!keylock)) {
//        if ((mstate.button == 0) && (!keylock)) {
            for (var i in menu) {
                menu[i].click = false;

                if (menu[i].select) {
                    menu[i].click = true;

                    var n = menu[i].func();
                    if (n != 0) return n;
                }
            }
        } else {
            for (i in w_number) {
                if (Boolean(w_number[i])) {
                    before_wn[i] = w_number[i];
                }
            }
        }

        if (keywait > 0) keywait--;
        //if (mstate.button == -1) keylock = false;
        if ((!zkey) && (keywait == 0)) keylock = false;

        //if (mstate.button == -1) keylock = false;
/*
        var wi = -1;
        for (i in menu) {
            if ((mstate.x >= menu[i].x) && (mstate.x <= menu[i].x + menu[i].w)
                && (mstate.y >= menu[i].y) && (mstate.y <= menu[i].y + menu[i].h)) {

                menu[i].select = true;
                wi = i;
            } else {
                menu[i].select = false;
            }
        }
*/
        var wi = -1;
        var wmesel = menusel;

        if (menusel < mttl.length * 3) {
            wmesel = Math.floor(menusel / 3) * 3;

        }

        for (i in menu) {
            if (i == wmesel) {
                menu[i].select = true;
                wi = i;
            } else {
                menu[i].select = false;
            }
        }

        if ((lkey || rkey) && (!keylock)) {
            if (menusel < mttl.length * 3) {

                var n = menusel;
                if (lkey) n = n + 1;
                if (rkey) n = n + 2;

                menu[n].select = true;
            }
        }
/*
        for (i in confmenu) {
            for (j in confmenu[i].button) {
                var w = confmenu[i].button[j];

                if ((mstate.x >= w.x) && (mstate.x <= w.x + w.w)
                && (mstate.y >= w.y) && (mstate.y <= w.y + w.h)) {

                    w.select = true;
                    wi = i;
                } else {
                    w.select = false;
                }
            }
        }
*/
        wtxt.push("== Configration ==");
        wtxt.push("-----------------%");
        //        wtxt.push("menu:" + wi);

        //        wtxt.push("Push rMouse Button to Start");

        for (i in confmenu) {
            w_config[i] = confmenu[i].result();

            if (mtyp[i] == 1) {

                w_number[i] = w_config[i];
            }
        }

/*
        for (i in w_config) {
            if (w_config[i]) {
                menu[i * 3 + 1].lamp = true;
                menu[i * 3 + 2].lamp = false;
            } else {
                menu[i * 3 + 1].lamp = false;
                menu[i * 3 + 2].lamp = true;
            }
        }
*/
//
/*
        for (i in w_number) {
            if (Boolean(w_number[i])) {
                if (w_number[i] != before_wn[i]) {
                    menu[i * 3 + 1].lamp = false;
                    menu[i * 3 + 2].lamp = false;
                    menu[i * 3 + 1].sel = false;
                    menu[i * 3 + 2].sel = false;
                }
            }
        }
*/
//===================
        state.Config.lamp_use = w_config[0];
        state.Config.map_use = w_config[1];
        state.Config.itemreset = w_config[2];
        state.Config.shotfree = w_config[3];

        if (!Boolean(sndtst)) sndtst = w_number[4];

        if (sndtst != w_number[4]) {
            if ((w_number[4] >= 0) && (w_number[4] <14)) {
                dev.sound.change(Math.floor(w_number[4]));
                dev.sound.play(0);
            }
            sndtst = w_number[4];
        }

        state.Config.startstage = w_number[5];

        if (reset_on) {

            state.Config.reset();
            //===================
            w_config[0] = state.Config.lamp_use;
            w_config[1] = state.Config.map_use;
            w_config[2] = state.Config.itemreset;
            w_config[3] = state.Config.shotfree;
            w_config[4] = false;
            w_config[5] = false;

            w_number[4] = 0;
            w_number[5] = state.Config.startstage;
            
            /*         
            w_config[0] = false;
            w_config[1] = false;
            w_config[2] = true;
            w_config[3] = false;
            w_config[4] = false;
            w_config[5] = false;

            w_number[5] = 1;
            */

            text.clear();
            text.reset();
            text.print("設定初期化しました。", 100, 320, "white");

            if (Boolean(localStorage)) {
                localStorage.clear();
                text.print("ローカルストレージクリア。", 100, 340, "white");
            } else {
                text.print("ローカルストレージが使用できない?"
                        , 100, 340, "white");
            }
            text.draw();


            for (var i = 0; i < mtyp.length; i++) {

                if (mtyp[i] == 0) {

                    confmenu[i].set(w_config[i]);
                } else {
                    var wcm = new sel_number();
                    confmenu[i].set(w_number[i]);
                   
                }
            }

            reset_on = false;
        }

        if (save_on) {

            text.clear();
            text.reset();

            if (state.Config.save() == 0) {
                text.print("設定をセーブしました。"//this.msg + localStorage.length
            , 100, 320, "white");
            } else {
                text.print("ローカルストレージが使用できない?"
                        , 100, 320, "white");

            }

            /*
            if (Boolean(localStorage)) {
                localStorage.setItem("fullpower", (this.config.fullpower) ? "on" : "off");
                localStorage.setItem("sideshot", (this.config.sideshot) ? "on" : "off");
                localStorage.setItem("itemreset", (this.config.itemreset) ? "on" : "off");
                localStorage.setItem("option", (this.config.option) ? "on" : "off");
                localStorage.setItem("startstage", new String(this.config.startstage));
  //              localStorage.setItem("highscore", new String(this.result.highscore));
                text.print("設定をセーブしました。"//this.msg + localStorage.length
                , 100, 320, "white");
            } else {
                text.print("ローカルストレージが使用できない?"
                        , 100, 320, "white");
            }
            */
            text.draw();

            save_on = false;
        }
        return 0;
        //進行
    }

    function btn() {

        //
        this.title = "button"; //button title
        this.x = 0;
        this.y = 0;
        this.w = 100;
        this.h = 16;

        this.select = false;
        this.click = false;

        this.setup = function (s, x, y, w, h) {

            this.title = s;
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;

            this.select = false;
            this.lamp = false;
            this.click = false;
        }

        this.status_reset = function () {
            this.select = false;
            this.click = false;
        }

        this.func = function () {
            return 0;
        }
    }

    function scene_draw() {

        for (var s in wtxt) {
            work.putchr(wtxt[s], 0, 100 + 16 * s);
        }

        for (var i in menu) {
            if (menu[i].lamp) {
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

            if (menu[i].select) {
                work.putchr(menu[i].title, menu[i].x - 4, menu[i].y - 1);
            } else {
                work.putchr(menu[i].title, menu[i].x, menu[i].y);

            }
        }

    }
}

