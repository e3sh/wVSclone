//=============================================================
// GameObjectItem
// ゲームオブジェクトクラス
//=============================================================
function gObjectClass() {
    this.x; 			// X座標
    this.y; 			// Y座標
    this.vx; 		// VX座標
    this.vy; 		// VY座標
    this.mp; 		// MotionPattern No.
    this.vector; 	// ベクトル値(方向)
    this.visible = false; // 表示フラグ（Visible)
    this.center_x; 	// オブジェクトの中心までのX
    this.center_y; 	// オブジェクトの中心までのY　
    this.hit_x; 		// 当たり判定の大きさX
    this.hit_y; 		// 当たり判定の大きさY
    this.mp_cnt_frm = 0;    // モーションパタン用カウンタ
    this.mp_cnt_anm = 0; // モーションパタン用アニメカウント
    this.type; 		// キャラクタタイプ(98:自機 0:味方 1:自弾 2:敵 3:敵弾 4:アイテム 5:その他)
    this.chr; 		// キャラ定義の番号
    this.frame = 0; 	// キャラクタフレームカウント
    this.scenario = []; // シナリオ(ステータス別）
    this.status = 0; // ステータス(0:未使用/廃棄済 1:通常 2:衝突 3:X軸枠外 4:Y軸枠外 5:廃棄処理中）
    this.hp; 		// 耐久力 (弾の場合は攻撃力）
    this.target = -1; //ターゲットにしているオブジェクト（ない場合は－）オブジェクトの参照渡しにしてもいいが、有無をどう判断するか？ステータスチェック？
    this.crash = -1; //衝突した相手のオブジェクトNO　/これも同様に↑に同じだが－
    this.id; 		// ID
    this.score = 0; 	//倒したときのスコア
    this.triger = 0; //トリガーの抑止間隔
    this.shot = 0; 	//ショットフラグ
    this.alpha = 255; // ALPHA値(透明度)0:透明～255:不透明
    this.display_size = 1.0; //表示拡大率

    this.message = []; //メッセージスタック

    //sprite motioncontrol param:モーションパタン関連/サイズやアルファグラフィックス関連も？
    //state 状態に関連する奴かな/シナリオで直接参照するやつをまとめてしまってもいいか
    //graphicsState　
    //obstate　基本だから入れなくてもいいか
    //gameparamate　scoreとか
    //systemState

    this.normal_draw_enable = true;
    this.custom_draw_enable = false;

    this.damegeflag = false;

    this.damage = { count: 0, vector: 0, dist: 0, no: 0 };

    this.attack = 1;

    this.mapCollision = false;
    this.mapColX = false;
    this.mapColY = false;

    this.alive = 600;

    this.custom_draw = null;

    this.old_x = this.x;
    this.old_y = this.y;

    //角度からラジアンに変換
    function ToRadian(d) { return (d * (Math.PI / 180.0)); }

    //ラジアンから角度に変換
    //
    function ToDegree(r) { return (r * (180.0 / Math.PI)); }
}

//メソッドのprototype宣言部　===================================
gObjectClass.prototype.test = function () { return 0; }

gObjectClass.prototype.reset = function () {

    status = 0; //StatusValue.NoUse;
    type = 5;   //TypeValue.Etc;
    visible = false;
    mp_cnt_frm = 0;
    mp_cnt_anm = 0;

    scenario = [];

    this.normal_draw_enable = true;
    this.custom_draw_enable = false;

    damegeflag = false;
}

//移動物処理用の関数のデフォルト
gObjectClass.prototype.init = function(scrn, o) {　o.vset(5);　}
gObjectClass.prototype.draw = function (scrn, o) { scrn.print(o.mp + "", o.x, o.y); } 
gObjectClass.prototype.move = function(scrn, o) {

    // 移動処理
    o.x += o.vx;
    o.y += o.vy;

    var f = 0;
    if (o.x < 0 || o.x > scrn.cw) { f = 1; }
    if (o.y < 0 || o.y > scrn.ch) { f = 1; }

    if (f != 0) {
        return -1;
    }
    return 0
}

//class内部コマンド群
gObjectClass.prototype.vset = function (num) {

    this.vx = Math.cos((Math.PI / 180.0) * (this.vector - 90.0)) * num;
    this.vy = Math.sin((Math.PI / 180.0) * (this.vector - 90.0)) * num;

    //30->60fpsに変更したときにシナリオ修正するのが面倒だった名残
    //this.vx /= 1.5;
    //this.vy /= 1.5;
}

//外部メッセージ送信コマンドsubroutine
gObjectClass.prototype.set_object = function (src, dst) {
    //src:ch dst:dummy
    var msg = {};

    msg.cmd = "set_object";
    msg.src = src;
    msg.dst = dst;

    this.message.push(msg);
}

gObjectClass.prototype.set_object_ex = function (src, tx, ty, tv, tsce, id) {
    //src:ch tx,ty,tv,tsce =x,y,vector,scenario_no

    var msg = {};

    var dst = {};
    dst.x = tx;
    dst.y = ty;
    dst.vector = tv;
    dst.sce = tsce;
    dst.id = id;

    msg.cmd = "set_object_ex";
    msg.src = src;
    msg.dst = dst;

    this.message.push(msg);
}

gObjectClass.prototype.get_target = function (src, dst) {
    //src:ch type dst:dummy
    var msg = {};

    msg.cmd = "get_target";
    msg.src = src;
    msg.dst = dst;

    this.message.push(msg);
}

