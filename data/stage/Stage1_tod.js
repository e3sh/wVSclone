//　ステージの設定(用語が混乱してるけど　マップ、マップシナリオ、マップチップの統合）

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
        //  開始フレーム,座標,,角度,シナリオ,キャラ
//	[　//[-1, 240, 608, 0, "player", 0],
//	[-1, 208, 608, 0, "friend_start", 10],
//	[-1, 272, 608, 0, "friend_start", 10],
//	[-1, 240, 240, 0, 28, 18],
        //	[-1, 320, 320, 0, 29, 19],
/*
	[50, 240, 0, 180, 11, 1],
	[100, 440, 140, 225, 10, 1],
	[100, 40, 140, 135, 9, 1],
	[120, 440, 140, 225, 10, 1],
	[120, 40, 140, 135, 9, 1],
	[140, 440, 140, 225, 10, 1],
	[140, 40, 140, 135, 9, 1],
	[160, 440, 140, 225, 10, 1],
	[160, 40, 140, 135, 9, 1],
	[180, 440, 140, 225, 10, 1],
	[180, 40, 140, 135, 9, 1],
    */
    /*
	[250, 140, 000, 180, 2, 1],
	[250, 340, 000, 180, 3, 1],
	[280, 140, 000, 180, 2, 1],
	[280, 340, 000, 180, 3, 1],
	[310, 140, 000, 180, 2, 1],
	[310, 340, 000, 180, 3, 1],
	[340, 140, 000, 180, 2, 1],
	[340, 340, 000, 180, 3, 1],
//	[390, 464, 200, 0, "effect_warnning_mark", 1],
	[440, 479, 200, 270, 15, 1],
//	[450, 16, 220, 0, "effect_warnning_mark", 1],
	[500, 1, 220, 90, 15, 1],
//	[700, 240, 0, 180, 23, 14],
	[900, 120, 0, 180, 19, 1],
	[900, 360, 0, 180, 19, 1],
*/
//	[1120, 480, 0, 180, 37, 2], //eventmessagetest
//	[1500, 240, 40, 180, 34, 14], //回転ボス
//	[1550, 240, 40, 180, "message_bosstriger", 2], //ボス戦割り込みトリガ
//	[1600, 480, 0, 180, 53, 2], //endmessage
//	[1700, 480, 0, 180, 54, 2], //result画面要求
        //	[1800, -1, -1, 180, 0, 4],//
 //   	[7110, 320, 240, 180, "message_billboard_tover", 1], //message
        //       [7200, 320, 240, 180, "message_bosstriger", 1], //gover画面要求 120秒後

        for (var i = 0; i < dgn.mw - 1; i+=2) {
            for (var j = 0; j < dgn.mh - 1; j+=2) {
                ms.push([7000, i * 80 + 32, j * 80 + 32, 180, "common_vset0", 4]);
               // ms.push([700, 1 * 80 + 32, 10 * 80 + 32, 180, "en_bullet_homing", 4]);
               // ms.push([700, 10 * 80 + 32, 1 * 80 + 32, 180, "en_bullet_homing", 4]);
               // ms.push([700, 10 * 80 + 32, 10 * 80 + 32, 180, "en_bullet_homing", 4]);
            }
        }


	ms.push([600000, -1, -1, 0, 0, 0]);
    
        //
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

            map_sc.push(ptn);
        }
        /*
        for (var e in map_sc) {

            var pt = map_sc[e];
            /*
            var wx = Math.floor(pt.x / 96);
            var wy = Math.floor(pt.y / 96);

            var f = true;

            for (var i in rlist) {
            if ((rlist[i].x == wx) && (rlist[i].y == wy)) {

            f =false;
            //    break;
            }

            }
            */
            //            if (f) {
            //var vr = Math.floor(Math.random() * rlist.length);

            //                pt.x = rlist[vr].x * 96 + 75;
            //                pt.y = rlist[vr].y * 96 + 75;
