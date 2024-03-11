﻿//Scene(result)
//
function sceneLvUp(state) { //2024/03/06
    
    let dev = state.System.dev;
    //宣言部
    let work = dev.graphics[3];//メニュー(最上面)
    let work2 = dev.graphics[2];//メイン描画面(FG)

    let keys = dev.key_state;

    this.init = scene_init;
    this.reset = scene_reset;
    this.step = scene_step;
    this.draw = scene_draw;

    this.reset_enable = true;

    let keylock;
    let wtxt;

    let ret_code;

    let diag;
    let dexef;

    let stbar;

    //処理部
    function scene_init() {
        //初期化処理
    }

    function scene_reset() {

        ret_code = 0;

        work2.clear();

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
            { keynum:38, text:["Time +0.5s", (5 + state.Game.player.spec.VIT * 0.5) + "s-> " + (5 + (state.Game.player.spec.VIT+1) * 0.5) + "s" ],
                icon:"BallS1",
                func: { call: function(p){
                    state.Game.player.spec.VIT++;
                    ret_code = p;
                }, p:1},
                x:-35, y:-25-55, w:70, h:50, keyon:false, select: false }//upkey
                /*
            ,{ keynum:40, text:"SELECT", icon:"Ball3", 
                func: { call: function(p){
                    ret_code = p;
                }, p:1},
                x:-35, y:-25+55, w:70, h:50, keyon:false }//downkey
                */
            ,{ keynum:37, text:["Recover +1", (3 + state.Game.player.spec.MND) + " -> " + (3 + state.Game.player.spec.MND+1) ], 
                icon:"BallL1", 
                func: { call: function(p){
                    state.Game.player.spec.MND++;
                    ret_code = p;
                }, p:1},
                x:-35-80, y:-25, w:70, h:50, keyon:false, select: false }//left

            ,{ keynum:39, text:["Damage +2", (10 + state.Game.player.spec.INT*2) + " -> " + (10 + (state.Game.player.spec.INT+1)*2) ], 
                icon:"BallB1", 
                func: { call: function(p){
                    state.Game.player.spec.INT++;
                    ret_code = p;
                }, p:1},
                x:-35+80, y:-25, w:70, h:50, keyon:false, select: false }//right
        ];

        diag = new DialogControl(dpara);
        dexef = false;     
        
        stbar = new statusBarMeter(["cyan","orange","limegreen","white","","",""]);

        keylock = false;
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

        if (diag.step(kstate) == 0) keylock = true;

        work2.draw();
        work2.reset();

        wtxt.push("LevelUp#" + state.Game.player.spec.ETC);
        //wtxt.push(" VIT=" + state.Game.player.spec.VIT);
        //wtxt.push(" INT=" + state.Game.player.spec.INT);
        //wtxt.push(" MND=" + state.Game.player.spec.MND); 

        stbar.setStatusArray([
            state.Game.player.spec.VIT,
            state.Game.player.spec.INT,
            state.Game.player.spec.MND
            //state.Game.player.spec.ETC
        ]);

        if (keylock && !dexef && diag.step(kstate) == 1) {
            diag.exec(); 
            keylock = false; 
            dexef = true;

            //dev.graphics[0].setInterval(1);//BG
            //dev.graphics[1].setInterval(1);//SPRITE
            //work2.setInterval(1);//<-dev.g2　FG
        }

        if (ret_code != 0) diag.effect();

        if ( diag.step(kstate) == 0 ) {
            if (ret_code != 0) {

                dev.graphics[0].setInterval(1);//BG
                dev.graphics[1].setInterval(1);//SPRITE
                work2.setInterval(1);//<-dev.g2　FG

                return ret_code;
            }
        } 
        return 0;
    }

    function scene_draw() {

        let w = state.obCtrl.player_objv(work);

        diag.draw(work, w.x, w.y);

        for (var s in wtxt) {
            work.putchr8(wtxt[s], w.x -35, w.y + 16*s + 32 );
        }
        stbar.draw(work, w.x -35, w.y + 48);

        //表示
    }

    function DialogControl(mlist){

        let FLCOLOR = "White";
        let menulist = mlist;

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
                    menulist[i].text[1] = "GET_STATUS";
                    menulist[i].select = true;
                }
            }
            //FLCOLOR = "Navy";
        }

        this.effect = function(){
          
            for (let i in menulist) {
                if (menulist[i].keyon) {
                    //if (menulist[i].w >0){ menulist[i].w--;}
                    if (menulist[i].h >0){ menulist[i].h--;}
                }
            }
        }

        this.draw = function(device, x, y){

            for (let i in menulist){

                let m = menulist[i];

                //if (m.keyon) {
                    let o = {x: x + m.x, y: y + m.y, w: m.w, h:m.h };                    
                    o.draw = function (device) {
                        device.beginPath();
                        device.fillStyle = (m.select)?"orange":(m.keyon)?"steelblue":"blue";
                        device.fillRect(this.x, this.y, this.w, this.h);

                        //device.beginPath();
                        if (!m.select){
                            device.strokeStyle = FLCOLOR;
                            device.strokeRect(this.x, this.y, this.w, this.h);
                        }
                    }
                    device.putFunc(o);
                //}
                /*
                //o = {x: x + m.x, y: y + m.y, w: m.w, h:m.h };                    
                o.draw = function (device) {
                    device.beginPath();
                    device.strokeStyle = FLCOLOR;
                    device.strokeRect(this.x, this.y, this.w, this.h);
                }
                device.putFunc(o);
                */
                //onsole.log(m);

                for (let i in m.text)   
                device.kprint(m.text[i], x + m.x +8 , y + m.y + 20 + i*8);

                device.put(m.icon, x + m.x + 10, y + m.y+ 10);
            }

        }
    }

    function statusBarMeter(setupParam){
        //setupParamater [barcolor, ...,}]
        let status;

        this.setStatusArray = function(ary){
            status = ary;
        }

        this.draw = function(device, x, y){
            
            let o = { s:status, b:setupParam, x:x, y:y }
            o.draw = function(device){
                device.beginPath();

                for (let i in this.s){
                    for (let j=0; j<this.s[i]; j++){
                        device.fillStyle = this.b[i];
                        device.fillRect(this.x + j*4, this.y + i*4, 3, 3);
                    }
                }

            }
            device.putFunc(o);
        }
    }

}