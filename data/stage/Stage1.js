//　ステージの設定(用語が混乱してるけど　マップ、マップシナリオ、マップチップの統合）

function Stage1(stageno) {

    //stageno = 0;
    var BLOCK_W = 96;
    var BLOCK_H = 96;
    
    //
    var dgn;
    
    dgn = new Dangeon(stageno);
    dgn.create();

    var mp = dgn.mapdata;
    var hlist = [];

    hlist = dgn.ml;

    var rlist = dgn.il;

    stageno = Math.floor(Math.random() * 1000000);
    var rnd = new myrnd(stageno);//seed);

    this.scenario = mapScenro;
    this.bgImage = mapBgImage;
    this.bgLayout = mapBgLayout;
    this.initial = mapInitial;
    this.bgPtn = mapBgPattern;

    var cmap = [];
    this.colmap = cmap;

    //　マップ設定値
    //  
    //　x,y　　座標　
    //　r　　　角度（移動方向に使用するか表示に使用するかはイベントによる。
    //　scenario　使用するシナリオ
    //　chr No. 使用するキャラクター
    //
    //　フレームカウントは約60で1秒進む予定
    //
    //  特殊機能 
    //　座標がマイナスの場合はフレームカウントのリセット（0に戻る）
    //  フレームカウントがマイナスの場合は最初のみ実行
    function mapScenro() {

        var ms =
        //  開始フレーム,座標,,角度,シナリオ,キャラ
	[
	[7199, 240, 240, 180, "enemy_timeover", 33],
	[7199, 240, 2000, 180, "enemy_timeover", 33],
	[7199, 1500, 1500, 180, "enemy_timeover", 33],
    [7199, 2000, 240, 180, "enemy_timeover", 33],
    [7199, 2000, 2000, 180, "enemy_timeover", 33],
	[600000, -1, -1, 0, 0, 0]];
        //
        // フレームカウントでソートされていること。

        var map_sc = []; //　出現パターン

        for (var j in ms) {
            var w = ms[j];

            var ptn = {};

            ptn.count = w[0];
            ptn.x = w[1];
            ptn.y = w[2];
            ptn.r = w[3];
            ptn.sc = w[4];
            ptn.ch = w[5];

            map_sc.push(ptn);
        }

        for (var e in map_sc) {

            var pt = map_sc[e];

            var wx = Math.floor(pt.x / BLOCK_W);
            var wy = Math.floor(pt.y / BLOCK_H);

            var f = true;

            for (var i in rlist) {
                if ((rlist[i].x == wx) && (rlist[i].y == wy)) {

                    f =false;
                //    break;
                }
            }

            if (f) {
                var vr = Math.floor(Math.random() * rlist.length);

                pt.x = rlist[vr].x * BLOCK_W + BLOCK_W/2;
                pt.y = rlist[vr].y * BLOCK_H + BLOCK_H/2;
            }
        }

        return map_sc;

    }

    function mapBgImage(stageno) {

        var num = Math.floor(((stageno-1) % 15) / 5) + 1;

        var tex_bg = "bg" + num;

    //    var tex_bg = new Image();
    //    tex_bg.src = "pict/cha.png";

        return tex_bg;
    }

    function mapBgLayout() {

        //    マップチップの座標リスト
        //スクロール時のbg調整用
        //mapImageNo, world ltx, world lty

        var mc = [];
        var mp = dgn.mapdata;

        var vx = [-1,  0,  1, -1,  1, -1,  0,  1];
        var vy = [-1, -1, -1,  0,  0,  1,  1,  1];

        var w = [];

        bit_check = function (n) {
            var cr = [];

            for (var i in vx) {

                if (Math.floor(n / Math.pow(2,i)) % 2 != 0) {
                    cr[i] = true;
                } else {
                    cr[i] = false;
                }
            }

            return cr;
        }

        cmap = [];

        for (var i = 1; i <= dgn.mw - 1; i++) {
            // 0,1,2 * 3
            cmap[i * 3 - 3] = [];
            cmap[i * 3 - 2] = [];
            cmap[i * 3 - 1] = [];
            for (var j = 1; j <= dgn.mh - 1; j++) {

                if (mp[i][j]) {
                    var cr = bit_check(dgn.type[i][j]);
                    for (var k in vx) {
                        w = [cr[k] ? (Number(k) + 3) : 12,
                            i * BLOCK_W + 32 + 32 * vx[k],
                            j * BLOCK_H + 32 + 32 * vy[k],
                            32,
                            32,
                            false, //cr[k];
                            1 + (cr[k] ? 0 : -1), //dgn.type[i][j],
                            true
                        ];
                        mc.push(w);
                        cmap[(i * 3 - 2) + vx[k]][(j * 3 - 2) + vy[k]] = cr[k];
                    }
                } else {
                    for (var k in vx) {
                        cmap[(i * 3 - 2) + vx[k]][(j * 3 - 2) + vy[k]] = null;//要素が無くてエラーにならないようにする。
                    }
                }

                if (mp[i][j]) {

                    w = [11,
                            i * BLOCK_W + 32,
                            j * BLOCK_H + 32,
                            32,
                            32,
                            false, //true,
                            1,//dgn.type[i][j],
                            true
                        ];
                    mc.push(w);
                    cmap[i * 3 - 2][j * 3 - 2] = true;
                };              

/*
                if (mp[i][j]) {

                    w = [1,
                            i * 96,
                            j * 96,
                            96,
                            96,
                            true,
                            dgn.type[i][j],
                            true
                        ];
                    mc.push(w);
                }
*/
            }
        }

        //debug disp


        for (var i in hlist) {

            w = [0,
        hlist[i].x * BLOCK_W, // + 10,
        hlist[i].y * BLOCK_H, // + 10,
        96,
        96,
        false,
        0,
        true
        ];
            mc.push(w);

        }

        var r = Math.floor(rnd.next() * rlist.length)
        w = [13,
            rlist[r].x * BLOCK_W + 16,
            rlist[r].y * BLOCK_H + 16,
                            64,
                            64,
                            true,
                            2,   //doortype
                            true
                        ];

        mc.push(w);

        var map_cp = []; //　マップチップ

        //no:graphics　type:floortype　0:床　1:壁　2:ドア


        for (var j in mc) {
            var w = mc[j];

            var chip = {};

            chip.no = w[0];
            chip.x = w[1];
            chip.y = w[2];
            chip.w = w[3];
            chip.h = w[4];
            chip.c = w[5];
            chip.type = w[6] + 10; //当たり判定混合用に背景ユニットはtype+10で処理することにする。
            chip.view = false;
            chip.visible = w[7];
            chip.lookf = false;

            map_cp.push(chip);
        }

        this.colmap = cmap;
        return map_cp;
    }

    function mapInitial(stageno) { //flag = true 初期マップ展開有り　false 自機リスタート

        var shuffled = [];

        for (var i = 0; i < rlist.length; i++) {

            shuffled[i] = i;
        }

        for (i = 0; i < 3000; i++) {

            var snum = Math.floor(rnd.next() * shuffled.length);
            var dnum = Math.floor(rnd.next() * shuffled.length);

            var w = shuffled[snum];
            shuffled[snum] = shuffled[dnum];
            shuffled[dnum] = w;
        }

  
        var ms = [];
        //  開始フレーム,座標,,角度,シナリオ,キャラ

        var r = shuffled[0];
        ms.push([false, rlist[r].x * BLOCK_W + 10, rlist[r].y * BLOCK_H + 10, 0, "player", 0]);
        //ms.push([false, rlist[r].x * BLOCK_W + 10, rlist[r].y * BLOCK_H + 10, 0, "effect_informationCursor", 0]);

        //ms.push([false, rlist[r].x * 96 + 10, rlist[r].y * 96 + 10, 0, "friend_rotate", 10]);

        var rcnt = 1;

        if ((stageno % 5) == 0) {
            //bossstage
            var stmap = [
            ["common_vset0", 20, 20], //ball
            ["common_vset0", 22, 1], //key
            ["common_vset0", 21, 1], //extend
            ["common_vset0", 23, 7], //b
            ["common_vset0", 24, 7], //s
            ["common_vset0", 25, 7], //l
            ["common_vset0", 26, 1], //lamp
            ["common_vset0", 27, 1], //map
            ["common_vset0", 15, 1], //wand
            ["common_vset0", 16, 1], //sword
            ["common_vset0", 17, 1], //axe
            ["common_vset0", 18, 1], //spare
            ["common_vset0", 19, 1], //boom
            ["common_vset0", 50, 1], //bow
            ["enemy_generator", 1, 3],//generator
            ["boss_0", 34, Math.floor(stageno / 5) - 1], //bx
            ["boss_0", 14, (stageno % 15 != 0) ? 1 : 0], //b0
            ["boss_1", 14, (stageno % 15 == 0) ? 1 : 0] //b2
            ];

        } else {
            //normalstage

            var e_mv = Math.floor(stageno / 4);
            var e_rsh = Math.floor(stageno / 3);
            var e_tr = Math.floor(stageno / 4);
            var e_mbl = Math.floor(stageno / 4);

            var e_mstd = 25 - e_mv - e_rsh - e_tr - e_mbl;
            e_mstd = (e_mstd < 5) ? 5 : e_mstd;

            var stmap = [
            ["common_vset0", 20, 20], //ball
            ["common_vset0", 22, 1], //key
            ["common_vset0", 23, Math.floor(stageno / 4) + 4], //b
            ["common_vset0", 24, Math.floor(stageno / 6) + 4], //s
            ["common_vset0", 25, 4], //l
            ["common_vset0", 26, 1], //lamp
            ["common_vset0", 27, 1], //map
            ["common_vset0", 15, 1], //wand
            ["common_vset0", 16, 1], //sword
            ["common_vset0", 17, 1], //axe
            ["common_vset0", 18, 1], //spare
            ["common_vset0", 19, 1], //boom
            ["common_vset0", 50, 1], //bow
            ["enemy_move_std2", 1, e_mstd],
            ["enemy_generator", 1, 5],
            ["enemy_mimic", 40, Math.floor(stageno / 5)],
            ["enemy_moveshot_1", 1, e_mv],
            ["sce_enemy_randomshot", 1, e_rsh],
            ["enemy_turn_r", 1, e_tr ],
            ["enemy_move_n_l", 1, e_mbl]
            ];

            //["enemy_timeover", 33, 0]//l
        }

        //var stmap = [[]];

        for (var i in stmap) {
            var data = stmap[i];

            for (var j = 0; j < data[2]; j++) {
                var nm = shuffled[rcnt];

                w = [true,
                    rlist[nm].x * BLOCK_W + BLOCK_W/2,
                    rlist[nm].y * BLOCK_H + BLOCK_H/2,
                    Math.floor(rnd.next() * 4) * 90, //Math.floor(Math.random() * 360),
                    data[0],
                    data[1]
                    ];

                ms.push(w);

                rcnt++;
                if (rcnt >= rlist.length) rcnt = 0;
            }
        }

        var map_sc = []; //　出現パターン

        for (var j in ms) {
            var w = ms[j];

            var ptn = {};

            ptn.s = w[0];
            ptn.x = w[1] + Math.floor(rnd.next() * (BLOCK_W/4)) *4 - BLOCK_W/2;
            ptn.y = w[2] + Math.floor(rnd.next() * (BLOCK_W/4)) *4 - BLOCK_W/2;
            ptn.r = w[3];
            ptn.sc = w[4];
            ptn.ch = w[5];

            map_sc.push(ptn);
        }

        //鍵の設定
        //5の倍数面は敵(ボス/中ボス)に鍵を持たせるために同じ座標に鍵を設定する。
        var key_idx = -1;

        for (var i in map_sc){
            var w = map_sc[i];

            if (w.ch == 22){ //Key
                key_idx = i;
                break;
            }
        }
        if (key_idx < 0) alert("KEY not Found!");

        for (var i in map_sc){
            var w = map_sc[i];

            if (w.ch == 14){ //BOSS の位置に鍵を移動する。
                map_sc[key_idx].x = w.x ;
                map_sc[key_idx].y = w.y ;
                break;
            }
        }
        return map_sc;
        //マップの初期配置とマップチップの座標リストなど
        //flagはマップの初期化をするかどうか(trueでリスタート？）
    }

    function mapBgPattern() {

        var sp =
        // SP NO.","X","Y","ADDX","ADDY"
    	[[0, 128 - 96, 128 - 128, 95, 95],
    	[1, 224 - 96, 128 - 128, 95, 95],
    	[2, 128 - 96, 128 - 128, 31, 31],
    	[3, 224 - 96, 128 - 128, 31, 31],
    	[4, 256 - 96, 128 - 128, 31, 31],
    	[5, 288 - 96, 128 - 128, 31, 31],
    	[6, 224 - 96, 160 - 128, 31, 31],
    	[11, 256 - 96, 160 - 128, 31, 31],
    	[7, 288 - 96, 160 - 128, 31, 31],
    	[8, 224 - 96, 192 - 128, 31, 31],
    	[9, 256 - 96, 192 - 128, 31, 31],
    	[10, 288 - 96, 192 - 128, 31, 31],
    	[11, 256 - 96, 160 - 128, 31, 31],
    	[12, 96 - 96, 192 - 128, 31, 31],
        [13,  0, 0, 32, 32],
        ];

        var bg_ptn = []; // BGパターン

        for (var j in sp) {
            var w = sp[j];

            var ptn = {};

            ptn.x = w[1];
            ptn.y = w[2];
            ptn.w = w[3];
            ptn.h = w[4];

            bg_ptn[w[0]] = ptn;
        }

        return bg_ptn;
    }


    function myrnd(num) {

        var seed = num;

        this.next = readnum;

        function readnum() {
            var rndnum = (1103515245 * seed + 12345) % 32768;

            seed = rndnum;

            return rndnum / 32767.1;
        }
    }
}