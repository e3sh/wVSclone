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

        st += "</br>fps:" + r.fps + "</br>"
        //+ "int.max" + r.interval.max + "</br>"
        //+ "int.min" + r.interval.min + "</br>"
        + "intv.ave:(" + r.interval.ave + "ms) "
        //+ "wl .max" + r.workload.max + "</br>"
        //+ "wl .min" + r.workload.min + "</br>"
        + "load.ave:(" + r.workload.ave + "ms)</br>workload:"
        + Math.trunc((r.workload.ave / r.interval.ave)*100) + "%</br>";

        document.getElementById("console").innerHTML = st;

        if (g.state.Config.debug){
            var sl = [];

            sl.push("bench:sc_buffer(max)/intv/bgcolor)");  
            st = "";
            for (var i=0 ; i < SC_NUM ;i++){
            st += "sc[" + i + "]" 
            + g.screen[i].count() + "/" 
            + g.screen[i].getInterval() + "/" 
            + g.screen[i].getBackgroundcolor()
            + ",";
            }
            sl.push(st);

            var r = g.fpsload.result();

            sl.push("fps:" + r.fps);
            sl.push("intv.ave:(" + r.interval.ave + "ms) load.ave:(" + r.workload.ave + "ms)");
            sl.push("workload:"+ Math.trunc((r.workload.ave / r.interval.ave)*100) + "%");

            g.font["8x8white"].useScreen(3);
            for(var i=0; i < sl.length; i++){
                g.font["8x8white"].putchr(sl[i], 0, 400+ i*8);
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

    init(g){
        this.scrn = g.screen[4];
        g.font["8x8white"].useScreen(4);
        this.fontsc =  g.font["8x8white"];

    }

    step(g) {
        var kstate = g.keyboard.check();
    
        if (Boolean(kstate[32])) {
            if (kstate[32]) {//spacebar↓
                var maintask = g.task.read("main");

                maintask.visible = true;
                maintask.enable = true;
                this.visible = false;
                this.visible = false;
                g.task.del("load"); 
            }
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
            pfunc(i + " " + st[i], 0, i*16 +16);
        }
        pfunc("push space key", 0, st.length*16 +32);

        /*
        var st = g.asset.namelist();
        for (var i in st){
            g.screen[4].print(i + " " + st[i] + (g.asset.image[st[i]].ready?"o":"x"), 0, i*16 +116);   
            //img_[i].loadcheck()?"o":"x";
            
        }
        */


    }

}