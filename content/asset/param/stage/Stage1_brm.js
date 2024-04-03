//　ステージの設定(用語が混乱してるけど　マップ、マップシナリオ、マップチップの統合）

function Stage1_brm() {

    //stageno = 0;
    let BLOCK_W = 96;
    let BLOCK_H = 96;

    this.scenario = mapScenro;
    this.bgImage = mapBgImage;
    this.bgLayout = mapBgLayout;
    this.initial = mapInitial;
    this.bgPtn = mapBgPattern;

    //let cmap = [];
    //this.colmap = cmap;

    function mapScenro() {
        let map_sc = [
            [100, 0, 0, 0, 37, 0] //SCE_MESSEGE_BILLBOARD_WM
        ]; //　出現パターン

        return map_sc;
    }

    function mapBgImage(stageno) {
        return "bg3";
    }

    function mapBgLayout() {

        let mc = [];
        
        let w = [];

        //Floor
        for (let i = 13; i <= 17 ;i++) {
            for (let j = 8; j <= 25 ;j++) {

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
                //mc.push([12,  i * BLOCK_W + 32 * j,  8 * BLOCK_H -32, 32, 32, false, 0, true ]);//Floor
                mc.push([12,  i * BLOCK_W + 32 * j,  8 * BLOCK_H , 32, 32, false, 0, true ]);//shadow
                mc.push([12,  i * BLOCK_W + 32 * j,  8 * BLOCK_H +32, 32, 32, false, 0, true ]);//shadow

                mc.push([11,  i * BLOCK_W + 32 * j,  26 * BLOCK_H, 32, 32, true , 1, true ]);//Wall
                //mc.push([12,  i * BLOCK_W + 32 * j,  26 * BLOCK_H, 32, 32, false, 0, true ]);//Floor
                //mc.push([12,  i * BLOCK_W + 32 * j,  26 * BLOCK_H -32, 32, 32, false, 0, true ]);//shadow
            }
        }

        for (let i = 8; i <= 25 ;i++) {
            for (let j = 0; j<3 ;j++){
                mc.push([11,  13 * BLOCK_W -32,  i * BLOCK_H +32 *j, 32, 32, true , 1, true ]);//Wall
                //mc.push([12,  13 * BLOCK_W -32,  i * BLOCK_H +32 *j, 32, 32, false, 0, true ]);//Floor
                //mc.push([12,  13 * BLOCK_W,  i * BLOCK_H + 32 *j, 32, 32, false, 0, true ]);//shadow
　
                mc.push([11,  18 * BLOCK_W,  i * BLOCK_H + 32 *j, 32, 32, true , 1, true ]);//Wall
                //mc.push([12,  18 * BLOCK_W,  i * BLOCK_H + 32 *j, 32, 32, false, 0, true ]);//Floor
                //mc.push([12,  18 * BLOCK_W -32,  i * BLOCK_H + 32 *j, 32, 32, false, 0, true ]);//shadow
            }
        }


        wx = 15;
        wy = 8;
        w = [13,
            wx * 96 + 16,
            wy * 96,
            64,
            64,
            true,
            2,   //doortype
            true
        ];
        mc.push(w);
        
        let map_cp = []; //　マップチップ

        for (let j in mc) {
            let w = mc[j];

            let chip = {};

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

        ms.push([false, 15, 25, 0, "player", 0]);//Player

        ms.push([true, 15, 12, 0, "boss_1", 14]);//boss
        //ms.push([true, 15, 14, 0, "boss_2", 14]);//boss
        ms.push([true, 15, 12, 0, "common_vset0", 22]);//key

        ms.push([true, 13, 16, 0, "boss_0", 34]);//sub
        ms.push([true, 17, 16, 0, "boss_0", 34]);//sub

        ms.push([true, 14, 20, 0, "enemy_mimic", 40]);//mimic
        ms.push([true, 16, 20, 0, "enemy_mimic", 40]);//mimic
        ms.push([true, 13, 21, 0, "enemy_mimic", 40]);//mimic
        ms.push([true, 17, 21, 0, "enemy_mimic", 40]);//mimic

        ms.push([true, 0, 0, 0, 37, 40]);//billboard

        let map_sc = []; //　出現パターン

        for (let j in ms) {
            let w = ms[j];

            let ptn = {};

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
        let key_idx = -1;

        for (let i in map_sc){
            let w = map_sc[i];

            if (w.ch == 22){ //Key
                key_idx = i;
                break;
            }
        }
        if (key_idx < 0) alert("KEY not Found!");

        for (let i in map_sc){
            let w = map_sc[i];

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

        let sp = 
        // SP NO.","X","Y","ADDX","ADDY"
    	[
            [0, 128 - 96, 128 - 128, 95, 95], //0,32,0 床96,96
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
            [12,  0, 64, 32, 32], //12, 0,64 床(壁際)
            [13,  0,  0, 32, 32], //13, 0, 0 Door  32，32
            [14,  0, 32, 32, 32], //14, 0,32 魔法陣 32，32
            [15,  0, 96, 32, 32], //15, 0,96 石板   32，32
            ["Door",     0,  0, 32, 32], //13, 0, 0 Door  32，32
            ["Portal",   0, 32, 32, 32], //14, 0,32 魔法陣 32，32
            ["StoneB",   0, 96, 32, 32], //15, 0,96 石板   32，32
            ["OpDoor",  32, 96, 32, 32], //--, 0,32 解放扉　  32，96
            ["LPortal", 64, 96, 32, 32], //--, 0,96 点灯魔法陣64，96
        ];

        let bg_ptn = []; // BGパターン

        for (let j in sp) {
            let w = sp[j];

            let ptn = {};

            ptn.x = w[1];
            ptn.y = w[2];
            ptn.w = w[3];
            ptn.h = w[4];

            bg_ptn[w[0]] = ptn;
        }

        return bg_ptn;
    }
}