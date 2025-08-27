//Scene
//
/**
 * @class
 * @classdesc
 * ステータス表示画面を管理するシーンです。<br>\
 * ゲーム内の全てのオブジェクトリスト、プレイヤーの詳細情報、<br>\
 * および所持アイテムを表示し、デバッグや情報確認に利用されます。
 */
class sceneStatusDisp {
    /**
     * @constructor
     * @param {stateControl} state
     * @description
     * `sceneStatusDisp`インスタンスを初期化します。<br>\
     * メニュー表示フラグやデバッグモードフラグ、キーロック変数などを準備します。
     */
    constructor(state) {

        const dev = state.System.dev;
        //宣言部
        const UI_layer = dev.graphics[state.Constant.layer.UI];

        //let keys = dev.key_state;
        this.reset_enable = true;

        let menuvf = false;
        let keywait = 10;

        let sel = 0;
        let inp = 1;
        let maxpage = 1;

        /**
         * 
         * @param {number} page 選択ページ
         * @param {boolean} invt inventory:true / property:false
         * @description
         * 現在のゲーム内のオブジェクトリストを画面に描画します。<br>\
         * ページングと選択カーソルに対応し、デバッグモードでは詳細情報も表示します。 
         */
        function list_draw(page, invt) {
            if (page < 1) page = 1;

            let st = state.obUtil.list();

            maxpage = Math.floor(st.length / 200) + 1;
            //let s = "Tp,objX,objY,s,Mp / Num:" + st.length;
            if (page > maxpage) page = maxpage;

            sel = ((page - 1) * 200) + (sel % 200);
            if (sel > st.length) sel = st.length - 1;

            let s = "No:Type,view,hp,status,Mp,chr / Num:" + st.length
                + " PAGE:[" + page + "]/" + maxpage
                + ":SELECT:[" + sel + "] ";
            if (invt) {
                s = s + "Inventory";
            } else {
                s = s + "Property";
            };
            //type, inview, inworld, status,mp,chr
            let c = 0;

            UI_layer.reset();
            UI_layer.clear();

            //UI_layer.putchr8(s, 0,0 );
            UI_layer.kprint(s, 0, 0);
            for (let i in st) {

                if (i >= (page - 1) * 200) {
                    let s = st[(page - 1) * 200 + i % 200];
                    let x = Math.floor(c / 50) * 160;
                    let y = (c % 50) * 8 + 8;

                    if (invt) {
                        if (state.obUtil.lookpick(UI_layer, i, x + 48 + 8, y)) {
                            s = s.substring(0, 8);
                        }
                    }
                    UI_layer.kprint(s, x, y);

                    if (i != sel) {
                        //UI_layer.putchr8(s ,x ,y );
                    } else {
                        //UI_layer.putchr("["+st[(page-1)*200 + i%200]+"]",Math.floor(c/50)*160,(c%50)*8+8);
                        //UI_layer.putchr8c(s,x ,y ,2 );
                        const bar = {};

                        bar.x = x;
                        bar.y = y;
                        bar.l = s.length; //st[(page-1)*200 + i%200].length;s.length;

                        bar.draw = function (device) {
                            device.beginPath();
                            device.fillStyle = "navy";
                            device.lineWidth = 1;
                            device.fillRect(this.x, this.y, this.l * 6, 8);
                            device.stroke();

                            device.beginPath();
                            device.strokeStyle = "white";
                            device.lineWidth = 1;
                            device.rect(this.x, this.y, this.l * 6, 8);
                            device.stroke();
                        };
                        UI_layer.putFunc(bar);
                        //UI_layer.putchr8c(s,x ,y ,2 );
                        UI_layer.kprint(s, x, y);
                    }
                    c++;
                    if (c > 200) break;
                }
            }
            UI_layer.draw();
        }
        /**
         * @param {number} num selectnumber 
         * @description
         * 指定されたインデックスのオブジェクトの詳細なプロパティを画面に描画します。<br>\
         * オブジェクトの画像、プロパティリスト、所持アイテムなどを表示します。
         */
        function obj_draw(num) {

            const COL = 49;

            let c = 0;

            UI_layer.reset();
            UI_layer.clear();

            let s = "== ObjectNo.[" + num + "] ==";
            UI_layer.putchr8(s, 0, 0);

            let st = state.obUtil.lookObj(num);
            for (let i in st) {
                let s = String(st[i]);

                if (!s.includes("object") && !s.includes("function")) {
                    UI_layer.putchr8(String(st[i]).substring(0, 39), Math.floor(c / COL) * 320, (c % COL) * 8 + 8);
                    c++;
                }
                if (c > 100) break;
            }

            state.obUtil.lookObjv(UI_layer, num, 240, 80);

            if (state.obUtil.lookpick(UI_layer, num, Math.floor(c / COL) * 320 + 8, ((c + 2) % COL) * 8 + 16)) {
                UI_layer.putchr8("pickitem/thisitem", Math.floor(c / COL) * 320 + 8, ((c + 1) % COL) * 8 + 8);
            };

            UI_layer.draw();
        }

        //処理部
        /**
         * @method
         * @description
         * シーンの初期化処理を実行します。<br>\
         * オブジェクト選択インデックス`sel`を0に設定します。
         */
        this.init = ()=> {
            //初期化処理
            sel = 0;
        }
        /**
         * @method
         * @description
         * テータス表示シーンの状態をリセットし、描画を準備します。<br>\
         * 背景描画を停止し、UIレイヤーの自動更新も停止して、<br>\
         * オブジェクトリストの初期表示を行います。
         */
        this.reset = ()=> {

            dev.pauseBGSP();
            UI_layer.setInterval(0); //UI

            //ret_code = 0;

            list_draw(1);
        }
        /**
         * @method
         * @param {GameCOre} g 
         * @param {inputResult} input 
         * @returns returncode normal=0
         * @description
         * ステータス表示画面の入力処理と表示内容の切り替えロジックです。<br>\
         * キーボード入力（Z, C, V, 数字キー、矢印キー）を検出し、<br>\
         * 画面遷移、表示クリア、インベントリ表示切り替え、オブジェクト選択、ページ切り替えなどを実行します。
         */
        this.step = (g, input)=> {

            keywait--;
            if (keywait > 0) return 0;

            // input key section
            let kstate = input.keycode; //dev.key_state.check();

            let zkey = input.trigger.weapon; //exit button
            //if (Boolean(kstate[90])) { //[z]
            //zkey = input.weapon;
            //}
            //if (Boolean(kstate[32])) { //[space]
            //    if (kstate[32]) zkey = true;
            //}

            let ckey = input.trigger.jump;//false; //dispalyclear
            if (Boolean(kstate[67])) {
                if (kstate[67]) { //ckey↓
                    ckey = true;
                }
            }

            let vkey = input.vkey;//false; //inventry_view
            if (Boolean(kstate[86])) {
                if (kstate[86]) { //vkey↓
                    vkey = true;
                }
            }

            //let numkey = false; //menu select num
            //let arrowkey = false; //list select 
            //for (let i in kstate) {
            //    if (Boolean(kstate[i])) {
                    let numkey = (input.numkey != -1)? true: false;//((i >= 48) && (i <= 57)) ? true : false; //Fullkey[0]-[9]
                    let arrowkey = (input.up || input.down || input.left || input.right) ? true : false; //Arrowkey
            //    }
            //}

            if (zkey || ckey || vkey || numkey || arrowkey) keywait = 8;

            // select key function section
            if (zkey) {
                UI_layer.reset();
                UI_layer.clear();
                UI_layer.draw();
                return state.Constant.scene.PAUSE; //return scenePause
            }

            if (ckey) {
                dev.clearBGSP();
                list_draw(inp, menuvf);
            }

            if (vkey) {
                menuvf = !menuvf;
                list_draw(inp, menuvf);
                //inv_draw(inp);
            }

            if (numkey) {
                inp = Number(input.numkey)//-1;
                //for (let i in kstate) {
                //    if (Boolean(kstate[i])) {
                //        inp = i - 48;
                //        break;
                //    }
                //}
                if (inp == 0) {
                    obj_draw(sel);
                } else {
                    list_draw(inp, menuvf);
                }
            }

            if (arrowkey) {
                let s = sel;
                for (let i in kstate) {
                    if (Boolean(kstate[i])) {
                        s = s + ((input.left) ? -50 : 0) //leftkey 
                            + ((input.up    ) ? -1 : 0) //upkey
                            + ((input.right ) ? +50 : 0) //rightkey
                            + ((input.down  ) ? +1 : 0); //downkey
                    }
                }
                if (s < 0) s = 0;
                //if (s > maxpage) s = maxpage;
                sel = s;
                //obj_draw(sel);
                list_draw(inp, menuvf);

            }
            return 0;
            //進行
        }
        /**
         * @method
         * @description
         * ステータス表示画面のUI要素を描画します。
         */
        this.draw = ()=>{
            //UI_layer.reset();
        }
    }
}
