//　ステージの設定(用語が混乱してるけど　マップ、マップシナリオ、マップチップの統合）

function Stage1_brm() {

    //stageno = 0;
    var BLOCK_W = 96;
    var BLOCK_H = 96;

    this.scenario = mapScenro;
    this.bgImage = mapBgImage;
    this.bgLayout = mapBgLayout;
    this.initial = mapInitial;
    this.bgPtn = mapBgPattern;

    //var cmap = [];
    //this.colmap = cmap;

    function mapScenro() {
        let map_sc = []; //　出現パターン
        return map_sc;
    }

    function mapBgImage(stageno) {
        return "bg3";
    }

    function mapBgLayout() {

        var mc = [];
        
        var w = [];

        //Floor
        for (var i = 13; i <= 17 ;i++) {
            for (var j = 8; j <= 25 ;j++) {

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
        for (let i = 13; i <= 17 ;i++) {
            for (let j = 0; j<3 ;j++){
                mc.push([11,  i * BLOCK_W + 32 * j,  8 * BLOCK_H -32, 32, 32, true , 1, true ]);//Wall
                mc.push([12,  i * BLOCK_W + 32 * j,  8 * BLOCK_H -32, 32, 32, false, 0, true ]);//Floor
                mc.push([12,  i * BLOCK_W + 32 * j,  8 * BLOCK_H , 32, 32, false, 0, true ]);//shadow

                mc.push([11,  i * BLOCK_W + 32 * j,  26 * BLOCK_H, 32, 32, true , 1, true ]);//Wall
                mc.push([12,  i * BLOCK_W + 32 * j,  26 * BLOCK_H, 32, 32, false, 0, true ]);//Floor
                mc.push([12,  i * BLOCK_W + 32 * j,  26 * BLOCK_H -32, 32, 32, false, 0, true ]);//shadow
            }
        }

        for (let i = 8; i <= 25 ;i++) {
            for (let j = 0; j<3 ;j++){
                mc.push([11,  13 * BLOCK_W -32,  i * BLOCK_H +32 *j, 32, 32, true , 1, true ]);//Wall
                mc.push([12,  13 * BLOCK_W -32,  i * BLOCK_H +32 *j, 32, 32, false, 0, true ]);//Floor
                mc.push([12,  13 * BLOCK_W,  i * BLOCK_H + 32 *j, 32, 32, false, 0, true ]);//shadow

                mc.push([11,  18 * BLOCK_W,  i * BLOCK_H + 32 *j, 32, 32, true , 1, true ]);//Wall
                mc.push([12,  18 * BLOCK_W,  i * BLOCK_H + 32 *j, 32, 32, false, 0, true ]);//Floor
                mc.push([12,  18 * BLOCK_W -32,  i * BLOCK_H + 32 *j, 32, 32, false, 0, true ]);//shadow
            }
        }


        wx = 15;
        wy = 11;
        w = [13,
            wx * 96 + 16,
            wy * 96 + 16,
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

        let ms = [];
        //  開始フレーム,座標,,角度,シナリオ,キャラ

        ms.push([false, 15, 23, 0, "player", 0]);//Player

        ms.push([true, 15, 14, 0, "boss_1", 14]);//boss
        //ms.push([true, 15, 14, 0, "boss_2", 14]);//boss
        ms.push([true, 15, 14, 0, "common_vset0", 22]);//key

        ms.push([true, 14, 16, 0, "boss_0", 34]);//sub
        ms.push([true, 16, 16, 0, "boss_0", 34]);//sub

        let map_sc = []; //　出現パターン

        for (var j in ms) {
            var w = ms[j];

            var ptn = {};

            ptn.s = w[0];
            ptn.x = w[1] * BLOCK_W + 32
            ptn.y = w[2] * BLOCK_W + 32 
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
}