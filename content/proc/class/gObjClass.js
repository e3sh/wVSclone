//=============================================================
// GameObjectItem
// ゲームオブジェクトクラス
//=============================================================
/**
 * @class
 * @classdesc
 * ゲーム内の全てのオブジェクト（自機、敵、弾、アイテムなど）の基底クラスです。<br>\
 * 位置、速度、アニメーションパターン、当たり判定サイズなどの共通プロパティを定義し、<br>\
 * オブジェクトの振る舞いを決定するシナリオやステータスを保持します。
 */
class gObjectClass {
    /**
     * @constructor
     * @param {gObjectControl} obCtrl gObjectControlインスタンス
     * @description
     * `gObjectClass`インスタンスを初期化します。<br>\
     * オブジェクトの座標、速度、表示状態、当たり判定、アニメーション、<br>\
     * タイプ、ステータス、HPなど、多岐にわたるプロパティを設定します。
     * @todo
     * ソースをNotebookLMでレビューしてもらうと見通しが悪くなっているので<br>\
     * EntityComponentSystem化したらいいんじゃないかとの指摘あり
     */
    constructor(obCtrl) {
        this.objCtrl = obCtrl; //ParentClass(ObjectControl)
        this.state = obCtrl.state;

        this.x; // X座標
        this.y; // Y座標
        this.vx; // VX座標
        this.vy; // VY座標
        this.mp; // MotionPattern No.
        this.vector; // ベクトル値(方向)
        this.visible = false; // 表示フラグ（Visible)
        this.center_x; // オブジェクトの中心までのX
        this.center_y; // オブジェクトの中心までのY　
        this.hit_x; // 当たり判定の大きさX
        this.hit_y; // 当たり判定の大きさY
        this.mp_cnt_frm = 0; // モーションパタン用カウンタ
        this.mp_cnt_anm = 0; // モーションパタン用アニメカウント
        this.type; // キャラクタタイプ(98:自機 0:味方 1:自弾 2:敵 3:敵弾 4:アイテム 5:その他)
        this.chr; // キャラ定義の番号
        this.frame = 0; // キャラクタフレームカウント
        this.scenario = []; // シナリオ(ステータス別）
        this.status = 0; // ステータス(0:未使用/廃棄済 1:通常 2:衝突 3:X軸枠外 4:Y軸枠外 5:廃棄処理中）
        this.hp; // 耐久力 (弾の場合は攻撃力）
        this.target = -1; //ターゲットにしているオブジェクト（ない場合は－）オブジェクトの参照渡しにしてもいいが、有無をどう判断するか？ステータスチェック？
        this.crash = -1; //衝突した相手のオブジェクトNO　/これも同様に↑に同じだが－
        this.id; // ID
        this.name; // 名前
        this.score = 0; //倒したときのスコア　＝現在は経験値として使用
        this.triger = 0; //トリガーの抑止間隔
        this.shot = 0; //ショットフラグ
        this.alpha = 255; // ALPHA値(透明度)0:透明～255:不透明
        this.display_size = 1.0; //表示拡大率

        this.weight = 1.0;

        this.message = []; //メッセージスタック

        //sprite motioncontrol param:モーションパタン関連/サイズやアルファグラフィックス関連も？
        //state 状態に関連する奴かな/シナリオで直接参照するやつをまとめてしまってもいいか
        //graphicsState　
        //obstate　基本だから入れなくてもいいか
        //gameparamate　scoreとか
        //systemState
        this.normal_draw_enable = true;
        this.custom_draw_enable = false;

        this.damageflag = false;

        this.damage = { count: 0, vector: 0, dist: 0, no: 0 };

        this.attack = 1;

        this.mapCollision = false;
        this.mapColX = false;
        this.mapColY = false;

        this.alive = 0;

        this.custom_draw = null;

        this.old_x = this.x;
        this.old_y = this.y;

        this.lighton = false; //SubMapで強調表示するか？drawPointで使用。2023/01/30
        this.prioritySurface = false; //SP面以外に表示する場合に、BoolでfalseでDrawで標準面に表示しtrueで表示しない。

        //(Booleanで運用するか、表示面[数値]で運用するかは状況次第）で。ObjCtrlにDrawPs実装し、GameSceneから呼ぶ 。2023/01/30  
        this.shiftx = 0; //扱い座標と表示座標をずらす場合に使用 2023/02/02
        this.shifty = 0; //

        //this.jump; this.jumpcount; 
        //this.jump = 0;
        //this.jpvec = -5.0;
        this.vecfrm; //1秒で60stepを実行するとしたときを1としたときの、DeltaTimeとの割合(1stepの移動量vx,vyに掛ける)
        this.barthTime;

        this.effectShadow = false; //影に強調エフェクトするかどうか2025/03/15追加

        //Typeによって当たり判定/ダメージ判定をするが、//
        //状況により個別に判定状態を切り替えられるようにフラグ管理も追加。2023/02/03
        //this.colcheck = true; //false true:当たり判定する。//対objということで地形はtypeで判定
        //this.dmgcheck = true; //false trueの場合　o.hp-o.attackする。アイテムの場合はセット時にattack0,かな
        const Constant = this.state.Constant; 

        const PLAYER =   Constant.objtype.PLAYER; 
        const FRIEND =   Constant.objtype.FRIEND;
        const BULLET_P = Constant.objtype.BULLET_P;
        const ENEMY =    Constant.objtype.ENEMY;
        const BULLET_E = Constant.objtype.BULLET_E;
        const ITEM =     Constant.objtype.ITEM;
        const ETC =      Constant.objtype.ETC;

        /**
         * @method
         * @param {number} type objtypes指定値
         * @description
         * オブジェクトのタイプを設定し、それに伴い衝突判定（`colcheck`）や<br>\
         * ダメージ判定（`dmgcheck`）の有効/無効を決定します。<br>\
         * プレイヤーや敵、弾、アイテムなどの基本的な振る舞いを初期化します。
         */
        this.setType = function (type) {
            this.name = "unknown";

            this.type = type;
            this.colcheck = !(type == ETC);
            this.dmgcheck = !(type == ITEM || type == ETC);

            if (type == PLAYER || type == FRIEND || type == ENEMY) { //自機、味方、敵
                this.jump = 0; //敵でも使うのでここに追加
                this.jpvec = -5.0;

                this.spec = { LV: 0 }; //敵の武器を表示するのに自分と共有処理の為、参照している

                // 
                /*
                    LV: 0, //WeaponLevel ( = state.Game.player.level)
                    HP: 0, //Maxhp (notuse)
                    MP: 0, //MagicPoint (notuse)
                    STR: 0,
                    DEX: 0,
                    AGI: 0,
                    VIT: 0, //HPrecover+ : init 3 +
                    INT: 0, //BombPower+ : init -10
                    MND: 0, //ShieldTime+: init 300flame(5s) +
                    LAK: 0,
                    ETC: 0　//CharactorLevel
                }
                //キャラクタの内部パラメータ用(Obj以外のリストで持たせてIDで管理でもいいが、
                //バトルシステム的な部分は定まっていないのでこんな感じで
                /*
                let health = [];//Buff.Debuffのリスト配列(オブジェクトでもよいかも)
                let bag = [];//持ち物とか（IDでのリスト）
                */
            }
        };

        //角度からラジアンに変換
        //function ToRadian(d) { return (d * (Math.PI / 180.0)); }

        //ラジアンから角度に変換
        //
        //function ToDegree(r) { return (r * (180.0 / Math.PI)); }
    }
    //メソッドのprototype宣言部　===================================
    //test() { return 0; }
    //メソッドのprototype宣言部　===================================
    /**
     * @method
     * @description
     * オブジェクトの全ての状態とプロパティを初期値にリセットします。<br>\
     * これにより、オブジェクトを再利用する際にクリーンな状態から始められます。
     */
    reset() {
        const ETC = 5;

        this.status = 0; //StatusValue.NoUse;
        this.type = ETC; //TypeValue.Etc;
        this.visible = false;
        this.mp_cnt_frm = 0;
        this.mp_cnt_anm = 0;

        this.scenario = [];

        this.normal_draw_enable = true;
        this.custom_draw_enable = false;

        this.damageflag = false;
    }
    //メソッドのprototype宣言部　===================================
    //移動物処理用の関数のデフォルト
    /**
     * @method
     * @param {Screen} scrn GameCore.state.System.dev.screen[]
     * @param {gObjectClass} o gObjectClassインスタンス 
     * @description
     * オブジェクトの初期化処理を実行します。<br>\
     * 通常はシナリオスクリプトから呼び出され、オブジェクトの初期動作を定義します。
     */
    init(scrn, o) { o.vset(5); }
    //メソッドのprototype宣言部　===================================
    /**
     * @method
     * @param {Screen} scrn GameCore.state.System.dev.screen[]
     * @param {gObjectClass} o gObjectClassインスタンス 
     * @description
     * オブジェクトの描画処理を実行します。<br>\
     * デバッグ時にオブジェクトのモーションパターン番号などを画面に表示します。
     */
    draw(scrn, o) { scrn.print(o.mp + "", o.x, o.y); }
    //メソッドのprototype宣言部　===================================
    /**
     * @method
     * @param {Screen} scrn GameCore.state.System.dev.screen[]
     * @param {gObjectClass} o gObjectClassインスタンス 
     * @returns {number} moveResultStates(Normal:0)
     * @description
     * オブジェクトの移動処理を実行します。<br>\
     * オブジェクトの速度に基づいて位置を更新し、<br>\
     * 画面外に出た場合に-1を返して削除を促します。
    */
    move(scrn, o) {
        // 移動処理
        //o.x += o.vx; o.y += o.vy;
        o.x += (o.vx * o.vecfrm); o.y += (o.vy * o.vecfrm);

        let f = 0;
        if (o.x < 0 || o.x > scrn.cw) { f = 1; }
        if (o.y < 0 || o.y > scrn.ch) { f = 1; }

        if (f != 0) return -1;

        return 0;
    }
    //メソッドのprototype宣言部　===================================
    //class内部コマンド群
    /**
     * @method
     * @param {number} num speedperframe
     * @description
     * オブジェクトの速度ベクトル(`vx`, `vy`)を、<br>\
     * 指定された方向()`vector`)と速度(`num`)に基づいて設定します。
     */
    vset(num) {

        this.vx = Math.cos((Math.PI / 180.0) * (this.vector - 90.0)) * num;
        this.vy = Math.sin((Math.PI / 180.0) * (this.vector - 90.0)) * num;

        //30->60fpsに変更したときにシナリオ修正するのが面倒だった名残
        //this.vx /= 1.5;
        //this.vy /= 1.5;
    }
    //メソッドのprototype宣言部　===================================
    //外部メッセージ送信コマンドsubroutine
    /**
     * @method
     * @param {number | string} src select_scenario
     * @param {*} [dst] option_paramater
     * @description
     * 新しいゲームオブジェクトを生成するためのメッセージをメッセージスタックに追加します。<br>\
     * 引数にオブジェクトの種類（`ch`）を指定します。
     */
    set_object(src, dst) {
        let msg = {}; msg.cmd = "set_object";
        msg.src = src; msg.dst = dst; this.message.push(msg);
    }
    //メソッドのprototype宣言部　===================================
    /**
     * @method
     * @param {number | string}} src select_scenario
     * @param {number} tx setposition x
     * @param {number} ty setposition y
     * @param {number} tv setvector
     * @param {number} tsce select_scenario
     * @param {number} id option_paramater
     * @description
     * 詳細なパラメータ（X, Y座標、方向、シナリオ番号、IDなど）を指定して、<br>\
     * 新しいオブジェクトを生成するためのメッセージをメッセージスタックに追加します。
     */
    set_object_ex(src, tx, ty, tv, tsce, id) {
        //src:ch tx,ty,tv,tsce =x,y,vector,scenario_no
        let msg = {};

        let dst = {};
        dst.x = tx;
        dst.y = ty;
        dst.vector = tv;
        dst.sce = tsce;
        dst.id = id;

        msg.cmd = "set_object_ex";
        msg.src = src; msg.dst = dst; this.message.push(msg);
    }
    //メソッドのprototype宣言部　===================================
    /**
     * @method
     * @param {number} src objtype 
     * @param {*} [dst] dummy
     * @description
     * 指定されたタイプのオブジェクトの中から、最も近いターゲットを探索し、<br>\
     * そのターゲットオブジェクトへの参照を`this.target`に設定するメッセージをスタックに追加します。
     */
    get_target(src, dst) {
        let msg = {}; msg.cmd = "get_target";
        msg.src = src; msg.dst = dst; this.message.push(msg);
    }
    //メソッドのprototype宣言部　===================================
    /**
     * @method
     * @param {number | string} src select_scenario
     * @param {*} [dst] dummy
     * @description
     * オブジェクトのシナリオ（振る舞い）を切り替えるためのメッセージをスタックに追加します。<br>\
     * 同時に、現在のフレームカウントをリセットし、描画有効フラグを設定します。
     */
    change_sce(src, dst) {
        let msg = {}; msg.cmd = "change_sce";

        this.frame = 0;
        this.normal_draw_enable = true;
        this.custom_draw_enable = false;

        msg.src = src; msg.dst = dst; this.message.push(msg);
    }
    //メソッドのprototype宣言部　===================================
    /**
     * @method
     * @param {number} src 加算される数値
     * @param {*} [dst] dummy
     * @description
     * スコアを加算するメッセージをメッセージスタックに追加します。<br>\
     * 引数に加算するスコア値を指定します。<br>\
     * （現在、スコアは経験値として扱っています）
     */
    add_score(src, dst) {
        let msg = {}; msg.cmd = "add_score";
        msg.src = src; msg.dst = dst; this.message.push(msg);
    }
    //メソッドのprototype宣言部　===================================
    /**
     * @method
     * @param {number} src 取得するキャラクター番号
     * @param {number} [dst] 指定ID
     * @description
     * アイテムを取得するメッセージをメッセージスタックに追加します。<br>\
     * 引数に取得するアイテムの種類（`chr`）、ID（`id`）を指定します。<br>\
     * @todo
     * (idは落とした武器レベルを継続する為の追加仕様/敵が拾うとリセットされるのはその為です)<br>\
     * プレイ中のアイテムに対してアイテムプールを作ってidで管理するようにする
     */
    get_item(src, dst) {
        let msg = {}; msg.cmd = "get_item";
        msg.src = src; msg.dst = dst; this.message.push(msg);
    }
    //メソッドのprototype宣言部　===================================
    //ここらへんからは外に出してしまってもいいかも
    //bomb系コマンド群（全体に影響を与える）
    /**
     * @method
     * @param {*} [src] dummy 
     * @param {*} [dst] dummy
     * @description
     * 画面内の敵の弾を全て消滅させるコマンドをメッセージスタックに追加します。
     */
    bomb(src, dst) {
        let msg = {}; msg.cmd = "bomb";
        msg.src = src; msg.dst = dst; this.message.push(msg);
    }
    /**
     * @method
     * @param {*} [src] dummy 
     * @param {*} [dst] dummy
     * @description
     * 画面内の敵の弾を全て回収状態（アイテム）に変換するコマンドをメッセージスタックに追加します。
     * （現在、使用されていません）
     */
    bomb2(src, dst) {
        let msg = {}; msg.cmd = "bomb2";
        msg.src = src; msg.dst = dst; this.message.push(msg);
    }
    /**
     * @method
     * @param {number} src ダメージ指定値
     * @param {*} [dst] dummy
     * @description
     * 画面内の敵全体に、HPを減少させる範囲攻撃を行うコマンドをメッセージスタックに追加します
     */
    bomb3(src, dst) {
        let msg = {}; msg.cmd = "bomb3";
        msg.src = src; msg.dst = dst; this.message.push(msg);
    }
    /**
     * @method
     * @param {number} src 指定するキャラクター番号
     * @param {*} [dst] dummy
     * @description
     * 指定のキャラクタ番号のオブジェクトを強制的に消滅させるコマンドをメッセージスタックに追加します。<br>\
     * タイムオーバー時の敵消滅処理などに使用されます。
     */
    bomb4(src, dst) {
        let msg = {}; msg.cmd = "bomb4";
        msg.src = src; msg.dst = dst; this.message.push(msg);
    }
    //メソッドのprototype宣言部　===================================
    /**
     * @method
     * @param {*} [src] dummy 
     * @param {*} [dst] dummy
     * @description
     * 画面内外を問わず、全てのアイテムを無条件で回収状態にするコマンドをメッセージスタックに追加します。<br>\
     * （現在は呼び出しされていません）
     */
    collect(src, dst) {
        let msg = {}; msg.cmd = "collect";
        msg.src = src; msg.dst = dst; this.message.push(msg);
    }
    //メソッドのprototype宣言部　===================================
    /**
     * @method
     * @param {*} [src] dummy 
     * @param {*} [dst] dummy
     * @description
     * 画面内に存在するアイテムのみを回収状態にするコマンドをメッセージスタックに追加します。
     */
    collect2(src, dst) {
        let msg = {}; msg.cmd = "collect2";
        msg.src = src; msg.dst = dst; this.message.push(msg);
    }
    //メソッドのprototype宣言部　===================================
    /**
     * @method
     * @param {*} [src] dummy 
     * @param {*} [dst] dummy
     * @description
     * 自機から半径100ピクセル以内にあるアイテムのみを回収状態にするコマンドをメッセージスタックに追加します。<br>\
     *  （現在は呼び出しされていません）
    */
    collect3(src, dst) {
        let msg = {}; msg.cmd = "collect3";
        msg.src = src; msg.dst = dst; this.message.push(msg);
    }
    //メソッドのprototype宣言部　===================================
    //System系コマンド（ゲームの推移に対しての指示）
    /**
     * @method
     * @param {number} src state.Constants.signalの定数値
     * @param {*} [dst] dummy 
     * @description
     * ゲームの推移に対するシグナルを発行するコマンドをメッセージスタックに追加します。<br>\
     * 例えば、シーンの切り替え指示などに使用されます。
     */
    SIGNAL(src, dst) {
        let msg = {}; msg.cmd = "SIGNAL";
        msg.src = src; msg.dst = dst; this.message.push(msg);
    }
    //メソッドのprototype宣言部　===================================
    /**
     * @method
     * @deprecated
     * @todo 評価する処理が無いので不要
     */
    //itemCombo処理用
    reset_combo(src, dst) {
        let msg = {}; msg.cmd = "reset_combo";
        msg.src = src; msg.dst = dst; this.message.push(msg);
    }
    //メソッドのprototype宣言部　===================================
    //itemのchrでフィールドに存在するか調べる。（KeyInformationCursor実装用）
    //SIGNALだとGameSceneに指示なのでコマンド追加。2023/01/29
    /**
     * @method
     * @param {number} src 指定するキャラクター番号
     * @param {*} [dst] dummy
     * @description
     * フィールド上に特定のアイテム（`chr`番号で指定）が存在するかどうかを探索し<br>\
     * そのアイテムの位置情報をゲームの状態に設定するメッセージをスタックに追加します。
     */
    search_target_item(src, dst) {
        let msg = {}; msg.cmd = "search_target_item";
        msg.src = src; msg.dst = dst; this.message.push(msg);
    }
    //メソッドのprototype宣言部　===================================
    //chrNoからmotion_ptnの0番のSpNameを返す。
    /**
     * @method
     * @param {number} src キャラクター番号
     * @returns {string} スプライト名
     * @description
     * キャラクター番号（`chr`）から、そのキャラクターのモーションパターンの、<br>\
     * 最初のフレームのスプライト名を返します。
     */
    dict_ch_sp(chr) {
        return this.objCtrl.dict_Ch_Sp(chr);

    }
    //メソッドのprototype宣言部　===================================
    //自分から目標( tx, ty )の
    //	方向角度を調べる(上が角度0の0-359)
    /**
     * @method
     * @param {number} tx targetposition x
     * @param {number} ty targetposition y
     * @returns {number} degree
     * @description
     * 自身の現在位置から目標点（`tx`, `ty`）までの方向角度（0-359度、上が0度）を計算します。<br>\
     * 敵がプレイヤーを追尾する際などに使用されます。
     */
    target_r(tx, ty) {
        let x = this.x;
        let y = this.y;

        let r;

        let wx = tx - x;
        let wy = ty - y;

        if (wx == 0) {
            if (wy >= 0) r = 180; else r = 0;
        } else {
            r = Math.atan(wy / wx) * (180.0 / Math.PI); //toDegree

            if ((wx >= 0) && (wy >= 0)) r = 90 + r;
            if ((wx >= 0) && (wy < 0)) r = 90 + r;
            if ((wx < 0) && (wy < 0)) r = 270 + r;
            if ((wx < 0) && (wy >= 0)) r = 270 + r;
        }

        return r;
    }
    //メソッドのprototype宣言部　===================================
    //自分からtargetに方向転換する処理
    //戻り値がtargetの方向。
    /**
     * @method
     * @returns {number} targetの方向
     * @description
     * 自身の現在位置から目標点(this.target.x,.y)までの方向角度（0-359度、上が0度）を計算します。
     */
    target_v() {
        return (!Boolean(this.target)) ? this.vector : this.target_r(this.target.x, this.target.y);
    }
    //メソッドのprototype宣言部　===================================
    //自分からtargetに方向転換する処理
    //	ホーミング処理用
    /**
     * @method
     * @param {number} add 方向転換角度
     * @description
     * 自分の向き(this.vector)を目標点(this.target.x,.y)に指定方向転換角度向きを変える
     */
    target_rotate_r(add) {
        if (!Boolean(this.target)) return;

        let r = this.target_r(this.target.x, this.target.y);
        let d = r; //目標角
        if (d > 179) d = -360 + d;

        w = this.vector; //現在の角度
        if (w > 179) w = -360 + w;

        r = d - w;
        if (Math.abs(r) > 180) {
            w = (this.vector + 180) % 360;
            if (w > 179) w = -360 + w;
            r = (d - w) * -1;
        }

        if (Math.abs(r) < add) add = r; //目標角が指定値より小さい場合は小さいままで

        if (r != 0) this.vector = this.vector + ((r / Math.abs(r)) * add);
        if (this.vector < 0) this.vector = 360 + this.vector;
        if (this.vector > 359) this.vector = this.vector - 360;
    }
    //メソッドのprototype宣言部　===================================
    //距離を求める。
    /**
     * @method
     * @param {number} tx targetposition x
     * @param {number} ty targetposition y
     * @returns {number} 距離
     * @description
     * 自身の現在位置から目標点（`tx`, `ty`）までの距離を返します。
     */
    target_d(tx, ty) {
        let x = this.x;
        let y = this.y;

        return Math.sqrt((Math.abs(tx - x) * Math.abs(tx - x)) + (Math.abs(ty - y) * Math.abs(ty - y)));
    }
    //メソッドのprototype宣言部　===================================
    //指定角度回転
    /**
     * @method
     * @param {number} r 角度
     * @description
     * 自身の方向ベクトルを、指定された角度（`r`）だけ相対的に回転させます。<br>\
     * 角度は0から359度の範囲に正規化されます。
     */
    rotate(r) {
        r = r % 360;
        r = (r > 179) ? -360 + r : r;
        this.vector = (this.vector + r);
    }
    //メソッドのprototype宣言部　===================================
    // sin 0-360 ↑方向が0の数値をいれて処理する
    /**
     * @method
     * @param {*} vec 角度（0-360度、上が0）
     * @returns {number} サイン値
     * @description
     * 指定された角度（0-360度、上が0）のサイン値を計算して返します。
     */
    Sin(vec) { return Math.sin((vec - 90) * (Math.PI / 180.0)); }
    //メソッドのprototype宣言部　===================================
    // cos 0-360 ↑方向が0の数値をいれて処理する
    /**
     * @method
     * @param {*} vec 角度（0-360度、上が0）
     * @returns {number} コサイン値
     * @description
     * 指定された角度（0-360度、上が0）のコサイン値を計算して返します。
    */
    Cos(vec) { return Math.cos((vec - 90) * (Math.PI / 180.0)); }
    //メソッドのprototype宣言部　===================================
    /**
     * @method 
     * @returns {number} moveResultStates(Normal:0)
     * @description
     * シナリオスクリプト内で使用されるオブジェクトの移動および衝突処理の中心的なロジックです。<br>\
     * 自身が画面内にいるか、衝突状態にあるか、ダメージを受けているかなどを判断し、<br>\
     * それに応じた振る舞い（エフェクト生成、HP減少、シナリオ変更など）を実行します。
     */
    sc_move() {
        const state = this.state;
        const Constant = state.Constant; 

        const PLAYER =   Constant.objtype.PLAYER; 
        const FRIEND =   Constant.objtype.FRIEND;
        const BULLET_P = Constant.objtype.BULLET_P;
        const ENEMY =    Constant.objtype.ENEMY;
        const BULLET_E = Constant.objtype.BULLET_E;
        const ITEM =     Constant.objtype.ITEM;
        const ETC =      Constant.objtype.ETC;

        let onst = this.gt.in_view_range(this.x - (this.hit_x / 2), this.y - (this.hit_y / 2), this.hit_x, this.hit_y);

        let f = 0;
        if (this.status == 2) { //状態が衝突の場合
            switch (this.type) { //自身のタイプが...
                case BULLET_P: //自弾
                case BULLET_E: //敵弾
                    if (onst) this.sound.effect(state.Constant.sound.HIT); //hit音
                    this.change_sce("effect_vanish");
                    this.damageflag = false;
                    //↑ここで弾を消しているので削除すると弾が消えなくなる。2023/01/20消してしまってbugったので記録。
                    break;
                case ENEMY: //敵
                    //this.display_size *= 2; //爆発を大きくする
                    this.change_sce("effect_bomb_x"); //7
                    if (onst) this.sound.effect(state.Constant.sound.DAMAGE); //爆発音 


                    //this.pick[35] = Math.floor(Math.random() * 3) + 1;
                    for (let i = 0, loopend = Math.floor(Math.random() * 3) + 1; i < loopend; i++) { //Coin
                        //this.set_object_ex(35, this.x, this.y, Math.floor(Math.random() * 360), "item_movingstop");
                        this.pick.push(state.Constant.item.COIN); //Coin
                    }
                    //敵が拾ったアイテムを落とす。
                    let itemf = false;
                    let num = 0;
                    //for (let i = 0, loopend = this.pick.length; i < loopend; i++) {
                    for (let i of this.pick) if (i != 35) num = num + i;
                    //this.set_object_ex(num, this.x, this.y, Math.floor(Math.random() * 360), "item_movingstop");
                    if (num > 0) itemf = true; //敵がCoin以外の何かを拾っていた場合true(宝箱を出すようにする）

                    if (itemf) {
                        this.set_object_ex(40, this.x, this.y, 0, "enemy_trbox"); //宝箱
                    } else {
                        //for (let i = 0; i < this.pick[35]; i++) {//Coin
                        for (let i in this.pick) {
                            this.set_object_ex(35, this.x, this.y, Math.floor(Math.random() * 360), "item_movingstop");
                        }
                    }
                    this.add_score(this.score);
                    break;
                case ITEM: //アイテム(敵がアイテムを取得する場合の事は考えていない。/<=拾うようにした）
                    if (Boolean(this.crash)) {
                        if (this.crash.pick_enable) { //
                            this.change_sce(6); //拾われたので消す
                            if (this.crash.type == ENEMY) { //相手が敵の場合
                                this.crash.pick.push(this.chr);
                            }
                            if (this.crash.type == PLAYER) { //自分の場合
                                if ((this.chr != 21) && (this.chr != 22)) { //1up or Key
                                    this.sound.effect(state.Constant.sound.CURSOR); //cursor音
                                }
                                this.get_item(this.chr, this.id);
                            }
                        }
                    }
                    break;
                default:
                    break;
            }
        }

        if (this.damageflag) {
            this.damage.count = 30;
            //let onst = this.gt.in_view_range(this.x - (this.hit_x / 2), this.y - (this.hit_y / 2), this.hit_x, this.hit_y);
            if (onst) {
                this.set_object_ex(6, this.x, this.y, this.vector, "effect_hit");
                //this.sound.effect(12); //hit音
            }
        }
        //ここから移動処理
        let wvec = this.vector;
        let wvx = this.vx; let wvy = this.vy;

        if (this.damage.count > 0) {
            this.damage.count--;
            this.vector = (this.damage.vector + 180) % 360;
            this.vset(this.damage.dist / (10 * this.weight)); //反射移動
            if (this.damage.count < 15) this.vset(0); //硬直時間 
        }

        if (this.status == 0) f = 1; //未使用ステータスの場合は削除


        // 移動処理
        if (this.mapCollision != true) {
            this.colcnt = 0;

            this.old_x = this.x;
            this.old_y = this.y;

            //this.x += this.vx;
            //this.y += this.vy;
            this.x += (this.vx * this.vecfrm);
            this.y += (this.vy * this.vecfrm);

            this.vector = wvec;
            this.vx = wvx;
            this.vy = wvy;
        } else {
            if (this.colcnt <= 0) {
                this.x = this.old_x;
                this.y = this.old_y;

                switch (this.type) { //自身のタイプが...
                    case BULLET_P: //自弾
                    case BULLET_E: //敵弾
                        f = 1;
                        break;
                    default:
                        if (this.mapColX) {
                            this.vx *= -1;
                            this.vector = 360 - this.vector;
                            if (this.vector < 0) this.vector = 180 + (180 + this.vector);
                        }
                        if (this.mapColY) {
                            this.vy *= -1;
                            this.vector = 180 + this.vector;
                            if (this.vector > 360) this.vector = 360 + 180 - this.vector;
                            this.vector = this.vector % 360;
                        }
                        if ((!this.mapColX) && (!this.mapColY)) {
                            this.vx *= -1;
                            this.vy *= -1;
                            this.vector = (this.vector + 180) % 360;
                        }
                        break;
                }
            }
            this.colcnt++;

            if (this.colcnt > 10) { //30
                this.vector = this.target_r(this.startx, this.starty);
                this.vset(1);

                this.x += this.vx; // * (this.colcount - 30);
                this.y += this.vy; //* (this.colcount - 30);
            }
        }
        //if (this.x < 0 || this.x > this.gt.ww) { f = 2; }
        //if (this.y < 0 || this.y > this.gt.wh) { f = 2; }
        if (f != 0) {
            if (f == 2) this.reset_combo(this.type);
            return -1; //0以外を返すと削除される。
        };
        /*
        if (this.colcnt > 60) {
            if (Boolean(this.crash)) {
                   //この場合は物に当たっているはず(味方同士とか）
                this.crash.mapCollision = false;
            } else {
                this.colcnt =  Math.floor(Math.random() * 60)
            }
        }
        */
        this.damageflag = false;

        return 0;
    }
}


