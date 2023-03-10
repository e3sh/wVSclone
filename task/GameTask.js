class GameTask_FPScount extends GameTask {

    constructor(id){
        super(id);
    }

    oldtime;
    newtime = Date.now();
    cnt = 0;

    fps_log = [];
    log_cnt = 0;
    log_max = 0;

    interval;

    fps = 0;
    
    step(g) {

        this.oldtime = this.newtime;
        this.newtime = Date.now();

        this.interval = this.newtime - this.oldtime;

        if (this.log_cnt > this.log_max) this.log_max = this.log_cnt;
        this.fps_log[this.log_cnt] = this.interval;

        this.log_cnt++;
        if (this.log_cnt > 59) this.log_cnt = 0;

        var w = 0;
        for (var i = 0; i <= this.log_max; i++) {
            w += this.fps_log[i];
        }

        this.cnt++;

        this.fps = parseInt(1000 / (w / (this.log_max + 1)));

    }

    draw(g){
        g.font["8x8white"].putchr("FPS:" + this.fps, 320, 0);
    }

}

class GameTask_Debug extends GameTask {

    constructor(id){
        super(id);
    }

    init(g){
        g.font["8x8white"].useScreen(3);
    }

    step(g) {
    }

    draw(g){
        const SC_NUM = g.screen.length;

        var st = "bench:sc_buffer(max)/intv/bgcolor</br>";  
 
        for (var i=0 ; i < SC_NUM ;i++){
            st += "sc[" + i + "]" 
            + g.screen[i].count() + " / " 
            + g.screen[i].getInterval() + " / " 
            + g.screen[i].getBackgroundcolor()
            + " , ";
        }

        var r = g.fpsload.result();

        /*
        st += "</br>fps:" + r.fps + "</br>"
        //+ "int.max" + r.interval.max + "</br>"
        //+ "int.min" + r.interval.min + "</br>"
        + "intv.ave:(" + r.interval.ave + "ms) "
        //+ "wl .max" + r.workload.max + "</br>"
        //+ "wl .min" + r.workload.min + "</br>"
        + "load.ave:(" + r.workload.ave + "ms)</br>workload:"
        + Math.trunc((r.workload.ave / r.interval.ave)*100) + "%</br>";
        */
        //document.getElementById("console").innerHTML = st;

        if (g.state.Config.debug){
            var sl = [];
            var r = g.fpsload.result();
            sl.push("fps:" +  Math.trunc(r.fps));
            sl.push("ave :load/intv/" );// + Math.trunc((r.workload.ave / r.interval.ave)*100) + "%"); 
            sl.push("    :" + String(r.workload.ave).substring(0,4) +
                "/" + String(r.interval.ave).substring(0,4) +  "ms");
            //    "(" + Math.trunc((r.workload.ave / r.interval.ave)*100) + "%)"); 
            //sl.push("intv.ave:" + String(r.interval.ave).substring(0,4) + "ms"); 
            //sl.push("load.ave:" + String(r.workload.ave).substring(0,4) + "ms");
            //sl.push("workload:"+ Math.trunc((r.workload.ave / r.interval.ave)*100) + "%");
            //sl.push("");
            sl.push("workload :"+ String((r.workload.ave / r.interval.ave)*100).substring(0,5) + "%");
            //sl.push("workload:" + "]".repeat(Math.trunc((r.workload.ave / r.interval.ave)*8)));
            //sl.push("");
            //sl.push("");
            var ws = String(g.deltaTime()).substring(0, 5);
            sl.push("deltaTime:"+ ws + "ms");//g.deltaTime());
            //sl.push("blink:"+ g.blink());
            //ws = String(60/(1000/g.deltaTime())).substring(0, 5);
            //sl.push("vec/frm:" + ws);//60/(1000/g.deltaTime()));   
            ws = String(g.time()).substring(0, 10);
            sl.push("run(ms):" + ws);//60/(1000/g.deltaTime()));   
            //ws = String(performance.now()).substring(0, 10);
            //sl.push("p.now():" + ws);//60/(1000/g.deltaTime()));   

            g.font["8x8white"].useScreen(4);
            for(var i=0; i < sl.length; i++){
                g.font["8x8white"].putchr(sl[i], 0, 400+ i*8);
            }

            var sl = [];
            sl.push("bench:intv:bgcolor/sc_buffer(max/count)");  

            st = "";
            for (var i=0 ; i < SC_NUM ;i++){
            st = "sc[" + i + "]" 
            + g.screen[i].getInterval() + ":" 
            + g.screen[i].getBackgroundcolor()  + "/"
            + g.screen[i].max() + "/" 
            + g.screen[i].count(); 
            sl.push(st);
            }

            for(var i=0; i < sl.length; i++){
                g.font["8x8white"].putchr(sl[i], 160, 400+ i*8);
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

    init(g){
        this.scrn = g.screen[4];
        g.font["8x8white"].useScreen(4);
        this.fontsc =  g.font["8x8white"];
        //this.cnt = 0;
    }

    step(g) {
        var kstate = g.keyboard.check();
    
        if (typeof g.state.Config.debug !== 'undefined') g.state.Config.debug = true;

        if (Boolean(kstate[32])||g.gamepad.btn_start) {
            if (kstate[32]||g.gamepad.btn_start) {//spacebar???
                var maintask = g.task.read("main");

                g.state.Config.debug = false;

                maintask.visible = true;
                maintask.enable = true;
                this.visible = false;
                this.visible = false;
                g.task.del("load"); 
            }
        }

        if (g.gamepad.check()){
            this.str = g.gamepad.infodraw();
        }else{
            this.str = [];
            this.str.push("[Gamepad]");
            this.str.push("Not Ready.");
        }
    }

    draw(g){
        var st = g.asset.check();

        //var f = g.asset.image["FontGraph"].ready;

        var pfunc = g.asset.image["FontGraph"].ready ? this.fontsc.putchr :this.scrn.print ;  
        /*
        if (f){
            this.fontsc.putchr(i + " " + st[i], 0, i*16 +16);
        }else{
            this.scrn.print(i + " " + st[i], 0, i*16 +16);
        }
        */

        for (var i in st){
            //pfunc(i + " " + st[i], 0, i*16 +16);
            pfunc(st[i], 0, i*16 +16);
        }

        //this.cnt = (this.cnt++ > 90)? 0: this.cnt; 
        //if ( this.cnt < 60){
        if (g.blink()){    
            pfunc("Push SPACE key or [START] button", 0, st.length*16 +32);
        }
                /*
        var st = g.asset.namelist();
        for (var i in st){
            g.screen[4].print(i + " " + st[i] + (g.asset.image[st[i]].ready?"o":"x"), 0, i*16 +116);   
            //img_[i].loadcheck()?"o":"x";
            
        }
        */
        for (var i in this.str){
            pfunc(this.str[i], 320, i*8 + 8);
        }
    }

}