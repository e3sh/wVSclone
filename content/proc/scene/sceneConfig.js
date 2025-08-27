//Scene
//
/**
 * @class
 * @classdesc
 * ゲームの設定オプションを管理するシーンです。<br>\
 * ランプ使用、マップ使用、アイテムリセット、弾フリーなどの設定を<br>\
 * ユーザーが変更、セーブ、ロード、リセットできる機能を提供します。
 */
class sceneConfig {
    /**
     * @constructor
     * @param {stateControl} state GameCore.state
     * @description
     * `sceneConfig`インスタンスを初期化します。<br>\
     * UI描画レイヤー、入力デバイス、各種設定パラメータ、<br>\
     * そして設定メニューを構成するボタン群を準備します。 
     */
    constructor(state) {

        const dev = state.System.dev;

        //宣言部
        const UI = dev.graphics[state.Constant.layer.UI];
        const BUI = dev.graphics[state.Constant.layer.BUI];

        const text = dev.graphics[state.Constant.layer.BUI];

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

        let sndtst;
        //
        /**
         * @class sceneConfig.btn
         * @classdesc
         * 設定メニューで使用される個々のUIボタンの基底クラスです。<br>\
         * ボタンのタイトル、位置、サイズ、選択状態、クリック状態、<br>\
         * およびクリック時に実行される関数を定義します。
         */
        class btn {
            constructor() {

                this.title = "button"; //button title
                this.x = 0;
                this.y = 0;
                this.w = 100;
                this.h = 16;

                this.select = false;
                this.click = false;

                /**
                 * @method
                 * @param {string} s ボタンのタイトル
                 * @param {number} x 表示位置
                 * @param {number} y 表示位置
                 * @param {number} w 幅
                 * @param {number} h 高さ
                 * @description
                 * ボタンのタイトル、表示位置（x, y）、幅（w）、高さ（h）を設定します。 
                 */
                this.setup = function (s, x, y, w, h) {

                    this.title = s;
                    this.x = x;
                    this.y = y;
                    this.w = w;
                    this.h = h;

                    this.select = false;
                    this.click = false;
                    this.lamp = false;
                };
                /**
                 * @method
                 * @description
                 * ボタンの選択状態（`select`）とクリック状態（`click`）を`false`にリセットします。
                 */
                this.status_reset = function () {
                    this.select = false;
                    this.click = false;
                };
                /**
                 * @method
                 * @returns {number} RetrunStatus
                 * @description
                 * ボタンがクリックされたときに実行される関数を定義するプレースホルダーです。<br>\
                 * デフォルトでは0を返します。
                 */
                this.func = function () {
                    return 0;
                };
            }
        }

        /**
         * @class sceneConfig.sel_menu
         * @classdesc
         * ON/OFF選択式のメニュー項目を管理するクラスです。<br>\
         * 項目名とメッセージ、有効/無効の選択ボタンを生成し、<br>\
         * 選択結果に応じて表示を更新します。
         */
        class sel_menu {
            constructor() {

                let res;
                let bl = [];
                this.button = bl;

                let tmes;
                let tmsx;
                let tmsy;
                /**
                 * @method
                 * @param {boolean} num 初期選択状態(default)
                 * @param {string} s ボタンタイトル
                 * @param {string} msg メッセージ
                 * @param {number} x ボタン位置
                 * @param {number} y ボタン位置
                 * @param {number} msx メッセージ位置
                 * @param {number} msy メッセージ位置
                 * @description
                 * メニュー項目を設定します。<br>\
                 * 項目のID、タイトル、表示メッセージ、位置、<br>\
                 * および有効/無効ボタンを定義します。
                 */
                this.setup = function (num, s, msg, x, y, msx, msy) {

                    res = num;

                    tmes = msg;
                    tmsx = msx;
                    tmsy = msy;

                    let m = new btn();
                    m.setup(s, x, y, 120, 16);
                    m.msg = msg;

                    menu.push(m);
                    bl.push(m);

                    for (let j = 0; j < 2; j++) {
                        let m = new btn();
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
                };
                /**
                 * @method
                 * @param {boolean} r 選択結果
                 * @description
                 * メニューの選択結果（`true`または`false`）を設定します。
                 */
                this.set = function (r) {

                    res = r;

                };
                /**
                 * @method
                 * @returns {boolean} 選択状態
                 * @description
                 * メニュー項目の選択状態を処理し、選択結果を返します。<br>\
                 * 選択されたボタンに応じて、内部の`res`値を更新し、<br>\
                 * 画面上の表示（"有効" or "無効"）をリアルタイムで更新します。
                 */
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

                        let restxt = (bl[1].select || bl[2].select) ? "-" : ((res) ? "有効" : "無効");

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
                };
            }
        }
        /**
         * @class sceneConfig.sel_number
         * @classdesc
         * 数値選択式のメニュー項目を管理するクラスです。<br>\
         * 項目名とメッセージ、-1と+1の増減ボタンを生成し、<br>\
         * 選択結果に応じて表示を更新します。
         */
        class sel_number {
            constructor() {

                let res;
                let bl = [];
                this.button = bl;

                let tmes;
                let tmsx;
                let tmsy;
                let ts;
                /**
                 * @method
                 * @param {number} num 初期値(default)
                 * @param {string} s ボタンタイトル
                 * @param {string} msg メッセージ
                 * @param {number} x ボタン位置
                 * @param {number} y ボタン位置
                 * @param {number} msx メッセージ位置
                 * @param {number} msy メッセージ位置
                 * @description
                 * 数値選択メニュー項目を設定します。<br>\
                 * 項目のID、タイトル、表示メッセージ、位置、<br>\
                 * および数値増減ボタン（-1, +1）を定義します。
                 */
                this.setup = function (num, s, msg, x, y, msx, msy) {

                    res = num;

                    ts = s;
                    tmes = msg;
                    tmsx = msx;
                    tmsy = msy;

                    let m = new btn();
                    m.setup(s, x, y, 120, 16);
                    m.msg = msg;

                    menu.push(m);
                    bl.push(m);

                    for (let j = 0; j < 2; j++) {
                        let m = new btn();
                        m.setup((j == 0) ? "  -1" : "  +1",
                            x + 160 + 80 * j, y, 80, 16);
                        m.msg = msg; //; + ((j == 0) ? "有効" : "無効");
                        m.sw = (j == 0) ? -1 : 1;
                        m.num = num;

                        menu.push(m);
                        bl.push(m);
                    }
                };
                /**
                 * @method
                 * @param {number} r 
                 * @description
                 * 数値の選択結果（`r`）を設定し、表示を更新します。<br>\
                 * これにより、メニューに表示される数値が変更されます。
                 */
                this.set = function (r) {

                    res = r;
                    bl[0].title = ts + res;

                };
                /**
                 * @method
                 * @returns {number} 選択値
                 * @description
                 * 数値選択の結果を処理し、選択された数値（`res`）を返します。<br>\
                 * 増減ボタンがクリックされた場合、`res`を更新し、<br>\
                 * 画面上の表示をリアルタイムで更新します。
                 */
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
                        text.kprint(tmes + res, tmsx, tmsy);
                        text.draw();
                    }
                    return res;
                };
            }
        }

        const menu = [];
        const mttl = ["LampUse.", "MapUse.", "ItemReset.", "ShotFree.", "SoundTest.", "StartStage.", "DebugStatus", "BulletErace"];
        const w_message = ["面の開始からランプを所持する:", "面の開始から地図を所持する:",
            "死んだときにアイテム放出する:", "弾を消費しない。:", "サウンドテスト : ", "開始面 : ", "デバッグステータス表示:", "画面外からの弾を消す:"];
        const mtyp = [0, 0, 0, 0, 1, 1, 0, 0]; //menu type 0:select 1:number

        w_number[5] = 1; //開始面初期値

        const confmenu = [];

        const menu_x = 60;
        const menu_y = 108;

        for (let i = 0; i < mttl.length; i++) {

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

        let m = new btn();
        m.setup("Import.", 100, 280, 120, 16);
        m.msg = "キーアサイン設定をインポート";
        m.func = function () {
            //save_on = true;
            //state.Config.import();
            text.kprint("（入力不能になるので無効）", 100, 288);

            keylock = true;
            return 0;
        };
        menu.push(m);

        m = new btn();
        m.setup("Export.", 100, 300, 120, 16);
        m.msg = "キーアサイン設定をエクスポート";
        m.func = function () {
            //reset_on = true;
            state.Config.export(state.Config.keyAn);
            text.kprint("現在のキーアサイン設定をエクスポートしました", 100, 308);
            keylock = true;
            return 0;
        };
        menu.push(m);

        m = new btn();
        m.setup("Save.", 100, 320, 120, 16);
        m.func = function () {
            save_on = true;
            keylock = true;
            return 0;
        };
        menu.push(m);

        m = new btn();
        m.setup("Reset.", 100, 340, 120, 16);
        m.func = function () {
            reset_on = true;
            keylock = true;
            return 0;
        };
        menu.push(m);

        m = new btn();
        m.setup("Exit.", 100, 364, 120, 16);
        m.jp = state.Constant.scene.TITLE; //Return Scene
        m.func = function () {
            return this.jp;
        };
        menu.push(m);

        //処理部
        /**
         * @method
         * @description
         * シーンの初期化処理を実行します。<br>\
         * ゲームの設定をロードし、各設定項目に対応する初期値を準備します。
         */
        this.init =()=>{
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
        /**
         * @method
         * @description
         * 設定シーンの状態をリセットし、UIを初期状態に戻します。<br>\
         * 背景描画の停止、メニューボタンのリセット、設定値の再設定などを行います。
         */
        this.reset =()=>{
            dev.pauseBGSP();
            //dev.graphics[0].setInterval(0);//BG　WORK2
            //dev.graphics[1].setInterval(0);//SPRITE
            //dev.graphics[2].setInterval(0);//FG
            for (let i in menu) {
                menu[i].sel = false;
                menu[i].lamp = false;
            }

            //wipef = false;
            //wipecnt = 0;
            //let cur_cnt = 0;

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
        /**
         * @method
         * @param {Screen} g dev.graphics[x] 
         * @param {inputMainTask} input input 
         * @returns {number} sceneSelectNumber
         * @description
         * 設定画面の入力処理とUIの更新ロジックです。<br>\
         * キーボード入力（方向キー、決定キーなど）を検出し、<br>\
         * メニュー選択の移動、設定値の変更、セーブ/リセット/終了などのアクションを実行します。
         */
        this.step =(g, input)=>{

            wtxt = [];

            let zkey = input.trigger.weapon; //false;
            let lkey = false;
            let rkey = false;

            const c = input; 

            if (!keylock) {
                if (c.left) { // <-
                    lkey = true;
                    keywait = 10;
                }
                if (c.right) { // ->
                    rkey = true;
                    keywait = 10;
                }
                if (c.up) { //↑
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
                if (c.down) { //↓
                    menusel++;

                    if (menusel < mttl.length * 3) {
                        menusel++;
                        menusel++;
                    }
                    if (menusel > menu.length - 1) menusel = 0;
                    keylock = true;
                    keywait = 10;
                    text.reset();
                    text.clear();
                    text.draw();
                }
                if (keylock) {
                    dev.sound.effect(state.Constant.sound.CURSOR);
                }
            }

            if ((zkey || (lkey || rkey)) && (!keylock)) {
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
            if ((!zkey) && (keywait == 0)) keylock = false;

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
                if ((w_number[4] >= 0) && (w_number[4] < 18)) { //Sound No 
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
                text.kprint("設定初期化しました。", 100, 348);

                if (Boolean(localStorage)) {
                    localStorage.clear();
                    text.kprint("ローカルストレージクリア。", 100, 356);
                } else {
                    text.kprint("ローカルストレージが使用できない?", 100, 356);
                }
                text.draw();
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
                    text.kprint("設定をセーブしました。", 100, 328);
                } else {
                    text.kprint("ローカルストレージが使用できない?", 100, 328);
                }
                text.draw();
                //text.reset();
                save_on = false;
            }
            return 0;
            //進行
        }
        /**
         * @method
         * @description
         * 設定画面のUI要素を描画します。<br>\
         * メニュー項目、選択ランプ、ボタン、およびセーブ/リセット時のメッセージなどを表示します。
         */
        this.draw =()=>{

            for (let s in wtxt) {
                //UI.putchr(wtxt[s], 0, 60 + 16 * s);
                UI.kprint(wtxt[s], 0, 60 + 16 * s);
            }

            for (let i in menu) {
                if (menu[i].lamp) {
                    UI.fill(menu[i].x, menu[i].y, menu[i].w, menu[i].h, "orange");
                }

                if (menu[i].select) {
                    if (!menu[i].lamp) UI.fill(menu[i].x - 10, menu[i].y - 1, menu[i].w, 8, "blue");
                    UI.kprint(menu[i].title, menu[i].x - 4, menu[i].y - 1);
                } else {
                    UI.kprint(menu[i].title, menu[i].x, menu[i].y);
                }
            }
            keyassignDisplay(424, 100);

        }

        function keyassignDisplay(x, y){

            const keyAn = state.Config.keyAn;

            let st = [];

            st.push("KeyAssignMap(KeyCode)");
            st.push("---------------------");

            if (keyAn instanceof Object) {

                let o = Object.entries(keyAn);

                o.forEach(function (element) {
                    let w = String(element).split(",");
                    let s = w[0];
                    if (s.length < 13) {
                        s = s + " ".repeat(10);
                        s = s.substring(0, 10);
                    }
                    let s2 = "";
                    for (let i = 1; i<w.length; i++){s2 = s2 + w[i] + ","}
                    st.push("." + s + ":" + s2);
                });
            }

            for (let i in st){
                UI.kprint(st[i], x, y + i*10);
            }
        }
    }
}

