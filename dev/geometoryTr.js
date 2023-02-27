//=============================================================
// GeometoryTrancerateクラス
// 画面表示とゲームワールドの座標変換用(簡易だから別にするまでもないか？
//=============================================================
function geometoryTrance() {

this.worldwidth = 3000;//とりあえず
this.worldheight = 3000;

this.stagewidth = 700;
this.stageheight = 530;

this.viewwidth = 640;
this.viewheight = 480;

this.world_x = 0;
this.world_y = 0;

var ww = this.worldwidth;
var wh = this.worldheight;

var sw = this.stagewidth;
var sh = this.stageheight;

var vw = this.viewwidth;
var vh = this.viewheight;

var workWorldX = this.world_x;
var workWorldY = this.world_y;

//用途はほぼマウス位置からの座標変換で移動とかのフォロー用
this.viewtoWorld = function (x, y) {

    var w = {}

    w.x = this.world_x + x;
    w.y = this.world_y + y;

    return w;
}
//ゲームオブジェクトは基本的にこちらで変換してから表示
this.worldtoView = function (x, y) {

    var w = {}

    w.x = Math.trunc(x - this.world_x);
    w.y = Math.trunc(y - this.world_y);

    return w;
}
//ワールド座標におけるビューポートの位置(初期値など）設定
this.viewpos = function (x, y) {
    //左端の座標を指定とする。
    if (x < 0) x = 0;
    if (y < 0) y = 0;
    //if (x < 0) x = ww + x;//0;
    //if (y < 0) y = wh + y;//0;
    if (x > (ww - vw)) x = ww - vw;//ww - vw;
    if (y > (wh - vh)) y = wh - vh;//wh - vh;
    //if (x > ww) x = x - ww;//ww - vw;
    //if (y > wh) y = y - wh;//wh - vh;

    //    this.world_x = x;
    //    this.world_y = y;

    workWorldX = Math.trunc(x);
    workWorldY = Math.trunc(y);
}

//viewposの設定を確定する（直接プロパティを触った場合は知らん）
this.commit = function () {

    this.world_x = workWorldX;
    this.world_y = workWorldY;
}

//Stageの座標を返す
this.nowstagepos = function () {

    var w = {}

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
}

//入力した座標がStage内の場合True
this.in_stage = function (x, y) {

    var f = false;

    if ((this.world_x + (vw / 2) - (sw / 2) <= x) && (this.world_x + (vw / 2) + (sw / 2) >= x)
    && (this.world_y + (vh / 2) - (sh / 2) <= y) && (this.world_y + (vh / 2) + (sh / 2) >= y))
        f = true;

    return f;

}
//入力した座標がView内の場合True
this.in_view = function (x, y) {

    var f = false;

    if ((this.world_x <= x) && (this.world_x + vw >= x) && (this.world_y <= y) && (this.world_y + vh >= y))
        f = true;

    return f;
}

//入力した範囲はViewに含まれる場合True
this.in_view_range = function (x, y, w, h) {

    var f = false;

    if ((Math.abs((this.world_x + vw / 2) - (x + w / 2)) < (vw + w) / 2) &&
     (Math.abs((this.world_y + vh / 2) - (y + h / 2)) < (vh + h) / 2))
        f = true;

//    f = true;

    return f;

}

//入力した範囲はStageに含まれる場合True
this.in_stage_range = function (x, y, w, h) {

    var f = false;

    if ((Math.abs((this.world_x + sw / 2) - (x + w / 2)) < (sw + w) / 2) &&
     (Math.abs((this.world_y + sh / 2) - (y + h / 2)) < (sh + h) / 2))
        f = true;

    return f;

}

//座標位置がワールド内にあるかどうかの確認と変換
this.in_world = function(x,y){

    return ((x < 0) || (x > ww) || (y < 0) || (y > wh)) ? false: true;
}

this.worldtoWorld_x = function(x){

    if (x < 0) x = ww + x;;
    if (x > ww) x = x - ww;

    return x;
}

this.worldtoWorld_y = function(y){
;
    if (y < 0) y = wh + y;;
    if (y > wh) y = y - wh;

    return y;
}



//this//.setWorldsize = function(){}

//this.setStagesize = function(){}

//this.setViewsize = function(){}



    //-------------------------------------------------------------
    //-------------------------------------------------------------







}



