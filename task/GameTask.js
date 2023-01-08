// task ==================================================================

class GameTask_FlipDisp extends GameTask {
	constructor(id){
		super(id);
	}

	draw( g ) {
        g.sprite.allDrawSprite();//スプライトをBufferに反映する。
	    g.screen[0].draw();
	    g.screen[1].draw();
	    g.screen[2].draw();
	    g.screen[3].draw();
        //これで全画面がCanvasに反映される。
        //(DrawではBufferに登録されるだけで、Canvasに反映されていない。)	
	}
}

class GameTask_ClearDisp extends GameTask {
	constructor(id){
		super(id);
	}

	draw( g ) {
	    g.screen[0].reset();
	    g.screen[1].reset();
	    g.screen[2].reset();
	    g.screen[3].reset();

	    g.screen[0].clear("black");
	    g.screen[1].clear();
	    g.screen[2].clear();
	    g.screen[3].clear();//UI表示画面は頻繁に書き換えないようにしたいので、数フレームに一回とかにするとか        //g.dsp.reset();
	    //g.dsp.clear("black");
	    //g.dsp.clear();
        //これで表示Bufferがクリアされ、先頭に全画面消去が登録される。
	}
}

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
        var st = "screenbuffer</br>"  
        + g.screen[0].count() + "</br>" 
	    + g.screen[1].count() + "</br>"
	    + g.screen[2].count() + "</br>"
	    + g.screen[3].count();

        document.getElementById("console").innerHTML = st;
    }

}