//=============================================================
// Screenクラス
//
//=============================================================
function Screen(canvas_id, c_w, c_h) {
    //キャンバスID、キャンバス幅、高さ指定。画面表示サイズはCSSのSTYLEで
    //指定してあるのでここでは、操作する解像度を指定する。

    var BUFFER_SIZE = 1500;

    //    alert("!");
    //キャラクタパターンテクスチャー
    var tex_p = new Image();
    tex_p.src = "pict/cha.png";

    var tex_c = new Image();
    tex_c.src = "pict/aschr.png"

    var ef_item = []; // クラスを登録して表示用

    var sp_ch_ptn = []; //スプライトキャラクタパターン

    var canvas = document.getElementById(canvas_id);

    canvas.width = c_w;
    canvas.height = c_h;

    var device = canvas.getContext("2d");

    this.cw = canvas.width;
    this.ch = canvas.height;

    var spReady = false;
    var chReady = false;

    this.sprite_texture_ready = spReady;
    this.character_texture_ready = chReady;

    device.font = "16px 'Arial'";

    tex_p.onload = function () {
        spReady = true;
    }

    tex_c.onload = function () {
        chReady = true;
    }

    this.readystate_check = function () {
        this.sprite_texture_ready = spReady;
        this.character_texture_ready = chReady;
    }

    var sp_ptn = spdata();

    var bg_ptn = [];

    for (i = 0; i < 7; i++) {
        for (j = 0; j < 16; j++) {
            ptn = {};

            ptn.x = 12 * j;
            ptn.y = 16 * i;

            ptn.w = 12;
            ptn.h = 16;

            sp_ch_ptn.push(ptn);
        }
    }

    var sp_ch_ptn8 = []; //スプライトキャラクタパターン(8x8)

    for (i = 0; i < 7; i++) {
        for (j = 0; j < 16; j++) {
            ptn = {};

            ptn.x = 8 * j;
            ptn.y = 8 * i + 128;
            ptn.w = 8;
            ptn.h = 8;

            sp_ch_ptn8.push(ptn);
        }
    }

    var sp8 = []; //spchrptn8(color)

    for (var t = 0; t <= 3; t++) {

        var ch = [];

        for (i = 0; i < 7; i++) {
            for (j = 0; j < 16; j++) {
                ptn = {};

                ptn.x = 8 * j + ((t % 2 == 0) ? 0 : 128);
                ptn.y = 8 * i + 128 + ((t >= 2) ? 64 : 0);
                ptn.w = 8;
                ptn.h = 8;

                ch.push(ptn);
            }
        }
        sp8[t] = ch;
    }

    //World => View変換を使用
    //this.view_tr_enable = false;

    //bufferCreate
    var buf_count = 0;
    var buffer = [];

    for (var i = 0; i < BUFFER_SIZE; i++) {
        buffer[i] = new ScreenSubClass();
    }

    //加算合成を使用する。
    this.lighter_enable = true;

    var efmax = 0;

    function selectBuffer() {
        buf_count++
        if (buf_count >= BUFFER_SIZE) buf_count = 0;

        return buffer[buf_count];
    }

    //-------------------------------------------------------------
    ///スプライト描画
    ///引数（m,r,alpha,zは省略するとデフォルト使用）
    ///	Sp : スプライト番号	X,Y : 表示位置
    ///	M : 上下左右反転 ( 0 NORMAL 1:上下反転 2 :左右反転 )
    ///	R : 回転角度 (0 - 359 )
    ///	alpha: アルファ値（透明度）0:透明～255:不透明）
    ///	z: Zoom（拡大率）
    //-------------------------------------------------------------
    //表示位置はx,yが表示中心となるように表示されます。
    this.put = function (sp, x, y, m, r, alpha, z) {

        //var o = {};
        var o = selectBuffer();

        o.img = tex_p;

        var d = sp_ptn[sp];

	//Debug(error回避)用
        if (!Boolean(d)) {
            o.text = sp;
            o.sx = x;
            o.sy = y;
            //o.color = c;

            o.mode = FILLTEXT;

            ef_item[ef_item.length] = o;

            return
        }

        o.sx = d.x;
        o.sy = d.y;
        o.sw = d.w;
        o.sh = d.h;

        //var simple = true;

        if (!Boolean(m)) { m = 0; }
        if (!Boolean(r)) { r = 0; }
        if (!Boolean(alpha)) { alpha = 255; }
        if (!Boolean(z)) { z = 1.0; }

        var simple = ((m == 0) && (r == 0) && (alpha == 255));

        //var simple = false;
        if (simple) {

            o.dx = x + (-d.w / 2) * z;
            o.dy = y + (-d.h / 2) * z;
            o.dw = d.w * z;
            o.dh = d.h * z;

            o.mode = DRAWIMG_XYWH_XYWH;

        } else {

            o.dx = (-d.w / 2) * z;
            o.dy = (-d.h / 2) * z;
            o.dw = d.w * z;
            o.dh = d.h * z;

            o.tx = x;
            o.ty = y;
            z
            o.alpha = alpha;
            o.r = r;

            /*
            o.sp = sp;
            o.x = x;
            o.y = y;
            o.r = r;
            o.alpha = alpha;
            o.z = z;
            */
            var FlipV = 1.0;
            var FlipH = 1.0;

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

            o.m11 = FlipH;
            o.m12 = 0;
            o.m21 = 0;
            o.m22 = FlipV;

            o.light_enable = this.light_enable;

            o.mode = SP_PUT;
        }
        /*
        o.FV = FlipV;
        o.FH = FlipH;

        o.draw = sp_put;

        o.le = this.lighter_enable;
        */
        ef_item[ef_item.length] = o;

    }
    /*
    function sp_put(device) {

        device.save();

        device.setTransform(this.FH, 0, 0, this.FV, this.x, this.y);
        if (this.r != 0) { device.rotate(Math.PI / 180 * this.r); }

        if (this.alpha == 255) {
            device.globalCompositeOperation = "source-over";
        } else {
            if (this.le) device.globalCompositeOperation = "lighter"; //source-over
            device.globalAlpha = this.alpha * (1.0 / 255);
        }
        var d = sp_ptn[this.sp];

        //device.globalAlpha = this.alpha * (1.0 / 255);

        //device.drawImage(tex_p, d.x, d.y, d.w, d.h, (-d.w / 2.0) * this.z, (-d.h / 2.0) * this.z, (0.0 +d.w ) * this.z, (0.0 + d.h) * this.z);
        device.drawImage(tex_p, d.x, d.y, d.w, d.h, (-d.w / 2) * this.z, (-d.h / 2) * this.z, d.w * this.z, d.h * this.z);


        device.restore();
        //        device.globalAlpha = 1.0;
    }
    */

    //-------------------------------------------------------------
    ///マップチップ用パターン描画
    ///引数（省略不可
    /// gr:Image()
    ///	ptn : パターン番号（またはx,y,w,hの入ったオブジェクト）
    /// X,Y : 表示位置
    ///	w,h: 表示幅/高さ
    //-------------------------------------------------------------

    this.putPattern = function (gr, ptn, x, y, w, h) {

        //var o = {};
        var o = selectBuffer();

        o.img = gr;
        o.sx = ptn.x;
        o.sy = ptn.y;
        o.sw = ptn.w;
        o.sh = ptn.h;
        o.dx = x;
        o.dy = y;
        o.dw = w;
        o.dh = h;
        o.mode = DRAWIMG_XYWH_XYWH;
        /*
        o.gr = gr;
        o.x = x;
        o.y = y;
        o.w = w;
        o.h = h;
        o.no = ptn;
        o.draw = bg_put;
        //o.draw = function(){};
        */
        ef_item[ef_item.length] = o;

    }
    /*
    function bg_put(device) {

        //var d = bg_ptn[this.no];
        var d = this.no;
        device.drawImage(this.gr, d.x, d.y, d.w, d.h, this.x, this.y, this.w, this.h);


        //        device.drawImage(this.gr, this.x, this.y, this.w, this.h);
    }
    */
    /*
    //-------------------------------------------------------------
    ///マップチップ用パターン切り取り配列の登録
    ///引数（省略不可
    ///	bgptn : パターン配列（x,y,w,hの入ったオブジェクト）
    //-------------------------------------------------------------
    this.setBgPattern = function (bgptn) {

    bg_ptn = bgptn;

    }
    */
    //-------------------------------------------------------------
    ///文字列の表示
    ///引数 S:文字列 X,Y:座標 c:Color
    //-------------------------------------------------------------
    this.print = function (str, x, y, c) {

        if (!Boolean(c)) { c = "limegreen"; }

        //var o = {};
        var o = selectBuffer();

        o.text = str;
        o.sx = x;
        o.sy = y;
        o.color = c;

        o.mode = FILLTEXT;

        /*
        o.text = str;
        o.x = x;
        o.y = y;
        o.color = c;
        o.draw = sp_print;
        */

        ef_item[ef_item.length] = o;

    }
    /*
    function sp_print(device) {

        device.fillStyle = this.color;
        device.fillText(this.text, this.x, this.y);

    }
    */
    //-------------------------------------------------------------
    /// スプライトを文字として表示(パターン配置をSpace～[~]のASCII配列と仮定で)
    /// 引数 S : 文字列 X,Y : 座標 z:zoom
    //-------------------------------------------------------------
    //表示位置はx,yが左上となるように表示されます。

    //    this.putchr = chr8x8put;
    this.putchr = function (str, x, y, z) {
        //    dummy = function (str, x, y, z) {

        var zflag = false;
        if (!Boolean(z)) {
            z = 1.0;

        } else {
            if (z != 1.0) zflag = true;
        }

        for (var i = 0, loopend = str.length; i < loopend; i++) {
            var n = str.charCodeAt(i);

            if ((n >= 32) && (n < 128)) { // space ～ "~" まで
                //var o = {};
                var o = selectBuffer();

                o.img = tex_c;
                var d = sp_ch_ptn[n - 32];

                o.sx = d.x;
                o.sy = d.y;
                o.sw = d.w;
                o.sh = d.h;

                o.dx = x + i * (12 * z);
                o.dy = y ;
                if (zflag) {
                    o.dx += (-d.w / 2) * z;
                    o.dy += (-d.h / 2) * z;
                }
                o.dw = d.w * z;
                o.dh = d.h * z;

                o.mode = DRAWIMG_XYWH_XYWH;

                /*
                o.chrno = n - 32; //0番をspace
                o.x = x + i * (12 * z); //12はPixel幅
                o.y = y;

                if (!zflag) {
                o.draw = sp_putchr;
                } else {
                o.z = z;
                o.draw = sp_putchrZ;
                }
                */
                ef_item[ef_item.length] = o;

            }
        }
        //
    }
    /*
    function sp_putchr(device) {

        var d = sp_ch_ptn[this.chrno];

        device.drawImage(tex_c, d.x, d.y, d.w, d.h, this.x, this.y, d.w, d.h);
    }

    function sp_putchrZ(device) {

        var d = sp_ch_ptn[this.chrno];

        device.drawImage(tex_c, d.x, d.y, d.w, d.h, this.x, this.y, d.w * this.z, d.h * this.z);
        //        device.drawImage(tex_c, d.x, d.y, d.w, d.h, this.x + (-d.w / 2.0) * this.z, this.y + (-d.h / 2.0) * this.z, d.w * this.z, d.h * this.z);

    }
    */
    //-------------------------------------------------------------
    /// スプライトを文字として表示(パターン配置をSpace～[~]のASCII配列と仮定で)
    /// 引数 S : 文字列 X,Y : 座標
    //-------------------------------------------------------------
    //表示位置はx,yが左上となるように表示されます。
    this.putchr8 = chr8x8put;

    function chr8x8put(str, x, y) {

        for (i = 0; i < str.length; i++) {
            var n = str.charCodeAt(i);

            if ((n >= 32) && (n < 128)) { // space ～ "~" まで
                //var o = {};
                var o = selectBuffer();

                o.img = tex_c;
                var d = sp_ch_ptn8[n-32];

                o.sx = d.x;
                o.sy = d.y;
                o.sw = d.w;
                o.sh = d.h;

                o.dx = x + i * 8;
                o.dy = y;
                o.dw = d.w;
                o.dh = d.h;

                o.mode = DRAWIMG_XYWH_XYWH;

                /*
                o.chrno = n - 32; //0番をspace
                o.x = x + i * 8; //8はPixel幅
                o.y = y;

                o.draw = sp_putchr8;
                */
                ef_item[ef_item.length] = o;

            }
        }
        //
    }
    /*
    function sp_putchr8(device) {

        var d = sp_ch_ptn8[this.chrno];

        device.drawImage(tex_c, d.x, d.y, d.w, d.h, this.x, this.y, d.w, d.h);
    }
    */
    //-------------------------------------------------------------
    /// スプライトを文字として表示(パターン配置をSpace～[~]のASCII配列と仮定で)
    /// 引数 S : 文字列 X,Y : 座標 c:color (0:white 1:red 2:green 3:blue) z:zoom
    //-------------------------------------------------------------
    //表示位置はx,yが左上となるように表示されます。
    this.putchr8c = function (str, x, y, c, z) {

        if (!Boolean(z)) { z = 1.0; }

        for (i = 0; i < str.length; i++) {
            var n = str.charCodeAt(i);

            if ((n >= 32) && (n < 128)) { // space ～ "~" まで
                //var o = {};
                var o = selectBuffer();

                o.img = tex_c;
                var d = sp8[c][n-32];

                o.sx = d.x;
                o.sy = d.y;
                o.sw = d.w;
                o.sh = d.h;

                o.dx = x + i * (8 * z) + (-d.w / 2) * z;
                o.dy = y + (-d.h / 2) * z;
                o.dw = d.w * z;
                o.dh = d.h * z;

                o.mode = DRAWIMG_XYWH_XYWH;

                /*
                o.chrno = n - 32; //0番をspace
                o.x = x + i * (8 * z); //8はPixel幅
                o.y = y;
                o.c = c;
                o.z = z;

                o.draw = sp_putchr8c;
                */
                ef_item[ef_item.length] = o;

            }
        }
        //
    }
    /*
    function sp_putchr8c(device) {

        var d = sp8[this.c][this.chrno]; //sp_ch_ptn8[this.chrno];

        //       device.drawImage(tex_c, d.x, d.y, d.w, d.h, this.x, this.y, d.w, d.h);
        device.drawImage(tex_c, d.x, d.y, d.w, d.h, this.x + (-d.w / 2.0) * this.z, this.y + (-d.h / 2.0) * this.z, d.w * this.z, d.h * this.z);
    }
    */
    //------------------------------------------------------------
    // 画像イメージを直接取得して表示させる。
    // 引数 G :画像(イメージデータ X,Y: 座標
    //------------------------------------------------------------
    this.putImage = function (gr, x, y) {

        //var o = {};
        var o = selectBuffer();

        o.img = gr;
        o.sx = x;
        o.sy = y;
        o.mode = DRAWIMG_XY;

        /*
        o.g = gr;
        o.x = x;
        o.y = y;
        o.draw = sp_putimage
        */
        ef_item[ef_item.length] = o;

    }
    /*
    function sp_putimage(device) {

        device.drawImage(this.g, this.x, this.y);

    }
    */
    //------------------------------------------------------------
    // 画像イメージを直接取得して表示させる。（ほぼテスト用）
    // 引数 G :画像(イメージデータ X,Y: 座標 w,h表示サイズ指定
    //------------------------------------------------------------
    this.putImage2 = function (gr, x, y, w, h) {

        //var o = {};
        var o = selectBuffer();

        o.img = gr;
        o.sx = x;
        o.sy = y;
        o.sw = w;
        o.sh = h;

        o.mode = DRAWIMG_XYWH;

        /*
        o.g = gr;
        o.x = x;
        o.y = y;
        o.w = w;
        o.h = h;

        o.draw = sp_putimage2
        */
        ef_item[ef_item.length] = o;
    }
    /*
    function sp_putimage2(device) {

        device.drawImage(this.g, this.x, this.y, this.w, this.h);

    }
    */
    //------------------------------------------------------------
    // 画像イメージを直接取得して表示させる。（Transform付き）
    // 引数 G :画像(イメージデータ) X,Y: 座標 m11,m12,m21,m22 変換座標
    //------------------------------------------------------------
    this.putImageTransform = function (gr, x, y, m11, m12, m21, m22) {

        //var o = {};
        var o = selectBuffer();

        o.img = gr;
        o.tx = x;
        o.ty = y;
        o.m11 = m11;
        o.m12 = m12;
        o.m21 = m21;
        o.m22 = m22;

        o.mode = PUTIMAGETRANSFORM;

        /*
        o.g = gr;
        o.x = x;
        o.y = y;

        o.m11 = m11;
        o.m12 = m12;
        o.m21 = m21;
        o.m22 = m22;

        o.draw = sp_putimageTr
        */
        ef_item[ef_item.length] = o;

    }
    /*
    function sp_putimageTr(device) {

        device.save();

        device.setTransform(this.m11, this.m12, this.m21, this.m22, this.x, this.y);
        device.drawImage(this.g, 0, 0);

        device.restore();

    }
    */
    //---------------------------------------------------------
    ///Transform
    //---------------------------------------------------------
    this.transform = function (m11, m12, m21, m22) {

        device.setTransform(m11, m12, m21, m22, 0, 0);
    }

    //------------------------------------------------------------
    // クラスで表示コマンドを登録して表示させる。
    // 引数 cl:class
    //------------------------------------------------------------
    this.putFunc = function (cl) {

        //ここで登録するクラスには表示の為に"draw( device )" functionを必ず登録
        ef_item[ef_item.length] = cl;

    }

    //---------------------------------------------------------
    ///画面消去(クリア）
    //---------------------------------------------------------
    this.clear = function (c_str) {

        device.save();
        device.setTransform(1, 0, 0, 1, 0, 0);
        device.clearRect(0, 0, canvas.width, canvas.height);
        device.restore();

        if (Boolean(c_str)) {
            device.fillStyle = c_str;
            device.fillRect(0, 0, canvas.width, canvas.height);
        }
    }

    //-----------------------------------------------------
    //部分クリア(色指定で部分塗りつぶし）ただし遅延実行されない
    //----------------------------------------------------
    this.fill = function (x, y, w, h, c_str) {

        if (Boolean(c_str)) {
            device.fillStyle = c_str;
            device.fillRect(x, y, w, h);
        } else {
            device.clearRect(x, y, w, h);
        }
    }

    //----------------------------------------------------------
    //描画バッファ配列のリセット
    //----------------------------------------------------------
    this.reset = function () {

        ef_item = [];
        buf_count = 0;
        //
    }

    //----------------------------------------------------------
    //描画
    //----------------------------------------------------------
    this.draw = function () {

        //		alert("in_draw");

        // ef draw
        //for (var i in ef_item) {
        for (var i = 0, loopend = ef_item.length; i < loopend; i++) {
            ef_item[i].draw(device);

            //if (i>1999) break;

        }
        if (efmax < ef_item.length) efmax = ef_item.length;

    }

    //----------------------------------------------------------
    //
    //----------------------------------------------------------
    this.count = function () {

        return efmax;
    }

    var NON_DRAW = 0;
    var SP_PUT = 1;
    var DRAWIMG_XYWH_XYWH = 2;
    var DRAWIMG_XYWH = 3;
    var DRAWIMG_XY = 4;
    var FILLTEXT = 5;
    var PUTIMAGETRANSFORM = 6;

    function ScreenSubClass() {

        this.img;
        this.text;

        this.sx;
        this.sy;
        this.sw;
        this.sh;

        this.dx;
        this.dy;
        this.dw;
        this.dh;

        this.color;

        this.use_tranceform;
        this.light_enable;

        this.m11;
        this.m12;
        this.m21;
        this.m22;

        this.tx;
        this.ty;

        this.alpha;
        this.r;

        this.mode; // DrawMode;
    }
    ScreenSubClass.prototype.func = [];
    ScreenSubClass.prototype.func[NON_DRAW] = function (device) {
        //use 

    }
    ScreenSubClass.prototype.func[SP_PUT] = function (device) {
        //use img, sx, sy, sw, sh, dx, dy, dw, dh, m11, m12, m21, m22, tx, ty, alpha, r
        device.save();

        device.setTransform(this.m11, this.m12, this.m21, this.m22, this.tx, this.ty);
        if (this.r != 0) { device.rotate(Math.PI / 180 * this.r); }

        if (this.alpha == 255) {
            device.globalCompositeOperation = "source-over";
        } else {
            if (this.light_enable) device.globalCompositeOperation = "lighter"; //source-over
            device.globalAlpha = this.alpha * (1.0 / 255);
        }

        device.drawImage(this.img, this.sx, this.sy, this.sw, this.sh, this.dx, this.dy, this.dw, this.dh);

        device.restore();
    }
    ScreenSubClass.prototype.func[DRAWIMG_XYWH_XYWH] = function (device) {
        //use img, sx, sy, sw, sh, dx, dy, dw, dh
        device.drawImage(this.img, this.sx, this.sy, this.sw, this.sh, this.dx, this.dy, this.dw, this.dh);
    }
    ScreenSubClass.prototype.func[DRAWIMG_XYWH] = function (device) {
        //use img, sx, sy, sw, sh
        device.drawImage(this.img, this.sx, this.sy, this.sw, this.sh);
    }
    ScreenSubClass.prototype.func[DRAWIMG_XY] = function (device) {
        //use img, sx, sy, sw, sh
        device.drawImage(this.img, this.sx, this.sy);
    }
    ScreenSubClass.prototype.func[FILLTEXT] = function (device) {
        //use text, sx, sy, color
        device.fillStyle = this.color;
        device.fillText(this.text, this.sx, this.sy);
    }
    ScreenSubClass.prototype.func[PUTIMAGETRANSFORM] = function (device) {
        //use img, m11, m12, m21, m22, tx, ty
        device.save();

        device.setTransform(this.m11, this.m12, this.m21, this.m22, this.tx, this.ty);
        device.drawImage(this.img, 0, 0);

        device.restore();
    }
    ScreenSubClass.prototype.draw = function (device) {
        //use mode
        this.func[this.mode].call(this, device);
    }


}



