//Scene
//
function scenePause(state) {

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
    //var keylock;
    //var keywait = 0;

    var ret_code = 0;

    const DSP_X = 320;
    const DSP_Y = 160;

    //処理部
    function scene_init() {

        tsel = 0.0;

        //初期化処理
    }

    function scene_reset() {
        dev.graphics[0].setInterval(0);//BG　WORK2
		dev.graphics[1].setInterval(0);//SPRITE
		dev.graphics[2].setInterval(0);//FG
    
        //work.setInterval(0);//UI

        ret_code = 0;

        work.putchr(" == PAUSE ==", DSP_X - 50, DSP_Y);
        work.putchr("Push <Z>key or [Space] ", DSP_X - 100, DSP_Y + 20);
        work.putchr(" Return game.", DSP_X - 50, DSP_Y + 40);
        work.putchr("Push <Q>key /", DSP_X - 100, DSP_Y + 60);
        work.putchr("Save and Quit.", DSP_X - 50, DSP_Y + 80); 

        work.draw();
        //work.reset();
        menuvf = false;

        state.Game.cold = true;

        //keylock = true;
        //keywait = 30;
    }

    function scene_step() {

        //var kstate = keys.check();

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
            /*
	        state.Game.item = obCtrl.item;
	        state.Game.itemstack = obCtrl.itemstack;
	        state.Game.player.zanki = 2 - dead_cnt;
            */

	        if (state.Game.save() == 0) {
	            //alert("ゲーム中断セーブ実施しました。\nタイトルに戻ります。");
                dev.sound.volume(1.0);
                dev.sound.change(9);
                dev.sound.play();
                        
                return 2;//Title
            } else {
                alert("ローカルストレージが使えません。\n中断セーブ出来なかったので、\nゲーム継続します。");

                zkey = true;
            }
        }

        if (zkey) {
            //obCtrl.interrapt = false;
            //obCtrl.SIGNAL = 0;

            dev.sound.volume(1.0);
            work.fill(DSP_X - 100, DSP_Y, 12 * 24, 20 * 5);
            work.draw();

            dev.graphics[0].setInterval(1);//BG　WORK2
            dev.graphics[1].setInterval(1);//SPRITE
            dev.graphics[2].setInterval(1);//FG
            //dev.graphics[3].setInterval(0);//UI
            //work.setInterval(1);//UI

            return 1;//GameScene
        }

        if (numkey) {
            var inp = -1;
            for (var i in kstate){
                if (Boolean(kstate[i])){
                    inp = i-48;
                    break;
                }
            }

            ret_code = 0;
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
                    //state.System.dev.sound.mute = (!state.System.dev.sound.mute);
                    break;
                case 5:
                    state.Config.bulletmode = (!state.Config.bulletmode);
                    break;
                case 6:
                    state.Game.player.level = (state.Game.player.level++ >= 3) ? 0: state.Game.player.level;
                    break;
                case 7:
                    ret_code = 8; //sceneOption
                    break;
                case 8:
                    ret_code = 7; //sceneStatusDisp
                    break;
                case 9:
                    state.Config.viewlog = (!state.Config.viewlog);
                    break;
                case 0:
                    menuvf = (!menuvf);
                    break;
                default:
                    break;
            }

            work.reset();
            work.fill(0, 240, 8 * 22, 8 * 11);//, "navy");

            if (menuvf){
                var arr = [];
                work.fill(0, 240, 8 * 22, 8 * 11, "navy");
                work.putchr8("Input ["+ inp +"]", 16, 240);

                arr.push("1: Debug Display  :" + (state.Config.debug?"ON":"OFF"));
                arr.push("2: Lamp(nextStage):" + (state.Config.lamp_use?"ON":"OFF"));
                arr.push("3: Map (nextStage):" + (state.Config.map_use?"ON":"OFF"));
                arr.push("4: -");//Mute (NotSupport)   :" + (state.System.dev.sound.mute?"ON":"OFF"));
                arr.push("5: Bullet(inRange):" + (state.Config.bulletmode?"ON":"OFF"));
                arr.push("6: Weapon Level   :+" + state.Game.player.level);
                arr.push("7: Map Option Menu:->");//Import/Export;
                arr.push("8: Obj Status Disp:->");
                arr.push("9: (Debug)Log View:" + (state.Config.viewlog?"ON":"OFF"));
                arr.push("0: Menu Display   :" + (menuvf?"ON":"OFF"));

                for (var i in arr){
                    work.putchr8(arr[i], 0, 248 + i * 8);
                }

                //savedata check
                let res = {load: true, ready:true, data:state.Game, title:"STAT/INV"};
                if (res.load){
                    let t = state.Game.dataview2(res);
                    for (let i in t){
                        work.kprint(t[i],8, i*8 + 8);
                }
                    work.draw();
                }

            }
            work.draw();
            keywait = 10;
        }

        return ret_code;
        //進行
    }

    function scene_draw() {
        //表示
        /*
        if (obCtrl.interrapt){
			if (obCtrl.SIGNAL == 1) {
            	work3.putchr(" == PAUSE ==", 320 - 50, 200);
            	work3.putchr("Push <Z>key or [Space] ", 320 - 100, 220);
            	work3.putchr(" Return game.", 320 - 50, 240);
            	work3.putchr("Push <Q>key /", 320 - 100, 260);
            	work3.putchr("Save and Quit.", 320 - 50, 280); 
        	} else {
            	work3.fill(320 - 100, 200, 12 * 24, 20 * 5);
        	}
		}
        */
        //work.reset();
    }

    function submenuStep(){
    }

    function submenuDraw(){
    }
}
