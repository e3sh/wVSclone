/**
 * GameTaskDebug
 * @class
 * @classdesc
 * ゲームのデバッグ情報をのうち、GameCore分を表示するためのタスクです。<br>\
 * FPS、パフォーマンス状態/スクリーン状態などの統計情報やグラフを、<br>\
 * デバッグ表示が有効時に画面にリアルタイムで出力します。
 */
class GameTask_Debug extends GameTask {
    /**
     * @param {TaskId} id タスクID
     * @description
     * `GameTask_Debug`インスタンスを初期化します。<br>\
     * 基本の`GameTask`コンストラクタを呼び出し、タスクIDを設定します。<br>\
     */
    constructor(id){
        super(id);
    }

    fontsc;
    scrn;

    /**
     * @method
     * @param {GameCore} g GameCoreインスタンス
     * @description
     * デバッグ表示に使用するフォントとスクリーンバッファを設定します。<br>\
     */
    init(g){
        const USEFONT = "6x8";// "8x8white";

        const s = new ConstantData();
        const MSG = s.layer.MSG;

        this.scrn = g.screen[MSG];

        g.font[USEFONT].useScreen(MSG);
        this.fontsc =  g.font[USEFONT];
    }
    /**
     * @method
     * @param {GameCore} g GameCoreインスタンス
     * @description
     * デバッグ情報を画面に描画します。<br>\
     * FPS、処理負荷（ワークロード）、スクリーン状態などのデータを整形して表示します。
     */
    draw(g){
        const SC_NUM = g.screen.length;

        const dsp_x = 400;
        const dsp_y =  40;

        const dsp_w = 112;
        const dsp_h = 200;

        //this.scrn.fill(dsp_x, dsp_y, dsp_w, dsp_h, "gray");

        //let st;  
        //let r = g.fpsload.result();

        if (g.state.Config.debug){

            this.scrn.fill(dsp_x, dsp_y, dsp_w, dsp_h, "rgba(96,96,96,0.3");

            let sl = [];
            let r = g.fpsload.result();
            sl.push(`fps:${Math.trunc(r.fps)}`);
            sl.push("ave :load/intv/" ); 
            sl.push(`    :${String(r.workload.ave).substring(0,4)}/${String(r.interval.ave).substring(0,4)}ms`);
            sl.push(`workload :${String((r.workload.ave / r.interval.ave)*100).substring(0,5)}%`);
            sl.push(`deltaTime:${String(g.deltaTime()).substring(0, 5)}ms`);
            sl.push(`run(ms):${String(g.time()).substring(0, 10)}`);   

            for(let i=0; i < sl.length; i++){
                this.fontsc.putchr(sl[i], dsp_x, dsp_y+80 + i*8);
            }

            sl = [];
            sl.push("sc(i)bgCol/max/cnt");  

            //st = "";
            for (let i=0 ; i < SC_NUM ;i++){
                sl.push(
                ` ${i}(${g.screen[i].getInterval()})${g.screen[i].getBackgroundcolor()}/${g.screen[i].max()}/${g.screen[i].count()}`
                );
            }
            for(let i=0; i < sl.length; i++){
                this.fontsc.putchr(sl[i], dsp_x, dsp_y + 134 + i*8);
            }

            this.scrn.putFunc(new pfmclass(r, dsp_x + 60, dsp_y +40, 2));
        }
        /**
         * putFunc(performanceMater)class
         * @method
         * @param {resultlog} result GameCore.fpsload.result
         * @param {number} x circlecenter 
         * @param {number} y circlecenter
         * @param {number} m 半径倍率
         * @description
         * resultlogを円で描画して表現します\
         * 折れ線外周はdeltaTime/折れ線内周は処理時間(workload.log)\
         * 最内周はworkload.min/内周はworkload.max/外周はinterval.ave\
         * グラフ内径が経過時間なので時間が掛かる(FPSが下がる)とグラフは大きくなります
         */
        function pfmclass(result, x, y, m){

            let pdata = [];
            let cdata = [];

            pdata.push(result.interval.log);
            pdata.push(result.workload.log);

            //cdata.push(result.interval.max);
            //cdata.push(result.interval.min);
            cdata.push(result.interval.ave);
            cdata.push(result.workload.max);
            cdata.push(result.workload.min);
            //cdata.push(result.workload.ave);

            this.data = pdata;
            this.dcdt = cdata;
            this.cx = x;
            this.cy = y;

            let r = (Math.PI*2)/result.fps;
            this.wx = x + Math.cos(r*result.logpointer)*result.interval.ave*m;
            this.wy = y + Math.sin(r*result.logpointer)*result.interval.ave*m;

            this.ix = x + Math.cos(r*result.logpointer)*result.workload.max*m;
            this.iy = y + Math.sin(r*result.logpointer)*result.workload.max*m;

            let c = (Math.trunc(
                (result.workload.log[result.logpointer]/
                result.interval.ave)*35)
                );
            this.wp = `rgb(${80+c*5},155,0)`; 

            this.draw =(device)=>{

                for (let d of this.dcdt){
                    device.beginPath();
                    device.lineWidth = 1;
                    device.strokeStyle = "green";

                    device.arc(this.cx, this.cy, d*m, 0, Math.PI*2, true);
                    device.stroke();
                }

                for (let d of pdata){
                    let x = this.cx;
                    let y = this.cy;

                    let r = (Math.PI*2)/d.length;
                
                    device.beginPath();
                    device.lineWidth = 1;
                    device.strokeStyle = "limegreen";

                    for (let i=0; i<d.length; i++){
                        x = this.cx + Math.cos(r*i)*d[i]*m;
                        y = this.cy + Math.sin(r*i)*d[i]*m;
                    
                        if (i==0) {
                            device.moveTo(x,y);
                        }else{
                            device.lineTo(x,y);
                            device.stroke(); 
                        }
                    }
                    device.closePath();
                    device.stroke();                
                }

                device.beginPath();
                device.lineWidth = 3;
                device.strokeStyle = this.wp;
                device.moveTo(this.ix, this.iy);
                device.lineTo(this.wx, this.wy);
                device.closePath();
                device.stroke(); 
            }
        }
    }
}
/**
 * @class
 * @classdesc
 * ゲームのロード処理と初期情報の表示を管理するタスクです。<br>\
 * アセットロード状態や入力デバイス情報を表示し、<br>\
 * ユーザー入力または時間経過でメインゲームへの移行を制御します。
 */