/*
            pt.x = Math.floor(pt.x / 80) * 80 + 32;
            pt.y = Math.floor(pt.y / 80) * 80 + 32;

            //            }

        }

        */
        return map_sc;

    }

    function mapBgImage() {

        var tex_bg = new Image();
        tex_bg.src = "pict/cha.png";
/*
        var tex_bg = []; 

        tex_bg[ 0 ] = new Image();
        tex_bg[0].src = "pict/sky.jpg";

        tex_bg[ 1 ] = new Image();
        tex_bg[1].src = "pict/space.jpg";

        tex_bg[ 2 ] = new Image();
        tex_bg[2].src = "pict/effect.jpg";
*/

        return tex_bg;
    }

    function mapBgLayout() {

        //    マップチップの座標リスト
        //スクロール時のbg調整用
        //mapImageNo, world ltx, world lty

        var mc = [];
        var mp = dgn.map;

        var w = [];

        var sz = 64;

                var sx = 0;  
                var sy = 0;


        for (var i = 0; i < dgn.mw - 1; i++) {
            sy = 0;
            var sz_w = ((i % 2) == 1) ? 16 : sz;

            for (var j = 0; j < dgn.mh - 1; j++) {

                var sz_h = ((j % 2) == 1) ? 16 : sz;

                if (((j % 2) == 0) && ((i % 2) == 0)) {//床の場合

                        w = [0,
                            sx,
                            sy,
                            sz+16,//sz_w,
                            sz+16,//sz_h,
                            false,
                            1,
                            true
                        ];

                        mc.push(w);
                }

                if (((j % 2) == 1) && ((i % 2) == 1)) {//柱の場合

                        w = [12,
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
                            w = [9,// + ((sz_w>sz_h)?0:1),
                            sx,
                            sy,
                            sz_w,
                            sz_h,
                            true,
                            0,
                            true
                        ];

                            mc.push(w);
                        }
                }
  //             mc.push(w);
            
                sy += sz_h;

            }
            sx += sz_w;
        }

        w = [5,
            Math.floor(rnd.next()*((dgn.mw - 1)/2))*80,
            Math.floor(rnd.next()*((dgn.mw - 1)/2))*80,
                            64,
                            64,
                            true,
                            2,   //doortype
                            true
                        ];

        mc.push(w);







        //枠の当たり判定

        var w = [11, 0, 0, 80 * 10 + 80, 4, true,
                        1, true
                        ];
        mc.push(w);

        var w = [11, 0, 80 * 10 + 60 , 80*10+80, 36, true,
                        1, true 
                        ];
        mc.push(w);

        var w = [11, 0, 0, 4, 80 * 10 + 60, true,
                        1, true
                        ];
        mc.push(w);

        var w = [11, 80*10 +60 , 0, 4, 80*10 + 60, true,
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
            chip.type = w[6];//0　壊れる　1　壊れないで使ってる
            chip.view = false;
            chip.visible = w[7];

            map_cp.push(chip);
        }
        return map_cp;
    }

    function mapInitial(stageno) { //flag = true 初期マップ展開有り　false 自機リスタート

/*    
        var ms = [];
        //  開始フレーム,座標,,角度,シナリオ,キャラ

        //var r = Math.floor(Math.random()*rlist.length);
        //ms.push([false, rlist[r].x * 96 + 10, rlist[r].y * 96 + 10, 0, "player", 0]);
        ms.push([false, 4 * 80 + 32, 4 * 80 + 32, 0, "player", 0]);
*/
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
                    //smap[cnt].o = false;

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

        var ms = [];
        //  開始フレーム,座標,,角度,シナリオ,キャラ
        ms.push([false,
       smap[shuffled[0]].x * 40 + 32,
       smap[shuffled[0]].y * 40 + 32,
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
                    smap[nm].x * 40 + 32,
                    smap[nm].y * 40 + 32,
                    Math.floor(rnd.next() * 4) * 90, //Math.floor(Math.random() * 360),
                    "ememy_move_std",
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
                    smap[nm].x * 40 + 32,
                    smap[nm].y * 40 + 32,
                    Math.floor(rnd.next() * 4) * 90, //Math.floor(Math.random() * 360),
                    "ememy_moveshot_1",
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
                    smap[nm].x * 40 + 32,
                    smap[nm].y * 40 + 32,
                    Math.floor(rnd.next() * 4) * 90, //Math.floor(Math.random() * 360),
                    "sce_ememy_randomshot",
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
                    smap[nm].x * 40 + 32,
                    smap[nm].y * 40 + 32,
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
                    smap[nm].x * 40 + 32,
                    smap[nm].y * 40 + 32,
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
                    smap[nm].x * 40 + 32,
                    smap[nm].y * 40 + 32,
                    Math.floor(rnd.next() * 360),
                    "common_vset0",
                    22
                    ];

            ms.push(w);
        }       
        /*
            for (var i in rlist) {

                w = [true,
            rlist[i].x * 96 + 48,
            rlist[i].y * 96 + 48,
            Math.floor(Math.random()*360),
            "common_vset0",
            1
            ];

                ms.push(w);

            }
*/
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
    	[[0, 0, 128, 80, 80],
        [ 5, 192, 0, 32, 32],
    	[ 9, 0, 208, 16, 16],
    	[10, 0, 208, 64, 16],
    	[11, 80, 128, 16, 64],
    	[12, 80, 208, 16, 16]
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