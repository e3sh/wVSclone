//Scene(result)
//
/**
 * @class
 * @classdesc
 * レベルアップ画面を管理するシーンです。<br>\
 * プレイヤーがレベルアップした際に表示され、<br>\
 * ステータス強化の選択肢を提示し、プレイヤーの選択に基づいて能力値を向上させます。
 */
class sceneLvUp {
    /**
     * @constructor
     * @param {stateControl} state GameCore.state 
     * @description
     * `sceneLvUp`インスタンスを初期化します。<br>\
     * ガイドカーソルのインスタンスを準備します。
     */
    constructor(state) {

        const dev = state.System.dev;
        //宣言部
        const UI_layer = dev.graphics[state.Constant.layer.UI];
        const BUI_layer = dev.graphics[state.Constant.layer.BUI];

        //let keys = dev.key_state;
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
        let wtxt;

        let ret_code;

        let diag;
        let dexef;

        //let stbar;
        let guide_cursor;

        //処理部
        /**
         * @description
         * シーンの初期化処理を実行します。<br>\
         * ガイドカーソルを準備します。
         */
        function scene_init() {
            //初期化処理
            guide_cursor = new arrowGuideCursor();
        }
        /**
         * @description
         * レベルアップシーンの状態をリセットし、描画を準備します。<br>\
         * 背景描画を停止し、レベルアップ選択肢のダイアログを初期化します。
         */
        function scene_reset() {

            ret_code = 0;

            //BUI_layer.clear();
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
                    device.strokeStyle = "darkblue";

                    device.stroke();
                }
            };
            //ゲーム画面の描画を停止(Flip/Drawを自動で実行するのを停止)
            dev.pauseBGSP();

            BUI_layer.putFunc(o);
            BUI_layer.draw();

            state.scene.pauseTCW(); //TweenOpenCloseWindow Effect動作抑止

            let dpara = [
                {
                    keynum: 38, text: ["0.5s Ext.", (5 + state.Game.player.base.VIT * 0.5) + "s->" + (5 + (state.Game.player.base.VIT + 1) * 0.5) + "s"],
                    icon: "BallS1", barcolor: "cyan",
                    func: {
                        call: function (p) {
                            //state.Game.player.spec.VIT++;
                            state.Game.player.base.VIT++;
                            ret_code = p;
                        }, p: 1
                    },
                    x: -35, y: -25 - 55, w: 70, h: 50, keyon: false, select: false, curpos: 1
                } //upkey
                ,
                {
                    keynum: 37, text: [" Heal+1", " " + (3 + state.Game.player.base.MND) + " -> " + (3 + state.Game.player.base.MND + 1)],
                    icon: "BallL1", barcolor: "limegreen",
                    func: {
                        call: function (p) {
                            //state.Game.player.spec.MND++;
                            state.Game.player.base.MND++;
                            ret_code = p;
                        }, p: 1
                    },
                    x: -35 - 80, y: -25, w: 70, h: 50, keyon: false, select: false, curpos: 8
                } //left
                ,
                {
                    keynum: 39, text: ["Damage+2", " " + (10 + state.Game.player.base.INT * 2) + "-> " + (10 + (state.Game.player.base.INT + 1) * 2)],
                    icon: "BallB1", barcolor: "orangered",
                    func: {
                        call: function (p) {
                            //state.Game.player.spec.INT++;
                            state.Game.player.base.INT++;
                            ret_code = p;
                        }, p: 1
                    },
                    x: -35 + 80, y: -25, w: 70, h: 50, keyon: false, select: false, curpos: 2
                } //right
            ];

            diag = new DialogControl(dpara);
            dexef = false;

            //stbar = new statusBarMeter(["cyan","orange","limegreen","white"]);
            keylock = false;

