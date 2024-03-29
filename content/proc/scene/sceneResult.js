//Scene(result)
//
function sceneResult(state) {
    
    var dev = state.System.dev;
    //宣言部
    var work = dev.graphics[3];//メニュー(最上面)
    var work2 = dev.graphics[2];//メイン描画面(FG)
	//var text = dev.text;
    //var text = dev.graphics[3];//文字表示面

    //var inp = dev.mouse_state;
    var keys = dev.key_state;

    this.init = scene_init;
    this.reset = scene_reset;
    this.step = scene_step;
    this.draw = scene_draw;

    this.reset_enable = true;

    var keylock;

    var wtxt;

    var wipef;
    var wipecnt;

    var ret_code;

    var counter = 0;

    var menu = [];
    var diag;
    var dexef;

    let soundf;

    var m = {
        title: "[   ok.  ]",
        x: 320-80 ,y: 280 ,w: 120 ,h: 16,
        sel: false,
        func: function () {
            return 11; //GameScene:1 + ContinueFlag:+10
        }
    };
    menu.push(m);

    const nop = function(){};
    const getitem = function(num){
        //console.log("test");
        state.obCtrl.get_item(num);//23:B 24:S 25:L
    };

    const bonusTable = [
        { ch:15, text:"杖"  ,sp:"Wand"   },
        { ch:16, text:"剣"  ,sp:"Knife"  },
        { ch:17, text:"斧"  ,sp:"Axe"    },
        { ch:18, text:"槍"  ,sp:"Spear"  },
        { ch:19, text:"ブーメラン",sp:"Boom" },
        //{ ch:20, text:"GET 球"  ,sp:"Ball1"  },
        //{ ch:21, text:"GET 1UP" ,sp:"Mayura1"},
        //{ ch:22, text:"鍵"  ,sp:"Key"    },
        { ch:23, text:"爆弾",sp:"BallB1" },
        { ch:24, text:"バリア玉",sp:"BallS1" },
        { ch:25, text:"回復玉",sp:"BallL1" },
        { ch:26, text:"ランプ",sp:"Lamp"   },
        { ch:27, text:"地図",sp:"Map"    },
        //{ ch:35, text:"GET ｺｲﾝ" ,sp:"Coin1"  },
        { ch:50, text:"弓矢",sp:"Bow"    }
    ];

    //処理部
    function scene_init() {
        //初期化処理
        /*diag = new DialogControl(

            [
            { keynum:38, text:"Selector", icon:"Mayura1", func:nop , x:320-80, y:200, w:120, h:50, keyon:false }//upkey
            ,{ keynum:40, text:"地図", icon:"Map", func:nop , x:320-80, y:326, w:120, h:50, keyon:false }//downkey
            ,{ keynum:37, text:"x3get テスト", icon:"BallB1", func:getitem(23) , x:320-80-150, y:255, w:120, h:50, keyon:false }//left
            ,{ keynum:39, text:"選択肢", icon:"TrBox", func:nop , x:320-80+150, y:255, w:120, h:50, keyon:false }//right
            ]
        );
        */
    }

    function scene_reset() {

        for (var i in menu) {
            menu[i].sel = false;
        }

        //wipef = false;
        wipef = true;

        wipecnt = 2;
        ret_code = 0;

        //        work2.clear();

        var o = {};

        o.cw = work2.cw;
        o.ch = work2.ch;

        o.draw = function (device) {

            for (var i = 0; i < this.ch; i += 4) {
                device.beginPath();
                device.lineWidth = 1;
                device.moveTo(0, i);
                device.lineTo(this.cw, i);

                //                device.strokeStyle = "lightgray";
                device.strokeStyle = "darkblue";

                device.stroke();
            }
        }
        //ゲーム画面の描画を停止(Flip/Drawを自動で実行するのを停止)
        dev.graphics[0].setInterval(0);//BG
        dev.graphics[1].setInterval(0);//SPRITE
        work2.setInterval(0);//<-dev.g2　FG

        work2.putFunc(o);
        work2.draw();

        let dpara = [
            { keynum:38, text:"Selector", icon:"Mayura1", func:nop , x:320-80, y:200, w:120, h:50, keyon:false }//upkey
            ,{ keynum:40, text:"地図", icon:"Map", func:nop , x:320-80, y:326, w:120, h:50, keyon:false }//downkey
            ,{ keynum:37, text:"x3get テスト", icon:"BallB1", func:nop , x:320-80-150, y:255, w:120, h:50, keyon:false }//left
            ,{ keynum:39, text:"選択肢", icon:"TrBox", func:nop , x:320-80+150, y:255, w:120, h:50, keyon:false }//right
            ];

        for ( let i in dpara ){//keycode udlr
            let p = dpara[ i ];

            let n = Math.floor(Math.random() * bonusTable.length);

            p.text = bonusTable[ n ].text;
            p.icon = bonusTable[ n ].sp;
            
            p.func = { call:getitem, p:bonusTable[ n ].ch };
        }

        diag = new DialogControl(dpara);
        dexef = false;        

        soundf = false;
    }

    function scene_step() {
        //進行
        wtxt = [];

 //       var mstate = inp.check_last();
        var kstate = keys.check();

        var zkey = false; if (Boolean(kstate[90])) { if (kstate[90]) zkey = true; }
        var xkey = false; if (Boolean(kstate[88])) { if (kstate[88]) xkey = true; }
        var ckey = false; if (Boolean(kstate[67])) { if (kstate[67]) ckey = true; }

        let esckey = false; if (Boolean(kstate[27])) { if (kstate[27]) esckey = true; }

        zkey = zkey || xkey || ckey; //any key

        //diag.step(kstate);

//        if ((mstate.button == 0) && (!keylock)) {
        counter ++;
        if (counter > 30) {
            if (!dev.sound.running()){
                if ((zkey)&&(!keylock)) {
                    for (var i in menu) {

                        if (menu[i].sel) {
                            let n = menu[i].func();
                            if (n != 0) {
                                //wipef = true;
                                if (!dexef) {diag.exec(); dexef=true;}
                                ret_code = n;
                                //return n;//
                            }
                        }
                    //return 2;
                    }
                }
                if (!soundf&&(state.Game.nowstage%15 == 0)) {
                    dev.sound.effect(15);//Fanfare
                    soundf = true;
                }
            }
            if (esckey){//restart test
                counter = 0;
                //return 5;
                ret_code = 5;
            } 
        }

        if ( !zkey ) keylock = false;
        if (dev.sound.running()) keylock = true;

        if (wipef) {

            var o = {};

            o.cw = work2.cw;
            o.ch = work2.ch;
            o.y1 = wipecnt + 1;
            o.y2 = work2.ch - wipecnt - 2; 

            o.draw = function (device) {

                device.strokeStyle = "black";
//                device.fillStyle = "black";

                device.beginPath();
                device.lineWidth = 8;
                device.moveTo(0, this.y1);
                device.lineTo(this.cw, this.y1);
                device.stroke();

                device.beginPath();
                device.lineWidth = 8;
                device.moveTo(0, this.y2);
                device.lineTo(this.cw, this.y2);
                //    device.stroke();
                device.stroke();
            }
            work2.putFunc(o);

            work2.draw();
            work2.reset();

            wipecnt += 3 * (60/(1000/state.System.deltaTime()));

            //if (work2.ch / 2 - wipecnt < 0) { return ret_code; }
            if (wipecnt > work2.ch/3) wipef = false;//return ret_code; }
        }

        for (i in menu) {
                if (!keylock) menu[i].sel = true; //ButtunLampOn
                if (ret_code != 0) menu[i].sel = false; //ButtunLampOff
        }

        var stage = state.Game.nowstage;
        wtxt.push(" == Stage -" + stage + "- Clear ==");//+ ret_code);
        if (state.Game.nowstage%15 == 0){
            wtxt.push(" ");
            wtxt.push(" == CONGRATULATIONS!& ==");
        }
        //      wtxt.push("---------------");
//      wtxt.push("Push rMouse Button to Start");


        if (ret_code != 0) diag.effect();
        return (( zkey ) || ( diag.step(kstate) != 0 )) ? 0 :ret_code;
    }

    function scene_draw() {

        let w = state.obCtrl.player_objv(work);
        work.fill(w.x-16,w.y-16,32,32,0);
        state.obCtrl.player_objv(work);

        for (let i in menu) {

            if (menu[i].sel) {
                var o = {}
                o.x = menu[i].x;
                o.y = menu[i].y;
                o.w = menu[i].w;
                o.h = menu[i].h;
                //o.c = "orange";
                let t = Math.sin(Math.PI*((state.System.time()%1500)/1500));
                o.c = "rgb(" + Math.trunc(255*t) + "," + Math.trunc(165*t) + ",0)";//

                o.draw = function (device) {
                    device.beginPath();
                    device.fillStyle = this.c;
                    device.fillRect(this.x, this.y, this.w, this.h);
                }
                work.putFunc(o);
            }

            work.putchr(menu[i].title, menu[i].x, menu[i].y);

        }

        for (var s in wtxt) {
            work.putchr(wtxt[s], 320-150, 120 + 16 * s );// + (150 - counter) );
            //			work.putchr8(wtxt[s],0,0 + 8*s);
            //		        work.print(wtxt[s],0,0 + 16*s +200);	
        }

        diag.draw(work);
        //表示

    }

    function DialogControl(mlist){

        var FLCOLOR = "White";
        var menulist = mlist;

        this.step = function(keystate){

            let c = 0;

            for (let i in menulist){

                let m = menulist[i];

                if (Boolean(keystate[m.keynum])){
                    menulist[i].keyon = (keystate[m.keynum]) ? true: false ; 

                    //if (m.keyon) m.func();        
                    if (menulist[i].keyon) c++;

                } else menulist[i].keyon = false;
            }

            return c;
        }

        this.exec = function(){
            for (let i in menulist) {
                let m = menulist[i];
                if (m.keyon) {
                    m.func.call(m.func.p);
                    menulist[i].text = "GET " + m.text;
                }
            }
            FLCOLOR = "Navy";
        }

        this.effect = function(){
            for (let i in menulist) {
                if (menulist[i].keyon) {
                    if (menulist[i].w >0) menulist[i].w--;
                    if (menulist[i].h >0) menulist[i].h--;
                }
            }
        }

        this.draw = function(device){

            for (let i in menulist){

                let m = menulist[i];

                //if (m.keyon) {
                    var o = {x: m.x, y: m.y, w: m.w, h:m.h };                    
                    o.draw = function (device) {
                        device.beginPath();
                        device.fillStyle = (m.keyon)?"orange":"blue";
                        device.fillRect(this.x, this.y, this.w, this.h);
                    }
                    device.putFunc(o);
                //}
                var o = {x: m.x, y: m.y, w: m.w, h:m.h };                    
                o.draw = function (device) {
                    device.beginPath();
                    device.strokeStyle = FLCOLOR;
                    device.strokeRect(this.x, this.y, this.w, this.h);
                }
                device.putFunc(o);
    
                //onsole.log(m);

                device.kprint(m.text, m.x + 24 , m.y + 20);
                device.put(m.icon, m.x + 10, m.y+ 10);

            }

        }
    }

}