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

        this.keyAn = [];

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
         */
        this.reset = configReset;
    }
}