class GameTask_Load extends GameTask {
    /**
     * 
     * @param {TaskId} id タスクID
     * @description
     * `GameTask_Load`インスタンスを初期化します。<br>\
     * 基本的な`GameTask`設定を行い、内部変数を準備します。
     */
    constructor(id){
        super(id);
    }
        scrn;
        fontsc;
        str;
        infoflg;
        infodly;

        fsf;//firstStep excuted flag
    /**
     * @method
     * @param {GameCore} g GameCoreインスタンス
     * @description
     * ロード画面表示に使用するスクリーンとフォントを設定します。<br>\
     * 情報表示の遅延時間などの初期状態を準備します。
     */
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
    /**
     * @method
     * @param {GameCore} g GameCoreインスタンス
     * @description
     * ロード処理の進行を管理します。<br>\
     * 入力（キーボード、マウス、タッチパッド）を検出してテストモードに切り替えたり、<br>\
     * ゲーム開始のトリガーを判定したりします。
     */
    step(g) {
        if (!this.fsf) this.infodly = g.time();

        let kstate = g.keyboard.check();
        let mstate = g.mouse.check();
        let tstate = g.touchpad.check();

        //if (typeof g.state.Config.debug !== 'undefined') g.state.Config.debug = true;
        //g.state.Config.debug = this.infoflg;

        let startflag = false; 

        const KEYCODE_MODE = (!Boolean(g.code)); 
        let space = (KEYCODE_MODE)? Boolean(kstate[32]):Boolean(kstate["Space"]);
        let escape = (KEYCODE_MODE)? Boolean(kstate[27]):Boolean(kstate["Escape"]);


        if (this.infoflg){ 
            if (space||g.gamepad.btn_start||mstate.button==0) {
                if (space||g.gamepad.btn_start||mstate.button==0) {//spacebar↓
                    startflag = true;
                }
            }
        }

        if (escape||g.gamepad.btn_back) {
            if (escape||g.gamepad.btn_back) {//esckey↓
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
    /**
     * @method
     * @param {GameCore} g GameCoreインスタンス
     * @description
     * ロード情報を画面に描画します。<br>\
     * アセットロード状況、入力デバイスの状態、ゲーム開始のプロンプトなどを、<br>\
     * アニメーション効果を付けて表示します。
     */
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
/**
 * @class
 * @classdesc
 * 入力デバイス（ゲームパッド、タッチパッド、マウス）の管理と<br>\
 * フルスクリーン切り替えを処理するタスクです。<br>\
 * これらのデバイスからの入力情報を画面に視覚的に表示します。
 */
class GameTask_Device extends GameTask {
    /**
     * 
     * @param {TaskId} id タスクID
     * @description
     * `GameTask_Device`インスタンスを初期化します。<br>\
     * フルスクリーン切り替えのユーティリティ関数を定義します。
     */
    constructor(id){
        super(id);
    }
    scrn;
    fontsc;
    /**
     * @description
     * HTMLのFullscreen APIを利用して、ブラウザのフルスクリーンモードを切り替えます。
     */
    toggleFullScreen = function() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
    //    keylock = 0;
    /**
     * @method
     * @param {GameCore} g GameCoreインスタンス 
     * @description
     * デバイスタスクの描画に使用するスクリーンとフォントを設定します。
     */
    init(g){
        const USEFONT = "6x8";// "8x8white";

        const s = new ConstantData();
        const MSG = s.layer.MSG;
        this.scrn = g.screen[MSG];
        g.font[USEFONT].useScreen(MSG);
        this.fontsc =  g.font[USEFONT];
    }
    /**
     * @method
     * @param {GameCore} g GameCoreインスタンス 
     * @description
     * キーボード、ゲームパッドの入力をチェックし、フルスクリーン切り替えのロジックを処理します。<br>\
     * 仮想ゲームパッドの入力も更新します。
     */
    step(g) {
        let ks = g.keyboard.state();

        const KEYCODE_MODE = (!Boolean(g.code)); 
        let homekey = (KEYCODE_MODE)? Boolean(ks[36]):Boolean(ks["Home"]);
        //let homekey = false; if (Boolean(ks[36])) homekey = true;

		g.gamepad.check();
		let backbtn = g.gamepad.btn_back;

        let fullscr = (homekey || backbtn)?true:false;
		if (fullscr){
			if (!document.fullscreenElement){ 
				g.systemCanvas.requestFullscreen();
		   }
		}

        g.vgamepad.check(g.mouse, g.touchpad);
    }
    /**
     * @method
     * @param {GameCore} g GameCoreインスタンス 
     * @description
     * 仮想ゲームパッド、タッチパッド、マウスの視覚的なインジケータを画面に描画します。<br>\
     * これにより、各入力デバイスの動作をデバッグし視覚的に確認できます。
    */
    draw(g){
        g.vgamepad.draw(this.scrn);
        g.touchpad.draw(this.scrn); 
        g.mouse.draw(this.scrn);
    }
}