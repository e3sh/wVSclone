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
    }

    draw(g){
        var st = g.asset.check();

        var f = g.asset.image["FontGraph"].ready;

        for (var i in st){

            if (f){
                this.fontsc.putchr(i + " " + st[i], 0, i*16 +16);
            }else{
                this.scrn.print(i + " " + st[i], 0, i*16 +16);
            }
        }
        /*
        var st = g.asset.namelist();
        for (var i in st){
            g.screen[4].print(i + " " + st[i] + (g.asset.image[st[i]].ready?"o":"x"), 0, i*16 +116);   
            //img_[i].loadcheck()?"o":"x";
            
        }
        */


    }

}