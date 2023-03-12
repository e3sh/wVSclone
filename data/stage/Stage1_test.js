//　ステージの設定(用語が混乱してるけど　マップ、マップシナリオ、マップチップの統合）

function Stage1_test(stageno) {

    //stageno = 0;
    var BLOCK_W = 96;
    var BLOCK_H = 96;

    stageno = Math.floor(Math.random() * 1000000);
    var rnd = new myrnd(stageno);//seed);

    this.scenario = mapScenro;
    this.bgImage = mapBgImage;
    this.bgLayout = mapBgLayout;
    this.initial = mapInitial;
    this.bgPtn = mapBgPattern;

    var cmap = [];
    //this.colmap = cmap;

    function mapScenro() {

        var ms =
        //  開始フレーム,座標,,角度,シナリオ,キャラ
    	[
    	[119999, 240, 240, 180, "enemy_timeover", 33],
	    [119999, 240, 2000, 180, "enemy_timeover", 33],
	    [119999, 1500, 1500, 180, "enemy_timeover", 33],
        [119999, 2000, 240, 180, "enemy_timeover", 33],
        [119999, 2000, 2000, 180, "enemy_timeover", 33],
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
            ptn.used = false;

            map_sc.push(ptn);
        }

        return map_sc;
    }

    function mapBgImage(stageno) {
        return "bg1";
    }

    function mapBgLayout() {

        //for (var j = 0; j < 90; j++){ cmap[j] = []; for (var i = 0; i < 90; i++){cmap[j][i] = null; }}
        var mc = [];
        
        var w = [];

        for (var i = 0; i <= 30 ;i++) {
            for (var j = 0; j <= 30 ;j++) {

                w = [0,
                    i * BLOCK_W,
                    j * BLOCK_H,
                    96,
                    96,
                    false, 
                    0,
                    true
                ];
                mc.push(w);
                //cmap[i][j] = null;
            }
        }
        //枠
        for (var i = 0; i <= 30 ;i++) {
            (i%2 == 0)?
                mc.push([11,  i * BLOCK_W     ,  0 * BLOCK_H, 32, 32, true , 1, true ])://Wall
                mc.push([12,  i * BLOCK_W     ,  0 * BLOCK_H, 32, 32, false, 0, true ]);//Floor
            mc.push([12,  i * BLOCK_W + 32,  0 * BLOCK_H, 32, 32, false, 0, true ]);
            mc.push([12,  i * BLOCK_W + 64,  0 * BLOCK_H, 32, 32, false, 0, true ]);
            //mc.push([12,  i * BLOCK_W, 31 * BLOCK_H, 32, 32, false, 0, true ]);
            (i%2 == 1)?
                mc.push([11,  0 * BLOCK_W,  i * BLOCK_H     , 32, 32, true , 1, true ]):
                mc.push([12,  0 * BLOCK_W,  i * BLOCK_H     , 32, 32, false, 0, true ]);
            mc.push([12,  0 * BLOCK_W,  i * BLOCK_H + 32, 32, 32, false, 0, true ]);
            mc.push([12,  0 * BLOCK_W,  i * BLOCK_H + 64, 32, 32, false, 0, true ]);
            //mc.push([12, 31 * BLOCK_W,  i * BLOCK_H, 32, 32, false, 0, true ]);
        }
        
        for (var i = 0; i <= 50; i++) {
            var wx = Math.floor(rnd.next() * 30) +1;
            var wy = Math.floor(rnd.next() * 30) +1;

            w = [11,
                wx * 96,
                wy * 96,
                32,
                32,
                true,
                1,
                true
                ];
            mc.push(w);
            //cmap[wx + 1][wy + 1] = true;
        }              
        
        wx = Math.floor(rnd.next() * 84) + 3;
        wy = Math.floor(rnd.next() * 84) + 3;
        w = [13,
            wx * 32,
            wy * 32,
            64,
            64,
            true,
            2,   //doortype
            true
        ];
        mc.push(w);
        
        var map_cp = []; //　マップチップ

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

        return map_cp;
    }

    function mapInitial(stageno) { //flag = true 初期マップ展開有り　false 自機リスタート

        var shuffled = [];
        var rlist = [];
        for (var i = 0; i < 3000; i++){
            var w = {};
            w.x = Math.floor(rnd.next() * 26)+3;
            w.y = Math.floor(rnd.next() * 26)+3;
    
            rlist.push(w);
        }

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
        ms.push([false, 15 * BLOCK_W + 10, 15 * BLOCK_H + 10, 0, "player", 0]);

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
            ["enemy_generator_vst", 1, 5],//generator
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

            const ENE_MAX = 25;
            var e_mstd = ENE_MAX - e_mv - e_rsh - e_tr - e_mbl;
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
            ["enemy_move_vst", 1, e_mstd],
            ["enemy_generator_vst", 1, 5],
            ["enemy_mimic", 40, Math.floor(stageno / 5)],
            ["enemy_moveshot_1", 1, e_mv],
            ["sce_enemy_randomshot", 1, e_rsh],
            ["enemy_turn_r", 1, e_tr ],
            ["enemy_move_n_l", 1, e_mbl]
            ];

            //["enemy_timeover", 33, 0]//l
        }

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
    	[[0, 128 - 96, 128 - 128, 95, 95], //0,32,0 床96,96
    	[1, 224 - 96, 128 - 128, 95, 95], //1,128,0 壁96，96
    	[2, 128 - 96, 128 - 128, 31, 31], //2, 32,0 床32，32　
    	[3, 224 - 96, 128 - 128, 31, 31], //3,128,0 壁7　
    	[4, 256 - 96, 128 - 128, 31, 31], //4,160,0 壁8 
    	[5, 288 - 96, 128 - 128, 31, 31], //5,192,0 壁9
    	[6, 224 - 96, 160 - 128, 31, 31], //6,128,32 壁4
//    	[11, 256 - 96, 160 - 128, 31, 31], //
    	[7, 288 - 96, 160 - 128, 31, 31], //7,192,32 壁6
    	[8, 224 - 96, 192 - 128, 31, 31], //8,128,64 壁1
    	[9, 256 - 96, 192 - 128, 31, 31], //9,160,64 壁2
    	[10, 288 - 96, 192 - 128, 31, 31], //10,192,64 壁3
    	[11, 256 - 96, 160 - 128, 31, 31], //11,160,32 壁5
    	[12, 96 - 96, 192 - 128, 31, 31], //12,0,64 床(壁際)
        [13,  0, 0, 32, 32], //13, 0, 0 Door
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