//　ステージの設定(マップ、マップシナリオ設定・読み出し）
function TestStage(stageno) {

    const BLOCK_W = 96;
    const BLOCK_H = 96;

    let dgn;
    
    dgn = new Dangeon(stageno);
    dgn.create();

    //let mp = dgn.mapdata;
 
    let hlist = dgn.ml; //通路を含む壁がないエリア
    let rlist = dgn.il; //壁際を除く部屋部分(初期配置エリア
    //let clist = dgn.rl; //壁際含む部屋部分(通路は含まない)

    stageno = Math.floor(Math.random() * 1000000);
    let rnd = new myrnd(stageno);//seed);

    this.scenario = mapScenro;
    this.bgImage = mapBgImage;
    this.bgLayout = mapBgLayout;
    this.initial = mapInitial;
    this.bgPtn = mapBgPattern;

    let cmap = [];
    this.colmap = cmap;
    
    this.startroom_id; 

    let startx, starty;

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
            let snum = Math.floor(rnd.next() * shuffled.length);
            let dnum = Math.floor(rnd.next() * shuffled.length);

            let w = shuffled[snum];
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

        let ms =
        //  開始フレーム,座標,,角度,シナリオ,キャラ
	        [[600000, -1, -1, 0, 0, 0]];
        // フレームカウントでソートされていること。

        let map_sc = []; //　出現パターン

        for (let j in ms) {
            let w = ms[j];

            let ptn = {};

            ptn.count = w[0];
            ptn.x = w[1];
            ptn.y = w[2];
            ptn.r = w[3];
            ptn.sc = w[4];
            ptn.ch = w[5];
            ptn.used = false;

            map_sc.push(ptn);
        }
        for (let e in map_sc) {

            let pt = map_sc[e];

            let wx = Math.floor(pt.x / BLOCK_W);
            let wy = Math.floor(pt.y / BLOCK_H);

            let f = true;

            for (let i in rlist) {
                if ((rlist[i].x == wx) && (rlist[i].y == wy)) {
                    f =false;
                }
            }

            if (f) {
                let vr = Math.floor(Math.random() * rlist.length);

                pt.x = rlist[vr].x * BLOCK_W + BLOCK_W/2;
                pt.y = rlist[vr].y * BLOCK_H + BLOCK_H/2;
            }
        }
        return map_sc;
    }

    function mapBgImage(stageno) {
        let num = Math.floor(((stageno-1) % 15) / 5) + 1;
        let tex_bg = "bg" + num;
        return tex_bg;
    }
    function mapBgPattern() { return bgdata(); }

    function mapBgLayout() {
        //マップチップの座標リスト
        let mc = [];
        let mp = dgn.mapdata;

        let vx = [-1,  0,  1, -1,  1, -1,  0,  1];
        let vy = [-1, -1, -1,  0,  0,  1,  1,  1];

        let w = [];
        bit_check = function (n) {
            let cr = [];
            for (let i in vx) {
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
            for (let j = 1; j <= dgn.mh - 1; j++) {
                if (mp[i][j]) {
                    let cr = bit_check(dgn.type[i][j]);
                    for (let k in vx) {
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
                };
            }
        }

        for (let i in hlist) {
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
                startx = x + (wdt/2)+32;
                starty = y + (hgt/2)+32;

                w = [14,    //魔法陣画像（拡大）
                    x + (wdt/2)+32, y + (hgt/2)+32, 64, 64,
                    true,   //false,//HitCheck有
                    4,      //Home(BG)
                    true    //visibility
                ];
                sid = mc.length - 1;
                mc.push(w);

                //ドアの設置
                let res = fieldCornerCheck(room[i]);   
                w = [13,    //Door
                    res.x + 16, res.y + 16, 64, 64,
                    true,   //false,//HitCheck有
                    2,      //Door(BG)
                    true    //visibility
                ];
            }else{
                //portal
                let res = fieldCornerCheck(room[i]);   
                w = [15,    //石板画像
                    res.x + 16, res.y + 16, 64, 64,
                    true,   //false,//HitCheck有
                    6,      //Portal(BG)
                    true    //visibility
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

        let map_cp = []; //　マップチップ
        //no:graphics　
        //type:floortype　0:床　1:壁　2:ドア　3:天井　4:Home 5:[Reserb] 6:Portal
        //     (type%2 == 1)trueの場合はFG(ForgForground) falseはBGに表示する。
        //c:当たり判定有無(有:true) visible:表示があるかどうか

        for (let j in mc) {
            let w = mc[j];

            let chip = {};

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
        
        let ms = [];
        //  開始フレーム,座標,,角度,シナリオ,キャラ
        ms.push([false, startx,  starty, 0, "player", 0]);

        let itl = [20, 20, 20, 20, 23, 24, 25, 51, 52, 53, 54, 55, 56, 57, 58, 22, 26, 27, 16, 17, 18, 19, 50];
        //スタート地点に設置される初期装備/ITEM DEBUG
    
        for (let i in itl){
            let r = startroom[i%startroom.length];
            ms.push([
                false //面展開時に(false: 毎回,　true:１度のみ)設置される。基本は自機用
                , rlist[r].x * BLOCK_W + BLOCK_W/2
                , rlist[r].y * BLOCK_H + BLOCK_W/2
                , 0, "common_vset0", itl[i]
            ]);
        }

        //check      
        // 51 AmuletR MP50 3    ST15 
        // 52 AmuletG MP51 8    ST15 
        // 53 AmuletB MP52 12   ST15 
        // 54 CandleR MP53 6    NONE 
        // 55 CandleB MP54 11   NONE
        // 56 RingR   MP55 7 9  ST10   
        // 57 RingB   MP56 2 4  ST10 
        // 58 Mirror MP57 13 14 ST15 
        //---------------------------
        //------ OK Z OK  Z  Z  Z
        //AMULET o  x  -  -  o  x
        //RING   -  -  o  x  -  -   
        //MIRROR o  x  -  -  x  o
        //       15 0 10  7 13  3 
        // ZAP CHECK STAGE-CLEAR9 -CLEAR14

        let map_sc = []; //　出現パターン

        for (let j in ms) {
            let w = ms[j];

            let ptn = {};

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
        //マップの初期配置とマップチップの座標リストなど
    }

    function myrnd(num) {
        let seed = num;
        this.next = readnum;
        function readnum() {
            let rndnum = (1103515245 * seed + 12345) % 32768;
            seed = rndnum;
            return rndnum / 32767.1;
        }
    }
}