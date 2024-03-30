//　ステージの設定(用語が混乱してるけど　マップ、マップシナリオ、マップチップの統合）

function Stage1(stageno) {

    //stageno = 0;
    const BLOCK_W = 96;
    const BLOCK_H = 96;
    
    //
    var dgn;
    
    dgn = new Dangeon(stageno);
    dgn.create();

    var mp = dgn.mapdata;
 
    let hlist = dgn.ml; //通路を含む壁がないエリア
    let rlist = dgn.il; //壁際を除く部屋部分(初期配置エリア
    let clist = dgn.rl; //壁際含む部屋部分(通路は含まない)

    stageno = Math.floor(Math.random() * 1000000);
    var rnd = new myrnd(stageno);//seed);

    this.scenario = mapScenro;
    this.bgImage = mapBgImage;
    this.bgLayout = mapBgLayout;
    this.initial = mapInitial;
    this.bgPtn = mapBgPattern;

    var cmap = [];
    this.colmap = cmap;

    this.startroom_id; 

    //rlistで各部屋にID付与
    rlist = roomDivision(rlist);

    //各部屋にIDを割付しサイズを確認
    function roomDivision(array){

        let cmpf = Array(array.length);
        cmpf.fill(false);

        let id = 0;
        for (let w in array){
            if (!cmpf[w]){
                array[w].id = id;
                cmpf[w] = true;
                check_blankarea(id, array[w].x, array[w].y);
                id++;
            }
            //break;
        }
        return array;
        //再帰用関数
        function check_blankarea(id, x, y){
            //alert(id + ":" + x + ":" + y);
            //console.log(id + ":" + x + ":" + y);
            let vx = [-1,  0,  1,  0];
            let vy = [ 0, -1,  0,  1];

            for (let i in vx){
                for (let w in array){
                    if (cmpf[w]) continue;
                    if ((array[w].x == x + vx[i])&&(array[w].y == y + vy[i])){
                        array[w].id = id;
                        cmpf[w] = true;
                        check_blankarea(id, x+vx[i], y+vy[i]);
                        //alert("!");
                    }
                }
            }   
            return;
        }
    }

    //ID毎の部屋のサイズを調べて、部屋数と最大サイズの部屋IDと最小サイズの部屋IDを返す。
    function roomSizeCheck(ilist){

        let cnt = [];
        let ha = [];

        for (let i in ilist){
            if (Boolean(cnt[ilist[i].id])){
                cnt[ilist[i].id]++

                if (ha[ilist[i].id].min.x > ilist[i].x) ha[ilist[i].id].min.x = ilist[i].x;
                if (ha[ilist[i].id].min.y > ilist[i].y) ha[ilist[i].id].min.y = ilist[i].y;
                if (ha[ilist[i].id].max.x < ilist[i].x) ha[ilist[i].id].max.x = ilist[i].x;
                if (ha[ilist[i].id].max.y < ilist[i].y) ha[ilist[i].id].max.y = ilist[i].y;
            }else{
                cnt[ilist[i].id]=1;

                let d = {min:{x:ilist[i].x, y:ilist[i].y}, max:{x:ilist[i].x, y:ilist[i].y}};
                ha[ilist[i].id]=d;
            }
        };
        let maxid; for (let i in cnt){ if (cnt[i] == Math.max(...cnt)) {maxid = i; } }
        let minid; for (let i in cnt){ if (cnt[i] == Math.min(...cnt)) {minid = i; } }

        return {rooms: cnt.length, max:maxid, min:minid, pos: ha };
    }

    //渡された配列をシャッフル
    function shuffle( shuffled ){

        for (i = 0; i < 3000; i++) {
            var snum = Math.floor(rnd.next() * shuffled.length);
            var dnum = Math.floor(rnd.next() * shuffled.length);

            var w = shuffled[snum];
            shuffled[snum] = shuffled[dnum];
            shuffled[dnum] = w;
        }

        return shuffled;
    }
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
    //[600, 0, 0, 0, "message_billboard_cp", 6],
    [118000, 240, 240, 180, "signal_warning", 6],
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

        //var mp = [[]];
        //for (var j = 0; j < dgn.mw; j++){ mp[j] = []; for (var i = 0; i <dgn.mh; i++){mp[j][i] = false; }}

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

        //array initialize
        for (let i=0; i<(dgn.mw+1)*3; i++) {
            cmap[i] = new Array(dgn.mh*3);
            cmap[i].fill(true);
        }

        for (let i = 1; i <= dgn.mw - 1; i++) {
            // 0,1,2 * 3
            //cmap[i * 3 - 3] = [];
            //cmap[i * 3 - 2] = [];
            //cmap[i * 3 - 1] = [];
            for (let j = 1; j <= dgn.mh - 1; j++) {

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
                        if (!cr[k]) cmap[(i * 3 - 2) + vx[k]][(j * 3 - 2) + vy[k]] = cr[k];
                        //cmap[(i * 3 - 2) + vx[k]][(j * 3 - 2) + vy[k]] = cr[k];
                    }
                } else {
                    for (var k in vx) {
                        //cmap[(i * 3 - 2) + vx[k]][(j * 3 - 2) + vy[k]] = false;//要素が無くてエラーにならないようにする。
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
                    //cmap[i * 3 - 2][j * 3 - 2] = false;
                };
            }
        }

        for (var i in hlist) {

            w = [0,
                hlist[i].x * BLOCK_W, // + 10,
                hlist[i].y * BLOCK_H, // + 10,
                96,
                96,
                false,
                0, //BG
                true
                ];
            mc.push(w);

            for(let k in vx){
                cmap[(hlist[i].x*3-2)+ vx[k]][(hlist[i].y*3-2) + vy[k]] = false;
            }
            cmap[hlist[i].x*3-2][hlist[i].y*3-2] = false;
        }

        let room_status = roomSizeCheck(rlist);
        let room = room_status.pos;

        let sid; //startroom_id; 

        for (let i in room){//rlist,clist
            //天井
            let x = (room[i].min.x - 1) * BLOCK_W;
            let y = (room[i].min.y - 1) * BLOCK_H;
            let wdt = (room[i].max.x - room[i].min.x + 2) * BLOCK_W;
            let hgt = (room[i].max.y - room[i].min.y + 2) * BLOCK_H;

            w = [1,//chip.no１は、gameSceneで半透明の黒四角として表示処理されるようになっている。
                x -32, //rlist,clist
                y -32, //rlist,clist
                wdt + 96 +32 +32,
                hgt + 96 +32 +32,
                true,//HitCheck有
                3, //ceiling(FG)
                true
            ];
            mc.push(w);

            if (i == room_status.min) {
                w = [14, //魔法陣画像（拡大）
                    x + (wdt/2)+32, y + (hgt/2)+32, 64, 64,
                    true, //false,//HitCheck有
                    4, //Home(BG)
                    true //visibility
                ];
                sid = mc.length - 1;
                //console.log("r:"+sid);
            }else{
            //portal
            let res = fieldCornerCheck(room[i]);   
            w = [15, //石板画像
                    res.x + 16, res.y + 16, 64, 64,
                    true, //false,//HitCheck有
                    6, //Portal(BG)
                    true //visibility
                ];
            }
            mc.push(w);
        }

        //部屋がマップ全体でどこの角に近いか調べて石板を設置する座標を返す
        function fieldCornerCheck(rm){

            const SW = 31;
            const SH = 31;

            let sx = [0, 1, 0, 1];
            let sy = [0, 0, 1, 1];
            let r = [];

            let x = rm.min.x + (rm.max.x - rm.min.x + 2)/2;
            let y = rm.min.y + (rm.max.y - rm.min.y + 2)/2;

            for (let i in sx){
                let u = Math.abs(x - (sx[i]*SW));
                let h = Math.abs(y - (sy[i]*SH));

                r[i] = Math.sqrt(u * u + h * h);
            }

            let c; for (let i in r){ if (r[i] == Math.min(...r)) {c = i; }}

            return {
                x: (rm.min.x-1) * BLOCK_W + (sx[c]*(rm.max.x - rm.min.x + 2 ))*BLOCK_W
                ,y: (rm.min.y-1) * BLOCK_H + (sy[c]*(rm.max.y - rm.min.y + 2))*BLOCK_H
            };
        }

        //ドアの設置
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

        //no:graphics　
        //type:floortype　0:床　1:壁　2:ドア　3:天井　4:Home 5:[Reserb] 6:Portal
        //     (type%2 == 1)trueの場合はFG(ForgForground) falseはBGに表示する。
        //c:当たり判定有無(有:true) visible:表示があるかどうか

        for (var j in mc) {
            var w = mc[j];

            var chip = {};

            chip.no = w[0]; //bgchip_no(絵の種類) 現状(2024/03/28)ではBGptn使用だがspptnで処理でもよいかも
            chip.x = w[1];
            chip.y = w[2];
            chip.w = w[3];
            chip.h = w[4];
            chip.c = w[5]; //Hitcheck_当たり判定有無(有:true
            chip.type = w[6] + 10; //当たり判定混合用に背景ユニットはtype+10で処理することにする。FG/BGはこの数字でif分岐(0:BG_1:FG_2:DOOR...）
            chip.view = false; //視界に入っている場合はtrue/(処理時に変更される)
            chip.visible = w[7]; //画像表示(基本有、(見えない壁では表示なし、通れる壁の場合は表示有、当たり判定無)
            chip.lookf = false; //一度視界に入った場合にtrue(処理時に変更される/Submapで通ったところの認識で使用している)
            chip.index = -1; //接触したときに個別識別する為のINDEX_ID

            map_cp.push(chip);
        }
        for (let i in map_cp){map_cp[i].index = i;}

        this.startroom_id = sid;
        this.colmap = cmap;

        return map_cp;
    }

    function mapInitial(stageno) { //flag = true 初期マップ展開有り　false 自機リスタート

        let room_status = roomSizeCheck(rlist);

        let shuffled = [];
        let startroom = [];
        for (let i = 0; i < rlist.length; i++) {
            if (rlist[i].id == room_status.min){
                startroom.push(i);
            }else{
                shuffled.push(i);    
            }
        }
        startroom = shuffle(startroom);//最小サイズの部屋(自機の開始位置)
        shuffled = shuffle(shuffled);//他の場所（敵やアイテムを配置）
        
        var ms = [];
        //  開始フレーム,座標,,角度,シナリオ,キャラ

        let r = startroom[0]; //自機の開始位置は一番小さい部屋内（敵は配置しない）2024/03/17
        ms.push([false, rlist[r].x * BLOCK_W + 10, rlist[r].y * BLOCK_H + 10, 0, "player", 0]);
        //ms.push([false, rlist[r].x * BLOCK_W + 10, rlist[r].y * BLOCK_H + 10, 0, "effect_informationCursor", 0]);
        //ms.push([false, rlist[r].x * 96 + 10, rlist[r].y * 96 + 10, 0, "friend_rotate", 10]);
    
        let itl = [20, 20, 20, 20, 23, 24, 25]; //スタート地点に設置される初期装備/ITEM
        for (let i=1; i < 7; i++){
            let r = startroom[i%startroom.length];
            ms.push([
                false //面展開時に(false: 毎回,　true:１度のみ)設置される。基本は自機用
                , rlist[r].x * BLOCK_W + BLOCK_W/2
                , rlist[r].y * BLOCK_H + BLOCK_W/2
                , 0, "common_vset0", itl[i]
            ]);
        }

        var rcnt = 0;

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
            ["boss_0", 34, Math.floor(stageno / 5) - 1], //bx //5F_0,10F_1,15F_2 
            ["boss_0", 14, (stageno % 15 != 0) ? 1 : 0], //b0 //5F_0,10F_1,15F_0
            ["boss_1", 14, (stageno % 15 == 0) ? 1 : 0]  //b2 //5F_0,10F_0,15F_1
            ];

        } else {
            //normalstage

            var e_mv  = Math.floor(stageno / 4); //1-4F_0.6-9F_1.11-14F_2.16-19F_3...26-29F_5
            var e_rsh = Math.floor(stageno / 3); //1-3F_0.4-6F_1.7-9F_2.10-12F_3...27-29F_9
            var e_tr  = Math.floor(stageno / 4); //1-4F_0.6-9F_1.11-14F_2.16-19F_3...26-29F_5
            var e_mbl = Math.floor(stageno / 4); //1-4F_0.6-9F_1.11-14F_2.16-19F_3...26-29F_5

            const ENE_MAX = 25;
            var e_mstd = ENE_MAX - e_mv - e_rsh - e_tr - e_mbl; //1F_25.14F_18_...29F_1
            e_mstd = (e_mstd < 5) ? 5 : e_mstd;

            var stmap = [
            ["common_vset0", 20, 20], //ball
            ["common_vset0", 22, 1], //key
            ["common_vset0", 23, Math.floor(stageno / 4) + 4], //b //1-4F 4.6-9F_5.11-14F_6. 
            ["common_vset0", 24, Math.floor(stageno / 6) + 4], //s //1-6F 4.7-12F_5.13-18F_6.
            ["common_vset0", 25, 4], //l //HP 1-4F+16_5F+7=+23.23*2+16=15F+62(72)/29F+124(134)/
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
            ["enemy_mimic", 40, Math.floor(stageno / 5)], //1-4F_0.5F-10F_1....29F_5
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
                if (rcnt >= shuffled.length) rcnt = 0;
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