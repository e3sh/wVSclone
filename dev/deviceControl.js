//**************************************************************
//deviceControl
//画面表示、入力関係（キーボード、マウス）、サウンド、イメージ
//　を多重定義しないようにまとめて扱うクラス。
//  単純に使う場合、不要かもしれない。
//**************************************************************

function deviceControl(){

    //initialize

    var SCREEN_PAGES = 4;

    var dsp = [];

    for (var i = 0; i < SCREEN_PAGES; i++) {
        dsp[i] = new Screen("Layer" + i, 640, 480);
    }
    
    //dsp[0]:Layer0 背景用(Background用） 
    //dsp[1]:Layer1 中間面(Sprite用） 
    //dsp[2]:Layer2 前景用(Forground用） 
    //dsp[3]:Layer3 最前面(Text/Status用） 
	//Public

	//canvas
	this.graphics = dsp;

	this.canvas = dsp; //使ってないと思うが互換性の為
	this.text = dsp[3]; //前にText面があったときの名残で互換性の為残っている。

	this.gs = new geometoryTrance();
    this.layout = new gameLayout();

    this.mouse_state = new inputControl("Layer3"); //<=現状ではマウス入力はWindow全体から行われるので引数無効

    var keys = new inputKeyboard();

    this.vkey_state = new vartualKeyControl();

    this.key_state = new keyEntryManager(this.mouse_state, keys, this.vkey_state);  //keys;

	this.sound = new soundControl();
	this.images = new loadingImages();

	//vkeyControl init

	var vtop = 200;
	var vleft = 50;

	var map = [[vleft + 50, vtop, 100, 100, [38]],//up
    [vleft, vtop + 50, 100, 100, [37]], //left
    [vleft + 100, vtop + 50, 100, 100, [39]],//right
    [vleft + 50, vtop + 100, 100, 100, [40]],//down
    [vleft + 250, vtop + 50, 100, 100, [90]],//z
    [vleft + 350, vtop + 50, 100, 100, [88]],//x
    [vleft + 450, vtop + 50, 100, 100, [67]],//c
    ];

	this.vkey_state.init(map);
}