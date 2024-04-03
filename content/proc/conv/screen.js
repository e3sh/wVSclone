//=============================================================
// Screenクラス(旧・新システム間の変換接続機構として)2023/01/07
//
//=============================================================
function Screen(g,num) {//g.screen（DisplayControll）[num]

    let scrn = g.screen[num];
    //document.getElementById("console").innerHTML = g.asset.Image;
    //キャラクタパターンテクスチャー
    //let tex_p = g.asset.image["SPGraph"].img;

    this.cw = scrn.cw;
    this.ch = scrn.ch;
    
    let fcolor = ["8x8white", "8x8red", "8x8green", "8x8blue", "stfont"];

    let sp_ptn = spdata();

    this.view = scrn.view;
    this.flip = scrn.flip;

    //this.interval = scrn.interval; // 自動更新での更新間隔(0:自動更新なし　1:毎回　2～:間隔)
    //this.backgroundcolor = scrn.backgroundcolor; //defaultBackgroundcolor;

    this.setInterval = scrn.setInterval;
    this.setBackgroundcolor = scrn.setBackgroundcolor;

    this.getInterval = scrn.getIntarval;
    this.getBackgroundcolor = scrn.getBackgroundcolor;

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
        let d = sp_ptn[sp];
        let tex_p = g.asset.image[d.pict].img;

    	//Debug(error回避)用
        if (!Boolean(d)) {
            scrn.buffer.fillText(sp, x, y);
            return;
        }

        if (!Boolean(m)) { m = 0; }
        if (!Boolean(r)) { r = 0; }
        if (!Boolean(alpha)) { alpha = 255; }
        if (!Boolean(z)) { z = 1.0; }

        let simple = ((m == 0) && (r == 0) && (alpha == 255));

        if (simple) {

            let dx = x + (-d.w / 2) * z;
            let dy = y + (-d.h / 2) * z;
            let dw = d.w * z;
            let dh = d.h * z;
        
            scrn.putPattern(tex_p, d, dx, dy, dw, dh );

        } else {

            let dx = (-d.w / 2) * z;
            let dy = (-d.h / 2) * z;
            let dw = d.w * z;
            let dh = d.h * z;

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
    }
    
    //-------------------------------------------------------------
    /// スプライトを文字として表示(パターン配置をSpace～[~]のASCII配列と仮定で)
    /// 引数 S : 文字列 X,Y : 座標 z:zoom
    //-------------------------------------------------------------
    //表示位置はx,yが左上となるように表示されます。
    this.putchr = function (str, x, y, z) {
        fontput(str, x, y, 4, z);
    }
    //-------------------------------------------------------------
    /// スプライトを文字として表示(パターン配置をSpace～[~]のASCII配列と仮定で)
    /// 引数 S : 文字列 X,Y : 座標
    //-------------------------------------------------------------
    //表示位置はx,yが左上となるように表示されます。
    this.putchr8 = function (str, x, y) {
        fontput(str, x, y, 0);
    }
    //-------------------------------------------------------------
    /// スプライトを文字として表示(パターン配置をSpace～[~]のASCII配列と仮定で)
    /// 引数 S : 文字列 X,Y : 座標 c:color (0:white 1:red 2:green 3:blue) z:zoom
    //-------------------------------------------------------------
    //表示位置はx,yが左上となるように表示されます。
    this.putchr8c = function (str, x, y, c) {
        fontput(str, x, y, c);
    }
    //-------------------------------------------------------------
    this.kprint = function(str, x, y){
        g.state.System.dev.kanji.useScreen(num); 
        g.state.System.dev.kanji.print(str, x, y);
    }
    this.kputchr = function(str, x, y, z){
        g.state.System.dev.kanji.useScreen(num); 
        g.state.System.dev.kanji.putchr(str, x, y, z);
    }

    //-------------------------------------------------------------
    function fontput(str, x, y, c, z){
        if (g.font[fcolor[c]]){
            g.font[fcolor[c]].useScreen(num); 
            g.font[fcolor[c]].putchr(str, x, y, z);
        }
    }
    //-------------------------------------------------------------
    this.putPattern = scrn.putPattern;
    this.print = scrn.print;
    this.putImage = scrn.putImage;
    this.putImage2 = scrn.drawImgXYWH;
    this.putImageTransform = scrn.putImageTransform;
    this.transform = scrn.buffer.transform;
    this.putFunc = scrn.putFunc;
    this.clear = scrn.clear;
    this.fill = scrn.fill;
    this.reset = scrn.reset;
    this.reflash = scrn.reflash;
    this.draw = scrn.draw;
    this.count = scrn.count;
    this.max = scrn.max;
}



