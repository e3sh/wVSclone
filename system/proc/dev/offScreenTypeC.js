﻿
// offScreenクラス
// (offscreen buffer)
//
// offScreenCanvasに随時描画
//(Chrome69＿Sep.2018でサポートとの事なので対応
//
//一度作成したらあまり書き換えないといった使い方をする場合に良い
//UIを作成したあとにフレーム毎ではなく必要時書き換えで使うとか
//全画面表示したいので表示はキャンバスを重ねないようにする
//(mainのCanvasに全部表示させる）

function offScreenTypeC( w, h, ix, iy ){//typeOffscreenCanvas版
    //w : width, h:height
    const element = new OffscreenCanvas( w, h );

    const offset_x = ix;
    const offset_y = iy;
/*
const offscreenCanvas = new OffscreenCanvas(200, 200);
const offscreenContext = offscreenCanvas.getContext('2d');
offscreenContext.fillStyle = 'red';
offscreenContext.fillRect(0, 0, 200, 200);

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
context.drawImage(offscreenCanvas, 0, 0);
*/
//2018頃にOFFSCREENcanvasが実装されたみたいなのでOFFSCREENCとして実装

    //var element = document.createElement("canvas");
    element.width = w;
    element.height = h;

    const device = element.getContext("2d");

    var enable_draw_flag = true;
    var enable_reset_flag = true;

    this.view = function ( flg ){ //flg : bool
        if (typeof flg == "boolean") {
            enable_draw_flag = flg;
        }
        return enable_draw_flag;
    }

    this.flip = function( flg ){
        if (typeof flg == "boolean") {
            enable_reset_flag = flg;
        }
        return enable_draw_flag;
    }
    //this.flip = function ( outdev ) {

    //    outdev.putImageData(device.getImageData(0, 0, element.width, element.height), 0, 0);
    //}

    //-------------------------------------------------------------
    //SP_PUT
    //use img, sx, sy, sw, sh, dx, dy, dw, dh, m11, m12, m21, m22, tx, ty, alpha, r
    //-------------------------------------------------------------
    this.spPut = function (img, sx, sy, sw, sh, dx, dy, dw, dh, m11, m12, m21, m22, tx, ty, alpha, r) {

        device.save();

        device.setTransform(m11, m12, m21, m22, tx, ty);
        if (r != 0) { device.rotate(Math.PI / 180 * r); }

        if (alpha == 255) {
            device.globalCompositeOperation = "source-over";
        } else {
            //if (this.light_enable) device.globalCompositeOperation = "lighter"; //source-over
            device.globalAlpha = alpha * (1.0 / 255);
        }

        device.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);

        device.restore();
    }

    //-------------------------------------------------------------
    //DRAWIMG_XYWH_XYWH
    //use img, sx, sy, sw, sh, dx, dy, dw, dh
    //-------------------------------------------------------------
    this.drawImgXYWHXYWH = function (img, sx, sy, sw, sh, dx, dy, dw, dh) {

        device.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
    }

    //-------------------------------------------------------------
    //FILLTEXT
    //use text, sx, sy, color
    //-------------------------------------------------------------
    this.fillText = function (str, x, y, c) {

        if (!Boolean(c)) { c = "limegreen"; }

        device.fillStyle = c;
        device.fillText(str, x, y);
    }
   
    //------------------------------------------------------------
    //DRAWIMG_XY
    //use img, sx, sy, sw, sh
    //------------------------------------------------------------
    this.drawImgXY = function (img, sx, sy) {
        
        device.drawImage(img, sx, sy);
    }

    //------------------------------------------------------------
    //DRAWIMG_XYWH
    //use img, sx, sy, sw, sh
    //------------------------------------------------------------
    this.drawImgXYWH = function (img, sx, sy, sw, sh) {

        device.drawImage(img, sx, sy, sw, sh);
    }

    //------------------------------------------------------------
    //PUTIMAGETRANSFORM
    //use img, m11, m12, m21, m22, tx, ty
    //------------------------------------------------------------
    this.putImageTransform = function (img, x, y, m11, m12, m21, m22) {

        device.save();

        device.setTransform(m11, m12, m21, m22, x, y);
        device.drawImage(img, 0, 0);

        device.restore();
    }

    //---------------------------------------------------------
    //TRANSFORM
    //use m11, m12, m21, m22, tx, ty
    //---------------------------------------------------------
    this.transform = function (m11, m12, m21, m22) {
        //dummy
    }

    //------------------------------------------------------------
    // クラスで表示コマンドを登録して表示させる。
    // 引数 cl:class
    //------------------------------------------------------------
    this.putFunc = function (cl) {

        cl.draw(device);
        //ここで登録するクラスには表示の為に"draw( device )" functionを必ず登録
    }

    //---------------------------------------------------------
    //ALLCLEAR
    //use sx, sy, sw, sh
    //---------------------------------------------------------
    this.allClear = function (sx, sy, sw, sh) {

        device.save();

        device.setTransform(1, 0, 0, 1, 0, 0);
        device.clearRect(sx, sy, sw, sh);

        device.restore();
    }

    //-----------------------------------------------------
    //FILLRECT
    //use sx, sy, sw, sh, color
    //----------------------------------------------------
    this.fillRect = function (sx, sy, sw, sh, color) {

        if (Boolean(color)) {
            device.fillStyle = color;
            device.fillRect(sx, sy, sw, sh);
        } else {
            device.clearRect(sx, sy, sw, sh);
        }
    }

    //----------------------------------------------------------
    //描画バッファ配列のリセット(offScreenバッファのクリア)
    //----------------------------------------------------------
    this.reset = function () {

        if (enable_reset_flag){
            this.allClear(0, 0, w, h);
        }
    }

    //----------------------------------------------------------
    //(flameloopで実行用）offScreenバッファのクリア
    //----------------------------------------------------------
    this.reflash = function () {

        if (enable_reset_flag){
            this.reset();
        }
    }

    //----------------------------------------------------------
    //描画
    //----------------------------------------------------------
    this.draw = function ( outdev ) {

        if (enable_draw_flag){
        //outdev.clearRect(x, y, w, h);
            outdev.drawImage(element, offset_x, offset_y);
        }
        //this.flip(outdev);
    }

    //----------------------------------------------------------
    //
    //----------------------------------------------------------
    this.count = function () {
        //dummy
        return "mode";
    }

    //----------------------------------------------------------
    //
    //----------------------------------------------------------
    this.max = function () {
        //dummy
        return "C";
    }



    //
}



