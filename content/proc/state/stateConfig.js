//stateConfig
//設定パラメータ
/**
 * @class
 * @classdesc
 * ゲームの設定パラメータを管理するクラスです。<br>\
 * ランプ使用、マップ使用、アイテムリセット、弾フリー、デバッグモードなどの設定を保持し、<br>\
 * ローカルストレージへのロード、セーブ、初期化機能を提供します。
 */
class stateConfig {
    /**
     * @constructor
     * @description
     * `stateConfig`インスタンスを初期化します。<br>\
     * 各種設定値をデフォルト値にリセットします。
     */
    constructor() {

        this.lamp_use;
        this.map_use;
        this.itemreset;
        this.shotfree;
        this.startstage;

        this.use_audio;
        this.master_volume;

        this.debug;
        this.viewlog;
        this.bulletmode;

        this.keyAn;

        /**
         * @description
         * 全ての設定パラメータを初期値にリセットします。
         */
        const configReset =()=>{ //値の初期化

            this.lamp_use = false;
            this.map_use = false;
            this.itemreset = true;
            this.shotfree = false;
            this.startstage = 1; //開始ステージ　0:Stage1_test/1－30：Stage1/30-：Stage_tod

            this.use_audio = true;
            this.master_volume = 5; //(0-10)予定(現在未使用)

            this.debug = false; //trueでdebugステータス表示。
            this.viewlog = false; //trueでdebug時にログ表示
            this.bulletmode = false; //trueで画面外から弾が飛んでこなくなる。

            const KEYCODE_MODE = false;

            this.keyAn = (KEYCODE_MODE)?{
                USECODEMODE: false,
                UP: [38, 87, 104],    //up    W tenkey8 code ArrowUp    Numpad8        
                DOWN: [40, 83, 98],   //down  S tenkey2 code ArrowDown  Numpad2  
                LEFT: [37, 65, 100],  //left  A tenkey4 code ArrowLeft  Numpad4      
                RIGHT: [39, 68, 102], //right D tenkey6 code ArrowRight Numpad6
                WEAPON: [90,32], //zkey code"keyZ" "Space"
                USEITEM:[88], //xkey code"keyX"
                JUMP:   [67], //ckey code"keyC"
                SELECT: [69], //ekey code"keyE"
                PAUSE:  [80], //pkey code"keyP"
                LOCK:   [81], //qkey code"keyQ"
                BACK:  [192],  //@key code"BracketLeft"
                CTRL:   [17], //ctrlL code"ControlLeft"

                VKEY:   [86],

                NUMKEY:[48, 49, 50, 51, 52, 53, 54, 55, 56, 57],

                GPAD_UP: 38,    //^
                GPAD_DOWN: 40,  //v
                GPAD_LEFT: 37,  //<
                GPAD_RIGHT: 39, //>
                GPAD_A: 67, //C
                GPAD_B: 88, //X
                GPAD_X: 90, //Z
                GPAD_Y: 69, //E
                GPAD_START: 80, //P
                GPAD_BACK: 192, //@
                GPAD_LB: 17,    //ControlL
                GPAD_RB: 17

            }//this paramater not function (keyCode)(code)
            :
            {
                USECODEMODE: true,
                UP: ["ArrowUp", "KeyW", "Numpad8"],    //up         
                DOWN: ["ArrowDown", "KeyS", "Numpad2"], //down  
                LEFT: ["ArrowLeft", "KeyA", "Numpad4"], //left      
                RIGHT: ["ArrowRight", "KeyD", "Numpad6"], //right
                WEAPON: ["KeyZ","Space"], //zkey
                USEITEM:["KeyX"], //xkey
                JUMP:   ["KeyC"], //ckey
                SELECT: ["KeyE"], //ekey
                PAUSE:  ["KeyP"], //pkey
                LOCK:   ["KeyQ"], //qkey
                BACK:  ["BracketLeft"],  //@key
                CTRL:   ["ControlLeft"], //ctrlL

                VKEY:   ["KeyV"],    

                NUMKEY:["Digit0", "Digit1", "Digit2", "Digit3", "Digit4",
                     "Digit5", "Digit6", "Digit7", "Digit8","Digit9"],

                GPAD_UP: "ArrowUp",  
                GPAD_DOWN: "ArrowDown",
                GPAD_LEFT: "ArrowLeft",
                GPAD_RIGHT: "ArrowRight",
                GPAD_A: "KeyC", //C
                GPAD_B: "KeyX", //X
                GPAD_X: "KeyZ", //Z
                GPAD_Y: "KeyE", //E
                GPAD_START: "KeyP", //P
                GPAD_BACK: "BracketLeft", //@
                GPAD_LB: "KeyQ", //Q
                GPAD_RB: "ControlLeft" //ControlL
            };
        }

        configReset();

        //ローカルストレージからのロード
        /**
         * @method
         * @returns {number} 0:LOAD_OK 1:NOTFOUND 2:LOCALSTORAGE_DISABLE
         * @description
         * ローカルストレージから設定パラメータをロードします。<br>\
         * ロードに成功したかどうかのコードを返します。 
         */
        this.load = function () {

            let ret_code = 0;
            if (Boolean(localStorage)) {
                let t = ["lamp_use", "map_use", "itemreset", "shotfree", "debug", "viewlog", "bulletmode", "startstage"];
                let f = false;

                for (let i = 0; i <= 5; i++) {
                    if (Boolean(localStorage.getItem(t[i]))) {
                        f = true;
                        this[t[i]] = (localStorage.getItem(t[i]) == "on") ? true : false;
                    }
                }

                if (Boolean(localStorage.getItem(t[6]))) {
                    f = true;
                    this[t[6]] = parseInt(localStorage.getItem(t[6]));
                }

                if (Boolean(localStorage.getItem('keyassign'))) {
                    f = true;
                    let json = localStorage.getItem('keyassign');
                    this.keyAn = JSON.parse(json);
                }

                ret_code = f ? 0 : 1; //alert(f ? "load" : "nondata");
            } else {
                ret_code = 2; //alert("non localstorage");
            }
            //正常時:0 /異常時:any
            return ret_code;
        };

        //ローカルストレージへのセーブ
        /**
         * @method
         * @returns {number} 0:SAVE_OK 2:LOCALSTORAGE_DISABLE
         * @description
         * 現在の設定パラメータをローカルストレージにセーブします。<br>\
         * セーブに成功したかどうかのコードを返します。
         */
        this.save = function () {

            let ret_code = 0;

            if (Boolean(localStorage)) {

                localStorage.setItem("lamp_use", (this.lamp_use) ? "on" : "off");
                localStorage.setItem("map_use", (this.map_use) ? "on" : "off");
                localStorage.setItem("itemreset", (this.itemreset) ? "on" : "off");
                localStorage.setItem("shotfree", (this.shotfree) ? "on" : "off");
                localStorage.setItem("debug", (this.debug) ? "on" : "off");
                localStorage.setItem("viewlog", (this.viewlog) ? "on" : "off");
                localStorage.setItem("bulletmode", (this.bulletmode) ? "on" : "off");
                localStorage.setItem("startstage", new String(this.startstage));

                let json = JSON.stringify(this.keyAn, undefined, 1);
                localStorage.setItem('keyassign', json);

            } else {
                ret_code = 2; //ローカルストレージが使用できない?

            }
            //正常時:0 /異常時:any
            return ret_code;
        };

        //コンフィグの初期化（初期値に設定）
        /**
         * @method
         * @description
         * コンフィグの初期化（初期値に設定）
         */
        this.reset = configReset;

        /**
         * @method
         * @description
         * キーアサイン情報をエクスポートする
         */
        this.export = function(obj){
            const filename = "keyAssign.json"
            //textfile export
            const json = JSON.stringify(obj, null, 2);
            const blob = new Blob([json], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
        }

        /**
         * @method
         * @description
         * キーアサイン情報をインポートする
         * @todo
         * 外部ファイル読み込みの作成
         * (変な設定のファイルを読み込むと操作できなくなるので不必要かもしれない)
         */
        this.import = function(){

            let json = keyassignSampleJsonObj();
            this.keyAn = JSON.parse(json);
        }

        function keyassignSampleJsonObj(){
            //WASDとSPACEを未使用にしてアイテムセレクトをSにするキーアサインサンプル
            return `{
                "USECODEMODE": false,
                "UP": [
                    38,
                    104
                ],
                "DOWN": [
                    40,
                    98
                ],
                "LEFT": [
                    37,
                    100
                ],
                "RIGHT": [
                    39,
                    102
                ],
                "WEAPON": [
                    90
                ],
                "USEITEM": [
                    88
                ],
                "JUMP": [
                    67
                ],
                "SELECT": [
                    83
                ],
                "PAUSE": [
                    80
                ],
                "LOCK": [
                    65
                ],
                "BACK": [
                    192
                ],
                "GPAD_UP": 38,
                "GPAD_DOWN": 40,
                "GPAD_LEFT": 37,
                "GPAD_RIGHT": 39,
                "GPAD_A": 67,
                "GPAD_B": 88,
                "GPAD_X": 90,
                "GPAD_Y": 83,
                "GPAD_START": 80,
                "GPAD_BACK": 192,
                "GPAD_LB": 81,
                "GPAD_RB": 17
            }`
        } 
    }
}
