function gObjectControl(scrn, state) {

    //メイン
    var cdt;// = new CLinear4TreeManager();
    //if (!cdt.init(5, 0, 0, 3000, 3000)) { alert("!"); }

    var debug_colnum;
    var debug_cflag;

    var dev = state.System.dev;

    delobj = 0;

    this.score = 0;

    this.interrapt = false;

    this.SIGNAL = 0;

    //	this.restart = 0;


    //以下はコンティニューでもリセット
    //ここらへんもStateGameに持たせるべきか？

    this.item = []; //現在取得しているアイテム(リセットオンだとやられると0）(消す処理自体はgameSceneで処理）

    this.combo = []; //連続して敵を倒したり、アイテム[20]を取った数。逃げられたり取りそこなうと0

    this.obCount = []; //出現したキャラクタの総数

    this.combomax = []; //comboが続いた内の最大値

    this.total = []; //種類別の倒した総数(主に敵）　倒した総数/出現した数で撃墜率などを算出で使用予定

    this.itemstack = [];

    //

    this.hidan = 0;

    this.nonmove = 0;

    var stockscore = 0;
    var stockcount = 0;
    var stockrate = 1;
    var stockdisp_x = 128;
    var stockdisp_y = 96;

    var restart_count = 0;
    var map_sc;

    var before_int;
    var before_SIG;
    //  var map_sc = mapScenro();
    var ch_ptn = character();
    var motion_ptn = motionPattern();

    var sce = scenario()

    // オブジェクトの情報をArrayで管理
    var obj = [];//これをState側に持たせれば全体から管理可能となるか。

    //当たり判定用マップ

    var csmap = []; //collisonmap　0:当たり判定なし 1:当たり判定/ダメージ判定 2:当たり判定のみ　//2は機能していない(0かnot0のみ)
    //         自･弾･敵･弾･物･他
    csmap[0] = [0, 0, 2, 1, 1, 0]; //自機味方
    csmap[1] = [0, 0, 1, 0, 0, 0]; //自弾
    csmap[2] = [2, 1, 1, 0, 1, 0]; //敵
    csmap[3] = [1, 0, 0, 0, 0, 0]; //敵弾
    csmap[4] = [1, 0, 1, 0, 0, 0]; //アイテム
    csmap[5] = [0, 0, 0, 0, 0, 0]; //その他


    var restartFlag = true;

    //再読み込み無しの再起動
    this.reset = function (cont_flag) {

        restartFlag = true;//リセットした状態（マップコリジョン登録等を再処理する為のフラグ）

        cdt = new CLinear4TreeManager();
        if (!cdt.init(6, 0, 0, 3000, 3000)) { alert("!"); }

        delobj = 0; //不要かも

        restart_count = 0;

        if (state.Game.cold) {
            this.score = 0;

            this.obCount = []; //出現したキャラクタの総数
            this.combomax = []; //comboが続いた内の最大値
            this.total = []; //種類別の倒した総数(主に敵）　倒した総数/出現した数で撃墜率などを算出で使用予定
            this.hidan = 0;
            this.combo = [];
            this.item = [];
            this.itemstack = [];

        }

        if (!cont_flag) {
            this.interrapt = false;
            this.SIGNAL = 0;

            obj = [];

            state.Config.cold = true;
            //    this.item = [];
        }

        if (state.Config.fullpower) {
            this.item[7] = 10;
        }

        this.item[35] = 0; //coinclear;
    }

    //move ======================================
    //オブジェクトの移動/各処理のループ

    this.move = function (mapsc) {

        map_sc = mapsc;

        //    var mstate = dev.mouse_state.check();
        //var mstate = dev.mouse_state.check_last();
        var kstate = dev.key_state.check();

        this.nonmove = 0;
        // 移動などの処理
        for (var i in obj) {
            //for (var i = 0, loopend = obj.length; i < loopend; i++) {
            var o = obj[i];

            //o.colitem && o.colitem.remove();

            //o.alive--;

            //var onst = o.gt.in_stage_range(o.x - (o.hit_x / 2), o.y - (o.hit_y / 2), o.hit_x, o.hit_y);
            var onst = o.gt.in_view_range(o.x - (o.hit_x / 2), o.y - (o.hit_y / 2), o.hit_x, o.hit_y);

            if (!onst) {
                if ((o.type == 1) || (o.type == 3)) {
                    o.status = 0; //画面外から弾が飛んでこないようにする処理(飛んできたら難しすぎたので）
                }
            }

            //var instage = o.gt.in_stage(o.x , o.y);

            //var wgs = dev.gs.nowstagepos();
            //if ((o.x < wgs.x) || (o.x > wgs.x + wgs.w) || (o.y < wgs.y) || (o.y > wgs.y + wgs.h)) {

            if (state.Game.outviewCollision) onst = true; //画面外も処理な為強制的にon
            if (!onst) {
                this.nonmove++;
                //                o.state_moving = false;
                //if ((o.type == 1) || (o.type == 3)) {
                //    o.status = 0; //画面外から弾が飛んでこないようにする処理
                //}
                if (o.type != 5) continue;
            }

            /*
            if (!o.state_moving && o.type != 5) {//画面外から復帰時は移動処理を1回待つ
            o.state_moving = true;
            continue;
            }
            */
            //o.mouse_state = mstate;
            o.key_state = kstate;

            if (o.move(scrn, o, mapsc) != 0) {
                o.colitem && o.colitem.remove();
                o.colitem = null;
                delete obj[i];
                delobj++;
                //o.status = 0;
            } else {
                if (o.type != 5) { //その他は当たり判定リストに載せない
                    if (!o.firstRunning || ((o.x != o.old_x) || (o.y != o.old_y))) { //移動している場合
                        o.colitem && o.colitem.remove();
                        if (!o.colitem) {
                            o.colitem = cdt.createObjectForTree();
                            o.colitem.obj = o;
                        }

                        cdt.register(
                            /*
                            o.x + o.center_x - o.hit_x/2, 
                            o.y + o.center_y - o.hit_y/2,
                            o.x + o.center_x + o.hit_x/2, 
                            o.y + o.center_y + o.hit_y/2,
                            */
                            o.x - o.hit_x/2, 
                            o.y - o.hit_y/2,
                            o.x + o.hit_x/2, 
                            o.y + o.hit_y/2,
		                    o.colitem);

                        o.crash = null;

                        o.firstRunning = true;
                    }
                }
            }

            //messageの処理

            for (var mcnt = 0, loopend = o.message.length; mcnt < loopend; mcnt++) {
                var ms = o.message[mcnt];

                if (ms.cmd == "add_score") this.score += ms.src;

                if (ms.cmd == "get_item") {

                    if (Boolean(this.item[ms.src])) {
                        this.item[ms.src]++;
                    } else {
                        this.item[ms.src] = 1;
                    }

                    var c_rate = 1;

                    if (ms.src == 35) {
                        //c_rate = this.combo_sub(4);
                        //c_rate = this.item[35];
                    }

                    this.score += o.score * c_rate;

                    if (ms.src == 35) {

                        if (stockcount == 0) stockcount = 8;
                        stockscore += o.score;
                        stockrate++;
                        //if (stockrate < this.chain_cnt) { stockrate = this.chain_cnt }

                        stockdisp_x = o.x;
                        stockdisp_y = o.y;

                        //var wid = (o.score * c_rate) + "pts.";
                        //dev.sound.effect(11); //get音
                        //map_sc.add(o.x, o.y, 0, 20, 39, wid); //43green
                    }

                    if (ms.src == 21) {
                        var wid = "Extend!";
                        map_sc.add(o.x, o.y, 0, 20, 39, wid);
                    }

                    if (ms.src == 22) {
                        var wid = "GetKey!";
                        dev.sound.effect(11); //get音
                        map_sc.add(o.x, o.y, 0, 20, 39, wid);
                    }

                    if ((ms.src >= 15) && (ms.src <= 19)) {
                        var wid = "Weapon!";
                        dev.sound.effect(11); //get音
                        map_sc.add(o.x, o.y, 0, 20, 39, wid);
                    }

                    var f = false;
                    //if ((ms.src == 20) || (ms.src == 23) || (ms.src == 24) || (ms.src == 25)) {
                    if ((ms.src == 23) || (ms.src == 24) || (ms.src == 25)) {
                        //dev.sound.effect(9); //cursor音
                        f = true;
                    }

                    if (f) {
                        var w = ms.src;
                        this.itemstack.push(w);
                    }

                    //   o.set_object_ex(20, this.x, this.y, 0, 39, wid);メッセージ処理部の終了でメッセージキューはリセットされるので直接処理する事
                }

                if (ms.cmd == "reset_combo") {

                    for (var cb in this.combo) {
                        if (ms.src == cb) {
                            this.combo[cb] = 0;
                        }
                    }
                }

                if (ms.cmd == "SIGNAL") {

                    if (this.interrapt) {
                        this.interrapt = false;
                        this.SIGNAL = 0;
                    } else {
                        this.interrapt = true;
                        this.SIGNAL = ms.src;

                        if (ms.src == 0) this.interrapt = false;
                    }
                }

                if ((ms.cmd == "bomb2") || (ms.cmd == "bomb3")) {

                    if (Boolean(this.item[7])) { //PowerUpを減らす。

                        if (this.item[7] > 0) this.item[7]--;
                    }
                }

                command[ms.cmd](o, ms.src, ms.dst);

            }
            o.message = [];

            o.mapCollision = false;
            o.mapColX = false;
            o.mapColY = false;
        }

        //score view display 

        if (stockcount > 0) {
            //coin get score display 
            stockcount--;

            if (stockcount == 0) {

                this.score += stockscore;

                var wid = stockscore + "pts";
                if (stockrate != 1) {
                    wid += "(" + stockrate + "coin)";
                }

                //map_sc.add(128, 96, 0, 20, 39, wid); //43green
                map_sc.add(stockdisp_x, stockdisp_y, 0, 20, 39, wid); //43green

                stockscore = 0;
                stockrate = 0;
            }
        }

        //Hit

        //restartFlag = false;
        if (restartFlag) {
            var mapchip = map_sc.mapChip();

            //mapchipのtypeの変更は元でされています。10: 床　11: 壁　12: 扉

            for (var k = 0, loopend = mapchip.length; k < loopend; k++) {
                var w = mapchip[k];

                //w.colitem && w.colitem.remove();
                //if ((w.c) && (w.view)) { //画面外は当たり判定を行わない
                if (w.c) { //表示させなかった画面外の壁も当たり判定を行う

                    //当たり判定のある壁を当たり判定ツリーに追加
                    if (!w.colitem) {
                        w.colitem = cdt.createObjectForTree();
                        w.colitem.obj = w;
                    }

                    cdt.register(w.x, w.y,
                    w.x + w.w, w.y + w.h,
		            w.colitem);
                }
            }
            restartFlag = false;
        }
        //
        var res = cdt.getAllCollisionList();

        debug_colnum = res.length;

        for (var i = 0, loopend = res.length; i < loopend; i += 2) {

            var o = res[i];
            var e = res[i + 1];

            var type_w1 = (o.type == 98) ? 0 : o.type;
            var type_w2 = (e.type == 98) ? 0 : e.type;

            if ((type_w1 >= 10) && (type_w2 >= 10)) continue;

            // mob and mob
            if ((type_w1 < 10) && (type_w2 < 10)) {

                var flag = csmap[type_w1][type_w2];

                if (flag == 0) continue;

                if ((Math.abs(o.x - e.x) < (o.hit_x + e.hit_x) / 2) && (Math.abs(o.y - e.y) < (o.hit_y + e.hit_y) / 2)) {

                    o.status = 2;
                    e.status = 2;
                    o.crash = e;
                    e.crash = o;
                }
            } else {
                // mob and wall ( map collision )
                if (type_w2 < 10) {
                    o = res[i + 1];
                    e = res[i];
                }

                var w = e;
                //            for (var m in colchip) {
                //              var w = colchip[m];
                var c = false; //カベ壊しフラグ

                var bupCol = o.mapCollision;
                var bupColX = o.mapColX;
                var bupColY = o.mapColY;

                if (w.c) { //((w.c) && (w.view)) {
                    if ((Math.abs((o.x + o.vx) - (w.x + w.w / 2)) < (o.hit_x + w.w) / 2) && (Math.abs((o.y + o.vy) - (w.y + w.h / 2)) < (o.hit_y + w.h) / 2)) {
                        o.mapCollision = true;
                        c = true;
                    }
                    if ((Math.abs((o.x + o.vx) - (w.x + w.w / 2)) < (o.hit_x + w.w) / 2) && (Math.abs(o.y - (w.y + w.h / 2)) < (o.hit_y + w.h) / 2)) {
                        o.mapColX = true;
                    }
                    if ((Math.abs(o.x - (w.x + w.w / 2)) < (o.hit_x + w.w) / 2) && (Math.abs((o.y + o.vy) - (w.y + w.h / 2)) < (o.hit_y + w.h) / 2)) {
                        o.mapColY = true;
                    }

                    //if(true){
                    if (c) {
                        //if ((w.type == 10) && ((o.type == 1) || (o.type == 1))) {
                        //delete mapchip[m];
                        //}

                        if (w.type == 12) {

                            if (o.type == 98) {
                                o.doorflag = true;
                            }
                            o.mapCollision = bupCol;// || o.mapCollision;
                            o.mapColX = bupColX;// || o.mapColX;
                            o.mapColY = bupColY;// || o.mapColY;
                        }
                    }
                }
                //wall and wall
            }
        }

        var cmap = mapsc.cmap();

        for (i in obj) {
            o = obj[i];

            if (o.type == 5) continue;//その他(effect)は地形当たり判定しない。

            ///*2023/01/22 debug(動作忘れたため)
            //地形との当たり判定（MAP配列）
            if (Boolean(cmap)){ //cmap有効の場合cmapで当たり判定
                var lt = {};
                var rb = {};

                lt.x = o.x - o.hit_x / 2;
                lt.y = o.y - o.hit_y / 2;
                rb.x = o.x + o.hit_x / 2;
                rb.y = o.y + o.hit_y / 2;

                lt.mx = Math.floor((lt.x - 96) / 32);
                lt.my = Math.floor((lt.y - 96) / 32);
                rb.mx = Math.floor((rb.x - 96) / 32);
                rb.my = Math.floor((rb.y - 96) / 32);


                if ((lt.mx < 0) || (lt.my < 0) ||
                    (rb.mx > cmap.length) || (rb.my > cmap.length)) {
                    o.mapCollision = true;
                } else

                if ((cmap[Math.floor((lt.x - 96) / 32)][Math.floor((lt.y - 96) / 32)]) ||
                    (cmap[Math.floor((lt.x - 96) / 32)][Math.floor((rb.y - 96) / 32)]) ||
                    (cmap[Math.floor((rb.x - 96) / 32)][Math.floor((lt.y - 96) / 32)]) ||
                    (cmap[Math.floor((rb.x - 96) / 32)][Math.floor((rb.y - 96) / 32)])) {

                    o.mapCollision = true;
                }
            }
            //*/
            //
            var onst = o.gt.in_stage_range(o.x - (o.hit_x / 2), o.y - (o.hit_y / 2), o.hit_x, o.hit_y);
            //画面外？
            //if ((o.x < wgs.x) || (o.x > wgs.x + wgs.w) || (o.y < wgs.y) || (o.y > wgs.y + wgs.h)) {

            if (state.Game.outviewCollision) onst = true; //画面外も処理な為強制的にon
            if (!onst) {
                continue;
            }

            if (o.crash) {

                var wo_stat = 0;
                var wo_crst = 0;
                var wo_vect = 0;

                if ((o.type == 1) || (o.type == 3)) {
                    //弾の場合はそのまま消滅
                } else {
                    var bf = true;

                    if (bf) { //衝突でのhp/damegeflag処理　(バトルシステムを入れる場合はここになる）

                        var whp = o.hp;

                        if (o.type == 4) o.hp = 0; //item取得の場合はhp減少が発生しないようにする。
                        //(アイテムに当たり判定があるのは自分と友軍なので取得の判定はアイテムが衝突死したところで行う)

                        if (o.type != o.crash.type) {
                            if (o.crash.type != 4) o.hp -= o.crash.attack; // ((o.crash.hp > 0) ? o.crash.hp : 1);
                        } else {
                            o.mapCollision = true; // whp = -1; //同じtype同士が衝突した場合はダメージ発生無しの衝突処理のみ
                        }

                        if (o.hp > 0) {//生き残った場合はstatusを2(衝突して死亡)から1(通常)にしてdamegeflagをオン
                            o.status = 1;
                            if (whp != o.hp) {
                                //if (o.type == 98) this.hidan++;
                                o.damageflag = true;
                                o.crash.damageflag = true;
                                o.damage.vector = o.target_r(o.crash.x, o.crash.y);
                                o.damage.dist = o.target_d(o.crash.x, o.crash.y);
                                o.damage.no = o.crash.attack;
                            }
                            o.crash = null;
                        } else {
                            if (o.type == 2) {
                                //this.combo_sub(2);
                            }
                        }
                    }
                }
            }
        }

        //    if (delobj > 10){obj.sort(); delobj = 0;}//消した配列が10個超えたらソート
        //    if (!obj[obj.length-1]) {obj.pop();}//空の配列を削除します。

        var f = 0;
        for (i in obj) {
            if (obj[i].type == 98) f++;
            //if (obj[i].type == 4) and 
        }

        if (f == 0) {
            restart_count++;

            if (restart_count > 180) {//3秒後
                before_int = this.interrapt;
                before_SIG = this.SIGNAL;
                this.interrapt = true;
                this.SIGNAL = 4649;
                //画面から自機がいなくなったらリスタートシグナルを上げる(数字は適当で仮）  
            }
        }

        //restartFlag = false;
    }

    this.combo_sub = function (num) {
        if (!Boolean(this.combo[num])) {
            this.combo[num] = 1;
        } else {
            this.combo[num]++;
        }

        if (!Boolean(this.combomax[num])) {
            this.combomax[num] = this.combo[num];
        } else {
            if (this.combo[num] > this.combomax[num]) this.combomax[num] = this.combo[num];
        }

        if (!Boolean(this.total[num])) {
            this.total[num] = 1
        } else {
            this.total[num]++;
        }

        return this.combo[num];
    }


    //外部からリスタート指示の為のコマンド  
    this.restart = function () {

        map_sc.start(false);
        restart_count = 0;

        this.interrapt = before_int;
        this.SIGNAL = before_SIG;
    }



    var command = [];

    command["set_object"] = function (o, src, dst) {

        //		set_sce( o.x,  o.y , o.vector , src );

        map_sc.add(o.x, o.y, o.vector, src , null, null ,o);

    }

    command["set_object_ex"] = function (o, src, dst) {
        // dst.x dst.y dst.vector src dst.sce

        //		set_sce( o.x,  o.y , o.vector , src, dst );

        map_sc.add(dst.x, dst.y, dst.vector, src, dst.sce, dst.id, o);

    }

    command["get_target"] = function (o, src, dst) {

        var tgt_no = 1;
        var wdist = 99999;

        o.target = null; //o; //{}; 見つからなかった場合

        for (var i in obj) {
            var wo = obj[i];
            if (wo.type != src) continue;

            var d = wo.target_d(o.x, o.y);
            if (d < wdist) {
                o.target = wo;
                wdist = d;
            }

        }

    }

    command["change_sce"] = function (o, src, dst) {
        //バグの温床になる危険を秘めています。要注意。

        o.init = sce.init[src];
        o.move = sce.move[src];
        o.custom_draw = sce.draw[src];

        o.init(scrn, o);
    }


    command["add_score"] = function (o, src, dst) {

        return src;
    }

    command["get_item"] = function (o, src, dst) {

        return src;
    }

    command["bomb"] = function (o, src, dst) {

        for (i in obj) {
            if (obj[i].type == 3) {//敵の弾を消滅

                obj[i].change_sce(7);
            }
        }
    }

    command["bomb2"] = function (o, src, dst) {

        for (i in obj) {
            o = obj[i];

            if (o.type == 3) {//敵の弾を回収状態に
                o.type = 4;
                o.mp = 18;
                o.score = 8;
//test用
                if (o.chr != 7) {
                    var witem = [18, 22, 26, 27, 29, 30];

                    o.mp = witem[Math.floor(Math.random() * witem.length)];
                }

                o.change_sce(30);
            }
        }
    }

    command["bomb3"] = function (o, src, dst) {

        for (i in obj) {

            //画面内にいる敵のみ
            var onst = o.gt.in_view_range(
                obj[i].x - (obj[i].hit_x / 2),
                obj[i].y - (obj[i].hit_y / 2), obj[i].hit_x, obj[i].hit_y);

            if (onst) {
                if (obj[i].type == 2) {//敵には一律10のダメージ
                    obj[i].hp -= 10;
                    if (obj[i].hp <= 0) obj[i].status = 2;
                }

                if (obj[i].type == 3) {//敵の弾を消滅

                    obj[i].change_sce(7);
                }
                /*
                //bomb時に画面内アイテム回収モードにしてみる2023/1/12追記
                if (obj[i].type == 4) {//アイテム
                        obj[i].change_sce(30);
                }
                */
            }
            
        }
    }
    //特定のchのみ消す（timeoverリセット用）
    command["bomb4"] = function (o, src, dst) {

        for (i in obj) {

            if (obj[i].chr == src) {
                obj[i].status = 0; //接触でなく消滅させる
            }
        }
    }

    command["collect"] = function (o, src, dst) {

        for (i in obj) {
            o = obj[i];

            if (o.type == 4) {//アイテムを回収モードに変更（上のほうに行ったときに）

                if (!Boolean(o.collection_mode)) {
                    o.collection_mode = true;
                    o.change_sce(30);
                }
            }
        }
    }
    //
    command["collect2"] = function (o, src, dst) {
        for (i in obj) {

            //画面内にいるアイテムのみ　2023/1/12追加コマンド
            var onst = o.gt.in_view_range(
                obj[i].x - (obj[i].hit_x / 2),
                obj[i].y - (obj[i].hit_y / 2), obj[i].hit_x, obj[i].hit_y);

            if (onst) {
                //アイテム回収モードにする
                if (obj[i].type == 4) {//アイテム
                        obj[i].change_sce(30);
                }
            }
            
        }
    }

    command["collect3"] = function (o, src, dst) {
        for (i in obj) {
            //自機の半径n内にいるアイテムのみ　2023/1/12追加コマンド
            if (obj[i].type == 4){//アイテム
                if ( o.target_d( obj[i].x, obj[i].y ) < 100){//半径
                        obj[i].change_sce(30);
                }
            }
            
        }
    }

    command["SIGNAL"] = function (o, src, dst) {
        

        //		this.pause = true;

        //		this.SIGNAL = src;
    }

    command["reset_combo"] = function (o, src, dst) {

        //		this.pause = true;

        //		this.SIGNAL = src;
    }
    command["search_target_item"] = function (o, src, dst) {
        //稼働中objに対象のCHNOが存在するか？(KEYSEARCH用) 
        //無かったら、敵の持ち物をチェックする。
        //ない場合はkeyon=false;//自分の持ち物にある場合はこれでチェックしない。
        //戻り値はState.game.keyon,key_x,key_yに入れる。
        var onflag = false;
        var wx = 0;
        var wy = 0;

        for (var i in obj) {
            var wo = obj[i];
            if (wo.type == 2){//enemy
                //wo.lighton = true;                
                for (var j of wo.pick){
                    if (j == src){
                        onflag = true;
                        wx = wo.x;
                        wy = wo.y;
                        wo.lighton = true;
                    }
                    if (onflag) break;
                }
                continue;
            }
            if (wo.type == 4){//item
                //wo.lighton = true;
                if (wo.chr == src){
                    onflag = true;
                    wx = wo.x;
                    wy = wo.y;
                    wo.lighton = true;
                    break;
                } 
                continue;
            }
        }

        state.Game.keyon = onflag;
        state.Game.key_x = wx;
        state.Game.key_y = wy;
    }




    // draw ======================================
    // オブジェクトの描画

    this.draw = function (wscreen, mode) {

        if (!Boolean(mode)) mode = false;
        //mode: prioritySurface
        if (!Boolean(wscreen)) wscreen = scrn;

        for (var i in obj) {
            var o = obj[i];

            //	o.wn = i;

            if (o.visible && (o.prioritySurface == mode)) {
                
                if (o.normal_draw_enable) {
                    if (dev.gs.in_view(o.x, o.y)){
                        o.draw(wscreen, o);
    
                        if (state.Config.debug) {
                            var w = o.gt.worldtoView(o.x, o.y);
                            var cl = {}
                            //cl.x = w.x + o.center_x - o.hit_x/2 ;
                            //cl.y = w.y + o.center_y - o.hit_y/2 ;
                            cl.x = w.x - o.hit_x/2 ;
                            cl.y = w.y - o.hit_y/2 ;
                            cl.w = o.hit_x;
                            cl.h = o.hit_y;
                            cl.draw = function(device){
                                device.beginPath();
                                device.strokeStyle = "green";
                                device.lineWidth = 2;
                                device.rect(this.x, this.y, this.w, this.h );
                                device.stroke();
                            }
                            if (o.type != 5) wscreen.putFunc(cl);
                            wscreen.putchr8(o.hp, w.x, w.y);
                        } 
                    }
                }

                if (o.custom_draw_enable) {
                    if (Boolean(o.custom_draw)) {
                        o.custom_draw(wscreen, o);
                    }

                }
            }
        }

        if (state.Config.debug && mode) {
            //debug 
            wscreen.putchr8("obj:" + cdt.objectNum, 300, 16);
            wscreen.putchr8("col:" + debug_colnum/2, 300, 24);
            wscreen.putchr8("f:" + debug_cflag, 300, 32);

            //wscreen.putchr8("scrst"+ wscreen.count(),300,40);

        }
    }

    // drawPoint ==================================
    // 縮小マップ用オブジェクト位置描画

    this.drawPoint = function (wscreen, flag) {
        //flag true: lamp on false:lamp off
        var col = ["skyblue", "skyblue", "red", "orange", "yellow", "yellow"];
        col[98] = "white";

        if (!Boolean(wscreen)) wscreen = scrn;

        var nt = Date.now();

        var cl = {};

        cl.obj = obj;
        cl.col = col;
        cl.draw = function (device) {

            for (var i in this.obj) {
                var o = this.obj[i];

                if (o.visible) {

                    if ((o.type == 1) || (o.type == 3) || (o.type == 5)) continue;

                    if ((o.type != 98) && (!flag)) continue;

                    if (o.normal_draw_enable) {
                        device.beginPath();
                        device.strokeStyle = this.col[o.type];
                        device.lineWidth = 2;
                        device.rect(
                            dev.layout.map_x + o.x / 20, 
                            dev.layout.map_y + o.y / 20,
                            o.hit_x / 20, o.hit_y / 20);
                        device.stroke();
                    }

                    if (o.lighton) {
                        device.beginPath();
                        device.strokeStyle = this.col[o.type];
                        device.lineWidth = 1;
                        device.arc(
                            dev.layout.map_x + (o.x + o.hit_x/2) / 20,
                            dev.layout.map_y + (o.y + o.hit_y/2) / 20,
                             (nt%27)/9*2, 0, 2 * Math.PI, false);
                        device.stroke();
                    }
                }
            }
        }

        wscreen.putFunc(cl);
    }

    //BG面にCharacter用のShadowをDrawする。用に作成
    this.drawShadow = function(wscreen){

        if (!Boolean(wscreen)) wscreen = scrn;

        var cl = {};
        cl.obj = obj;
        cl.draw = function (device) {
            for (var i in this.obj) {
                var o = this.obj[i];
                
                if (!o.visible) continue;
                //shadow 
                //bullet/effectには影つけない
                if ((o.type == 1) || (o.type == 3) || (o.type == 5 )) continue;
                if (!o.gt.in_view(o.x,o.y)) continue;
                if (o.normal_draw_enable) {
                    var w = o.gt.worldtoView(o.x, o.y);

                    var ww = o.center_x * o.display_size;
                    var wh = o.center_y * o.display_size;
 
                    device.beginPath();
                    device.fillStyle = "rgba(0,0,0,0.6)";
                    device.ellipse(w.x, w.y + wh, ww, wh/4, 0,  0, Math.PI*2, true );

                    device.fill();
                }
            }
        }
        wscreen.putFunc(cl);
    }

    // =======================================================
    // オブジェクトのセット
    this.set_s = set_sce;

    function set_sce(x, y, r, ch, sc, id, parent) {

        var o = new gObjectClass();

        o.reset();

        o.firstRunning = false;

        o.parent = parent;

        o.scrn = scrn;
        o.graphicsLayer = dev.graphics;
        o.mouse_state = dev.mouse_state.check_last();
        o.gt = dev.gs;
        o.sound = dev.sound;

        o.gameState = state.Game;
        o.item = this.item;
        o.itemstack = this.itemstack;
        o.config = state.Config;

        o.pick = [];
        o.pick_enable = true; //falseだとアイテムを拾わない。

        o.x = x;
        o.y = y;

        o.startx = x; //何に使ってる？
        o.starty = y; //

        o.vector = r;
        o.chr = ch;
        o.visible = true;

        o.mp = ch_ptn[ch].mp;
        o.hp = ch_ptn[ch].hp;
        o.maxhp = o.hp;
        o.type = ch_ptn[ch].type;
        o.center_x = ch_ptn[ch].center_x;
        o.center_y = ch_ptn[ch].center_y;
        o.hit_x = ch_ptn[ch].size_x;
        o.hit_y = ch_ptn[ch].size_y;

        if (!Boolean(id)) id = ch_ptn[ch].id;
        o.id = id;

        o.score = ch_ptn[ch].score;
        o.status = 1; //StatusValue.Normal ;

        if (!Boolean(sc)) sc = ch_ptn[ch].senario[0];

        o.init = sce.init[sc];
        o.move = sce.move[sc];
        o.draw = cntl_draw;
        o.custom_draw = sce.draw[sc];

        o.attack = 3;//characterパラメータで設定できない為、Scenarioかここで設定している(仮
        if ((o.type == 1) || (o.type == 3)) {
            o.attack = o.hp;
        }

        o.init(scrn, o);

        var epty = -1;

        for (var i = 0,loopend = obj.length; i < loopend; i++) {
            if (!obj[i]) {//空の配列を探す。
                epty = i;
                break;
            }
        }

        if (epty == -1) {
            obj[obj.length] = o;
        } else {
            obj[epty] = o;
        }

        if (Boolean(this.obCount[o.type])) {
            this.obCount[o.type]++;
        } else {
            this.obCount[o.type] = 1;
        }

        if ((o.type == 1)&&(o.type == 3)) o.alive = 90;
    };

    this.num = function () {

        return obj.length;
    }

    this.cnt = function () {

        var c = 0;

        for (var i in obj) {
            c++;
        }
        return c;
    }

    function cntl_draw(scrn, o) {
        //alert("!");
        //表示
        
        //shadow 
        //bullet/effectには影つけない
        //var sdwf = ((o.type != 1)&&(o.type !=3)&&(o.type !=5))? true : false;
        //var sdwf = (o.type !=5)? true : false;
        //
        if (Boolean(motion_ptn[o.mp].wait)) {
            o.mp_cnt_frm++;
            if (o.mp_cnt_frm > motion_ptn[o.mp].wait / 2) {
                o.mp_cnt_anm++;
                o.mp_cnt_frm = 0;
                if (o.mp_cnt_anm >= motion_ptn[o.mp].pattern.length) o.mp_cnt_anm = 0;
            }
        }
        try {
            var ptn = motion_ptn[o.mp].pattern[o.mp_cnt_anm][0];
        }
        catch (e) {
            o.mp_cnt_anm = 0;
            ptn = motion_ptn[o.mp].pattern[o.mp_cnt_anm][0];
        }

        var wvh = motion_ptn[o.mp].pattern[o.mp_cnt_anm][1];
        var wr = motion_ptn[o.mp].pattern[o.mp_cnt_anm][2];

        if ((wvh == -1) && (wr == -1)) {
            wvh = 0;
            wr = o.vector;
        };

        var w = o.gt.worldtoView(o.x, o.y);
        /*
        if (sdwf){//shadow draw
            var cl = {}
            cl.x = w.x;
            cl.y = w.y; 
            cl.w = o.center_x * o.display_size;
            cl.h = o.center_y * o.display_size;
            cl.draw = function(device){
                device.beginPath();
                device.fillStyle = "rgba(0,0,0,0.6)";
                device.ellipse(this.x, this.y + this.h, this.w, this.h/4, 0,  0, Math.PI*2, true );

                //device.ellipse(this.x, this.y, this.w*10, this.h*10, 0,  0, Math.PI*2, true );
                //device.fillStyle = "darkyellow";
                //device.arc(this.x, this.y,  30, 0,  Math.PI*2, true );
                device.fill();
            }
            scrn.putFunc(cl);
        }
        */
        /*
        document.getElementById("manual_1").innerHTML = 
        "!"+ ptn + "," + wvh + "," + wr +
        "(" + Math.trunc(o.x) + "," + Math.trunc(o.y) + 
        ")(" + Math.trunc(w.x) + "," + Math.trunc(w.y)+"</br>"+
        "s:"+scrn+scrn.cw+","+scrn.ch;
        */

        //if ((w.x >= 0) && (w.x <= scrn.cw) && (w.y >= 0) && (w.y <= scrn.ch)) {
            scrn.put(ptn,
                 w.x + o.shiftx, 
                 w.y + o.shifty, 
                 wvh, wr, o.alpha, o.display_size);
            //scrn.putchr("mp:"+ o.mp, w.x, w.y);
            //document.getElementById("manual_1").innerHTML += ".";
        //}

    }

}
