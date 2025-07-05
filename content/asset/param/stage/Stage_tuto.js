//　ステージの設定(用語が混乱してるけど　マップ、マップシナリオ、マップチップの統合）

function Stage_tutorial() {

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
        //    [100, 0, 0, 0, 37, 0] //SCE_MESSEGE_BILLBOARD_WM
        ]; //　出現パターン

        return map_sc;
    }

    function mapBgImage(stageno) {
        return "bg1";
    }
    function mapBgPattern() { return bgdata(); }

    function mapBgLayout() {

        //array initialize
        for (let i=0; i<(dgn.mw+1)*3; i++) {
            cmap[i] = new Array(dgn.mh*3);
            cmap[i].fill(true);
        }
        //
        //0:none 1:floor 2:shadow 3:door 4:home 5:stoneb 9:blackwall
        //walltype :10>
        //     0   1   2   3   4   5   6   7   8   9  10  11  12  13  14      
        const floormap = [
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],//0
            [  0,  0,  0,  0, 10, 11, 11, 11, 12,  0,  0,  0,  0],//1
            [  0,  0,  0,  0, 13,  1,  1,  5, 14,  0,  0,  0,  0],//2
            [  0,  0,  0,  0, 13,  1,  1,  1, 14,  0,  0,  0,  0],//3
            [  0,  0,  0,  0, 15, 24,  1, 23, 17,  0,  0,  0,  0],//4
            [  0, 10, 11, 11, 26, 22,  1, 25, 26, 11, 11, 12,  0],//5
            [  0, 13,  1,  1, 20,  1,  1,  1, 20,  1,  1, 14,  0],//6
            [  0, 13,  1,  1,  1,  1,  4,  1,  1,  1,  3, 14,  0],//7
            [  0, 13,  1,  1, 18,  1,  1,  1, 18,  1,  1, 14,  0],//8
            [  0, 15, 16, 16, 27, 24,  1, 23, 27, 16, 16, 17,  0],//9
            [  0,  0,  0,  0,  0, 13,  1, 14,  0,  0,  0,  0,  0],//0
            [  0,  0,  0,  0,  0, 13,  1, 14,  0,  0,  0,  0,  0],//1
            [  0,  0,  0,  0,  0, 13,  1, 14,  0,  0,  0,  0,  0],//2
            [  0,  0,  0,  0,  0, 13,  1, 14,  0,  0,  0,  0,  0],//3
            [  0,  0,  0,  0,  0,  9,  9,  9,  0,  0,  0,  0,  0],//4
        ];

        // 0:shadow 1:wall
        const wallmap = {
            10:0b111_111_110, //776
            11:0b111_111_000, //770
            12:0b111_111_011, //773
            13:0b110_110_110, //666
            14:0b011_011_011, //333
            15:0b110_111_111, //677
            16:0b000_111_111, //077
            17:0b011_111_111, //377
            18:0b000_010_010, //022
            19:0b000_110_000, //060
            20:0b010_010_000, //220
            21:0b000_011_000, //030
            22:0b110_110_000, //660
            23:0b000_011_011, //033
            24:0b000_110_110, //066
            25:0b011_011_000, //330
            26:0b111_111_010, //772
            27:0b010_111_111, //276
            28:0b010_111_011, //273
        };
        
        const OFFSET_X = 7 * BLOCK_W;
        const OFFSET_Y = 7 * BLOCK_H;

        let mc = [];

        let startx, starty;

        for (let j in floormap){
            for (let i in floormap[j]){
                let d = floormap[j][i];
                if ((d != 0)&&(d < 9)){
                    //Type, X, Y, W, H, collison, SP No, visible
                    mc.push([
                        0,
                        i*BLOCK_W + OFFSET_X,
                        j*BLOCK_H + OFFSET_Y,
                        96, 96, false, 0, true 
                    ]);

                    for (let k=0; k<=2; k++){
                        for (let l=0; l<=2; l++){
                            cmap[i*3 + k + 18][j*3 + l + 18] = null;//(7-1)*3 OFFSET
                        }
                    }
                }
                if ((d >=2 && d<=9)){
                    //SP No, X, Y, W, H, collison, layer, visible
                    let typeno = 0;
                    let spno = 0;
                    let v = true;
                    switch (d){
                        case 3: // Door
                            typeno = 2;
                            spno = 13;
                            break;
                        case 4: // Home
                            typeno = 4;
                            spno = 14;
                            startx = i*BLOCK_W + OFFSET_X + 48;
                            starty = j*BLOCK_H + OFFSET_Y + 48;
                            break;
                        case 5: // Stone
                            typeno = 6;
                            spno = 15;
                            break;
                        case 9: //blackwall
                            typeno = 12;
                            spno = 0;
                            v = false;    
                        default:
                            break;
                    }

                    mc.push([
                        spno,
                        i*BLOCK_W + OFFSET_X + 16,
                        j*BLOCK_H + OFFSET_Y + 16,
                        64, 64, true, typeno, v 
                    ]);
                }
                if (d>=10){
                    const splist = [ 3, 4, 5, 6,11, 7, 8, 9,10];

                    let spno, typeno, col, rootx, rooty, rx, ry;

                    rootx = i*BLOCK_W + OFFSET_X;
                    rooty = j*BLOCK_H + OFFSET_Y;

                    rx = Math.trunc((rootx-BLOCK_W)/32);
                    ry = Math.trunc((rooty-BLOCK_H)/32);

                    let wd = wallmap[d];

                    for (let i=0; i<=8; i++){
                        if (wd%2 == 0){
                            spno = 12;
                            typeno = 0; //floor
                            col = false;
                        }else{
                            spno = splist[i];
                            typeno = 1; //wall
                            col = true;
                        }

                        mc.push([
                            spno,
                            rootx+32*(2-(i%3)), 
                            rooty+32*(2-Math.trunc(i/3)), 
                            32, 32, false, typeno, true 
                        ]);

                        cmap[rx +(2-(i%3))][ry + (2-Math.trunc(i/3))] = col;

                        wd = Math.trunc(wd/2);
                    }
                }
            }
        }

        /*
        mc.push([ //ceil
            1,
            (4+7)*BLOCK_W,
            (9+7)*BLOCK_H,
            4*BLOCK_W, 3*BLOCK_H,
            true, 3, true 
        ]);
        */

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

        ms.push([false, 13, 20, 0, "player", 0]);//Player
        
        //ms.push([true, 15, 12, 0, "boss_1", 14]);//boss
        ms.push([true, 13, 9, 0, "common_vset0", 22]);//key

        ms.push([true,  9, 13, 0, "common_vset0", 20]);//ball
        ms.push([true,  9, 14, 0, "common_vset0", 20]);//
        ms.push([true,  9, 15, 0, "common_vset0", 20]);//
        ms.push([true, 10, 13, 0, "common_vset0", 23]);//b
        ms.push([true, 10, 14, 0, "common_vset0", 24]);//s
        ms.push([true, 10, 15, 0, "common_vset0", 25]);//l
  
        ms.push([true, 12, 10, 0, "enemy_move_std2", 1]);//enemy
        //ms.push([true, 13, 10, 0, "enemy_move_std2", 1]);//
        //ms.push([true, 14, 10, 0, "enemy_move_std2", 1]);//
       
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

        let key_idx = -1;

        for (let i in map_sc){
            let w = map_sc[i];

            if (w.ch == 22){ //Key
                key_idx = i;
                break;
            }
        }
        if (key_idx < 0) alert("KEY not Found!");

        return map_sc;
    }
}