//Scene(result)
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
            { keynum:38, text:"SHIELD Time +0.5s", icon:"BallS1",
                func: { call: function(p){
                    state.Game.player.spec.VIT++;
                    ret_code = p;
                }, p:1},
                x:320-80, y:200, w:120, h:50, keyon:false }//upkey

            ,{ keynum:40, text:"SELECT", icon:"Ball3", 
                func: { call: function(p){
                    ret_code = p;
                }, p:0},
                x:320-80, y:326, w:120, h:50, keyon:false }//downkey

            ,{ keynum:37, text:"HP Recovery +1", icon:"BallL1", 
                func: { call: function(p){
                    state.Game.player.spec.MND++;
                    ret_code = p;
                }, p:1},
                x:320-80-150, y:255, w:120, h:50, keyon:false }//left

            ,{ keynum:39, text:"Bomb Damage +2", icon:"BallB1", 
                func: { call: function(p){
                    state.Game.player.spec.INT++;
                    ret_code = p;
                }, p:1},
                x:320-80+150, y:255, w:120, h:50, keyon:false }//right
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

        wtxt.push(" == Level Up ==");

        if (keylock && !dexef && diag.step(kstate) == 1) {
            diag.exec(); 
            keylock = false; 
            dexef = true;
        }

        if (ret_code != 0) diag.effect();
        return ( diag.step(kstate) != 0 ) ? 0 :ret_code;
    }

    function scene_draw() {

        for (var s in wtxt) {
            work.putchr(wtxt[s], 320-150, 120 + 16 * s );
        }

        diag.draw(work);

        state.obCtrl.player_objv(work);
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