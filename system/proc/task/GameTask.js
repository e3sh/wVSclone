class GameTask_Debug extends GameTask {

    constructor(id){
        super(id);
    }

    fontsc;

    init(g){
        const USEFONT = "6x8";// "8x8white";

        const s = new ConstantData();
        const MSG = s.layer.MSG;

        g.font[USEFONT].useScreen(MSG);
        this.fontsc =  g.font[USEFONT];
    }

    step(g) {
    }

    draw(g){
        const SC_NUM = g.screen.length;

        const dsp_x = 280;
        const dsp_y = 320;
        
        let st;  
        let r = g.fpsload.result();

        if (g.state.Config.debug){
            let sl = [];
            let r = g.fpsload.result();
            sl.push("fps:" +  Math.trunc(r.fps));
            sl.push("ave :load/intv/" ); 
            sl.push("    :" + String(r.workload.ave).substring(0,4) +
                "/" + String(r.interval.ave).substring(0,4) +  "ms");
            sl.push("workload :"+ String((r.workload.ave / r.interval.ave)*100).substring(0,5) + "%");
            let ws = String(g.deltaTime()).substring(0, 5);
            sl.push("deltaTime:"+ ws + "ms");
            ws = String(g.time()).substring(0, 10);
            sl.push("run(ms):" + ws);   

            for(let i=0; i < sl.length; i++){
                this.fontsc.putchr(sl[i], dsp_x, dsp_y+ i*8);
            }

            sl = [];
            sl.push("sc(i)bgCol/max/cnt");  

            st = "";
            for (let i=0 ; i < SC_NUM ;i++){
            //st = "sc[" + i + "]" 
            st = " " + i + "(" 
            + g.screen[i].getInterval() + ")" 
            + g.screen[i].getBackgroundcolor() + "/"
            + g.screen[i].max() + "/" 
            + g.screen[i].count()
            ; 
            sl.push(st);
            }

            for(let i=0; i < sl.length; i++){
                this.fontsc.putchr(sl[i], dsp_x+120, dsp_y+ i*8);
            }
        }
    }
}

class GameTask_Load extends GameTask {

    constructor(id){
        super(id);
    }
        scrn;
        fontsc;
        str;
        //cnt;
        infoflg;
        infodly;

        fsf;//firstStep excuted flag

    init(g){
        const USEFONT = "6x8";// "8x8white";
        
        const s = new ConstantData();
        const MSG = s.layer.MSG;
        this.scrn = g.screen[MSG];
        g.font[USEFONT].useScreen(MSG);
        this.fontsc =  g.font[USEFONT];
        //this.cnt = 0;
        this.infoflg = false;
        this.infodly = 0;
        //this.infodly = g.time();

        this.fsf = false;
    }

    step(g) {
        if (!this.fsf) this.infodly = g.time();

        let kstate = g.keyboard.check();
        let mstate = g.mouse.check();
        let tstate = g.touchpad.check();

        if (typeof g.state.Config.debug !== 'undefined') g.state.Config.debug = true;
        g.state.Config.debug = this.infoflg;

        let startflag = false; 

        if (this.infoflg){ 
            if (Boolean(kstate[32])||g.gamepad.btn_start||mstate.button==0) {
                if (kstate[32]||g.gamepad.btn_start||mstate.button==0) {//spacebar↓
                    startflag = true;
                }
            }
        }

        if (Boolean(kstate[27])||g.gamepad.btn_back) {
            if (kstate[27]||g.gamepad.btn_back) {//esckey↓
                this.infoflg = true;
                this.infodly = g.time();
            }
        }

        if (((g.time()-this.infodly) > 3000)&&(!this.infoflg)) {
            startflag = true;
        }

        if (tstate.pos.length > 2){
            startflag = true;
        }

        if (startflag && this.fsf) {
            let maintask = g.task.read("main");

            g.state.Config.debug = false;

            maintask.visible = true;
            maintask.enable = true;
            this.visible = false;
            this.visible = false;
            g.task.del("load"); 
        }

        if (g.gamepad.check()){
            this.str = g.gamepad.infodraw();
        }else{
            this.str = [];
            this.str.push("[Gamepad]");
            this.str.push("Not Ready.");
        }

        this.fsf = true;
    }

