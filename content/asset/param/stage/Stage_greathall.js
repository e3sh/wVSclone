﻿//　ステージの設定(用語が混乱してるけど　マップ、マップシナリオ、マップチップの統合）

function Stage_greathall() {

    //stageno = 0;
    let BLOCK_W = 96;
    let BLOCK_H = 96;

    this.scenario = mapScenro;
    this.bgImage = mapBgImage;
    this.bgLayout = mapBgLayout;
    this.initial = mapInitial;
    this.bgPtn = mapBgPattern;

    let cmap = [];
    this.colmap = cmap;

    const MAP_W = 30;
    const MAP_H = 30;

    const dgn = {mw: MAP_W, mh: MAP_H};

    function mapScenro() {
        let map_sc = [
            [100, 0, 0, 0, 37, 0] //SCE_MESSEGE_BILLBOARD_WM
        ]; //　出現パターン

        return map_sc;
    }

    function mapBgImage(stageno) {
        return "bg3";
    }
    function mapBgPattern() { return bgdata(); }

    function mapBgLayout() {
        let mc = [];
        
        let w = [];

        //array initialize
        for (let i=0; i<(dgn.mw+1)*3; i++) {
            cmap[i] = new Array(dgn.mh*3);
            cmap[i].fill(true);
        }

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

                for (let k=0; k<=2; k++){
                    for (let l=0; l<=2; l++){
                        cmap[(i-1)*3 + k][(j-1)*3 + l] = null;
                    }
                }
            }
        }
        //枠 wall width
        for (let i = 12*BLOCK_W+32; i<=18*BLOCK_W+32; i+=32){
            mc.push([11,  i, 8 * BLOCK_H -64, 32, 32, false , 1, true ]);//Wall
            mc.push([11,  i, 8 * BLOCK_H -32, 32, 32, false , 1, true ]);//Wall

            mc.push([11,  i,26 * BLOCK_H    , 32, 32, false , 1, true ]);//Wall
            mc.push([11,  i,26 * BLOCK_H +32, 32, 32, false , 1, true ]);//Wall
        }

        //shadow
        for (let i = 13; i <= 17 ;i++) {
            for (let j = 0; j<3 ;j++){
                mc.push([12,  i * BLOCK_W + 32 * j,  8 * BLOCK_H    , 32, 32, false, 0, true ]);//shadow
                mc.push([12,  i * BLOCK_W + 32 * j,  8 * BLOCK_H +32, 32, 32, false, 0, true ]);//shadow

                cmap[i*3 + j][8] = null;
                cmap[i*3 + j][9] = null;
            }
        }

        //wall height
        for (let i = 8; i <= 25 ;i++) {
            for (let j = 0; j<3 ;j++){
                mc.push([11,  13 * BLOCK_W -64, i * BLOCK_H +32 *j, 32, 32, false , 1, true ]);//Wall
                mc.push([11,  13 * BLOCK_W -32, i * BLOCK_H +32 *j, 32, 32, false , 1, true ]);//Wall

                mc.push([11,  18 * BLOCK_W    , i * BLOCK_H + 32 *j, 32, 32, false , 1, true ]);//Wall
                mc.push([11,  18 * BLOCK_W +32, i * BLOCK_H + 32 *j, 32, 32, false , 1, true ]);//Wall
            }
        }

        wx = 15 * BLOCK_W + 32;
        wy = 25 * BLOCK_H + 32;
        w = [1,//chip.no１は、gameSceneで半透明の黒四角として表示処理されるようになっている。
            wx-48, wy-48, 96, 96,
            true,//HitCheck有
            3, //ceiling(FG)
            false//部屋じゃないので表示しない
        ];
        mc.push(w);

        sid = mc.length - 1;
        w = [14, //魔法陣画像（拡大）
            wx-32, wy-32, 64, 64,
            true, //false,//HitCheck有
            4, //Home(BG)
            true //visibility
        ];
        mc.push(w);

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
}