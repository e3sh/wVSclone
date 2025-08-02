//Scene
//
function sceneConfig(state) {

    const dev = state.System.dev;

    //宣言部
    const UI = dev.graphics[state.Constant.layer.UI];
    const BUI = dev.graphics[state.Constant.layer.BUI];

    //let text = dev.text;
    const text = dev.graphics[state.Constant.layer.BUI]; 

    //let inp = dev.mouse_state;
    //const  keys = dev.key_state;

    this.init = scene_init;
    this.reset = scene_reset;
    this.step = scene_step;
    this.draw = scene_draw;

    this.reset_enable = true;
    this.score = 0;
    this.config = state.Config;

    let keylock;
    let keywait = 0;

    let w_config = [];
    let w_number = [];
    let before_wn = [];

    let wtxt;

    let save_on = false;
    let reset_on = false;

    let menusel = 0;

    let wipef;
    let wipecnt;

    let sndtst;
    //
    function btn() {

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

        let res;
        let bl = [];
        this.button = bl;

        let tmes;
        let tmsx;
        let tmsy;

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

            for (let j = 0; j < 2; j++) {
                m = new btn();
                m.setup(
                    (j == 0) ? " Enable" : " Disable",
                    x + 160 + 80 * j, 
                    y, 80, 16
                    );
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

                let restxt =  (bl[1].select || bl[2].select) ?"-":((res) ? "有効" : "無効");

                text.reset();    
                text.clear();
                //text.print(tmes + restxt, tmsx+2, tmsy+1, "black");
                //text.print(tmes + restxt, tmsx, tmsy, "white");
                text.kprint(tmes + restxt, tmsx, tmsy);
                //text.kputchr(tmes + restxt, tmsx, tmsy, 1.5);
                text.draw();
                //text.reset();
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

            let res;
            let bl = [];
            this.button = bl;

            let tmes;
            let tmsx;
            let tmsy;
            let ts;

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

                for (let j = 0; j < 2; j++) {
                    m = new btn();
                    m.setup((j == 0) ? "  -1" : "  +1",
                x + 160 + 80 * j, y, 80, 16);
                    m.msg = msg; //; + ((j == 0) ? "有効" : "無効");
                    m.sw = (j == 0) ? -1 : 1;
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

                let o_res = res;

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

                    text.reset();
                    text.clear();
                    //text.print(tmes + res, tmsx+2, tmsy+1, "black");
                    //text.print(tmes + res, tmsx, tmsy, "white");
                    text.kprint(tmes + res, tmsx, tmsy);
                    //text.kputchr(tmes + res, tmsx, tmsy, 1.5);
                    text.draw();
                    //text.reset();
                }
                //     bl[1].lamp = false;
                //    bl[2].lamp = false;

                return res;
            }
    }

    let menu = []
    let mttl = ["LampUse.", "MapUse.", "ItemReset.", "ShotFree.", "SoundTest.", "StartStage.", "DebugStatus", "BulletErace"];
    let w_message = ["面の開始からランプを所持する:", "面の開始から地図を所持する:",
	"死んだときにアイテム放出する:", "弾を消費しない。:", "サウンドテスト : ", "開始面 : ", "デバッグステータス表示:", "画面外からの弾を消す:"];
    let mtyp = [0, 0, 0, 0, 1, 1, 0, 0];//menu type 0:select 1:number

    w_number[5] = 1; //開始面初期値

    let confmenu = [];

    let menu_x = 60;
    let menu_y = 108;

    for (let i = 0; i < mttl.length ; i++) {

        let wcm;
        if (mtyp[i] == 0) {
            wcm = new sel_menu();
            wcm.setup(i, mttl[i], w_message[i], menu_x, menu_y + i * 20, 20, menu_y + i * 20 + 8);
        } else {
            wcm = new sel_number();
            wcm.setup(i, mttl[i], w_message[i], menu_x, menu_y + i * 20, menu_x, menu_y + i * 20 + 8);
        }
        confmenu.push(wcm);
    }

    m = new btn();
    m.setup("Save.", 100, 320, 120, 16); 
    m.msg = "Save.";
    m.func = function () {
        save_on = true;
        keylock = true;
        return 0;
    };
    menu.push(m);

    m = new btn();
    m.setup("Reset.", 100, 340, 120, 16);
    m.msg = "Reset.";
    m.func = function () {
        reset_on = true;
        keylock = true;
        return 0;
    }
    menu.push(m);

    m = new btn();
    m.setup("Exit.", 100, 360, 120, 16);
    m.msg = "Exit.";
    m.jp = state.Constant.scene.TITLE; //Return Scene
    m.func = function () {
        return this.jp;
    };
    menu.push(m);

    //処理部
    function scene_init() {
        state.Config.reset();
        state.Config.load();
        //===================
        w_config[0] = state.Config.lamp_use;
        w_config[1] = state.Config.map_use;
        w_config[2] = state.Config.itemreset;
        w_config[3] = state.Config.shotfree;
        w_config[4] = false;
        w_config[5] = false;
        w_config[6] = state.Config.debug;
        w_config[7] = state.Config.bulletmode;

        w_number[4] = 0;
        w_number[5] = state.Config.startstage;

        //初期化処理
    }

    function scene_reset() {
        dev.pauseBGSP();
        //dev.graphics[0].setInterval(0);//BG　WORK2
		//dev.graphics[1].setInterval(0);//SPRITE
		//dev.graphics[2].setInterval(0);//FG

        for (let i in menu) {
            menu[i].sel = false;
            menu[i].lamp = false;
        }

        wipef = false;
        wipecnt = 0;
        cur_cnt = 0;

        BUI.setBackgroundcolor("navy");
        BUI.reset();
        BUI.clear("navy");

        for (i in w_number) {
            if (Boolean(w_number[i])) {
                before_wn[i] = w_number[i];
            }
        }

        for (let i = 0; i < mtyp.length; i++) {

            if (mtyp[i] == 0) {
                
                confmenu[i].set(w_config[i]);
            } else {
                //let wcm = new sel_number();
                confmenu[i].set(w_number[i]);
            }
        }

        keylock = true;

        menusel = 0;
        keylock = 10;

        //dev.sound.change(Math.floor(Math.random() * 6));
        //dev.sound.play(0);

    }

    function scene_step(g, input) {

        wtxt = [];

        //let mstate = inp.check_last();
        //let kstate = keys.check();

        //let x = mstate.x;
        //let y = mstate.y;

        let zkey = input.trigger.weapon;//false;
        let lkey = false;
        let rkey = false;

        const c = input;//dev.directionM( kstate );

        if (!keylock) {
            //if (Boolean(kstate[37])) {
                if (c.left) {// <-
                //if (kstate[37]) {//<=
                    lkey = true;
                    keywait = 10;
                }
            //}
            //if (Boolean(kstate[39])) {
                if (c.right) {// ->
                //if (kstate[39]) {//=>
                    rkey = true;
                    keywait = 10;
                }
            //}

            //if (Boolean(kstate[38])) {
                if (c.up) {//↑
                //if (kstate[38]) {//↑
                    menusel--;

                    if (menusel < mttl.length * 3) {
                        menusel--;
                        menusel--;
                    }
                    if (menusel < 0) menusel = menu.length - 1;
                    keylock = true;
                    keywait = 10;
                    text.reset();
                    text.clear();
                    text.draw();
                }
            //}

            //if ((kstate[40])) {
                if (c.down) {//↓
                //if (kstate[40]) {//↓
                    menusel++;

                    if (menusel < mttl.length * 3) {
                        menusel++;
                        menusel++;
                    }
                    if (menusel > menu.length- 1) menusel = 0;
                    keylock = true;
                    keywait = 10
                    text.reset();
                    text.clear();
                    text.draw();
                }
            //}
            /*    
            //zkey = false;
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
            */
            if (keylock) {
                dev.sound.effect(state.Constant.sound.CURSOR);
            }
        }

        if ((zkey||(lkey || rkey)) && (!keylock)) {
//        if ((mstate.button == 0) && (!keylock)) {
            for (let i in menu) {
                menu[i].click = false;

                if (menu[i].select) {
                    menu[i].click = true;

                    let n = menu[i].func();
                    if (n != 0) {
                        BUI.setBackgroundcolor("");
                        return n;
                    }
                }
            }
        } else {
            for (let i in w_number) {
                if (Boolean(w_number[i])) {
                    before_wn[i] = w_number[i];
                }
            }
        }

        if (keywait > 0) keywait--;
        //if (mstate.button == -1) keylock = false;
        if ((!zkey) && (keywait == 0)) keylock = false;

        //if (mstate.button == -1) keylock = false;

        let wi = -1;
        let wmesel = menusel;

        if (menusel < mttl.length * 3) {
            wmesel = Math.floor(menusel / 3) * 3;

        }

        for (let i in menu) {
            if (i == wmesel) {
                menu[i].select = true;
                wi = i;
            } else {
                menu[i].select = false;
            }
        }

        if ((lkey || rkey) && (!keylock)) {
            if (menusel < mttl.length * 3) {

                let n = menusel;
                if (lkey) n = n + 1;
                if (rkey) n = n + 2;

                menu[n].select = true;
            }
        }

        wtxt.push("== Configration ==");
        wtxt.push("-----------------%");

        for (let i in confmenu) {
            w_config[i] = confmenu[i].result();

            if (mtyp[i] == 1) {

                w_number[i] = w_config[i];
            }
        }

        //===================
        state.Config.lamp_use = w_config[0];
        state.Config.map_use = w_config[1];
        state.Config.itemreset = w_config[2];
        state.Config.shotfree = w_config[3];
        state.Config.debug = w_config[6];
        state.Config.bulletmode = w_config[7];


        if (!Boolean(sndtst)) sndtst = w_number[4];

        if (sndtst != w_number[4]) {
            if ((w_number[4] >= 0) && (w_number[4] <18)) {//Sound No 
                dev.sound.change(Math.floor(w_number[4]));
                dev.sound.play();
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
            w_config[6] = state.Config.debug;
            w_config[7] = state.Config.bulletmode;

            w_number[4] = 0;
            w_number[5] = state.Config.startstage;

            text.clear();

            //text.print("設定初期化しました。", 102, 281, "black");
            //text.print("設定初期化しました。", 100, 280, "white");
            text.kprint("設定初期化しました。", 100, 280);

            if (Boolean(localStorage)) {
                localStorage.clear();

                //text.print("ローカルストレージクリア。", 102, 301, "black");
                //text.print("ローカルストレージクリア。", 100, 300, "white");
                text.kprint("ローカルストレージクリア。", 100, 300);
            } else {

                //text.print("ローカルストレージが使用できない?"
                //        , 102, 301, "black");
                //text.print("ローカルストレージが使用できない?"
                //        , 100, 300, "white");
                text.kprint("ローカルストレージが使用できない?", 100, 300);
            }
            text.draw();
            //text.reset();

            for (let i = 0; i < mtyp.length; i++) {

                if (mtyp[i] == 0) {

                    confmenu[i].set(w_config[i]);
                } else {
                    //let wcm = new sel_number();
                    confmenu[i].set(w_number[i]);
                }
            }

            reset_on = false;
        }

        if (save_on) {
            text.clear();
        
            if (state.Config.save() == 0) {

            //    text.print("設定をセーブしました。"//this.msg + localStorage.length
            //, 102, 281, "black");
            //    text.print("設定をセーブしました。"
            //, 100, 280, "white");
                text.kprint("設定をセーブしました。", 100, 280);
            } else {

            //    text.print("ローカルストレージが使用できない?"
            //            , 102, 281, "black");
            //    text.print("ローカルストレージが使用できない?"
            //            , 100, 280, "white");
                text.kprint("ローカルストレージが使用できない?", 100, 280);
            }
            text.draw();
            //text.reset();
            
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

        for (let s in wtxt) {
            //UI.putchr(wtxt[s], 0, 60 + 16 * s);
            UI.kprint(wtxt[s], 0, 60 + 16 * s);
        }

        for (let i in menu) {
            if (menu[i].lamp) {
                UI.fill(menu[i].x, menu[i].y, menu[i].w, menu[i].h,"orange" );
                /*
                let o = {}
                o.x = menu[i].x;
                o.y = menu[i].y;
                o.w = menu[i].w;
                o.h = menu[i].h;
                o.draw = function (device) {
                    device.beginPath();
                    device.fillStyle = "orange";
                    device.fillRect(this.x, this.y, this.w, this.h);
                }
                UI.putFunc(o);
                */
            }

            if (menu[i].select) {
                if (!menu[i].lamp) UI.fill(menu[i].x - 10, menu[i].y-1 , menu[i].w, 8,"blue" );
                //UI.fill(menu[i].x - 4 -6 , menu[i].y - 1 , menu[i].title.length*6 + 12,8,"blue" );
                UI.kprint(menu[i].title, menu[i].x - 4, menu[i].y - 1);
            } else {
                //if (!menu[i].lamp) UI.fill(menu[i].x, menu[i].y, menu[i].w, menu[i].h,"black" );
                UI.kprint(menu[i].title, menu[i].x, menu[i].y);
            }
        }

    }
}

