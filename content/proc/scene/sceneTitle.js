//Scene
//
/**
 * @class
 * @classdesc
 * タイトル画面を管理するシーンです。<br>\
 * 新規ゲーム開始、中断セーブデータのロード、ゲーム設定（コンフィグ）などの<br>\
 * 選択肢をユーザーに提示します。
 */
class sceneTitle {
    /**
     * @constructor
     * @param {*} state
     * @description
     * `sceneTitle`インスタンスを初期化します。<br>\
     * 「NewGame」「LoadGame」「Config」の各メニューボタンを準備し、<br>\
     * それぞれの遷移先シーンを設定します。 
     */
    constructor(state) {

        const dev = state.System.dev;
        //宣言部
        const UI_layer = dev.graphics[state.Constant.layer.UI];
        const BUI_layer = dev.graphics[state.Constant.layer.BUI];
        
        /**
         * @method
         */
        this.init = scene_init;
        /**
         * @method
         */
        this.reset = scene_reset;
        /**
         * @method
         */
        this.step = scene_step;
        /**
         * @method
         */
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

        let itemV;

        const DSP_X = 320;
        const DSP_Y = 112;

        let menu = [];
        let mttl = ["NewGame", "LoadGame", "Config"];
        let mjmp = [state.Constant.scene.MAIN, state.Constant.scene.MAIN + 10, state.Constant.scene.CONFIG];

        for (let i = 0; i < mttl.length; i++) {
            let m = {};
            m.title = mttl[i];
            m.x = 320 - 50;
            m.y = 260 + i * 20 + 32;
            m.w = 120;
            m.h = 16;
            m.jp = mjmp[i];
            m.sel = false;
            m.func = function () {

                return this.jp;
            };
            menu.push(m);
        }

        //let cnt;
        let tsel = new Number(0.0);
        //処理部
        /**
         * @description
         * シーンの初期化処理を実行します。<br>\
         * アニメーション用のカウンターを初期化します。
         */
        function scene_init() {
            tsel = 0.0;

            //初期化処理
        }
        /**
         * @description
         * タイトルシーンの状態をリセットし、描画を準備します。<br>\
         * 背景描画をクリアし、キャラクターや武器の画像を配置し、<br>\
         * メニューボタンの状態とセーブデータ情報を更新します。
         */
        function scene_reset() {

            state.Config.load();

            dev.pauseBGSP();
            dev.graphics[state.Constant.layer.UI].setInterval(1); //UI //
            //TitleにはすべてのSceneから戻ってくる可能性があるので画面状態が分からない。手動にした画面を一度クリア。
            dev.clearBGSP();

            for (let i in menu) {
                menu[i].sel = false;
            }

            wipef = false;
            wipecnt = 0;
            //let cur_cnt = 0;
            ret_code = 0;

            BUI_layer.reset();
            BUI_layer.clear("black");

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

            BUI_layer.put("Mayura1", DSP_X - 32, DSP_Y + 40);
            BUI_layer.put("Unyuu1", DSP_X - 32, DSP_Y + 72);
            BUI_layer.put("Unyuu3", DSP_X - 32 - 32, DSP_Y + 72);
            BUI_layer.put("Key", DSP_X - 50 + 16, DSP_Y + 104);

            BUI_layer.putchr("Player", DSP_X, DSP_Y + 40);
            BUI_layer.putchr("Enemy", DSP_X, DSP_Y + 72);
            BUI_layer.putchr("Key", DSP_X, DSP_Y + 100);

            BUI_layer.put("TitleLogo", DSP_X, DSP_Y);
            BUI_layer.kprint("土日ダンジョン　令和版", DSP_X + 50, DSP_Y + 20);

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

            psel = { mode: 0, x: 0 };

            //savedata check
            let res = state.Game.preload();
            if (res.load) {
                let t = state.Game.dataview2(res);
                for (let i in t) {
                    BUI_layer.kprint(t[i], 8, i * 8 + 8);
                }
                BUI_layer.draw();
            }

            itemV = new titleItemListMap(state);
            //cnt = 0;
            //dev.sound.change(0);
            //reset処理を記述予定
        }
        /**
         * 
         * @param {*} g 
         * @param {*} input 
         * @returns 
         * @description
         * タイトル画面の入力処理と画面遷移ロジックです。<br>\
         * キーボード入力（方向キー、決定キーなど）を検出し、<br>\
         * メニュー選択の移動、および選択されたアクション（ゲーム開始、ロード、コンフィグ）を実行します。
         */
        function scene_step(g, input) {

            BUI_layer.draw();

            wtxt = [];

            let zkey = input.trigger.weapon;

            if (!keylock) {

                const c = input; //dev.directionM( kstate );

                if (c.up || c.down || c.left || c.right) {
                    if (c.up) { //↑
                        menusel--;
                        if (menusel < 0) menusel = menu.length - 1;
                    }

                    if (c.down) { //↓
                        menusel++;
                        if (menusel > menu.length - 1) menusel = 0;
                    }

                    if (c.left) { // <-
                        psel.mode = 0;
                    }

                    if (c.right) { // ->
                        psel.mode = 1;
                        psel.x += 2;
                    }
                    keylock = true;
                    keywait = 10;
                }

                if (keylock) {
                    dev.sound.effect(state.Constant.sound.CURSOR);
                }

            }

            if ((zkey) && (!keylock)) {

                for (let i in menu) {

                    if (menu[i].sel) {
                        let n = menu[i].func();
                        //dev.sound.change(0);
                        //dev.sound.play(0);
                        if (n != 0) {
                            wipef = true;
                            state.Game.mode = psel.mode;
                            ret_code = n;
                        }
                    }
                }
            }
            if (keywait > 0) keywait--;

            if ((!zkey) && (keywait == 0)) keylock = false;

            if (wipef) {
                return ret_code;
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
        /**
         * @description
         * タイトル画面のUI要素を描画します。<br>\
         * メニューボタン、キャラクターの画像、および「Press key...」のメッセージを表示します。
         */
        function scene_draw() {
            //let bvf = false; //blinkViewFlag 
            //cnt++;
            //if (cnt > 30){
            //    bvf = true;
            //    cnt = (cnt > 90)? 0 : cnt;
            // }
            for (let i in menu) {

                if (menu[i].sel) {

                    let o = {};
                    o.x = menu[i].x - 6;
                    o.y = menu[i].y;
                    o.w = menu[i].w;
                    o.h = menu[i].h;
                    o.draw = function (device) {
                        device.beginPath();
                        device.fillStyle = "orange";
                        device.fillRect(this.x, this.y, this.w, this.h);
                    };
                    UI_layer.putFunc(o);

                    UI_layer.putchr(menu[i].title, menu[i].x - 4, menu[i].y - 1);

                } else {
                    UI_layer.putchr(menu[i].title, menu[i].x - 4, menu[i].y - 1);
                }
            }

            if (psel.x > 0) {
                if (psel.mode == 1) {
                    if (psel.x < DSP_X - 32 - 32) { psel.x += 6; } else { psel.x = DSP_X - 32 - 32; }
                } else {
                    psel.x -= 6;
                }
                UI_layer.put("Unyuu3", psel.x, DSP_Y + 40 + 16);
            } else {
                psel.x = 0;
            }

            itemV.draw(640 - Math.trunc((psel.x/ (DSP_X - 32 - 32))*100),0);

            if (state.System.blink()) {
                //if (bvf) 
                UI_layer.putchr8("Press <z> key or [Space]key to", 320 - 100 - 8, 270);
            }
            //表示
        }
    }
}

function titleItemListMap(state){

    const UI_layer = state.System.dev.graphics[state.Constant.layer.UI];
    const chPtn = state.Database.chrPattern;
    const mtnPtn = state.Database.motionPattern;
    const ITEM = state.Constant.objtype.ITEM;
    const chItbl = state.Database.chrItemtable;

    const itemTable = [];
    for (let i in chPtn){
        const c = chPtn[i]
        if (c.type == ITEM){
            itemTable.push(c);
        }
    }
    this.draw = function(x, y){
        
        for (let i in itemTable){
            const c = itemTable[i];


            UI_layer.put(mtnPtn[c.mp].pattern[0][0], x+16, y + i*17+16 );
            UI_layer.kprint(`     :${chItbl[c.cn]}`,x,y + i*17+16 );
        }
    }
}