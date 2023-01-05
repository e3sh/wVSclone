// main
function main_r() {

    //	document.oncontextmenu = function(){ return false; };

//    var wait = 33; //Interval
    var fps = 60; //fps


// 各ブラウザ対応
    var oldtime = Date.now();
    var fnum = 0;

window.requestAnimationFrame = (function(){
	return window.requestAnimationFrame		||
		window.webkitRequestAnimationFrame	||
		window.mozRequestAnimationFrame		||
		window.oRequestAnimationFrame		||
		window.msRequestAnimationFrame		||
		function(callback, element){
//			window.setTimeout(callback, 1000 / fps);

            fnum++;
            if (fnum > fps) {
                fnum = 1;
                oldtime = Date.now();
            }

            var targettime = oldtime + Math.round(fnum * (1000.0 / fps));
            var newtime = Date.now();
            var waittime = targettime - newtime;

            if (waittime <= 0) waittime = 1;

            setTimeout(callback, waittime);


		};
})();

    //ロード順が確定しなくてエラーになるから、ここでプロトタイプ宣言してます。
    gObjectClass.prototype.sc_move = ocl_scMove;
    //ちょっとみっともないかも。

    var state = new stateControl();
		
	var elm_dbg = document.getElementById("debug_cb"); elm_dbg.checked = state.Config.debug;

    var dev = state.System.dev;
    var work = dev.graphics[1];
    var work2 = dev.graphics[0];
    var work3 = dev.graphics[3];
    var forgroundBG = dev.graphics[2];

    var scene = new sceneControl(state);

    var inp = dev.mouse_state;
    var keys = dev.key_state;

    var tsel = new Number(0.0);

    var startf = false;
    var lc = false;
    var lc_starttime = Date.now();

    var frameskip = false;

    var tc = new bench();

//    dev.sound.mute = true;
//  dev.sound.volume(0.5)

    main_routine();

    function main_routine() {

        tc.start();

        if (elm_dbg.checked) {
            state.Config.debug = true;
            dev.vkey_state.enable = true;
        } else {
            state.Config.debug = false;
            dev.vkey_state.enable = false;
        }

        if (!startf) {
            waittime = 16;
            lc = load_check();
            //lc = false;
        }

        if (lc) {
            startf = true;

            var wtxt = [];
            var mstate = inp.check();
            var kstate = keys.check();

            //debug display
            if (state.Config.debug) {
                wtxt.push("mousemove x:" + mstate.x + " y:" + mstate.y + " t:" + tsel);
                wtxt.push("b:" + mstate.button + " w:" + mstate.wheel); // + " r:" + Math.floor(mstate.deg) + " d:"+Math.ceil(mstate.distance));

                //var wks = ""
                //for (var s in kstate) {
                //    if (kstate[s]) { wks += "[" + s + "]"; }
                //}
                wtxt.push("key:" + keys.state());
            }
            //---
            if (mstate.wheel != 0) {
                tsel += (mstate.wheel > 0) ? 1 : -1;
            }
            var x = mstate.x;
            var y = mstate.y;

            var trig = false;

            if (mstate.button == 0) {
                trig = true;
            }

            if (mstate.button == 1) {
                //			var ao = new Audio("sound/shot.wav");
                //			ao.play();
            }

            if (state.Config.debug) {
                for (var i = 0, loopend = dev.graphics.length; i < loopend; i++) {
                    wtxt.push("work" + i + ":" + dev.graphics[i].count());
                }

                for (var s in wtxt) {
                    work.putchr8(wtxt[s], 0, 424 - 8 * s);
                }
                dev.vkey_state.draw(work);
            }


            scene.step();

            if (!frameskip) {
                //		
                //画面全消去
                work.clear();
                //forgroundBG.clear();
                //画面表示実施(バッファを画面に反映
                work.draw();
                //forgroundBG.draw();
                //バッファをクリア
                work.reset();
                //forgroundBG.reset();
                //
                scene.draw();
            }
            dev.gs.commit();


        }
        tc.end();

        if (state.Config.debug) {
            tc.draw(work);
        } else {
        //    tc.draw(forgroundBG);
        }

        requestAnimationFrame(main_routine);
    }

    function load_check() {
        
        /*
        work.readystate_check();
        work2.readystate_check();
        var w1s = work.sprite_texture_ready;
        var w1t = work.character_texture_ready;
        var w2s = work2.sprite_texture_ready;
        var w2t = work2.character_texture_ready;
        */

        //work2.print("Load_check", 0, 20);

        /*
        st = "w1s_" + (w1s ? "ready" : ".");
        work2.print(st, 0, 40);
        st = "w1t_" + (w1t ? "ready" : ".");
        work2.print(st, 0, 60);
        st = "w2s_" + (w2s ? "ready" : ".");
        work2.print(st, 0, 80);
        st = "w2t_" + (w2t ? "ready" : ".");
        work2.print(st, 0, 100);
        st = "sndt_" + dev.sound.loadCheck();
        work2.print(st, 0, 150);
        */

        var wtxt = [];

        wtxt.push("Load_check.");
        wtxt.push("");

        var rs = dev.images.readyStateCheck();
        var y = 20;
        var rsc = 0;
        for (var i in rs) {
            wtxt.push(i + "_" + (rs[i] ? "Ready" : "."));
            rsc += (rs[i] ? 1 : 0);
        }

        wtxt.push("sndt_" + dev.sound.loadCheck());
        wtxt.push("");

        var wt = Math.floor((Date.now() - lc_starttime) / 1000);
        wtxt.push("count :" + wt + ".");

        for (var i in wtxt) {
            work2.print(wtxt[i], 0, y);
            y += 20;
        }

        work2.clear("black");
        work2.draw();
        work2.reset();

        if (rsc >= 5) {
            if (dev.sound.loadCheck() == "Ready") {
                state.Config.use_audio = true;
                return true;
            } else if (wt >= 10) {
                state.Config.use_audio = false;
                return true;
            } else {
                return false;
            } 
        } else {
            return false;
        }
    }
}
