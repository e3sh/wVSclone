//stateResult
/**
 * @class
 * @classdesc
 * スコアやゲーム結果に関する情報を管理するクラスです。<br>\
 * ハイスコアの保持、そしてローカルストレージからのロード・セーブ機能を提供します。
 */
class stateResult {
    /**
     * @constructor
     * @description
     * `stateResult`インスタンスを初期化します。
     * ハイスコアと現在のスコアを準備します。
     */
    constructor() {

        this.highscore = 0;
        this.score = 0;
        //this.item = obCtrl.item;
        //現在gameSceneでここに色々登録されている。
        let ret_code = 0;
        //ローカルストレージからのロード
        /**
         * @method
         * @returns {number}
         * @description
         * ローカルストレージからハイスコアをロードします。<br>\
         * ロードの成否を示すコードを返します。
         */
        this.load = function () {

            if (Boolean(localStorage)) {

                let f = false;

                if (Boolean(localStorage.getItem("highscore"))) {
                    f = true;
                    this.highscore = parseInt(localStorage.getItem("highscore"));
                }
                ret_code = f ? 0 : 1; //	        alert(f ? "gload" : "gnondata");
            } else {
                ret_code = 2; //	        alert("gnon localstorage");
            }
            //正常時:0 /異常時:any
            return ret_code;
        };

        //ローカルストレージへのセーブ
        /**
         * @method
         * @returns {number}
         * @description
         * 現在のハイスコアをローカルストレージにセーブします。<br>\
         * ーブの成否を示すコードを返します。 
         */
        this.save = function () {

            let ret_code = 0;

            if (Boolean(localStorage)) { //ローカルストレージ使えたらハイスコア記録しとく
                localStorage.setItem("highscore", new String(this.result.highscore));
            } else {
                ret_code = 2;
            }

            //正常時:0 /異常時:any
            return ret_code;
        };
    }
}