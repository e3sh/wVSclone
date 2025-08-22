/**
 * @class
 * @classdesc
 * ゲームステージのデータ、シナリオ、初期配置を管理します。<br>\
 * マップデータとマップチップのキャッシュ、衝突判定マップを提供し、<br>\
 * ステージの切り替えやマップに関連するイベントの追加を行います。
 */
class mapSceControl {
    /**
     * @constructor
     * @description
     * `mapSceControl`インスタンスを初期化します。<br>\
     * マップシナリオイベントを格納するバッファ、ステージキャッシュ、<br>\
     * 現在のステージ番号などを準備します。
     */
    constructor() {

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
        this.counter_runnning = true; //カウンターを進めるかどうか

        this.flame = f_cnt;

        this.stage = 1;
        this.keyuse = true;

        let stage = []; //MAPDATA_CHACHE;
        /**
         * @method
         * @returns {string} StageNoList
         * @description
         * ステージキャッシュの使用状況（ロード済みのステージ番号）を文字列で返します。
         */
        this.chacheUseStatus = function () {
            let st = ""; for (let i in stage) {
                if (Boolean(stage[i])) { st += i + "."; }
            }
            return st;
        };
        /**
         * @method
         * @returns {StageListSubClass[]} ステージキャッシュの配列
         * @description
         * 内部で保持しているステージキャッシュの配列を返します。
         */
        this.StageChache = function () {
            return stage;
        };

        let stage_name;
        let stage_data; //マップデータクラス用
        let stage_msc; //マップシナリオ
        let stage_bg; //bgグラフィック
        let stage_mch; //マップチップ座標
        let stage_inisc; //initial scenario
        let stage_ptn; //bgグラフィック分割用データ(bgのspdata)

        let colmap;
        let sid;

        const StageNameList = stageNameList();

        /**
         * @method
         * @returns {Object} 衝突判定用マップデータ（`colmap`）
         * @description
         * 現在のステージの衝突判定用マップデータ（`colmap`）を返します。
         */
        this.cmap = function () { return colmap; }; //当たり判定用マップデータ[x,y]
        /**
         * @method
         * @returns {number} ステージの開始部屋のマップチップインデックス
         * @description
         * 現在のステージの開始部屋のマップチップインデックス（`sid`）を返します。
        */
        this.startroom_id = function () { return sid; }; //開始部屋のMapChipIndex

        //initial make new map data 1-15
        for (let i = 1; i <= 15; i++) {
            //newdata(i, this.keyuse);
        }
        //newdata(this.stage, this.keyuse);
        /**
         * 
         * @param {number} num StageNo 
         * @returns {StageListSubClass} `StageListSubClass`のインスタンス
         * @description
         * 指定された番号に基づいて新しいステージデータ（マップレイアウト、シナリオ、初期配置など）を生成します。<br>\
         * `StageListSubClass`のインスタンスを返します。
         */
        function mapdatacreate(num) {

            if (num <= 0) {
                stage_data = new Stage_openfield(num); //TEST STAGE
            } else if (num == 1) {
                stage_data = new Stage_tutorial(); //1st Stage
            } else if (num % 15 == 0) {
                stage_data = new Stage_greathall(num); //BossRooｍ
            } else if (num <= 30) {
                //stage_data = new TestStage(num);
                stage_data = new Stage_normal(num); //NormalStage
            } else {
                stage_data = new Stage_tod(num, true); //TEST STAGE
            }
            let s = new StageListSubClass();

            s.mapScenario = stage_data.scenario();
            s.bgPattern = stage_data.bgImage(num);
            s.mapChip = stage_data.bgLayout();
            s.initialScenario = stage_data.initial(num);
            s.bgSpdata = stage_data.bgPtn();
            s.colmap = stage_data.colmap;
            s.startroom_id = stage_data.startroom_id;

            let sname = "unknown";

            if (Boolean(StageNameList[num])) sname = StageNameList[num];
            s.name = sname;

            let d = new Date();
            s.createdate = d.toString();

            return s;
        }

        /**
         * 
         * @param {Object} s マップデータ
         * @returns {boolean} 成否
         * @description
         * 生成されたマップデータをJSON形式でローカルストレージに保存します。<br>\
         * 保存が成功した場合は`true`を返します。
         */
        function mapdata_save(s) {
            //webstorage save
            let jsontext = JSON.stringify(s);

            let executef = false;
            if (Boolean(localStorage)) { //ローカルストレージ使えたらセーブ実施
                localStorage.setItem("stagedata_" + num, jsontext);
                console.log("stage" + num + " mapgenerate complited.");
                executef = true;
            } else {
                console.log("stage" + num + " mapgenerate do not saved.");
            }

            return executef;
        }

        /**
         * 
         * @param {number} num StageNo 
         * @returns {StageListSubClass} マップデータ
         * @description
         * ローカルストレージから指定された番号のマップデータをロードします。<br>\
         * データが存在しない場合は新しく生成して保存します。
         */
        function mapdataload(num) {
            //webstorage load
            let s;

            if (!localStorage.getItem("stagedata_" + num)) {
                //stagedata_num がなかった場合、mapdatacreate
                s = mapdatacreate(num);
                mapdata_save(s);
            } else {
                s = JSON.parse(localStorage.getItem("stagedata_" + num));
            }

            return s;
        }

        /**
         * 
         * @param {string} filename 
         * @param {object} obj
         * @description
         * 任意のオブジェクトをJSONファイルとしてエクスポート（ダウンロード）する汎用ユーティリティ関数です。
         */
        function fexport(filename = "sample.json", obj) {
            //textfile export
            const json = JSON.stringify(obj, null, 2);
            const blob = new Blob([json], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
        }

        /**
         * 
         * @param {number} num StageNo 
         * @description
         * 指定されたステージのマップデータをJSONファイルとしてエクスポートします。<br>\
         * これはデバッグやステージ作成に利用されます。
         */
        this.mapexport = function (num) {

            fexport("stagedata_" + num, mapdatacreate(num));
        };

        /**
         * 
         * @param {number} num stageNo 
         * @param {boolean} [kyuse] not function 
         * @description
         * 指定されたステージ番号の新しいマップデータを初期化またはロードし、<br>\
         * 現在のステージとして設定します。
         */
        function newdata(num, kyuse) {
            //    stage_data = new Stage1_tod(num, kyuse);
            if (!Boolean(stage[num])) {

                /*
                if (num <= 0){
                    stage_data = new Stage_openfield(num);//TEST STAGE
                }else if (num == 1) {
                    stage_data = new Stage_tutorial();//1st Stage
                }else if (num%15 == 0) {
                    stage_data = new Stage_greathall(num);//BossRooｍ
                }else if (num <= 30 ){
                    //stage_data = new TestStage(num);
                    stage_data = new Stage_normal(num);//NormalStage
                }else{
                    stage_data = new Stage_tod(num, kyuse);//TEST STAGE
                }
                let s = new StageListSubClass();
    
                s.mapScenario   = stage_data.scenario();
                s.bgPattern     = stage_data.bgImage(num);
                s.mapChip       = stage_data.bgLayout();
                s.initialScenario = stage_data.initial(num);
                s.bgSpdata      = stage_data.bgPtn();
                s.colmap        = stage_data.colmap;
                s.startroom_id  = stage_data.startroom_id;
    
                let sname = "unknown";
                
                if (Boolean(StageNameList[num])) sname = StageNameList[num];
                s.name = sname;
    
                //let s = mapdataload(num);
                */
                stage[num] = mapdatacreate(num); //s;
            }

            stage_name = stage[num].name;
            stage_msc = stage[num].mapScenario;
            stage_bg = stage[num].bgPattern;
            stage_mch = stage[num].mapChip; //Collisionチェックで書き換える
            stage_inisc = stage[num].initialScenario;
            stage_ptn = stage[num].bgSpdata;
            colmap = stage[num].colmap;
            sid = stage[num].startroom_id;
            //console.log(sid);
            map_sc = stage_msc;
            ini_sc = stage_inisc;
        }
        /**
         * @method
         * @param {number} stage stageNo
         * @description
         * 現在のステージを変更し、新しいステージのマップデータ、シナリオ、初期配置をロードします。
         */
        this.change = function (stage) {

            this.stage = stage;

            event = [];
            buf_count = 0;

            newdata(stage, this.keyuse);

            map_sc = stage_msc;
            ini_sc = stage_inisc;
        };

        /**
         * @method
         * @param {number} number stageNo 
         * @returns {string} StageName
         * @description
         * 指定された番号または現在のステージの名前を返します。
         */
        this.stagename = function (number) {
            //番号入力なしの場合、今のステージ名を返す
            let sname = "unknown";

            if (Boolean(number)) {
                if (Boolean(StageNameList[number])) sname = StageNameList[number];
            } else {
                sname = stage_name;
            }
            return sname;
        };
        /**
         * @method
         * @returns {ImageAsset} 背景画像情報
         * @description
         * 現在のステージの背景画像情報を返します。 
         */
        this.bgImage = function () { return stage_bg; };
        /**
         * @method
         * @returns {bgPtn} 背景パターンデータ
         * @description
         * 現在のステージの背景パターンデータを返します。
         */
        this.bgPtn = function () { return stage_ptn; };
        /**
         * @method
         * @returns {mapChip} マップチップデータ
         * @description
         * 現現在のステージのマップチップデータを返します。
         */
        this.mapChip = function () { return stage_mch; };
        /**
         * @method
         * @returns {Mapscenario[]} 初期シナリオ（初期配置オブジェクト）
         * @description
         * 現在のステージの初期シナリオ（初期配置オブジェクト）を返します。
         */
        this.ini_sc = function () { return stage_inisc; };
        /**
         * @method
         * @returns {MapsceEvent[]} マップシナリオイベントリスト
         * @description
         * 現在バッファに格納されているマップシナリオイベントのリストを返します。
         */
        this.event = function () { return event; };
        /**
         * @method
         * @description
         * マップシナリオコントローラを初期化し、最初のステージ（ステージ1）のデータをロードします。
         */
        this.init = function () {
            this.stage = 1;
            //stage = [];
            event = [];

            newdata(this.stage, this.keyuse);

            map_sc = stage_msc;
            ini_sc = stage_inisc;
        };
        /**
         * @method
         * @param {number} t systemtime
         * @description 
         * マップシナリオの進行をリセットし、イベントカウンターと開始時間を初期化します。<br>\
         */
        this.reset = function (t) {

            this.enable = true;
            this.counter_runnning = true;

            startTime = t + 80;
            f_cnt = -5;

            this.start(false);
            this.start(true);
        };

        /**
         * @method
         * @param {number} t systemtime
         * @description
         * マップシナリオのイベントカウンターをリセットし、<br>\
         * 全てのマップシナリオイベントを未使用状態に戻します。 
         */
        this.counterReset = function (t) {

            startTime = t;
            f_cnt = 0;
            for (let i = 0, loopend = map_sc.length; i < loopend; i++) {
                let w = map_sc[i];
                w.used = false;
            }
        };

        /**
         * @method
         * @param {gObjectControl} objc GameCore.state.objc 
         * @param {number} t systemtime 
         * @returns {void}
         * マップシナリオの進行を1ステップ進めます。<br>\
         * 時間経過に応じて新しいオブジェクトを生成したり、イベントをトリガーしたりします。
         */
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
        };
        /**
         * @method
         * @param {number} x 座標
         * @param {number} y 座標
         * @param {number} r 向き
         * @param {number} ch キャラクタ番号
         * @param {number} sce シナリオ
         * @param {number} id ID
         * @param {number} parent 親オブジェクト
         * @returns {void}
         * @description
         * マップシナリオイベントを内部バッファに追加し、<br>\
         * 次回の`step`呼び出し時にオブジェクトが生成されるように登録します。
         */
        this.add = function (x, y, r, ch, sce, id, parent) {

            if (!this.enable) return;

            let ev = buffer[buf_count]; // { };
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
        };

        /**
         * @method
         * @param {boolean} flag true：初期配置(すべて)　false:復帰時配置(自機/)
         * @description
         * 初期シナリオで定義されたオブジェクトをゲームに配置します。<br>\
         * `flag`引数で、特定の初期配置グループを選択できます。
         */
        this.start = function (flag) {
            for (let i = 0, loopend = ini_sc.length; i < loopend; i++) {
                let w = ini_sc[i];
                if (flag == w.s) { this.add(w.x, w.y, w.r, w.ch, w.sc); }
            }
        };

        /**
         * @method
         * @param {number} t systemtime
         * @description 
         * マップシナリオのカウンターを一時停止します。<br>\
         * 現在のシステム時刻を`pauseTime`として記録します。
         */
        this.pauseOn = function (t) { pauseTime = t; };
        /**
         * @method
         * @param {number} t systemtime
         * @description
         * マップシナリオのカウンターを再開します。<br>\
         * ポーズ中に経過した時間を開始時刻に加算して、時間経過のずれを補正します。
         */
        this.pauseOff = function (t) { startTime += (t - pauseTime); };

        /**
         * @description
         * マップシナリオイベントの個々のエントリ（位置、キャラ番号、シナリオ、ID、親など）を<br>\
         * 保持するための内部クラスです。
         */
        function mapSceSubClass() {
            this.x; this.y; this.r; this.ch; this.sce; this.parent;
        }

        /**
         * @description
         * 各ステージの全てのデータ（マップシナリオ、背景パターン、マップチップ、<br>\
         * 初期シナリオ、衝突マップ、開始部屋ID、名前、作成日など）を<br>\
         * カプセル化するための内部クラスです。
         */
        function StageListSubClass() {
            this.name;
            this.data; //マップデータクラス用 StageClass
            this.mapScenario; //マップシナリオ 
            this.bgPattern; //bgグラフィック
            this.mapChip; //マップチップ座標
            this.initialScenario; //initial scenario
            this.bgSpdata; //bgグラフィック分割用データ(bgのspdata)

            this.colmap; //CollisionMapData
            this.startroom_id; //StartroomID
        }
    }
}
