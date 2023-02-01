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

    //var keylock;
    //var keywait = 0;

    //var ret_code = 0;

    //処理部
    function scene_init() {

        tsel = 0.0;

        //初期化処理
    }

    function scene_reset() {
        dev.graphics[0].setInterval(0);//BG　WORK2
		dev.graphics[1].setInterval(0);//SPRITE
		dev.graphics[2].setInterval(0);//FG
    
        work.setInterval(0);//UI

        ret_code = 0;

        work.putchr(" == PAUSE ==", 320 - 50, 200);
        work.putchr("Push <Z>key or [Space] ", 320 - 100, 220);
        work.putchr(" Return game.", 320 - 50, 240);
        work.putchr("Push <Q>key /", 320 - 100, 260);
        work.putchr("Save and Quit.", 320 - 50, 280); 

        work.draw();

        state.Game.cold = true;

        //keylock = true;
        //keywait = 30;
    }

    function scene_step() {

        //var kstate = keys.check();

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
            work.fill(320 - 100, 200, 12 * 24, 20 * 5);
            work.draw();

            dev.graphics[0].setInterval(1);//BG　WORK2
            dev.graphics[1].setInterval(1);//SPRITE
            dev.graphics[2].setInterval(1);//FG
            work.setInterval(6);//UI

            return 1;//GameScene
        }

        return 0;
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
    }
}
