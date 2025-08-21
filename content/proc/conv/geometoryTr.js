//=============================================================
// GeometoryTrancerateクラス
// 画面表示とゲームワールドの座標変換用
//=============================================================
/**
 * @class
 * @classdesc
 * ワールド座標系と実際の画面表示座標系の変換を管理するクラスです。<br>\
 * ゲーム内のスプライトがどの位置にあり、画面のどこに表示されるべきか、<br>\
 * また、表示範囲内にあるかどうかの判定を行います。
 */
class geometoryTrance {
    /**
     * @constructor
     * @description
     * `geometoryTrance`のインスタンスを初期化します。<br>\
     * ゲームワールドとステージ、ビューポートの幅と高さを定義し、<br>\
     * 現在のワールド位置を初期化します。
     */
    constructor() {

        this.worldwidth = 2976; //とりあえずblock96*31
        this.worldheight = 2976;

        this.stagewidth = 700;
        this.stageheight = 460;

        this.viewwidth = 640;
        this.viewheight = 400;

        this.world_x = 0;
        this.world_y = 0;

        let ww = this.worldwidth;
        let wh = this.worldheight;

        let sw = this.stagewidth;
        let sh = this.stageheight;

        let vw = this.viewwidth;
        let vh = this.viewheight;

        let workWorldX = this.world_x;
        let workWorldY = this.world_y;

        this.changestate = false;

        /**
         * @method
         * @param {Range} s 矩形範囲
         * @param {Range} r 矩形範囲
         * @returns {boolean} 正否
         * @description
         * 2つの矩形範囲（`s`と`r`）が重なっているかをチェックします。<br>\
         * 衝突判定や領域内判定の補助に使用されます。
         */
        function rangeCheck(s, r) {
            return ((Math.abs((s.x + s.w / 2) - (r.x + r.w / 2)) < (s.w + r.w) / 2) &&
                (Math.abs((s.y + s.h / 2) - (r.y + r.h / 2)) < (s.h + r.h) / 2));
        }
        /**
         * @method
         * @param {Point} p 指定点
         * @param {Range} r 矩形範囲
         * @returns boolean} 正否
         * @description
         * 指定された点（`p`）が、与えられた矩形範囲（`r`）内に含まれるかをチェックします。
         */

        function pointCheck(p, r) {
            return ((r.x <= p.x) && ((r.x + r.w) >= p.x) && (r.y <= p.y) && ((r.y + r.h) >= p.y));
        }

        //用途はほぼマウス位置からの座標変換で移動とかのフォロー用
        /**
         * @method
         * @param {number} x 座標
         * @param {number} y 座標
         * @returns {{x,y}} 結果
         * @description
         * 画面上のX, Y座標を、現在のワールドスクロール位置を考慮したワールド座標に変換します。<br>\
         * 主にマウス位置からゲームワールド内の座標を特定するのに使用されます。
         */
        this.viewtoWorld = function (x, y) {
            let w = {};
            w.x = this.world_x + x;
            w.y = this.world_y + y;

            return w;
        };

        //ゲームオブジェクトは基本的にこちらで変換してから表示
        /**
         * @method
         * @param {number} x 座標
         * @param {number} y 座標
         * @returns {{x,y}} 結果
         * @description
         * ゲームワールド内のX, Y座標を、現在の画面スクロール位置を考慮した表示画面座標に変換します。<br>\
         * ゲームオブジェクトの表示位置を計算する際に不可欠です。
         */
        this.worldtoView = function (x, y) {
            let w = {};
            if (this.world_x > ww - vw) {
                if (x < vw) {
                    w.x = ww - this.world_x + x;
                } else {
                    w.x = Math.trunc(x - this.world_x);
                }
            } else {
                w.x = Math.trunc(x - this.world_x);
            }

            if (this.world_y > wh - vh) {
                if (y < vh) {
                    w.y = wh - this.world_y + y;
                } else {
                    w.y = Math.trunc(y - this.world_y);
                }
            } else {
                w.y = Math.trunc(y - this.world_y);
            }
            // view shift
            //w.sx = 192; 
            //w.sy = 120;
            w.sx = 0;
            w.sy = 0;

            w.x += w.sx; //(1024-640)/2
            w.y += w.sy; //( 640-400)/2

            return w;
        };

        //ワールド座標におけるビューポートの位置(初期値など）設定
        /**
         * @method
         * @param {*} x 座標
         * @param {*} y 座標
         * @description
         * ゲームワールドにおけるビューポート（画面の表示領域）の基準位置を設定します。<br>\
         * X, Y座標がワールド境界を超えた場合、ループスクロールを考慮して調整されます。
         */
        this.viewpos = function (x, y) {
            if (x < 0) x = ww + x;
            if (y < 0) y = wh + y;
            if (x > ww) x = x - ww; //ww - vw;
            if (y > wh) y = y - wh; //wh - vh;

            workWorldX = Math.trunc(x);
            workWorldY = Math.trunc(y);
        };

        //viewposの設定を確定する（直接プロパティを触った場合は知らん）
        /**
         * @method
         * @returns {boolean} 変更の有無
         * @description
         * `viewpos`で設定されたワーク用のワールド位置（`workWorldX`, `workWorldY`）を、<br>\
         *  実際のワールド位置（`this.world_x`, `this.world_y`）に確定します。<br>\
         *  位置に変更があった場合は`true`を返します。
        */
        this.commit = function () {

            let changef = false;

            if ((this.world_x != workWorldX) ||
                (this.world_y != workWorldY)) {

                this.world_x = workWorldX;
                this.world_y = workWorldY;

                changef = true;
            }
            this.changestate = changef;

            return changef; //変更有無:true/false　
        };

        //Stageの座標を返す
        /**
         * @typedef {Object} nowStagePosResultObject　座標リストObject
         * @property {number} ltx 左上x
         * @property {number} lty 左上y
         * @property {number} rtx 右上x
         * @property {number} rty 右上y
         * @property {number} lbx 左下x
         * @property {number} lby 左下y
         * @property {number} rbx 右下x
         * @property {number} rby 右下y
         * @property {number} w 幅
         * @property {number} h 高さ
         * @todo 座標系のオブジェクトの型を決める/point{x,y} vector{x,y,r} rect(x,y,w,h) etc
         */
        //コメント書いていると型があった方がよいのがよくわかる

        /**
         * @method
         * @returns {nowStagePosResultObject} 座標リストObject
         * @description
         * 現在のステージ（ビューポート）のワールド座標における四隅の座標と、<br>\
         * 幅、高さをオブジェクトとして返します。
         */
        this.nowstagepos = function () {

            let w = {};

            //stagelefttop
            w.ltx = this.world_x + (vw / 2) - (sw / 2);
            w.lty = this.world_y + (vh / 2) - (sh / 2);

            //stagerighttop
            w.rtx = this.world_x + (vw / 2) + (sw / 2);
            w.rty = this.world_y + (vh / 2) - (sh / 2);

            //stageleftbottm
            w.lbx = this.world_x + (vw / 2) - (sw / 2);
            w.lby = this.world_y + (vh / 2) + (sh / 2);

            //stagerightbottom
            w.rbx = this.world_x + (vw / 2) + (sw / 2);
            w.rby = this.world_y + (vh / 2) + (sh / 2);

            //stagelefttop(alias)
            w.x = w.ltx;
            w.y = w.lty;

            w.w = sw;
            w.h = sh;

            return w;
        };

        //入力した座標がStage内の場合True
        /**
         * @method
         * @param {number} x 座標
         * @param {number} y 座標
         * @returns {boolean} 正否
         * @description
         * 指定したX, Y座標が現在のステージの表示範囲内にあるかを判定します。
         */
        this.in_stage = function (x, y) {
            let p = {}; p.x = x; p.y = y;; p.w = 1; p.h = 1;
            let r = {};
            r.x = this.world_x + (vw / 2) - (sw / 2);
            r.y = this.world_y + (vh / 2) - (sh / 2);
            r.w = sw; r.h = sh;

            return in_range(p, r);
        };

        //入力した座標がView内の場合True
        /**
         * @method
         * @param {number} x 座標
         * @param {number} y 座標
         * @returns {boolean} 正否
         * @description
         * 指定したX, Y座標が現在のビューポート（画面表示領域）内にあるかを判定します
         */
        this.in_view = function (x, y) {
            let p = {}; p.x = x; p.y = y; p.w = 1; p.h = 1;
            let r = {}; r.x = this.world_x; r.y = this.world_y; r.w = vw; r.h = sh;
            return in_range(p, r);
        };

        //入力した範囲はViewに含まれる場合True
        /**
         * @method
         * @param {number} x 座標
         * @param {number} y 座標
         * @param {number} w 幅
         * @param {number} h 高さ
         * @returns {boolean} 正否
         * @description
         * 指定した矩形範囲（X, Y, W, H）が、現在のビューポートの表示範囲に<br>\
         * 一部でも含まれているかを判定します。
         */
        this.in_view_range = function (x, y, w, h) {
            let s = {}; s.x = x; s.y = y; s.w = w; s.h = h;
            let r = {}; r.x = this.world_x; r.y = this.world_y; r.w = vw; r.h = vh;
            return in_range(s, r);
        };

        //入力した範囲はStageに含まれる場合True
        /**
         * @method
         * @param {number} x 座標
         * @param {number} y 座標
         * @param {number} w 幅
         * @param {number} h 高さ
         * @returns {boolean} 正否
         * @description
         * 指定した矩形範囲（X, Y, W, H）が、現在のステージの表示範囲に<br>\
         * 一部でも含まれているかを判定します。
        */
        this.in_stage_range = function (x, y, w, h) {
            let s = {}; s.x = x; s.y = y; s.w = w; s.h = h;
            let r = {}; r.x = this.world_x; r.y = this.world_y; r.w = sw; r.h = sh;
            return in_range(s, r);
        };
        /**
         * @method
         * @param {Range} s 矩形範囲
         * @param {Range} r 矩形範囲
         * @returns {boolean} 正否
         * @description
         * ループスクロールを考慮し、2つの矩形範囲が重なっているかを判定します。<br>\
         * ステージの端を越えてもオブジェクトが画面に表示されるかをチェックするために使用されます。
         */
        function in_range(s, r) {
            let result = false;
            let x = s.x;
            let y = s.y;

            for (let i = 0; i <= 1; i++) {
                for (let j = 0; j <= 1; j++) {
                    s.x = x + ww * i;
                    s.y = y + wh * j;
                    result = (result || rangeCheck(s, r));
                }
            }
            return result;
        }

        //座標位置がワールド内にあるかどうかの確認と変換
        /**
         * @method
         * @param {number} x 座標
         * @param {number} y 座標
       　* @returns {boolean} 正否
         * @description
         * 指定したX, Y座標が、ゲームのワールド全体の範囲内にあるかを判定します
         */
        this.in_world = function (x, y) {

            return !((x < 0) || (x > ww) || (y < 0) || (y > wh));
        };

        /**
         * @method
         * @param {number} x 座標
         * @returns {number} 変換後の座標
         * @description
         * X座標がワールドの水平方向境界を超えた場合、ループスクロールを考慮して<br>\
         * ワールド内での適切なX座標に変換します。
         */
        this.worldtoWorld_x = function (x) {

            if (x < 0) x = ww + x;;
            if (x > ww) x = x - ww;

            return x;
        };

        /**
         * @method
         * @param {number} x 座標
         * @returns {number} 変換後の座標
         * @description
         * Y座標がワールドの垂直方向境界を超えた場合、ループスクロールを考慮して<br>\
         * ワールド内での適切なY座標に変換します
         */
        this.worldtoWorld_y = function (y) {

            if (y < 0) y = wh + y;;
            if (y > wh) y = y - wh;

            return y;
        };
        //setter
        //this//.setWorldsize = function(){}
        //this.setStagesize = function(){}
        //this.setViewsize = function(){}
        //-------------------------------------------------------------
        //-------------------------------------------------------------
    }
}



