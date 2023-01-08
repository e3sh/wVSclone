// old comversion WGVS対応へ変換対応で残置
//**************************************************************
//deviceControl
//画面表示、入力関係（キーボード、マウス）、サウンド、イメージ
//　を多重定義しないようにまとめて扱うクラス。
//**************************************************************
function deviceControl( g ){

    var SCREEN_PAGES = 4;

    var dsp = [];

    for (var i = 0; i < SCREEN_PAGES; i++) {
        dsp[i] = new Screen(g.screen[i]);
    }
    //dsp[0]:Layer0 背景用(Background用） 
    //dsp[1]:Layer1 中間面(Sprite用） 
    //dsp[2]:Layer2 前景用(Forground用） 
    //dsp[3]:Layer3 最前面(Text/Status用） 

    this.graphics = dsp;

	this.canvas = dsp; //使ってないと思うが互換性の為
	this.text = dsp[3]; //前にText面があったときの名残で互換性の為残っている。

	this.gs = new geometoryTrance();
    this.layout = new gameLayout();

    this.mouse_state = g.mouse;
    var keys = g.keyboard;

    this.key_state = keys;  //keys;

	this.sound = new soundControl();
	this.images = new loadingImages();
}