﻿//　ステージの設定(用語が混乱してるけど　マップ、マップシナリオ、マップチップの統合）
function Stage1_tod( seed, keyuse ) {

    var dgn;

    dgn = new Dangeon_tod( seed );
    dgn.create();

    var rnd = new myrnd(seed);
    var mp = dgn.map;
    this.scenario = mapScenro;
    this.bgImage = mapBgImage;
    this.bgLayout = mapBgLayout;
    this.initial = mapInitial;
    this.bgPtn = mapBgPattern;
    var gamemode = keyuse; //鍵があるかないか

    //var cmap = [];
    //this.colmap = cmap;

//    alert(keyuse);
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

        var ms = []; 

        for (var i = 0; i < dgn.mw - 1; i+=2) {
            for (var j = 0; j < dgn.mh - 1; j+=2) {
                ms.push([7000, i * 80 + 32, j * 80 + 32, 180, "common_vset0", 4]);
            }
        }
    	ms.push([600000, -1, -1, 0, 0, 0]);
    
        // フレームカウントでソートされていること。

        var map_sc = []; //　出現パターン

        for (var j in ms) {
            var w = ms[j];

            var ptn = {};

            ptn.count = w[0];
            ptn.x = w[1];
            ptn.y = w[2] ;
            ptn.r = w[3];
            ptn.sc = w[4];
            ptn.ch = w[5];
            ptn.used = false;

            map_sc.push(ptn);
        }
        return map_sc;
    }

    function mapBgImage() {

        var tex_bg = new Image();
        tex_bg.src = "pict/cha.png";
        //return tex_bg;
        return "bg3";
    }

    function mapBgLayout() {

        //    マップチップの座標リスト
        //スクロール時のbg調整用
        //mapImageNo, world ltx, world lty

        var mc = [];
        var mp = dgn.map;

        var w = [];

        var sz = 128; var pw = 16;//64+16

                var sx = 0;  
                var sy = 0;


        for (var i = 0; i < dgn.mw - 1; i++) {
            sy = 0;
            var sz_w = ((i % 2) == 1) ? pw : sz;

            for (var j = 0; j < dgn.mh - 1; j++) {

                var sz_h = ((j % 2) == 1) ? pw : sz;

                if (((j % 2) == 0) && ((i % 2) == 0)) {//床の場合

                        w = [0,
                            sx,
                            sy,
                            sz,//sz_w,
                            sz,//sz_h,
                            false,
                            0,
                            true
                        ];

                        mc.push(w);
                }

                if (((j % 2) == 1) && ((i % 2) == 1)) {//柱の場合

                        w = [11,
                            sx,
                            sy,
                            sz_w,
                            sz_h,
                            true,
                            1,
                            true
                        ];

                        mc.push(w);

                } else {

                    if (mp[i][j] != "  ") {
                        w = [11,// + ((sz_w>sz_h)?0:1),
                        sx,
                        sy,
                        sz_w,
                        sz_h,
                        true,
                        1,
                        true
                        ];
                    }else{
                        w = [0,// + ((sz_w>sz_h)?0:1),
                        sx,
                        sy,
                        sz_w,
                        sz_h,
                        false,
                        0,
                        true
                        ];
                    }
                    mc.push(w);
               
                }
                sy += sz_h;
            }
        sx += sz_w;
        }

        w = [13,
            Math.floor(rnd.next()*((dgn.mw - 1)/2))*(sz + pw),
            Math.floor(rnd.next()*((dgn.mw - 1)/2))*(sz + pw),
                            64,
                            64,
                            true,
                            2,   //doortype
                            true
                        ];
        mc.push(w);

        //枠の当たり判定
        blsz = sz + pw;
        var w = [11, 0, 0, blsz * 10 + blsz, pw, true,
                        1, true
                        ];
        mc.push(w);

        var w = [11, 0, blsz * 10 + blsz , blsz * 10 + blsz, pw, true,
                        1, true 
                        ];
        mc.push(w);

        var w = [11, 0, 0, pw, blsz * 10 + blsz, true,
                        1, true
                        ];
        mc.push(w);

        var w = [11, blsz*10 + blsz, 0, pw, blsz*10 + blsz, true,
                        1, true
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
            chip.type = w[6] + 10;// blocktype (+10) 0　壊れる　1　壊れないで使ってる
            chip.view = false;
            chip.visible = w[7];
            chip.lookf = true;

            map_cp.push(chip);
        }
        return map_cp;
    }

    function mapInitial(stageno) { //flag = true 初期マップ展開有り　false 自機リスタート

        var smap = [];
        var shuffled = [];

        var cnt = 0; 
    
        for (var i = 0; i < dgn.mw - 1; i++) {
            for (var j = 0; j < dgn.mh - 1; j++) {
                if (((j % 2) == 0) && ((i % 2) == 0)) {//床の場合

                    shuffled[cnt] = cnt;
                    
                    smap[cnt] = {};
                    smap[cnt].x = i;
                    smap[cnt].y = j;
                    cnt++;
                }
            }
        }

        //shuffle

        for (i = 0; i < 1000 ; i++){

            var snum = Math.floor(rnd.next()*shuffled.length);
            var dnum = Math.floor(rnd.next()*shuffled.length);

            var w = shuffled[snum];
            shuffled[snum]=shuffled[dnum];
            shuffled[dnum]=w;
        }


        var SW = 64;
        var SZ = SW;

        var ms = [];
        //  開始フレーム,座標,,角度,シナリオ,キャラ
        ms.push([false,
       smap[shuffled[0]].x * SW + SZ,
       smap[shuffled[0]].y * SW + SZ,
        0, "player", 0]);


        //alert(stageno);
        var n_ene = 3 + Math.floor(stageno/3); //6;
        var h_ene = Math.floor(stageno/5); //2;
        var b_ene = Math.floor(stageno/7); //1;

        var lst = 1;
        var led = lst + n_ene;

        for (i = lst; i < led; i++) {
            var nm = shuffled[i];

            w = [true,
                    smap[nm].x * SW + SZ,
                    smap[nm].y * SW + SZ,
                    Math.floor(rnd.next() * 4) * 90, //Math.floor(Math.random() * 360),
                    "enemy_move_std",
                    //"common_vset2",
                    1
                    ];

            ms.push(w);
        }

        lst = led;
        led += h_ene;
 
        for (i =lst; i < led; i++) {
            var nm = shuffled[i];

            w = [true,
                    smap[nm].x * SW + SZ,
                    smap[nm].y * SW + SZ,
                    Math.floor(rnd.next() * 4) * 90, //Math.floor(Math.random() * 360),
                    "enemy_moveshot_1",
            //"common_vset2",
                    1
                    ];

            ms.push(w);
        }

        lst = led;
        led += b_ene;

        for (i = lst; i < led; i++) {
            var nm = shuffled[i];

            w = [true,
                    smap[nm].x * SW + SZ,
                    smap[nm].y * SW + SZ,
                    Math.floor(rnd.next() * 4) * 90, //Math.floor(Math.random() * 360),
                    "sce_enemy_randomshot",
            //"common_vset2",
                    1
                    ];

            ms.push(w);
        }

        lst = led;
        led += 5;
//
        for (i = lst; i < led; i++) {
            var nm = shuffled[i];

            w = [true,
                    smap[nm].x * SW + SZ,
                    smap[nm].y * SW + SZ,
                    Math.floor(rnd.next() * 360),
                    "common_vset0",
                    20
                    ];

            ms.push(w);
        }

        lst = led;

        if ((stageno%10==0)&&(stageno!=0) ){//extenditem
        nm = shuffled[lst];

        w = [true,
                    smap[nm].x * SW + SZ,
                    smap[nm].y * SW + SZ,
                    Math.floor(rnd.next() * 360),
                    "common_vset0",
                    21
                    ];

        ms.push(w);
        }

        if (gamemode) {
            lst++; // key

            nm = shuffled[lst];

            w = [true,
                    smap[nm].x * SW + SZ,
                    smap[nm].y * SW + SZ,
                    Math.floor(rnd.next() * 360),
                    "common_vset0",
                    22
                    ];

            ms.push(w);
        }       

        var map_sc = []; //　出現パターン

        for (var j in ms) {
            var w = ms[j];

            var ptn = {};

            ptn.s = w[0];
            ptn.x = w[1];
            ptn.y = w[2];
            ptn.r = w[3];
            ptn.sc = w[4];
            ptn.ch = w[5];

            map_sc.push(ptn);
        }

        return map_sc;
        //マップの初期配置とマップチップの座標リストなど
        //自機の発進処理もここに入れ込んでしまう方がスマートだと思われる。
        //flagはマップの初期化をするかどうか(trueでリスタート？）
    }

    function mapBgPattern() {

        var sp =
        // SP NO.","X","Y","ADDX","ADDY"
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