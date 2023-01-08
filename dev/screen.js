//=============================================================
// Screenクラス(旧・新システム間の変換接続機構として)2023/01/07
//
//=============================================================
function Screen(scrn) {//g.screen（DisplayControll）[x]

    //キャラクタパターンテクスチャー
    var tex_p = new Image();
    tex_p.src = "pict/cha.png";

    var tex_c = new Image();
    tex_c.src = "pict/aschr.png";

    var sp_ch_ptn = []; //スプライトキャラクタパターン

    this.cw = scrn.cw;
    this.ch = scrn.ch;

    var spReady = false;
    var chReady = false;

    this.sprite_texture_ready = spReady;
    this.character_texture_ready = chReady;

    tex_p.onload = function () { spReady = true; }
    tex_c.onload = function () { chReady = true; }

    this.readystate_check = function () {
        this.sprite_texture_ready = spReady;
        this.character_texture_ready = chReady;
    }

    var sp_ptn = spdata();

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
        var d = sp_ptn[sp];

    	//Debug(error回避)用
        if (!Boolean(d)) {
            scrn.buffer.fillText(sp, x, y);
        }

        if (!Boolean(m)) { m = 0; }
        if (!Boolean(r)) { r = 0; }
        if (!Boolean(alpha)) { alpha = 255; }
        if (!Boolean(z)) { z = 1.0; }

        var simple = ((m == 0) && (r == 0) && (alpha == 255));

        if (simple) {

            var dx = x + (-d.w / 2) * z;
            var dy = y + (-d.h / 2) * z;
            var dw = d.w * z;
            var dh = d.h * z;
        
            scrn.putPattern(tex_p, d, dx, dy, dw, dh );

        } else {

            var dx = (-d.w / 2) * z;
            var dy = (-d.h / 2) * z;
            var dw = d.w * z;
            var dh = d.h * z;

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
    }
    //-------------------------------------------------------------
    ///マップチップ用パターン描画
    ///引数（省略不可
    /// gr:Image()
    ///	ptn : パターン番号（またはx,y,w,hの入ったオブジェクト）
    /// X,Y : 表示位置
    ///	w,h: 表示幅/高さ
    //-------------------------------------------------------------
    this.putPattern = function (gr, ptn, x, y, w, h) {
        scrn.putPattern(gr, ptn, x, y, w, h );
    }
    //-------------------------------------------------------------
    ///文字列の表示
    ///引数 S:文字列 X,Y:座標 c:Color
    //-------------------------------------------------------------
    this.print = function (str, x, y, c) {
        scrn.print(str, x, y, c);
    }
    //-------------------------------------------------------------
    /// スプライトを文字として表示(パターン配置をSpace～[~]のASCII配列と仮定で)
    /// 引数 S : 文字列 X,Y : 座標 z:zoom
    //-------------------------------------------------------------
    //表示位置はx,yが左上となるように表示されます。
    this.putchr = function (str, x, y, z) {
        var zflag = false;
        if (!Boolean(z)) {
            z = 1.0;

        } else {
            if (z != 1.0) zflag = true;
        }

        for (var i = 0, loopend = str.length; i < loopend; i++) {
            var n = str.charCodeAt(i);

            if ((n >= 32) && (n < 128)) { // space ～ "~" まで

                var d = sp_ch_ptn[n - 32];
                var dx = x + i * (12 * z);
                var dy = y ;
                if (zflag) {
                    dx += (-d.w / 2) * z;
                    dy += (-d.h / 2) * z;
                }
                var dw = d.w * z;
                var dh = d.h * z;

                scrn.putPattern(tex_c, d, dx, dy, dw, dh );
            }
        }
    }

    //-------------------------------------------------------------
    /// スプライトを文字として表示(パターン配置をSpace～[~]のASCII配列と仮定で)
    /// 引数 S : 文字列 X,Y : 座標
    //-------------------------------------------------------------
    //表示位置はx,yが左上となるように表示されます。
    this.putchr8 = function (str, x, y) {
        for (i = 0; i < str.length; i++) {
            var n = str.charCodeAt(i);

            if ((n >= 32) && (n < 128)) { // space ～ "~" まで

                var d = sp_ch_ptn8[n-32];
                var dx = x + i * 8;
                var dy = y;
                var dw = d.w;
                var dh = d.h;

                scrn.putPattern(tex_c, d, dx, dy, dw, dh );
            }
        }
    }
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

                var d = sp8[c][n-32];
                var dx = x + i * (8 * z) + (-d.w / 2) * z;
                var dy = y + (-d.h / 2) * z;
                var dw = d.w * z;
                var dh = d.h * z;

                scrn.putPattern(tex_c, d, dx, dy, dw, dh );
            }
        }
    }
    //------------------------------------------------------------
    // 画像イメージを直接取得して表示させる。
    // 引数 G :画像(イメージデータ X,Y: 座標
    //------------------------------------------------------------
    this.putImage = function (gr, x, y) {
        scrn.putImage(gr, x, y);
    }
    //------------------------------------------------------------
    // 画像イメージを直接取得して表示させる。（ほぼテスト用）
    // 引数 G :画像(イメージデータ X,Y: 座標 w,h表示サイズ指定
    //------------------------------------------------------------
    this.putImage2 = function (gr, x, y, w, h) {
        scrn.drawImgXYWH(gr, x, y, w, h);
    }
    //------------------------------------------------------------
    // 画像イメージを直接取得して表示させる。（Transform付き）
    // 引数 G :画像(イメージデータ) X,Y: 座標 m11,m12,m21,m22 変換座標
    //------------------------------------------------------------
    this.putImageTransform = function (gr, x, y, m11, m12, m21, m22) {
        scrn.putImageTransform(gr, x, y, m11, m12, m21, m22);
    }
    //---------------------------------------------------------
    ///Transform
    //---------------------------------------------------------
    this.transform = function (m11, m12, m21, m22) {
        scrn.buffer.transform(m11, m12, m21, m22);
    }
    //------------------------------------------------------------
    // クラスで表示コマンドを登録して表示させる。
    // 引数 cl:class
    //------------------------------------------------------------
    this.putFunc = function (cl) {
        //ここで登録するクラスには表示の為に"draw( device )" functionを必ず登録
        scrn.putFunc(cl);
    }
    //---------------------------------------------------------
    ///画面消去(クリア）
    //---------------------------------------------------------
    this.clear = function (c_str) {
        scrn.clear(c_str);
    }
    //-----------------------------------------------------
    //部分クリア(色指定で部分塗りつぶし）
    //----------------------------------------------------
    this.fill = function (x, y, w, h, c_str) {
        scrn.fill(x, y, w, h, c_str);
    }
    //----------------------------------------------------------
    //描画バッファ配列のリセット
    //----------------------------------------------------------
    this.reset = function () {

        scrn.reset();
    }
    //----------------------------------------------------------
    //描画
    //----------------------------------------------------------
    this.draw = function () {

        scrn.draw();

        /*

        for (var i = 0, loopend = ef_item.length; i < loopend; i++) {
            ef_item[i].draw(device);

        }
        if (efmax < ef_item.length) efmax = ef_item.length;
        */
    }

    //----------------------------------------------------------
    //
    //----------------------------------------------------------
    this.count = function () {

        return scrn.count();
    }
}



