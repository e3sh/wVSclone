//Scene(result)
//
function sceneLvUp(state) { //2024/03/06
    
    const dev = state.System.dev;
    //宣言部
    const UI_layer = dev.graphics[state.Constant.layer.UI];
    const BUI_layer = dev.graphics[state.Constant.layer.BUI];

    //let keys = dev.key_state;

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

    //let stbar;

    let guide_cursor;

    //処理部
    function scene_init() {
        //初期化処理
        guide_cursor = new arrowGuideCursor();
    }

    function scene_reset() {

        ret_code = 0;

        //BUI_layer.clear();

        let o = {};

        o.cw = BUI_layer.cw;
        o.ch = BUI_layer.ch;

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
        //BUI_layer.setInterval(0);//<-dev.g2　FG
        dev.pauseBGSP();

        BUI_layer.putFunc(o);
        BUI_layer.draw();

        state.scene.pauseTCW();//TweenOpenCloseWindow Effect動作抑止

        let dpara = [
            { keynum:38, text:["0.5s Ext.", (5 + state.Game.player.base.VIT * 0.5) + "s->" + (5 + (state.Game.player.base.VIT+1) * 0.5) + "s" ],
                icon:"BallS1", barcolor: "cyan",  
                func: { call: function(p){
                    //state.Game.player.spec.VIT++;
                    state.Game.player.base.VIT++;
                    ret_code = p;
                }, p:1},
                x:-35, y:-25-55, w:70, h:50, keyon:false, select: false, curpos: 1 }//upkey
                /*
            ,{ keynum:40, text:"SELECT", icon:"Ball3", 
                func: { call: function(p){
                    ret_code = p;
                }, p:1},
                x:-35, y:-25+55, w:70, h:50, keyon:false }//downkey
                */
            ,{ keynum:37, text:[" Heal+1", " " + (3 + state.Game.player.base.MND) + " -> " + (3 + state.Game.player.base.MND+1) ], 
                icon:"BallL1", barcolor: "limegreen",
                func: { call: function(p){
                    //state.Game.player.spec.MND++;
                    state.Game.player.base.MND++;
                    ret_code = p;
                }, p:1},
                x:-35-80, y:-25, w:70, h:50, keyon:false, select: false, curpos: 8 }//left

            ,{ keynum:39, text:["Damage+2", " " + (10 + state.Game.player.base.INT*2) + "-> " + (10 + (state.Game.player.base.INT+1)*2) ], 
                icon:"BallB1", barcolor: "orangered",
                func: { call: function(p){
                    //state.Game.player.spec.INT++;
                    state.Game.player.base.INT++;
                    ret_code = p;
                }, p:1},
                x:-35+80, y:-25, w:70, h:50, keyon:false, select: false, curpos: 2 }//right
        ];

        diag = new DialogControl(dpara);
        dexef = false;     
        
        //stbar = new statusBarMeter(["cyan","orange","limegreen","white"]);

        keylock = false;

        guide_cursor.param(1|2|0|8);
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

        zkey = zkey || xkey || ckey; //any key

        // Select時にWASDが効かないことへの対策コード
        let dc = input;//dev.directionM( kstate );
        if (dc.up)      kstate[38] = true;
        if (dc.down)    kstate[40] = true;
        if (dc.left)    kstate[37] = true;
        if (dc.right)   kstate[39] = true;

        if (diag.step(kstate) == 0) keylock = true;

        BUI_layer.draw();
        BUI_layer.reset();

        wtxt.push("LevelUp#" + state.Game.player.spec.ETC);
        wtxt.push("= SELECT =");

        //wtxt.push(" VIT=" + state.Game.player.spec.VIT);
        //wtxt.push(" INT=" + state.Game.player.spec.INT);
        //wtxt.push(" MND=" + state.Game.player.spec.MND); 

        /*
        stbar.setStatusArray([
            state.Game.player.spec.VIT,
            state.Game.player.spec.INT,
            state.Game.player.spec.MND
            //state.Game.player.spec.ETC
        ]);
        */

        diag.setStatusArray([
            state.Game.player.base.VIT,
            state.Game.player.base.MND, //順番注意
            state.Game.player.base.INT
        ]);

        if (keylock && !dexef && diag.step(kstate) == 1) {
            diag.exec(); 
            keylock = false; 
            dexef = true;

            //dev.graphics[0].setInterval(1);//BG
            //dev.graphics[1].setInterval(1);//SPRITE
            //BUI_layer.setInterval(1);//<-dev.g2　FG
        }

        if (ret_code != 0) diag.effect();

        if ( diag.step(kstate) == 0 ) {
            if (ret_code != 0) {

                //dev.graphics[0].setInterval(1);//BG
                //dev.graphics[1].setInterval(1);//SPRITE
                //BUI_layer.setInterval(1);//<-dev.g2　FG
                dev.resumeBGSP();

                state.obUtil.keyitem_enhance_check();

                let w = state.obUtil.player_objv(UI_layer);
                diag.close(dev.graphics[2], w.x, w.y, 20);

                state.scene.resumeTCW();

                return ret_code;
            }
        } 
        return 0;
    }

    function scene_draw() {

        let w = state.obUtil.player_objv(UI_layer);

        UI_layer.fill(w.x-120,w.y-100,240,200,0);

        state.obUtil.player_objv(UI_layer);

        diag.draw(UI_layer, w.x, w.y);

        for (let s in wtxt) {
            UI_layer.putchr8(wtxt[s], w.x -35, w.y + 16*s + 32 );
        }
        //stbar.draw(UI_layer, w.x -35, w.y + 48);
        guide_cursor.draw(UI_layer, w.x, w.y, 32);

        //表示
    }

    function DialogControl(mlist){

        let FLCOLOR = "White";
        let menulist = mlist;
        let status = [];

        this.setStatusArray = function(ary){
            status = ary;
        }

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
                    menulist[i].text[1] = "GET_STAT";
                    menulist[i].select = true;

                    guide_cursor.param(m.curpos);
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

        this.close = function(device, x, y, count){

            for (let i in menulist){

                let m = menulist[i];
                state.scene.setTCW(device, {x: x+m.x, y: y+m.y,w: m.w,h: m.h}, count);
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
                device.putchr8(m.text[i], x + m.x +2 , y + m.y + 20 + i*8);

                device.put(m.icon, x + m.x + 10, y + m.y+ 10);

                if (Boolean(status[i])){
                    for (let j=0; j<status[i]; j++){
                        device.fill(x + m.x + 20 + j*4, y + m.y + 10, 3, 6, m.barcolor);
                    }
                }
            }

        }
    }

    function statusBarMeter(setupParam){
        //setupP0aramater [barcolor, ...,}]
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

    function arrowGuideCursor(){

        let view = 0;

        let vx = [  0, 1,  0, -1 ];
        let vy = [ -1, 0,  1,  0 ];
        let vr = [  0,90,180,270 ];
        //let vr = [270,  0, 90,180 ];

        this.param = function(num) {view = num;}

        this.draw = function(device, x, y, r){
            //view NESW bit:0123 bit on Draw
            for (let i in vx){
                let w = Math.trunc(state.System.time()/100)%5;
                
                if ((view&Math.pow(2,i)) != 0){
                    device.put("cursorx",//"cursorx",
                    x + vx[i] * (r+w),
                    y + vy[i] * (r+w),
                    0, 
                    vr[i] 
                    );
                }
            }
        }
    }
}