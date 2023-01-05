function bench() {

    var oldtime;
    var newtime = Date.now();
    var cnt = 0;

    var fps_log = [];
    var load_log = [];
    var log_cnt = 0;
    var log_max = 0;

    var workload;
    var interval;

    var fps = 0;

    var xpos = 640 - 80;
    var ypos = 480 - 16;

    this.start = function () {

        oldtime = newtime;
        newtime = Date.now();
    }

    this.end = function () {

        workload = Date.now() - newtime;
        interval = newtime - oldtime;

        if (log_cnt > log_max) log_max = log_cnt;
        fps_log[log_cnt] = interval;
        load_log[log_cnt] = workload;

        log_cnt++;
        if (log_cnt > 59) log_cnt = 0;

        var w = 0;
        for (var i = 0; i <= log_max; i++) {
            w += fps_log[i];
        }

        cnt++;

        fps = parseInt(1000 / (w / (log_max + 1)));
    }

    this.result = function () {

        var r = {};

        r.fps = fps;
        r.fps_log = fps_log;
        r.load_log = load_log;

        var workload = {}
        var interval = {}

        r.workload = workload;
        r.interval = interval;

        return r;
    }

    this.draw = function (dsp) {

        //var fstr = "";
        //var lstr = "";

        var int_max = 0;
        var int_min = 999;
        var int_ave = 0;

        var load_max = 0;
        var load_min = 999;
        var load_ave = 0;

        var wlod = 0;
        var wint = 0;
        for (var i = 0; i <= log_max; i++) {
            //fstr += fps_log[i] + " ";
            //lstr += load_log[i] + " ";

            if (int_max < fps_log[i]) int_max = fps_log[i];
            if (int_min > fps_log[i]) int_min = fps_log[i];

            if (load_max < load_log[i]) load_max = load_log[i];
            if (load_min > load_log[i]) load_min = load_log[i];

            wlod += load_log[i];
            wint += fps_log[i];
        }

        int_ave = parseInt(wint / (log_max + 1));
        load_ave = parseInt(wlod / (log_max + 1));

        var wtxt = [];

        //wtxt.push("proc result.");

        //        wtxt.push("requestAnimationFrame test");
        //        wtxt.push("now : " + newtime);
        //        wtxt.push("old : " + oldtime);
        wtxt.push("fps : " + fps);
        //wtxt.push("use : " + window.requestAnimationFrame);
        //wtxt.push("count : " + cnt);
        //wtxt.push("workload : " + workload);
        //wtxt.push("interval : " + interval);
        //wtxt.push("ld : " + lstr);
        //wtxt.push("it : " + fstr);
        //wtxt.push("intv (ave/min/max) :(" + int_ave + "/" + int_min + "/" + int_max + ")");
        //wtxt.push("load (ave/min/max) :(" + load_ave + "/" + load_min + "/" + load_max + ")");
        wtxt.push("load:" + load_ave + "ms");

        for (var s in wtxt) {
            var wy = 0 + 8 * s + ypos;
            dsp.putchr8(wtxt[s], xpos, wy);
        }

        var gdrawflag = false;

        if (gdrawflag) {

            cl = {}
            cl.x = 240;
            cl.y = 48 + ypos;
            cl.g = fps_log;
            cl.s = log_cnt;
            cl.col = "rgb(0,128,255)"; // "Cyan";
            cl.draw = graph_draw;
            dsp.putFunc(cl);

            cl = {}
            cl.x = 240;
            cl.y = 48 + ypos;
            cl.g = load_log;
            cl.s = log_cnt;
            cl.col = "Red";
            cl.draw = graph_draw;
            dsp.putFunc(cl);
        }
    }
}

function graph_draw(dev) {

    dev.beginPath();
    //dev.moveTo(this.x + this.s*2, this.y);
    //dev.strokeStyle = "Black"; // "rgb(0,128,255)";

    dev.moveTo(this.x, this.y+1);
    dev.lineTo(this.x + this.g.length * 3, this.y+1);
    dev.strokeStyle = "rgb(255,255,255)";
    dev.lineWidth = "1";
    dev.stroke();

    dev.beginPath();
    dev.strokeStyle = this.col;
    for (var i = 0; i < this.g.length; i++) {
        var c = (this.s + this.g.length - i) % (this.g.length)
        //if ((i == 0) || (c == 0)) {
        //    dev.stroke(); // dev.moveTo(this.x + c * 3, this.y - this.g[i]);
        //}
        //dev.moveTo(this.x + c * 3, this.y - this.g[i]);
        dev.lineTo(this.x + i * 3, this.y - this.g[c]);
    }
    dev.stroke();

}