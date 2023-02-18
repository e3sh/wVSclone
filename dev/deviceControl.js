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

    //this.key_state = keys;  //keys;

    this.gpad_state = g.gamepad;

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
    var userinput = new mixuserinput(g);
    this.key_state = userinput;


    //this.keyptn = [];
    
    //this.start = function(){
    //    var w =["keycode_attack", "keycode_bomb", "keycode_jump", "keycode_quit", "keycode_pause",
    //    "btn_num_attack", "btn_num_bomb", "btn_num_jump", "btn_num_quit", "btn_num_pause"];

    //    for (var i = 0; i <10; i++){
    //        this.keyptn[w[i]] = g.state.Config.keyAn[i];  
    //    }    
    //}

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

            var k = g.state.Config.keyAn
 
            //各プロパティの更新
            //a_button  Attack z,space  btn_a
            //b         Jump   c,       btn_b
            //c         Bomb   x,ctrl   btn_x   
            //d         Q               btn_y
            //e         Esc             btn_start
            var state = [];

            if (gpd.check()){
                this.r = gpd.r; //進行方法のr
                this.a = gpd.btn_a;
                this.b = gpd.btn_b;
                this.c = gpd.btn_x;
                this.d = gpd.btn_y;
                this.e = gpd.btn_start;

                //if (gpd.upkey) state[38] = true;
                //if (gpd.downkey) state[40] = true;
                //if (gpd.leftkey) state[37] = true;
                //if (gpd.rightkey) state[39] = true;
                state[38] = gpd.upkey;// || Boolean(state[38]) ;
                state[40] = gpd.downkey;//|| Boolean(state[40]) ;
                state[37] = gpd.leftkey;// || Boolean(state[37]) ;;
                state[39] = gpd.rightkey;// || Boolean(state[39]) ;

                //state[90] = gpd.btn_a;// || Boolean(state[90]) ;
               // state[67] = gpd.btn_b;// || Boolean(state[67]) ;
                //state[88] = gpd.btn_x;// || Boolean(state[88]) ;
                //state[81] = gpd.btn_y;// || Boolean(state[81]) ;
                //state[27] = gpd.btn_start;// || Boolean(state[27]) ;

                state[90] = gpd.btn_x;// || Boolean(state[90]) ;Z ATTACK
                state[67] = gpd.btn_a;// || Boolean(state[67]) ;C JUMP 
                state[88] = gpd.btn_b;// || Boolean(state[88]) ;X BOMB
                state[81] = gpd.btn_y;// || Boolean(state[81]) ;Q QUIT
                state[27] = gpd.btn_start;// || Boolean(state[27]) ;ESC 
            }
            var wstate = key.check();
            for (var i in wstate){
                state[i] = state[i] || wstate[i];
            }
            
            return state;
        }

    }
}
