//=============================================================
// Screenクラス(旧・新システム間の変換接続機構として)2023/01/07
//
//=============================================================
/**
 * @class
 * @classdesc
 * 旧システムと新システム間の変換接続機構として機能するScreenクラスです。<br>\
 * `DisplayControl`へのラッパーとして、旧来の描画関数を新しいAPIに変換して提供します。
 */
class Screen {
    /**
     * @constructor
     * @param {GameCore} g GameCoreインスタンス 
     * @param {number} num DispayControlでのscreenNo
     * @description
     * `Screen`インスタンスを初期化します。<br>\
     * `DisplayControl`インスタンスへの参照を取得し、<br>\
     * 描画幅、高さ、フリップ、ビューなどのプロパティを設定します。
     */
    constructor(g, num) {

        const scrn = g.screen[num];

        const cw = scrn.cw;
        const ch = scrn.ch;

        const fcolor = ["8x8white", "8x8red", "8x8green", "8x8blue", "stfont"];
        const sp_ptn = spdata();

        const flip = scrn.flip;
        const view = scrn.view;

        this.cw = cw;
        this.ch = ch;

        this.view = view;
        this.flip = flip;

        //this.interval = scrn.interval; // 自動更新での更新間隔(0:自動更新なし　1:毎回　2～:間隔)
        //this.backgroundcolor = scrn.backgroundcolor; //defaultBackgroundcolor;
        const setI = scrn.setInterval;
        const setBgc = scrn.setBackgroundcolor;

        const getI = scrn.getIntarval;
        const getBgc = scrn.getBackgroundcolor;

        this.setInterval = setI;
        this.setBackgroundcolor = setBgc;

        this.getInterval = getI;
        this.getBackgroundcolor = getBgc;

        this.baseDcc = scrn; //gameCore.screen(SelectLayerobject)

        //-------------------------------------------------------------
        ///スプライト描画
        //表示位置はx,yが表示中心となるように表示されます。
        /**
         * @method
         * @param {number | string} sp スプライト番号
         * @param {number} x 位置
         * @param {number} y 位置
         * @param {number} [m=0] 反転[1:上下反転 2:左右反転 3:上下左右反転]
         * @param {number} [r=0] 回転
         * @param {number} [alpha=255] アルファ値(透明度）[0:透明～255:不透明]
         * @param {number} [z=1.0] 拡大率
         * @returns {void}
         * @description
         * スプライトを画面に描画します。<br>\
         * スプライト番号、位置、反転、回転、アルファ値、拡大率を指定し、<br>\
         * 内部で`DisplayControl.buffer.spPut`を呼び出します。
         */
        this.put = function (sp, x, y, m=0, r=0, alpha=255, z=1.0) {
            let d = sp_ptn[sp];
            let tex_p = g.asset.image[d.pict].img;

            //Debug(error回避)用
            if (!Boolean(d)) {
                scrn.buffer.fillText(sp, x, y);
                return;
            }

            if (!Boolean(m)) m=0;
            if (!Boolean(r)) r=0;
            if (!Boolean(alpha)) alpha=255;
            if (!Boolean(z)) z=1.0;

            let simple = ((m == 0) && (r == 0) && (alpha == 255));
            //simple = false;

            if (simple) {

                let dx = x + (-d.w / 2) * z;
                let dy = y + (-d.h / 2) * z;
                let dw = d.w * z;
                let dh = d.h * z;

                scrn.putPattern(tex_p, d, dx, dy, dw, dh);

            } else {
                let FlipV = 1.0;
                let FlipH = 1.0;

                switch (m) {
                    case 0:
                        break;
                    case 1:
                        FlipV = -1.0;
                        break;
                    case 2:
                        FlipH = -1.0;
                        break;
                    case 3:
                        FlipV = -1.0;
                        FlipH = -1.0;
                        break;
                    default:
                        break;
                }

                scrn.buffer.spPut(
                    tex_p,
                    d.x, d.y, d.w, d.h,
                    (-d.w / 2) * z,
                    (-d.h / 2) * z,
                    d.w * z,
                    d.h * z,
                    FlipH, 0, 0, FlipV,
                    x, y,
                    alpha, r
                );
            }
        };

        //-------------------------------------------------------------
        /// スプライトを文字として表示(パターン配置をSpace～[~]のASCII配列と仮定で)
        //表示位置はx,yが左上となるように表示されます。12*16size
        /**
         * @method
         * @param {string} str 文字列
         * @param {number} x 座標
         * @param {number} y 座標
         * @param {number} [z=1.0] 拡大率
         * @description
         * スプライトを文字として表示します（ASCII配列を想定）。<br>\
         * 文字列、X, Y座標、拡大率を指定し、内部で`fontput`を呼び出します。
         */
        this.putchr = function (str, x, y, z=1.0) {
            fontput(str, x, y, 4, z);
        };
        //-------------------------------------------------------------
        /// スプライトを文字として表示(パターン配置をSpace～[~]のASCII配列と仮定で)
        //表示位置はx,yが左上となるように表示されます。8*8size
        /**
         * @method
         * @param {string} str 文字列
         * @param {number} x 座標
         * @param {number} y 座標
         * @description
         * スプライトを文字として表示します（ASCII配列、8x8フォントを想定）。<br>\
         * 文字列、X, Y座標を指定し、内部で`fontput`を呼び出します。
         */
        this.putchr8 = function (str, x, y) {
            fontput(str, x, y, 0);
        };
        //-------------------------------------------------------------
        /// スプライトを文字として表示(パターン配置をSpace～[~]のASCII配列と仮定で)
        //表示位置はx,yが左上となるように表示されます。
        /**
         * @method
         * @param {string} str 文字列
         * @param {number} x 座標
         * @param {number} y 座標
         * @param {number} c color (0:white 1:red 2:green 3:blue) 
         * @description
         * スプライトを文字として表示します（ASCII配列、8x8フォント、色指定）。<br>\
         * 文字列、X, Y座標、色番号を指定し、内部で`fontput`を呼び出します。
         */
        this.putchr8c = function (str, x, y, c) {
            fontput(str, x, y, c);
        };
        //-------------------------------------------------------------
        /**
         * @method
         * @param {string} str 文字列
         * @param {number} x 座標
         * @param {number} y 座標
         * @description
         * 漢字フォントを使用して文字列を画面に表示します。<br>\
         * `fontPrintControl.print`メソッドを呼び出します。
         */
        this.kprint = function (str, x, y) {
            g.state.System.dev.kanji.useScreen(num);
            g.state.System.dev.kanji.print(str, x, y);
        };
        /**
         * @method
         * @param {string} str 文字列
         * @param {number} x 座標
         * @param {number} y 座標
         * @param {number} Z 拡大率
         * @description
         * 漢字フォントを使用して各文字を拡大率付きで表示します。<br>\
         * `fontPrintControl.putchr`メソッドを呼び出します。
         */
        this.kputchr = function (str, x, y, z) {
            g.state.System.dev.kanji.useScreen(num);
            g.state.System.dev.kanji.putchr(str, x, y, z);
        };
        //-------------------------------------------------------------
        /**
         * 
         * @param {string} str 文字列
         * @param {number} x 座標
         * @param {number} y 座標
         * @param {number} c color (0:white 1:red 2:green 3:blue) 
         * @param {number} Z 拡大率
         * @description
         * 文字列のフォント描画を内部的に処理するヘルパー関数です。<br>\
         * 定されたフォントとスクリーンバッファを使用して`GameSpriteFontControl.putchr`を呼び出します。 
         */
        function fontput(str, x, y, c, z) {
            if (g.font[fcolor[c]]) {
                g.font[fcolor[c]].useScreen(num);
                g.font[fcolor[c]].putchr(str, x, y, z);
            }
        }
        //-------------------------------------------------------------
        /**
         * @method
         * @description
         * マップチップ用パターンを描画するメソッドです。<br>\
         * `DisplayControl.putPattern`メソッドを直接呼び出します。
         */
        this.putPattern = scrn.putPattern;
        /**
         * @method
         * @description
         * 文字列を画面に表示するメソッドです。<br>\
         * `DisplayControl.print`メソッドを直接呼び出します。
         */
        this.print = scrn.print;
        /**
         * @method
         * @description
         * 画像イメージを直接取得して表示するメソッドです。<br>\
         * `DisplayControl.putImage`メソッドを直接呼び出します。
         */
        this.putImage = scrn.putImage;
        /**
         * @method
         * @description
         * 画像イメージを指定されたサイズで表示するメソッドです。<br>\
         * `DisplayControl.drawImgXYWH`メソッドを直接呼び出します。
         */
        this.putImage2 = scrn.drawImgXYWH;
        /**
         * @method
         * @description
         * 画像イメージを変形行列付きで表示するメソッドです。<br>\
         * `DisplayControl.putImageTransform`メソッドを直接呼び出します。
         */
        this.putImageTransform = scrn.putImageTransform;
        /**
         * @method
         * @description
         * 変形行列を適用するメソッドです。(Deprecatedな`offScreenTypeC.transform`へのラッパーです。
         */
        this.transform = scrn.buffer.transform;
        /**
         * @method
         * @description
         * カスタム描画オブジェクトを登録して表示するメソッドです。<br>\
         *  `DisplayControl.putFunc`メソッドを直接呼び出します。
         */
        this.putFunc = scrn.putFunc;
        /**
         * @method
         * @description
         * 画面を消去（クリア）するメソッドです。<br>\
         *  `DisplayControl.clear`メソッドを直接呼び出します。
         */
        this.clear = scrn.clear;
        /**
         * @method
         * @description
         * 指定範囲を色で塗りつぶすメソッドです。<br>\
         *  `DisplayControl.fill`メソッドを直接呼び出します。
         */
        this.fill = scrn.fill;
        /**
         * @method
         * @description
         * オフスクリーンバッファをクリアするメソッドです。<br>\
         * `DisplayControl.reset`メソッドを直接呼び出します。
         */
        this.reset = scrn.reset;
        /**
         * @method
         * @description
         * フレームループでオフスクリーンバッファをクリアするメソッドです。<br>\
         * `DisplayControl.reflash`メソッドを直接呼び出します。
         */
        this.reflash = scrn.reflash;
        /**
         * @method
         * @description
         * 描画処理を実行し、オフスクリーンCanvasをメインCanvasへ反映させるメソッドです。<br>\
         * `DisplayControl.draw`メソッドを直接呼び出します。
         */
        this.draw = scrn.draw;
        /**
         * @method
         * @description
         * 書き込み処理回数を取得するメソッドです。<br>\
         * `DisplayControl.count`メソッドを直接呼び出します。
         */
        this.count = scrn.count;
        /**
         * @method
         * @description
         * 書き込み処理回数の最大値を取得するメソッドです。<br>\
         * `DisplayControl.max`メソッドを直接呼び出します。
         */
        this.max = scrn.max;
    }
}