gObjectClass.prototype.change_sce = function (src, dst) {
    //src:scenario_no dst:dummy

    var msg = {};

    msg.cmd = "change_sce";
    msg.src = src;
    msg.dst = dst;

    this.frame = 0;
    this.normal_draw_enable = true;
    this.custom_draw_enable = false;

    this.message.push(msg);
}

gObjectClass.prototype.add_score = function (src, dst) {
    //src:score dst:dummy

    var msg = {};

    msg.cmd = "add_score";
    msg.src = src;
    msg.dst = dst;

    this.message.push(msg);
}

gObjectClass.prototype.get_item = function (src, dst) {
    //src:score dst:dummy

    var msg = {};

    msg.cmd = "get_item";
    msg.src = src;
    msg.dst = dst;

    this.message.push(msg);
}

//ここらへんからは外に出してしまってもいいかも
//bomb系コマンド群（全体に影響を与える）
gObjectClass.prototype.bomb = function (src, dst) {
    //src,dst:dummy

    var msg = {};

    msg.cmd = "bomb";
    msg.src = src;
    msg.dst = dst;

    this.message.push(msg);
}

gObjectClass.prototype.bomb2 = function (src, dst) {
    //src,dst:dummy

    var msg = {};

    msg.cmd = "bomb2";
    msg.src = src;
    msg.dst = dst;

    this.message.push(msg);
}

gObjectClass.prototype.bomb3 = function (src, dst) {
    //src,dst:dummy

    var msg = {};

    msg.cmd = "bomb3";
    msg.src = src;
    msg.dst = dst;

    this.message.push(msg);
}

gObjectClass.prototype.bomb4 = function (src, dst) {
    //src,dst:dummy

    var msg = {};

    msg.cmd = "bomb4";
    msg.src = src;
    msg.dst = dst;

    this.message.push(msg);
}

gObjectClass.prototype.collect = function (src, dst) {
    //src,dst:dummy

    var msg = {};

    msg.cmd = "collect";
    msg.src = src;
    msg.dst = dst;

    this.message.push(msg);
}

gObjectClass.prototype.collect2 = function (src, dst) {
    //src,dst:dummy　add_2023/1/12　

    var msg = {};

    msg.cmd = "collect2";
    msg.src = src;
    msg.dst = dst;

    this.message.push(msg);
}

gObjectClass.prototype.collect3 = function (src, dst) {
    //src,dst:dummy　add_2023/1/12　

    var msg = {};

    msg.cmd = "collect3";
    msg.src = src;
    msg.dst = dst;

    this.message.push(msg);
}


//System系コマンド（ゲームの推移に対しての指示）
gObjectClass.prototype.SIGNAL = function (src, dst) {
    //src,dst:dummy

    var msg = {};

    msg.cmd = "SIGNAL";
    msg.src = src; // SIGNAL_no:処理は受け入れ側で考える。
    msg.dst = dst;

    this.message.push(msg);
}
//itemCombo処理用（やっつけ）
gObjectClass.prototype.reset_combo = function (src, dst) {
    //src,dst:dummy

    var msg = {};

    msg.cmd = "reset_combo";
    msg.src = src; //Combo_id 
    msg.dst = dst;

    this.message.push(msg);
}
//自分から目標( tx, ty )の
//	方向角度を調べる(上が角度0の0-359)
gObjectClass.prototype.target_r = function (tx, ty) {

    var x = this.x;
    var y = this.y;

    var r;

    var wx = tx - x;
    var wy = ty - y;

    if (wx == 0) {
        if (wy >= 0) r = 180; else r = 0;
    } else {
        r = Math.atan(wy / wx) * (180.0 / Math.PI) //toDegree

        if ((wx >= 0) && (wy >= 0)) r = 90 + r;
        if ((wx >= 0) && (wy < 0)) r = 90 + r;
        if ((wx < 0) && (wy < 0)) r = 270 + r;
        if ((wx < 0) && (wy >= 0)) r = 270 + r;
    }

    return r;
}
//自分からtargetに方向転換する処理
//戻り値がtargetの方向。
gObjectClass.prototype.target_v = function () {

    if (!Boolean(this.target)) return this.vector;

    return this.target_r(this.target.x, this.target.y);
}
//自分からtargetに方向転換する処理
//	ホーミング処理用
gObjectClass.prototype.target_rotate_r = function (add) {

    if (!Boolean(this.target)) return;

    var r = this.target_r(this.target.x, this.target.y);
    var d = r; 			//目標角
    if (d > 179) d = -360 + d;

    w = this.vector; //現在の角度
    if (w > 179) w = -360 + w;

    r = d - w;
    if (Math.abs(r) > 100) {
        w = (this.vector + 180) % 360;
        if (w > 179) w = -360 + w;
        r = (d - w) * -1;
    }

    if (Math.abs(r) < add) add = r; //目標角が指定値より小さい場合は小さいままで

    if (r != 0) this.vector = this.vector + ((r / Math.abs(r)) * add);
    if (this.vector < 0) this.vector = 360 + this.vector;
    if (this.vector > 359) this.vector = this.vector - 360;
}
//距離を求める。
gObjectClass.prototype.target_d = function (tx, ty) {
    var x = this.x;
    var y = this.y;

    return Math.sqrt((Math.abs(tx - x) * Math.abs(tx - x)) + (Math.abs(ty - y) * Math.abs(ty - y)));
}

// sin 0-360 ↑方向が0の数値をいれて処理する
gObjectClass.prototype.Sin = function (vec) { return Math.sin((vec - 90) * (Math.PI / 180.0)); }

// cos 0-360 ↑方向が0の数値をいれて処理する
gObjectClass.prototype.Cos = function (vec) { return Math.cos((vec - 90) * (Math.PI / 180.0)); }
