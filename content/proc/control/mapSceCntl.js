function mapSceControl(){

    var MAPSCBUFMAX = 1000;

    var buffer = [];
    for (var i = 0; i < MAPSCBUFMAX; i++) {
        buffer[i] = new mapSceSubClass();
    }
    var buf_count = 0;


	var event; //= [];
	var map_sc; // = mapScenro();
	var ini_sc; // = initial_scenario();
	
	var f_cnt = -5;
//	var msc_cnt = 0;
    var startTime;
    var pauseTime;

	this.enable = true; //外から操作用。trueで追加動作可。falseで不可(受入停止)
	this.counter_runnning = true;//カウンターを進めるかどうか

	this.flame = f_cnt;

	this.stage = 1;
	this.keyuse = true;

	var stage_data;//マップデータクラス用
	var stage_msc;//マップシナリオ
	var stage_bg;//bgグラフィック
	var stage_mch; //マップチップ座標
	var stage_inisc; //initial scenario
	var stage_ptn; //bgグラフィック分割用データ(bgのspdata)

	var colmap;
	this.cmap = function () { return colmap; };   //当たり判定用マップデータ[x,y]

	newdata(this.stage, this.keyuse);

	function newdata(num, kyuse) {
	//    stage_data = new Stage1_tod(num, kyuse);
        if (num <= 0){
            stage_data = new Stage1_test(num);//TEST STAGE
        }else if (num <= 30 ){
            stage_data = new Stage1(num);
        }else{
    	    stage_data = new Stage1_tod(num, kyuse);//TEST STAGE
        }

	    stage_msc = stage_data.scenario();
	    stage_bg = stage_data.bgImage(num);
	    stage_mch = stage_data.bgLayout();
	    stage_inisc = stage_data.initial(num);
	    stage_ptn = stage_data.bgPtn();

	    colmap = stage_data.colmap;
	}

	this.change = function (stage) {

	    this.stage = stage;

	    event = [];
	    buf_count = 0;

	    newdata(stage,this.keyuse);

	    map_sc = stage_msc;
	    ini_sc = stage_inisc;
	}

	    this.bgImage = function () {
	        return stage_bg;
	    }

    this.bgPtn = function () {
        return stage_ptn;
    }

    this.mapChip = function () {
        return stage_mch;
    }

    this.init = function () {
        this.stage = 1;

        event = [];

        newdata(this.stage, this.keyuse);

        map_sc = stage_msc;
        ini_sc = stage_inisc;
    }

    this.reset = function (t) {

        this.enable = true;
        this.counter_runnning = true;

        startTime = t + 80;
        f_cnt = -5;

        this.start(false);
        this.start(true);

    }

    this.counterReset = function (t) {

        startTime = t;
        f_cnt = 0;

        for (var i = 0, loopend = map_sc.length; i < loopend; i++) {
            var w = map_sc[i];

            w.used = false;
        }
    }

    this.step = function (objc, t) {

        if (!this.enable) return;

        if (this.counter_runnning) f_cnt++;

        //        if (f_cnt > 2000) this.counter_runnning = false;
        f_cnt = Math.trunc(t - startTime);

        f_cnt = (f_cnt > 120000) ? 120000 : f_cnt; //time over 120s(120,000ms )
        for (var i = 0, loopend = map_sc.length; i < loopend; i++) {
            var w = map_sc[i];

            //if (w.count < f_cnt) continue;
            if (w.used) continue;

            if (w.count <= f_cnt) {

                if ((w.x < 0) && (w.y < 0)) {
                    f_cnt = 0;
                    break;
                }

                this.add(w.x, w.y, w.r, w.ch, w.sc);
                w.used = true;
            }

            if (w.count > f_cnt) break;
        }

        for (var i = 0, loopend = event.length; i < loopend; i++) {
            var e = event[i];

            objc.set_s(e.x, e.y, e.r, e.ch, e.sce, e.id, e.parent);
        }

        event = [];
        buf_count = 0;

        this.flame = f_cnt;

    }

    this.add = function (x, y, r, ch, sce, id, parent) {

        if (!this.enable) return;

        ev = buffer[buf_count]; // { };
        buf_count++;
        if (buf_count >= MAPSCBUFMAX) buf_count = 0;

        ev.x = x;
        ev.y = y;
        ev.r = r;
        ev.ch = ch;
        ev.sce = sce;
        ev.id = id;
        ev.parent = parent;
        
        //if (Boolean(id)) ev.id = id;
        //if (Boolean(parent)) ev.parent = parent;

        event[event.length] = ev;
    }

    this.start = function (flag) {

        for (var i = 0, loopend = ini_sc.length; i < loopend; i++) {
            var w = ini_sc[i];

            if (flag == w.s) {

                this.add(w.x, w.y, w.r, w.ch, w.sc);
            }
        }

    }

    this.pauseOn = function(t){
        pauseTime = t;
    }

    this.pauseOff = function(t){
        startTime += (t - pauseTime); 
    }

	function mapSceSubClass() {
	    this.x;
	    this.y;
	    this.r;
	    this.ch;
	    this.sce;
	    this.parent;
	}

}