            guide_cursor.param(1 | 2 | 0 | 8);
        }
        /**
         * 
         * @param {Screen} g dev.graphics[x] 
         * @param {inputMainTask} input inputStatusObject 
         * @returns {number} sceneReturnStatus
         * @description
         * レベルアップ画面の入力処理とステータス強化ロジックです。<br>\
         * キーボード入力で選択肢を操作し、選択された能力値を強化します。
         */
        function scene_step(g, input) {
            //進行
            wtxt = [];
            let kstate = input.keycode; //keys.check();

            let zkey = false; if (Boolean(kstate[90])) { if (kstate[90]) zkey = true; }
            let xkey = false; if (Boolean(kstate[88])) { if (kstate[88]) xkey = true; }
            let ckey = false; if (Boolean(kstate[67])) { if (kstate[67]) ckey = true; }

            let esckey = false; if (Boolean(kstate[27])) { if (kstate[27]) esckey = true; }

            zkey = zkey || xkey || ckey; //any key


            // Select時にWASDが効かないことへの対策コード
            let dc = input; //dev.directionM( kstate );
            if (dc.up) kstate[38] = true;
            if (dc.down) kstate[40] = true;
            if (dc.left) kstate[37] = true;
            if (dc.right) kstate[39] = true;

            if (diag.step(kstate) == 0) keylock = true;

            BUI_layer.draw();
            BUI_layer.reset();

            wtxt.push("LevelUp#" + state.Game.player.spec.ETC);
            wtxt.push("= SELECT =");

            diag.setStatusArray([
                state.Game.player.base.VIT,
                state.Game.player.base.MND, //順番注意
                state.Game.player.base.INT
            ]);

            if (keylock && !dexef && diag.step(kstate) == 1) {
                diag.exec();
                keylock = false;
                dexef = true;
            }

            if (ret_code != 0) diag.effect();

            if (diag.step(kstate) == 0) {
                if (ret_code != 0) {
                    dev.resumeBGSP();

                    state.obUtil.keyitem_enhance_check();

                    let w = state.obUtil.player_objv(UI_layer);
                    diag.close(dev.graphics[2], w.x, w.y, 20);

                    state.scene.resumeTCW();

                    return ret_code;
                }
            }
            return 0;
        }

        /**
         * @description
         * レベルアップ画面のUI要素を描画します。<br>\
         * プレイヤーのイラスト、ステータス強化選択肢のダイアログ、<br>\
         * およびガイドカーソルを表示します。
         */
        function scene_draw() {

            let w = state.obUtil.player_objv(UI_layer);

            UI_layer.fill(w.x - 120, w.y - 100, 240, 200, 0);

            state.obUtil.player_objv(UI_layer);

            diag.draw(UI_layer, w.x, w.y);

            for (let s in wtxt) {
                UI_layer.putchr8(wtxt[s], w.x - 35, w.y + 16 * s + 32);
            }
            //stbar.draw(UI_layer, w.x -35, w.y + 48);
            guide_cursor.draw(UI_layer, w.x, w.y, 32);

            //表示
        }

        /**
         * @class
         * @classdesc
         * レベルアップ画面で能力値強化の選択肢を提供するダイアログ形式のUIを管理します。<br>\
         * 選択肢の表示、入力検出、選択された能力値の強化実行を制御します。
         */
        class DialogControl {
            constructor(mlist) {

                const FLCOLOR = "White";
                let menulist = mlist;
                let status = [];
                /**
                 * @method
                 * @param {object[]} ary
                 * @description
                 * ダイアログ内で表示するステータス値の配列を設定します。
                 */
                this.setStatusArray = function (ary) {
                    status = ary;
                };
                /**
                 * @method
                 * @param {keystate} keystate 
                 * @returns {number}
                 * @description
                 * ダイアログの入力処理を1ステップ実行します。<br>\
                 * キーボード入力に応じて選択肢の状態を更新し、選択されている項目数を返します。
                 */
                this.step = function (keystate) {

                    let c = 0;

                    for (let i in menulist) {

                        let m = menulist[i];

                        if (Boolean(keystate[m.keynum])) {
                            menulist[i].keyon = (keystate[m.keynum]) ? true : false;

                            //if (m.keyon) m.func();        
                            if (menulist[i].keyon) c++;

                        } else menulist[i].keyon = false;
                    }

                    return c;
                };
                /**
                 * @method
                 * @description
                 * 現在選択されている（キーが押されている）オプションに関連する関数を実行します。<br>\
                 * 選択されたオプションのテキストを「GET_STAT」に変更し、選択済みフラグを立てます。
                 */
                this.exec = function () {
                    for (let i in menulist) {
                        let m = menulist[i];
                        if (m.keyon) {
                            m.func.call(m.func.p);
                            menulist[i].text[1] = "GET_STAT";
                            menulist[i].select = true;

                            guide_cursor.param(m.curpos);
                        }
                    }
                    //FLCOLOR = "Navy";
                };
                /**
                 * @method
                 * @description
                 * ダイアログの視覚エフェクトを更新します。<br>\
                 * 選択されたオプションのボタンサイズをアニメーションで変化させます。
                 */
                this.effect = function () {

                    for (let i in menulist) {
                        if (menulist[i].keyon) {
                            //if (menulist[i].w >0){ menulist[i].w--;}
                            if (menulist[i].h > 0) { menulist[i].h--; }
                        }
                    }
                };
                /**
                 * @method
                 * @param {Screen} device 
                 * @param {number} x 
                 * @param {number} y 
                 * @param {number} count 
                 * @description
                 * ダイアログを閉じるアニメーションを設定します。<br>\
                 * 各選択肢に対応する矩形領域が徐々に消える視覚効果を生成します。
                 */
                this.close = function (device, x, y, count) {

                    for (let i in menulist) {

                        let m = menulist[i];
                        state.scene.setTCW(device, { x: x + m.x, y: y + m.y, w: m.w, h: m.h }, count);
                    }
                };
                /**
                 * @method
                 * @param {Screen} device 
                 * @param {number} x 
                 * @param {number} y 
                 * @description
                 * ダイアログとその選択肢を画面に描画します。<br>\
                 * 各選択肢のボタン、テキスト、アイコン、そしてステータスバーを表示します。
                 */
                this.draw = function (device, x, y) {

                    for (let i in menulist) {

                        let m = menulist[i];

                        //if (m.keyon) {
                        let o = { x: x + m.x, y: y + m.y, w: m.w, h: m.h };
                        o.draw = function (device) {
                            device.beginPath();
                            device.fillStyle = (m.select) ? "orange" : (m.keyon) ? "steelblue" : "blue";
                            device.fillRect(this.x, this.y, this.w, this.h);

                            //device.beginPath();
                            if (!m.select) {
                                device.strokeStyle = FLCOLOR;
                                device.strokeRect(this.x, this.y, this.w, this.h);
                            }
                        };
                        device.putFunc(o);

                        for (let i in m.text)
                            device.putchr8(m.text[i], x + m.x + 2, y + m.y + 20 + i * 8);

                        device.put(m.icon, x + m.x + 10, y + m.y + 10);

                        if (Boolean(status[i])) {
                            for (let j = 0; j < status[i]; j++) {
                                device.fill(x + m.x + 20 + j * 4, y + m.y + 10, 3, 6, m.barcolor);
                            }
                        }
                    }
                };
            }
        }
        /**
         * @class
         * @classdesc
         * 選択可能な方向を視覚的にガイドするための矢印を描画するクラスです。<br>\
         * 指定された方向にアニメーションするカーソルを表示します。
         */
        class arrowGuideCursor {
            constructor() {

                let view = 0;

                let vx = [0, 1, 0, -1];
                let vy = [-1, 0, 1, 0];
                let vr = [0, 90, 180, 270];
                //let vr = [270,  0, 90,180 ];
                /**
                 * @method
                 * @param {number} num
                 * @description
                 * ガイド矢印の表示方向を数値ビットで設定します。
                 * @example
                 * 1=N, 2=E, 4=S, 8=W のようにビットフラグで制御します。
                 */
                this.param = function (num) { view = num; };
                /**
                 * @method
                 * @param {Screen} device 
                 * @param {number} x 
                 * @param {number} y 
                 * @param {number} r 
                 * @description
                 * 設定された方向に、アニメーションするガイド矢印を画面に描画します。
                 */
                this.draw = function (device, x, y, r) {
                    //view NESW bit:0123 bit on Draw
                    for (let i in vx) {
                        let w = Math.trunc(state.System.time() / 100) % 5;

                        if ((view & Math.pow(2, i)) != 0) {
                            device.put("cursorx", //"cursorx",
                                x + vx[i] * (r + w),
                                y + vy[i] * (r + w),
                                0,
                                vr[i]
                            );
                        }
                    }
                };
            }
        }
    }
}