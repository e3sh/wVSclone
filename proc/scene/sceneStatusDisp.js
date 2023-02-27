//Scene
//
function sceneStatusDisp(state) {

    var dev = state.System.dev;
    //宣言部
    var work = dev.graphics[3];
 
    //var keys = dev.key_state;

    this.init = scene_init;
    this.reset = scene_reset;
    this.step = scene_step;
    this.draw = scene_draw;

    this.reset_enable = true;

    var menuvf = false;
    var keywait = 10;


    function list_draw(page){
        var st = state.obCtrl.list(); 

        var maxpage = Math.floor(st.length/200) + 1;
        //var s = "Tp,objX,objY,s,Mp / Num:" + st.length;

        if (page > maxpage) page = maxpage;        
        var s = "No:Type,view,hp,status,Mp,chr / Num:" + st.length + " PAGE:[" + page + "]/" + maxpage;
        //type, inview, inworld, status,mp,chr
        var c = 0;

        work.reset();
        work.clear();

        work.putchr8(s, 0,0 );
        for (var i in st){

            if (i >= (page-1)*200){
                work.putchr8("" + i + ":" + st[i%200],Math.floor(c/50)*160,(c%50)*8+8 );
                c++;
                if (c>200) break;
            }
        }
        work.draw();
    }
    
    function obj_draw(num){

        var c=0;

        work.reset();
        work.clear();

        var s = "== ObjectNo.[" + num +"] =="; 
        work.putchr8(s, 0,0 );

        var st = state.obCtrl.lookObj(num);
        for (var i in st){
                work.putchr8(String(st[i]).substring(0, 40),Math.floor(c/50)*320,(c%50)*8+8 );
                c++;
                if (c>100) break;
        }
        work.draw();
    }

    //処理部
    function scene_init() {
        //初期化処理
    }

    function scene_reset() {
        dev.graphics[0].setInterval(0);//BG　WORK2
		dev.graphics[1].setInterval(0);//SPRITE
		dev.graphics[2].setInterval(0);//FG
    
        work.setInterval(0);//UI

        ret_code = 0;

        list_draw(1);
        /*
        var st = state.obCtrl.list(); 

        var s = "Tp,objX,objY,s,Mp / Num:" + st.length;
        var c = 0;

        work.reset();
        work.clear();

        work.putchr8(s, 0,0 );
        for (var i in st){
            work.putchr8("" + i + ":" + st[i],Math.floor(c/50)*160,(c%50)*8+8 );
            c++;
            if (c>200) break;
        }

        work.draw();
        //work.reset();
        */
    }

    function scene_step() {

        keywait--;
        if (keywait > 0) return 0;

        var kstate = dev.key_state.check();

        var zkey = false;
        if (Boolean(kstate[90])) {//[z]
            if (kstate[90]) zkey = true;
        }
	    if (Boolean(kstate[32])) {//[space]
	        if (kstate[32]) zkey = true;
        }

        var qkey = false;
	    if (Boolean(kstate[81])) {
	        if (kstate[81]) {//[q]
	            qkey = true;
	            delete(kstate[81]);// = false;//押しっぱなし検出する為、予防
	        }
	    }

        var numkey = false;
        for (var i in kstate){ //Fullkey[0]-[9]
            if (Boolean(kstate[i]) && (i >= 48) && (i <= 57)){
                numkey = true;
            }
        }

	    if (qkey) {
            //return 2;//Title
        }

        if (zkey) {
            dev.sound.volume(1.0);
            work.fill(320 - 100, 200, 12 * 24, 20 * 5);
            work.draw();

            dev.graphics[0].setInterval(1);//BG　WORK2
            dev.graphics[1].setInterval(1);//SPRITE
            dev.graphics[2].setInterval(1);//FG
            work.setInterval(6);//UI

            return 6;//scenePause
        }

        if (numkey) {
            var inp = -1;
            for (var i in kstate){
                if (Boolean(kstate[i])){
                    inp = i-48;
                    break;
                }
            } 
            if (inp == 0) {obj_draw(0)
            } else {  
                list_draw(inp);
            }
        }
        /*
        if (numkey) {
            var inp = -1;
            for (var i in kstate){
                if (Boolean(kstate[i])){
                    inp = i-48;
                    break;
                }
            }

            switch (inp){
                case 1:
                    state.Config.debug = (!state.Config.debug);
                    break;
                case 2:
                    state.Config.lamp_use = (!state.Config.lamp_use);
                    break;
                case 3:
                    state.Config.map_use = (!state.Config.map_use);
                    break;
                case 4:
                    state.System.dev.sound.mute = (!state.System.dev.sound.mute);
                    break;
                case 5:
                    state.Config.bulletmode = (!state.Config.bulletmode);
                    break;
                case 6:
                    state.Game.player.level = (state.Game.player.level++ >= 3) ? 0: state.Game.player.level;
                    break;
                case 0:
                    menuvf = (!menuvf);
                    break;
                default:
                    break;
            }
            work.reset();
            work.fill(0, 300, 640, 8 * 11);
            if (menuvf){
                var arr = [];
                work.putchr8("Input ["+ inp +"]", 16, 300);

                arr.push("1: Debug Display:" + (state.Config.debug?"ON":"OFF"));
                arr.push("2: Lamp(on FloorChange):" + (state.Config.lamp_use?"ON":"OFF"));
                arr.push("3: Map (on FloorChange):" + (state.Config.map_use?"ON":"OFF"));
                arr.push("4: Mute (NotSupport)   :" + (state.System.dev.sound.mute?"ON":"OFF"));
                arr.push("5: BulletMode(offRange):" + (state.Config.bulletmode?"ON":"OFF"));
                arr.push("6: Weapon Level(Powup) :+" + state.Game.player.level);
                arr.push("7: Import/Export :NotSupport");
                arr.push("8: Status Display:NotSupport");
                arr.push("9: -     :");
                arr.push("0: Menu Display:" + (menuvf?"ON":"OFF"));

                for (var i in arr){
                    work.putchr8(arr[i], 0, 308 + i * 8);
                }
            }
            work.draw();
            keywait = 10;
        }
        */

        return 0;
        //進行
    }

    function scene_draw() {
        //work.reset();
    }
}