    draw(g){
        const LINEH = 8;
        const DELAY = this.infodly;//1000;
        const LWAIT = 4;

        let st = g.asset.check();

        if (!this.infoflg){
            st = [];
            st.push("> Loading/Running Information.");
            st.push("> Input Device Status. [ESC]");
            st.push("");
            st.push("vvvvvvvvvvvvvvvvvvvvvv");
            st.push("vvvv  GAME START  vvvv");
            st.push("vvvvvvvvvvvvvvvvvvvvvv");
            st.push(".......ok".substring(0,Math.trunc((g.time()-this.infodly)/300)));

            g.state.System.dev.graphics[4].put("TitleLogo"
                , 320, 178-Math.trunc((g.time()-this.infodly)/60));
        }

        //let pfunc = g.asset.image["FontGraph"].ready ? this.fontsc.putchr :this.scrn.print ;  
        const pfunc = g.asset.image["KanjiHw"].ready ? this.fontsc.putchr :this.scrn.print ;  

        let c = 0 + DELAY/LWAIT;
        //let t = Math.tranc(g.time()/LWAIT);
        let t = g.time()/LWAIT;

        for (let i in st){
            //pfunc(i + " " + st[i], 0, i*16 +16);
            let wl = c - t

            if (wl < 0) {
                pfunc(st[i], 0, i*LINEH + 8);
            }else{
                if (wl < st[i].length){
                    let s = st[i].substring(0, 
                        st[i].length - wl) + " _";

                    pfunc(s, 0, i*LINEH + 8);
                    //pfunc(s, 1, i*LINEH + 8);

                }else{
                    pfunc("_", 0, i*LINEH + 8);
                }
            }
            c += st[i].length;
        }

        if (this.infoflg){
           let o = {}
                o.x = 0;
                o.y = st.length*LINEH +16;
                o.w = 32 * 8;
                o.h = 8;
                let wc = Math.floor(Math.cos(((g.time()%3000)/3000)*6.28)*256)+256;
                wc = (wc > 255)?255: wc;
                o.c = 'rgb( 0, 0,' + wc + ')';//"navy";
                //o.c = 'rgb( 0,' +  Math.floor(Math.sin(((g.time()%2000)/2000)*6.28 + 2)*255)  + ',' + Math.floor(Math.cos(((g.time()%2000)/2000)*6.28)*255) + ')';//"navy";
            o.draw = function (device) {
                device.beginPath();
                device.fillStyle = this.c;
                device.fillRect(this.x, this.y, this.w, this.h);
            }
            this.scrn.putFunc(o);

            pfunc("Push SPACE key or [START] button", 0, st.length*LINEH +16);

            pfunc(g.task.namelist(), 0, this.scrn.ch-8);

            for (let i in this.str){
                pfunc(this.str[i], 320, i*8 + 8);
            }

            let ks = g.keyboard.state();
            let ms = g.mouse.check_last();
            let ts = g.touchpad.check();

            st = "";
            for (let i in ks){
                //if (ks[i]) st += "[" + String.fromCharCode(i) + ":" + i + "]"; 
                if (ks[i]) st += "[" + i + "]"; 
            }
            pfunc("[Keyboard]", 320, this.str.length*8 +16);
            if (st.length>0) pfunc("KeyCode:" + st, 320, this.str.length*8 +24);
        
            st = "x:" + ms.x + " y:" + ms.y + " button:" + ms.button + " wheel:" + ms.wheel;
            pfunc("[Mouse]", 320, this.str.length*8 +40);
            pfunc("State:" + st, 320, this.str.length*8 +48);

            let vy = 0;
            pfunc("[TouchPad]" + navigator.maxTouchPoints, 320, this.str.length*8 +64);
            for (let i in ts.pos){
                pfunc("State:" + "[" + i + "]" + ts.pos[i].x + "," + ts.pos[i].y + "," + ts.pos[i].id
                , 320, this.str.length*8 +72 + vy);
                vy+=8;
            }
            pfunc("[Fullscreen]" + (document.fullscreenEnabled?"Enable":"Disable"), 320, this.scrn.ch-16);
            pfunc(document.fullscreenElement?"Active":"NonActive", 320, this.scrn.ch-8);
        }
    }
}

class GameTask_Device extends GameTask {

    constructor(id){
        super(id);
    }
        scrn;
        fontsc;
        toggleFullScreen = function() {
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen();
            } else if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
        keylock = 0;
 
    init(g){
        const USEFONT = "6x8";// "8x8white";

        const s = new ConstantData();
        const MSG = s.layer.MSG;
        this.scrn = g.screen[MSG];
        g.font[USEFONT].useScreen(MSG);
        this.fontsc =  g.font[USEFONT];
    }

    step(g) {
        let ks = g.keyboard.state();
        let homekey = false; if (Boolean(ks[36])) homekey = true;

		let r = g.gamepad.check();
		let backbtn = g.gamepad.btn_back;

        let fullscr = (homekey || backbtn)?true:false;
		if (fullscr){
			if (!document.fullscreenElement){ 
				g.systemCanvas.requestFullscreen();
		   }
		}

        g.vgamepad.check(g.mouse, g.touchpad);

    }

    draw(g){
        g.vgamepad.draw(this.scrn);
        g.touchpad.draw(this.scrn); 
        g.mouse.draw(this.scrn);
    }
}