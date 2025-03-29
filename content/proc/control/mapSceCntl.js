function mapSceControl(){

    const MAPSCBUFMAX = 1000;

    let buffer = [];
    for (let i = 0; i < MAPSCBUFMAX; i++) {
        buffer[i] = new mapSceSubClass();
    }
    let buf_count = 0;

	let event; //= [];
	let map_sc; // = mapScenro();
	let ini_sc; // = initial_scenario();
	
	let f_cnt = -5;
//	let msc_cnt = 0;
    let startTime;
    let pauseTime;

	this.enable = true; //外から操作用。trueで追加動作可。falseで不可(受入停止)
	this.counter_runnning = true;//カウンターを進めるかどうか

	this.flame = f_cnt;

	this.stage = 1;
	this.keyuse = true;

    let stage = [];//MAPDATA_CHACHE;
    this.chacheUseStatus = function(){
        let st=""; for(let i in stage){
            if (Boolean(stage[i])){ st+=i+".";}  
        }
        return st;
    }
    this.StageChache = function(){
        return stage;
    }

	let stage_data;//マップデータクラス用
	let stage_msc;//マップシナリオ
	let stage_bg;//bgグラフィック
	let stage_mch; //マップチップ座標
	let stage_inisc; //initial scenario
	let stage_ptn; //bgグラフィック分割用データ(bgのspdata)

	let colmap;
    let sid;
	this.cmap = function () { return colmap; } //当たり判定用マップデータ[x,y]
    this.startroom_id = function(){return sid; } //開始部屋のMapChipIndex

    //initial make new map data 1-15
    for (let i=1 ; i<=15; i++){
        newdata(i, this.keyuse);
    }
	//newdata(this.stage, this.keyuse);

	function newdata(num, kyuse) {
	//    stage_data = new Stage1_tod(num, kyuse);
        if (!Boolean(stage[num])){
            if (num <= 0){
                stage_data = new Stage1_vsv(num);//TEST STAGE
            }else if (num%15 == 0) {
                stage_data = new Stage1_brm(num);//BossRooｍ
            }else if (num <= 30 ){
                //stage_data = new TestStage(num);
                stage_data = new Stage1(num);//NormalStage
            }else{
                stage_data = new Stage1_tod(num, kyuse);//TEST STAGE
            }
            let s = new StageListSubClass();

            s.mapScenario   = stage_data.scenario();
            s.bgPattern     = stage_data.bgImage(num);
            s.mapChip       = stage_data.bgLayout();
            s.initialScenario = stage_data.initial(num);
            s.bgSpdata      = stage_data.bgPtn(); 
            s.colmap        = stage_data.colmap;
            s.startroom_id  = stage_data.startroom_id;

            /*
            let jsontext = JSON.stringify(s);

            if (Boolean(localStorage)) { //ローカルストレージ使えたらセーブ実施
                localStorage.setItem("stagedata" + num, jsontext);
                console.log("stage" + num  + " mapgenerate complited.");
            } else {
                console.log("stage" + num  + " mapgenerate do not saved.");
            }
            let s = JSON.parse(localStorage.getItem("savedata"));
            */
            stage[num] = s;
        }

        stage_msc   = stage[num].mapScenario;
        stage_bg    = stage[num].bgPattern;
        stage_mch   = stage[num].mapChip;//Collisionチェックで書き換える
        stage_inisc = stage[num].initialScenario;
        stage_ptn   = stage[num].bgSpdata;
        colmap  = stage[num].colmap;
        sid     = stage[num].startroom_id;
        //console.log(sid);
	}

	this.change = function (stage) {

	    this.stage = stage;

	    event = [];
	    buf_count = 0;

	    newdata(stage,this.keyuse);

	    map_sc = stage_msc;
	    ini_sc = stage_inisc;
	}

	this.bgImage = function () { return stage_bg;  }
    this.bgPtn   = function () { return stage_ptn; }
    this.mapChip = function () { return stage_mch; }
    this.ini_sc  = function () { return stage_inisc; }
    this.event   = function () { return event; }

    this.init = function () {
        this.stage = 1;
        //stage = [];

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
        for (let i = 0, loopend = map_sc.length; i < loopend; i++) {
            let w = map_sc[i];
            w.used = false;
        }
    }

    this.step = function (objc, t) {

        if (!this.enable) return;
        if (this.counter_runnning) f_cnt++;

        f_cnt = Math.trunc(t - startTime);
        f_cnt = (f_cnt > 120000) ? 120000 : f_cnt; //time over 120s(120,000ms )
        for (let i = 0, loopend = map_sc.length; i < loopend; i++) {
            let w = map_sc[i];

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

        for (let i = 0, loopend = event.length; i < loopend; i++) {
            let e = event[i];

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

        event[event.length] = ev;
    }

    this.start = function (flag) {
        for (let i = 0, loopend = ini_sc.length; i < loopend; i++) {
            let w = ini_sc[i];
            if (flag == w.s) { this.add(w.x, w.y, w.r, w.ch, w.sc); }
        }
    }
    this.pauseOn = function(t){ pauseTime = t; }
    this.pauseOff = function(t){ startTime += (t - pauseTime); }

	function mapSceSubClass() {
	    this.x;	this.y; this.r; this.ch; this.sce; this.parent;
	}
    function StageListSubClass(){
        this.data;      //マップデータクラス用 StageClass
        this.mapScenario;//マップシナリオ 
        this.bgPattern; //bgグラフィック
        this.mapChip;   //マップチップ座標
        this.initialScenario; //initial scenario
        this.bgSpdata;  //bgグラフィック分割用データ(bgのspdata)
    
        this.colmap;    //CollisionMapData
        this.startroom_id;//StartroomID
    }
}
