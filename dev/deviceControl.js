// old comversion WGVS対応へ変換対応で残置
//**************************************************************
//deviceControl
//画面表示、入力関係（キーボード、マウス）、サウンド、イメージ
//　を多重定義しないようにまとめて扱うクラス。
//**************************************************************
function deviceControl( g ){
    //document.getElementById("console").innerHTML = image(g.asset.image["BG1"]);
    var SCREEN_PAGES = g.screen.length; //alert("g:"+ g.screen.length);

    var dsp = [];

    for (var i = 0; i < SCREEN_PAGES; i++) {
        dsp[i] = new Screen(g, i);
    }

    //dsp[0]:Layer0 背景用(Background用） 
    //dsp[1]:Layer1 中間面(Sprite用） 
    //dsp[2]:Layer2 前景用(Forground用） 
    //dsp[3]:Layer3 前面(Text/Status/UI用） 
    //dsp[4]:Layer4 最前面(sceneCtrl_WipeEffect用） 

    dsp[0].setBackgroundcolor("black");

    //dsp[0].flip(false);
    //dsp[3].view(false);
    //dsp[0].setInterval(3);
    //dsp[1].setInterval(3);
    //dsp[2].setInterval(3);
    dsp[3].setInterval(6); //6flame毎に書き換え/表示
    

    this.graphics = dsp;

	//this.canvas = dsp; //使ってないと思うが互換性の為
	//this.text = dsp[3]; //前にText面があったときの名残で互換性の為残っている。

	this.gs = new geometoryTrance();
    this.layout = new gameLayout();

    this.mouse_state = g.mouse;
    var keys = g.keyboard;

    this.key_state = keys;  //keys;

	this.sound = new soundControl();

    this.game = g;
    /*
    var img = [];
    img["FontGraph"] = g.asset.image["FontGraph"].img;
    img["SPGraph"]  = g.asset.image["SPGraph"].img;
    img["bg1"]      = g.asset.image["bg1"].img;
    img["bg2"]      = g.asset.image["bg2"].img;
    img["bg3"]      = g.asset.image["bg3"].img;

	//this.images = new loadingImages();
	this.images = img;
    */
    this.userinput = new mixuserinput(g);

    function mixuserinput(g){

        var key = g.keyboard;
        var gpd = g.gamepad;

        //mix input Keyboard and Gamepad 
        this.r = -1; //進行方法のr
        this.a = false;
        this.b = false;
        this.c = false;
        this.d = false;
        this.e = false;

        this.check = function(){

            //各プロパティの更新
            //a_button  Attack z,space  btn_a
            //b         Jump   c,       btn_b
            //c         Bomb   x,ctrl   btn_x   
            //d         Q               btn_y
            //e         Esc             btn_start
            var state = key.state();

            if (gpd.check()){

            }

            return true;
        }

    }
}
