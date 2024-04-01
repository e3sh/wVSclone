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

    //dsp[1].flip(false);
    //dsp[2].flip(false);
    //dsp[3].flip(false);
    //dsp[4].flip(false);
    //dsp[3].view(false);
    //dsp[0].setInterval(3);
    //dsp[1].setInterval(3);
    //dsp[2].setInterval(3);
    //dsp[3].setInterval(6); //6flame毎に書き換え/表示

    this.graphics = dsp;

	//this.canvas = dsp; //使ってないと思うが互換性の為
	//this.text = dsp[3]; //前にText面があったときの名残で互換性の為残っている。

    this.kanji = new fontPrintControl(
        g,
        g.asset.image["KanjiHw"].img, 6, 8,
        g.asset.image["KanjiFw"].img,12, 8
    )

	this.gs = new geometoryTrance();
    this.layout = new gameLayout();

    this.mouse_state = g.mouse;
    var keys = g.keyboard;

    //this.key_state = keys;  //keys;

    this.gpad_state = g.gamepad;

	this.sound = new soundCntl(g.asset.sound);

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

    this.directionM = function( keystate ){

        const cmap = [
            38, 40, 37, 39, //↑, ↓, ←, →
            87, 83, 65, 68, //W, S, A, D
           104, 98,100,102  //8, 2, 4, 6 (TenKey)
        ];
        let result = [];
        for (let i in cmap){
            if (Boolean(keystate[cmap[i]])){
                result[i] = (keystate[cmap[i]])? true: false;
            }else{
                result[i] = false;
            }
        }
        return {
            up:    result[0] || result[4] || result[ 8], 
            down:  result[1] || result[5] || result[ 9], 
            left:  result[2] || result[6] || result[10], 
            right: result[3] || result[7] || result[11],
        };
    }
    //this.keyptn = [];
    
    //this.start = function(){
    //    var w =["keycode_attack", "keycode_bomb", "keycode_jump", "keycode_quit", "keycode_pause",
    //    "btn_num_attack", "btn_num_bomb", "btn_num_jump", "btn_num_quit", "btn_num_pause"];

    //    for (var i = 0; i <10; i++){
    //        this.keyptn[w[i]] = g.state.Config.keyAn[i];  
    //    }    
    //}
    // mixUserinput: gamepadとvpad入力をキーボードの入力で返す。
    // axes -> カーソルキー
    // 各ボタン（A)（B)（X)（Y)（START)　->　c,x,z,q,esc
 
    function mixuserinput(g){

        var key = g.keyboard;
        var gpd = g.gamepad;
        var tpd = g.touchpad;
        var vpd = g.vgamepad;

        //mix input Keyboard and Gamepad 
        this.r = -1; //進行方法のr
        this.a = false; //exmpl. accept
        this.b = false; //   ... cancal
        this.c = false; //    .. action1 
        this.d = false; //    .. action2
        this.e = false; //    .. pause 

        this.check = function(){

            var k = g.state.Config.keyAn //使えてない
 
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

            var vstate = vpd.check(); 
            if (vstate.distance > 0){
                //touchpad操作されているので方向処理
                //0  330-360,0-30 u 38 30-60 300 330
                //45 30-60 ul 38 37
                //90 60-120 l 37 30-60 120-150
                //135 120-150 dl 37 40
                //180 150-210 d 40 120-150 210-240
                //225 210-240 dr 39 40 
                //270 240-300 r 39 210-240 300-330
                //315 300-330 ur 38 39
                var d = vstate.deg;
                if ((d >=300) || (d <  60)) state[38] = true;//u
                if ((d >= 30) && (d < 150)) state[39] = true;//r
                if ((d >=120) && (d < 240)) state[40] = true;//d
                if ((d >=210) && (d < 330)) state[37] = true;//l
           }
            //vkey のbuttonNoは、←0　↑2　→1　↓3となっている為、
            //Z:0　C:3　X:1　ESC:2　とする。
            if (vstate.button[0]) state[90] = vstate.button[0];
            if (vstate.button[1]) state[88] = vstate.button[1];
            //if (vstate.button[2]) state[27] = vstate.button[2];//pause?
            if (vstate.button[3]) state[67] = vstate.button[3];

            var wstate = key.check();
            for (var i in wstate){
                state[i] = state[i] || wstate[i];
            }
            
            return state;
        }

    }
}
