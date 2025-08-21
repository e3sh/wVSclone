// old comversion WGVS対応へ変換対応で残置
//**************************************************************
//deviceControl
//画面表示、入力関係（キーボード、マウス）、サウンド、イメージ
//　を多重定義しないようにまとめて扱うクラス。
//**************************************************************
/**
 * @class
 * @classdesc
 * 旧システムとの互換性維持のため残置された、デバイス制御のファサードクラスです。<br>\
 * 画面表示、入力（キーボード、マウス、ゲームパッド）、サウンド、画像などの機能を集約して扱います。<br>\
 * これを通してゲームのコア機能にアクセスします。
 */
class deviceControl {
    /**
     * @constructor
     * @param {GameCore} g GameCoreインスタンス
     * @description
     * `deviceControl`インスタンスを初期化します。<br>\
     * 各種グラフィックレイヤー、キーボード、マウス、ゲームパッド、<br>\
     * サウンドシステムなどを設定し、ゲームの基盤を構築します。
     */
    constructor(g) {

        const SCREEN_PAGES = g.screen.length;

        const dsp = [];

        for (let i = 0; i < SCREEN_PAGES; i++) {
            dsp[i] = new Screen(g, i);
        }

        const c = new ConstantData();

        const BG    = c.layer.BG;
        const SP    = c.layer.SP; 
        const FG    = c.layer.FG; 
        const BUI   = c.layer.BUI;
        //const UI    = g.Constant.layer.UI;

        dsp[BG].setBackgroundcolor("black");
        this.graphics = dsp;

        /**
         * @method
         * @description
         * 背景（BG）、スプライト（SP）、フォアグラウンド（FG）、UI（BUI）の<br>\
         * 各描画レイヤーの自動更新（クリア）を一時停止します。<br>\
         */
        this.pauseBGSP = function () {
            dsp[BG].setInterval(0);
            dsp[SP].setInterval(0);
            dsp[FG].setInterval(0);
            dsp[BUI].setInterval(0); //BUI pause 
        };
        /**
         * @method
         * @description
         * 背景（BG）、スプライト（SP）、フォアグラウンド（FG）、UI（BUI）の<br>\
         * 各描画レイヤーの自動更新を再開します。<br>\
         */
        this.resumeBGSP = function () {
            dsp[BG].setInterval(1);
            dsp[SP].setInterval(1);
            dsp[FG].setInterval(1);
            dsp[BUI].setInterval(1); //BUI resume
        };
        /**
         * @method
         * @description
         * 背景（BG）、スプライト（SP）、フォアグラウンド（FG）、UI（BUI）の<br>\
         * 各描画レイヤーをリセットし、クリアして再描画します。<br>\
         */
        this.clearBGSP = function () {
            dsp[BG].reset() ; dsp[BG].clear();  dsp[BG].draw();
            dsp[SP].reset() ; dsp[SP].clear();  dsp[SP].draw();
            dsp[FG].reset() ; dsp[FG].clear();  dsp[FG].draw();
            dsp[BUI].reset(); dsp[BUI].clear(); dsp[BUI].draw();
        };

        this.kanji = new fontPrintControl(
            g,
            g.asset.image["KanjiHw"].img, 6, 8,
            g.asset.image["KanjiFw"].img, 12, 8
        );

        this.gs = new geometoryTrance();
        this.layout = new gameLayout();

        this.mouse_state = g.mouse;
        this.gpad_state = g.gamepad;
        this.sound = new soundCntl(g.asset.sound);

        this.game = g;

        let userinput = new mixuserinput(g);
        this.key_state = userinput;

        /**
         * @method
         * @param {keyState} keystate キー入力状態
         * @returns {object} cursor {up:boolean, down:boolean, right:boolean, left:boolean} 
         * @description
         * キーボードの状態を解析し、方向キー入力（上下左右）を抽出します。<br>\
         * 矢印キー、WASD、テンキーの入力に対応しています。
         * @todo code/keycode select
         */
        this.directionM = function (keystate) {

            const cmap = [
                38, 40, 37, 39, //↑, ↓, ←, →
                87, 83, 65, 68, //W, S, A, D
                104, 98, 100, 102 //8, 2, 4, 6 (TenKey)
            ];
            let result = [];
            for (let i in cmap) {
                if (Boolean(keystate[cmap[i]])) {
                    result[i] = (keystate[cmap[i]]) ? true : false;
                } else {
                    result[i] = false;
                }
            }
            return {
                up: result[0] || result[4] || result[8],
                down: result[1] || result[5] || result[9],
                left: result[2] || result[6] || result[10],
                right: result[3] || result[7] || result[11],
            };
        };

        /**
         * 
         * @param {GameCore} g GameCoreインスタンス
         * @description
         * mixUserinput: gamepadとvpad入力をキーボードの入力で返す。<br>\
         * axes -> カーソルキー<br>\
         * 各ボタン（A)（B)（X)（Y)（START)　->　c,x,z,q,esc
         */
        function mixuserinput(g) {

            let key = g.keyboard;
            let gpd = g.gamepad;
            let mouse = g.mouse;
            let tpd = g.touchpad;
            let vpd = g.vgamepad;

            //mix input Keyboard and Gamepad 
            this.r = -1; //進行方法のr
            this.a = false; //exmpl. accept
            this.b = false; //   ... cancal
            this.c = false; //    .. action1 
            this.d = false; //    .. action2
            this.e = false; //    .. pause 

            /**
             * 
             * @returns {keyState} キー入力状態
             * @description
             * ゲームパッドの入力状態をチェックし、<br>\
             * ゲームパッドのボタンやスティックの値を、<br>\
             * 統合された入力プロパティに変換して更新します。
             */
            this.check = function () {

                //各プロパティの更新
                //a_button  Attack z,space  btn_a
                //b         Jump   c,       btn_b
                //c         Bomb   x,ctrl   btn_x   
                //d         Q               btn_y
                //e         Esc             btn_start
                let state = [];

                if (gpd.check()) {
                    this.r = gpd.r; //進行方法のr
                    this.a = gpd.btn_a;
                    this.b = gpd.btn_b;
                    this.c = gpd.btn_x;
                    this.d = gpd.btn_y;
                    this.e = gpd.btn_start;

                    state[38] = gpd.upkey; // || Boolean(state[38]) ;
                    state[40] = gpd.downkey; //|| Boolean(state[40]) ;
                    state[37] = gpd.leftkey; // || Boolean(state[37]) ;;
                    state[39] = gpd.rightkey; // || Boolean(state[39]) ;

                    state[90] = gpd.btn_x; // || Boolean(state[90]) ;Z ATTACK
                    state[67] = gpd.btn_a; // || Boolean(state[67]) ;C JUMP 
                    state[88] = gpd.btn_b; // || Boolean(state[88]) ;X BOMB

                    state[69] = gpd.btn_y; // || Boolean(state[69]) ;E SELECT (GameScene) add 2025/07/11
                    state[80] = gpd.btn_start; // || Boolean(state[27]) ;ESC->P(state[80]) change 2025/06/26
                    state[192] = gpd.btn_back; // @key (QuitOperation)back_Btn 2025/06/26
                    state[17] = gpd.btn_rb; //Controlkey 
                }

                mouse.mode(g);
                mouse.check();
                tpd.mode(g);
                let vstate = vpd.check();
                if (vstate.distance > 0) {
                    //touchpad操作されているので方向処理
                    //0  330-360,0-30 u 38 30-60 300 330
                    //45 30-60 ul 38 37
                    //90 60-120 l 37 30-60 120-150
                    //135 120-150 dl 37 40
                    //180 150-210 d 40 120-150 210-240
                    //225 210-240 dr 39 40 
                    //270 240-300 r 39 210-240 300-330
                    //315 300-330 ur 38 39
                    let d = vstate.deg;
                    if ((d >= 300) || (d < 60)) state[38] = true; //u
                    if ((d >= 30) && (d < 150)) state[39] = true; //r
                    if ((d >= 120) && (d < 240)) state[40] = true; //d
                    if ((d >= 210) && (d < 330)) state[37] = true; //l
                }
                //vkey のbuttonNoは、←0　↑2　→1　↓3となっている為、
                //Z:0　C:3　X:1　ESC:2　とする。
                if (vstate.button[0]) state[90] = vstate.button[0];
                if (vstate.button[1]) state[88] = vstate.button[1];
                //if (vstate.button[2]) state[27] = vstate.button[2];//pause?
                if (vstate.button[3]) state[67] = vstate.button[3];

                let wstate = key.check();
                for (let i in wstate) {
                    state[i] = state[i] || wstate[i];
                }
                return state;
            };
        }
    }
}
