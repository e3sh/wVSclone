//Scene(result)
//
function sceneResult(state) {
    
    const dev = state.System.dev;
    //宣言部
    const work = dev.graphics[state.Constant.layer.UI];//メニュー(最上面) UI
    const work2 = dev.graphics[state.Constant.layer.BUI];//メイン描画面(FG)
	//let text = dev.text;
    //let text = dev.graphics[3];//文字表示面 UI
 
    const mapsc = state.mapsc;

    this.init = scene_init;
    this.reset = scene_reset;
    this.step = scene_step;
    this.draw = scene_draw;

    this.reset_enable = true;

    let keylock;

    let wtxt;

    let wipef;
    let wipecnt;

    let ret_code;

    let counter = 0;

    let menu = [];
    let diag;
    let dexef;

    let soundf;

    let m = {
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

    let stage;
    let nextstage;
    let zapf;

    //処理部
    function scene_init() {
    }

    function scene_reset() {

        for (let i in menu) {
            menu[i].sel = false;
        }

        //wipef = false;
        wipef = true;

        wipecnt = 2;
        ret_code = 0;

        //        work2.clear();

        let o = {};

        o.cw = work2.cw;
        o.ch = work2.ch;

        o.draw = function (device) {

            for (let i = 0; i < this.ch; i += 4) {
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
        //dev.graphics[0].setInterval(0);//BG
        //dev.graphics[1].setInterval(0);//SPRITE
        //work2.setInterval(0);//<-dev.g2　FG
        dev.pauseBGSP();

        work2.putFunc(o);
        work2.draw();

        let dpara = [
            { keynum:38, text:"up", icon:"Mayura1", func:nop , x:320-80, y:200, w:120, h:50, keyon:false }//upkey
            ,{ keynum:40, text:"down", icon:"Map", func:nop , x:320-80, y:326, w:120, h:50, keyon:false }//downkey
            ,{ keynum:37, text:"left", icon:"BallB1", func:nop , x:320-80-150, y:255, w:120, h:50, keyon:false }//left
            ,{ keynum:39, text:"right", icon:"TrBox", func:nop , x:320-80+150, y:255, w:120, h:50, keyon:false }//right
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

        //check      
        // 51 AmuletR MP50 3    ST15 
        // 52 AmuletG MP51 8    ST15 
        // 53 AmuletB MP52 12   ST15 
        // 54 CandleR MP53 6    NONE 
        // 55 CandleB MP54 11   NONE
        // 56 RingR   MP55 7 9  ST10   
        // 57 RingB   MP56 2 4  ST10 
        // 58 Mirror  MP57 13 14 ST15 
        //---------------------------
        //------ OK Z OK  Z  Z  Z
        //AMULET o  x  -  -  o  x
        //RING   -  -  o  x  -  -   
        //MIRROR o  x  -  -  x  o
        //       15 0 10  7 13  3 
        // ZAP CHECK STAGE-CLEAR9 -CLEAR14
        function itemcheck(){
            
            let r = [];
            for (let i=0;i<=7;i++){
                r[i] = state.obCtrl.item[51+i];
                if (Boolean(r[i])){
                    r[i] = (r[i]>0)?true:false;
                } else r[i] = false;
            }
            let it = {
                Amulet:{R: r[0], G: r[1], B: r[2]}
                ,Ring: {R: r[5], B: r[6]}
                ,Mirror:   r[7]
            }
            return it;
        }

        stage = mapsc.stage;
        nextstage = stage+1;

        zapf = false;

        let r = itemcheck();
        if (stage%15 == 9){
            //RING CHECK ANY
            if (r.Ring.R || r.Ring.B ){
                //NextStage Normal 10
                zapf = false;
            }else{
                //Zap to 7
                mapsc.stage = 6;
                nextstage = mapsc.stage + 1;
                zapf = true;
            }
        }
        if (stage%15 == 14){
            //MIRROR AND AMULET ANY CHECK
            if (r.Amulet.R || r.Amulet.G || r.Amulet.B){
                if (r.Mirror){
                    //NextStage Normal 15
                    zapf = false;
                }else{
                    //Zap to Stage 13
                    mapsc.stage = 12;
                    nextstage = mapsc.stage + 1;
                    zapf = true;
                }
            } else {
                if (r.Mirror){
                    //Zap to Stage 3
                    mapsc.stage = 2;
                    nextstage = mapsc.stage + 1;
                    zapf = true;
                }else{
                    //Zap to Stage 0
                    mapsc.stage = -1;//ZAP to Stage.0
                    nextstage = mapsc.stage + 1;
                    zapf = true;
                }
            }
        }
    }

    function scene_step(g, input) {
        //進行
        wtxt = [];

 //       let mstate = inp.check_last();
        let kstate = input.keycode;//keys.check();

        let zkey = false; if (Boolean(kstate[90])) { if (kstate[90]) zkey = true; }
        let xkey = false; if (Boolean(kstate[88])) { if (kstate[88]) xkey = true; }
        let ckey = false; if (Boolean(kstate[67])) { if (kstate[67]) ckey = true; }

        let esckey = false; if (Boolean(kstate[27])) { if (kstate[27]) esckey = true; }

        zkey = (zkey || xkey || ckey)? true:false; //any key

        // Select時にWASDが効かないことへの対策コード
        let dc = input;//dev.directionM( kstate );
        if (dc.up)      kstate[38] = true;
        if (dc.down)    kstate[40] = true;
        if (dc.left)    kstate[37] = true;
        if (dc.right)   kstate[39] = true;
        
        //diag.step(kstate);

//        if ((mstate.button == 0) && (!keylock)) {
        counter ++;
        if (counter > 30) {
            if (!dev.sound.running()){
                if ((zkey)&&(!keylock)) {
                    for (let i in menu) {

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
                    state.obUtil.keyitem_reset();
                    soundf = true;
                }
            }
            if (esckey){//restart test
            //    counter = 0;
            //    ret_code = 5;
            } 
        }

        if ( !zkey ) keylock = false;
        if (dev.sound.running()) keylock = true;

        if (wipef) {

            let o = {};

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
            //state.obCtrl.keyitem_view_draw(work2);

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

        //let stage = state.Game.nowstage;
        wtxt.push(" == Stage -" + state.mapsc.stagename( stage ) + "- Clear ==");//+ ret_code);
        wtxt.push(" ");
        if (stage%15 == 0){
            wtxt.push(" == CONGRATULATIONS!& ==");
        }else{
            wtxt.push(
                ((zapf)?"   WARP! ": "   Goto ") + "Next Stage." 
                + state.mapsc.stagename( nextstage ) 
            );
        }
        //      wtxt.push("---------------");
//      wtxt.push("Push rMouse Button to Start");

        if (ret_code != 0) diag.effect();

        if (( zkey ) || ( diag.step(kstate) != 0 )){
            return 0;// wait/pause
        }else{
            diag.close(dev.graphics[2], 20);
            return ret_code;
        }

        //return (( zkey ) || ( diag.step(kstate) != 0 )) ? 0 :ret_code;
    }

    function scene_draw() {

        let w = state.obUtil.player_objv(work);
        work.fill(w.x-16,w.y-16,32,32,0);
        state.obUtil.player_objv(work);

        for (let i in menu) {

            if (menu[i].sel) {
                let o = {}
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

        for (let s in wtxt) {
            let ox = Math.trunc(wtxt[s].length*12)/2;
            work.putchr(wtxt[s], 320-ox, 120 + 16 * s );
        }

        diag.draw(work);
        //表示

    }

    function DialogControl(mlist){

        let FLCOLOR = "White";
        let menulist = mlist;
        let getflag = new Array(mlist.length);
        getflag.fill(false);

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
                    getflag[i] = true;
                }
            }
            FLCOLOR = "Navy";
        }

        this.effect = function(){
            for (let i in menulist) {
                if (menulist[i].keyon) {
                    //if (menulist[i].w >0) menulist[i].w--;
                    //if (menulist[i].h >0) menulist[i].h--;
                }
            }
        }

        this.close = function(device, count){

            for (let i in menulist){
                let m = menulist[i];
                state.scene.setTCW(device, {x: m.x, y: m.y,w: m.w,h: m.h}, count);
            }
        }

        this.draw = function(device){

            for (let i in menulist){

                let m = menulist[i];

                //if (m.keyon) {
                    let o = {x: m.x, y: m.y, w: m.w, h:m.h, c:(getflag[i])?(m.keyon)?"darkorange":"Navy":(m.keyon)?"Blue":"Navy" };                    
                    o.draw = function (device) {
                        device.beginPath();
                        device.fillStyle = this.c;
                        device.fillRect(this.x, this.y, this.w, this.h);
                    }
                    device.putFunc(o);

                //let t = Math.trunc( 128*Math.sin(Math.PI*((state.System.time()%1500)/1500)) )+127;
                //let cl = (getflag[i])?"rgb(" + t + "," + t + "," + t + ")":FLCOLOR;//
                let t = Math.trunc(Math.sin(Math.PI*((state.System.time()%1500)/1500))*255);
                let cl = (getflag[i])?"rgb(" + t + "," + t + ",0)":FLCOLOR;//
                o = {x: m.x, y: m.y, w: m.w, h:m.h, c: cl };
                o.draw = function (device) {
                    device.beginPath();
                    device.strokeStyle = this.c;
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