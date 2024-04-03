//=============================================================
// GeometoryTrancerateクラス
// 画面表示とゲームワールドの座標変換用
//=============================================================
function geometoryTrance() {

    this.worldwidth = 2976;//とりあえずblock96*31
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

    function rangeCheck(s, r){ // s r range{x; y; w; h} return bool
        return ((Math.abs((s.x + s.w / 2) - (r.x + r.w / 2)) < (s.w + r.w) / 2) &&
            (Math.abs((s.y + s.h / 2) - (r.y + r.h / 2)) < (s.h + r.h) / 2));
    }

    function pointCheck(p, r){// p point{x; y} r range{x; y; w; h} return bool
        return ((r.x <= p.x) && ((r.x  + r.w) >= p.x) && (r.y <= p.y) && ((r.y + r.h) >= p.y))
    }
    
    //用途はほぼマウス位置からの座標変換で移動とかのフォロー用
    this.viewtoWorld = function (x, y) {
        let w = {}
        w.x = this.world_x + x;
        w.y = this.world_y + y;

        return w;
    }

    //ゲームオブジェクトは基本的にこちらで変換してから表示
    this.worldtoView = function (x, y) {
        let w = {}
        if (this.world_x > ww - vw){
            if (x < vw){
                w.x = ww - this.world_x + x;
            }else{
                w.x = Math.trunc(x - this.world_x);
            }
        }else{
            w.x = Math.trunc(x - this.world_x);        
        }

        if (this.world_y > wh - vh){
            if (y < vh){
                w.y = wh - this.world_y + y;
            }else{
                w.y = Math.trunc(y - this.world_y);
            }
        }else{
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
    }

    //ワールド座標におけるビューポートの位置(初期値など）設定
    this.viewpos = function (x, y) {
        if (x < 0) x = ww + x;
        if (y < 0) y = wh + y;
        if (x > ww) x = x - ww;//ww - vw;
        if (y > wh) y = y - wh;//wh - vh;

        workWorldX = Math.trunc(x);
        workWorldY = Math.trunc(y);
    }

    //viewposの設定を確定する（直接プロパティを触った場合は知らん）
    this.commit = function () {

        let changef = false;

        if ((this.world_x != workWorldX)||
            (this.world_y != workWorldY)){

            this.world_x = workWorldX;
            this.world_y = workWorldY;

            changef = true;
        }

        this.changestate = changef;

        return changef; //変更有無:true/false　
    }

    //Stageの座標を返す
    this.nowstagepos = function () {

        let w = {}

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
        let p = {}; p.x = x; p.y = y;; p.w = 1; p.h = 1;
        let r = {};
        r.x = this.world_x + (vw / 2) - (sw / 2);
        r.y = this.world_y + (vh / 2) - (sh / 2);
        r.w = sw; r.h = sh;

        return in_range(p, r);
    }

    //入力した座標がView内の場合True
    this.in_view = function (x, y) {
        let p = {}; p.x = x; p.y = y; p.w = 1; p.h = 1;
        let r = {}; r.x = this.world_x; r.y = this.world_y; r.w = vw; r.h = sh;
        return in_range(p, r);
    }

    //入力した範囲はViewに含まれる場合True
    this.in_view_range = function (x, y, w, h) {
        let s = {}; s.x = x; s.y = y; s.w = w; s.h = h;
        let r = {}; r.x = this.world_x; r.y = this.world_y; r.w = vw; r.h = vh;
        return in_range(s, r);
    }

    //入力した範囲はStageに含まれる場合True
    this.in_stage_range = function (x, y, w, h) {
        let s = {}; s.x = x; s.y = y; s.w = w; s.h = h;
        let r = {}; r.x = this.world_x; r.y = this.world_y; r.w = sw; r.h = sh;
        return in_range(s, r);
    }

    function in_range(s, r){//loopscrollcheck
        let result = false;
        let x = s.x;
        let y = s.y;

        for (let i=0; i<=1 ;i++){
            for (let j=0; j<=1; j++){
                s.x = x + ww*i;
                s.y = y + wh*j;
                result = (result || rangeCheck(s, r));
            }
        }
        return result;
    }

    //座標位置がワールド内にあるかどうかの確認と変換
    this.in_world = function(x,y){

        return !((x < 0) || (x > ww) || (y < 0) || (y > wh));
    }

    this.worldtoWorld_x = function(x){

        if (x < 0) x = ww + x;;
        if (x > ww) x = x - ww;

        return x;
    }

    this.worldtoWorld_y = function(y){

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



