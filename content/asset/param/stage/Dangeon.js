function Dangeon(stageno) {

    //stageno = 0;

            MAP_W = 30,
            MAP_H = 30,
            MINIMUM_ROOM_SIZE = 3,
            MARGIN_BETWEEN_RECT_ROOM = 2,
            MINIMUM_RECT_SIZE = MINIMUM_ROOM_SIZE + (MARGIN_BETWEEN_RECT_ROOM * 2),
            COUPLE_VERTICAL = 0,
            COUPLE_HORIZONAL = 1

            stageno = Math.floor(Math.random() * 1000000);
            let rnd = new myrnd(stageno); //seed);

        function _room(){
                this.lx = 0;
                this.ly = 0;
                this.hx = MINIMUM_ROOM_SIZE;
                this.hy = MINIMUM_ROOM_SIZE;
           }

            function _rect() {
                this.done_split_v = false;
                this.done_split_h = false;
                this.lx = 0;
                this.ly = 0;
                this.hx = MINIMUM_RECT_SIZE;
                this.hy = MINIMUM_RECT_SIZE;
                this.room = new _room();
            }

        function _couple(){
                this.v_or_h = COUPLE_HORIZONAL;

                this.rect0 = new _rect();
                this.rect1 = new _rect();
        }

        let rect_list = [];
        let room_list = [];
        let couple_list = [];

        let map = [[]];
        let roomcmap = [[]];
        let bcmap = [[]];
        let typemap = [[]];

        let mlist = [];//通路
        let rlist = [];//部屋
        let ilist = [];//部屋の内、壁のない場所

        this.create = Create;
//        this.change = map_change;

        this.mapdata = map;
        this.room = roomcmap;
        this.inroom = bcmap;
        this.type = typemap;

        this.ml = mlist;
        this.rl = rlist;
        this.il = ilist;
        
        this.mw = MAP_W;
        this.mh = MAP_H;

//        Create();

        function Create()
        {
            // document.getElementById("cnsl").value = "start.";
            //alert("!");
                for (let j = 0; j < MAP_W; j++)
                {
                    map[j] = [];
                    for (let i = 0; i < MAP_H; i++)
                    {
                        map[j][i] = false;
                    }
                }
                rect_list = [];
                room_list =[];

                couple_list = [];

                rect_split(rect_add(0, 0, MAP_W - 1, MAP_H - 1));

                room_make();

                couple_more();
                map_print();
                
//                mlist = [];
//                rlist = [];
//                ilist = [];

                map_change1();

            //    document.getElementById("cnsl").value = "complate."

            //    Draw();
            }

            function map_change() {
                map_change1();
                Draw();
            }

        function map_change1() {

            for (let j = 0; j < MAP_W; j++) {
                for (let i = 0; i < MAP_H; i++) {
                    if (map[j][i]) map[j][i] = false; else map[j][i] = true;
                }
            }


            let vx = [-1, 0, 1, -1, 1, -1, 0, 1];
            let vy = [-1, -1, -1, 0, 0, 1, 1, 1];

            let w = [];

            let eracemap = [[]];

            for (let i = 0; i < MAP_W; i++) {
                roomcmap[i] = [];
                eracemap[i] = [];

                for (let j = 0; j < MAP_H; j++) {
                    let f = true;
                    let b = 0;
                    let typ = 0;

                    if ((i == 0) || (i == MAP_H - 1) || (j == 0) || (j == MAP_W - 1)) {

                        eracemap[i][j] = f;
                        roomcmap[i][j] = b;
                        continue; 
                    }

                    for (let k in vx) {
                        if (!map[i + vx[k]][j + vy[k]]) {
                            b++;
                        }
                    }
                    roomcmap[i][j] = b;

                    if (map[i][j]) {
                        for (let k in vx) {
                            if (!map[i + vx[k]][j + vy[k]]) {
                                f = false;
                            }
                        }
                    }
                    eracemap[i][j] = f;
                }
            }

            for (let i = 0; i < MAP_W; i++) {
                typemap[i] = [];
                for (let j = 0; j < MAP_H; j++) {

                    if (!map[i][j]) {

                        let w = {};
                        w.x = i;
                        w.y = j;

                        mlist.push(w);
                    }

                    let typ = 0;

                    if ((i == 0) || (i == MAP_H - 1) || (j == 0) || (j == MAP_W - 1)) {
                        //
                    } else {
                        let c = 0;
                        for (let k in vx) {
                            if (map[i + vx[k]][j + vy[k]]) {
                                typ += Math.pow(2, c);
                            }
                            c++;
                        }
                    }

                    //
                    if (typ ==   2 +   1) typ = 2;
                    if (typ ==   2 +   4) typ = 2;
                    if (typ ==   2 +   1+4) typ = 2;
                    if (typ ==   8 +   1) typ = 8;
                    if (typ ==   8 +  32) typ = 8;
                    if (typ ==   8 +  1+32) typ = 8;
                    if (typ ==  16 +   4) typ = 16;
                    if (typ ==  16 + 128) typ = 16;
                    if (typ ==  16 + 4+128) typ = 16;
                    if (typ ==  64 +  32) typ = 64;
                    if (typ ==  64 + 128) typ = 64;
                    if (typ ==  64 + 32+128) typ = 64;

                    if (typ ==  11 +   4) typ = 11;
                    if (typ ==  11 +  32) typ = 11;

                    if (typ == (11+16) +  32) typ = (11+16);
                    if (typ == (11+64) +  64) typ = (11+ 4);

                    if (typ ==  22 +   1) typ = 22;
                    if (typ ==  22 + 128) typ = 22;

                    if (typ == (22+64) +  1) typ = (22+64);
                    if (typ == (22+8) + 128) typ = (22+8);

                    if (typ == 104 +   1) typ = 104;
                    if (typ == 104 + 128) typ = 104;

                    if (typ == (104+16) +1) typ = (104+16);
                    if (typ == (104+ 2) + 128) typ = (104+2);

                    if (typ == 208 +   4) typ = 208;
                    if (typ == 208 +  32) typ = 208;

                    if (typ == (208+8) +   4) typ = (208+8);
                    if (typ == (208+2) +  32) typ = (208+2);

                    if (typ ==  31 +  32) typ = 31;
                    if (typ ==  31 + 128) typ = 31;
                    if (typ == 107 +   4) typ = 107;
                    if (typ == 107 + 128) typ = 107;
                    if (typ == 214 +   1) typ = 214;
                    if (typ == 214 +  32) typ = 214;
                    if (typ == 248 +   1) typ = 248;
                    if (typ == 248 +   4) typ = 248;

                    if (typ == 24 +   1) typ = 24;
                    if (typ == 24 +   4) typ = 24;
                    if (typ == 24 +  32) typ = 24;
                    if (typ == 24 + 128) typ = 24;
                    if (typ == 24 +  1+4) typ = 24;
                    if (typ == 24 +  1+32) typ = 24;
                    if (typ == 24 +  1+128) typ = 24;
                    if (typ == 24 +  4+32) typ = 24;
                    if (typ == 24 +  4+128) typ = 24;
                    if (typ == 24 + 32+128) typ = 24;

                    if (typ == 66 +   1) typ = 66;
                    if (typ == 66 +   4) typ = 66;
                    if (typ == 66 +  32) typ = 66;
                    if (typ == 66 + 128) typ = 66;
                    if (typ == 66 +  1+4) typ = 66;
                    if (typ == 66 +  1+32) typ = 66;
                    if (typ == 66 +  1+128) typ = 66;
                    if (typ == 66 +  4+32) typ = 66;
                    if (typ == 66 +  4+128) typ = 66;
                    if (typ == 66 + 32+128) typ = 66;

                    typemap[i][j] = typ;
                }
            }

            for (let i = 0; i < MAP_W; i++) {
                bcmap[i] = [];
 //               typemap[i] = [];

                for (let j = 0; j < MAP_H; j++) {
//                    let typ = 0;

                    if (!map[i][j] && (roomcmap[i][j] >= 8)) bcmap[i][j] = true; else bcmap[i][j] = false;
                    //if (!map[i][j] && (roomcmap[i][j] >= 6)) bcmap[i][j] = true; else bcmap[i][j] = false;
                    if (!map[i][j] && (roomcmap[i][j] >= 5)) roomcmap[i][j] = true; else roomcmap[i][j] = false;
                    if (eracemap[i][j]) map[i][j] = false;

/*
                    if ((i == 0) || (i == MAP_H - 1) || (j == 0) || (j == MAP_W - 1)) {
                        //
                    }else{
                        let c = 0;
                        for (let k in vx) {
                            if (map[i + vx[k]][j + vy[k]]) {
                                typ += Math.pow(2, c);
                            }
                            c++;
                        }
                    }
                    typemap[i][j] = typ;
                    */
                }
            }

            //room_check

            for (let i = 0; i < MAP_W; i++) {
                for (let j = 0; j < MAP_H; j++) {

                    if (roomcmap[i][j]) {

                        let w = {};
                        w.x = i;
                        w.y = j;

                        rlist.push(w);
                    }
                }
            }

            for (let i = 0; i < MAP_W; i++) {
                for (let j = 0; j < MAP_H; j++) {

                    if (bcmap[i][j]) {

                        let w = {};
                        w.x = i;
                        w.y = j;

                        ilist.push(w);
                    }
                }
            }
        }


        function map_print()
        {
            let c0x, c0y, c1x, c1y;

            /*
            foreach (let c in rect_list)
            {
                let rect = rect_list[ c ];

                break;
                for (i = rect.lx, j = rect.ly; i <= rect.hx; i++) map[i, j] = true;
                for (i = rect.lx, j = rect.hy; i <= rect.hx; i++) map[i, j] = true;
                for (i = rect.lx, j = rect.ly; j <= rect.hy; j++) map[i, j] = true;
                for (i = rect.hx, j = rect.ly; j <= rect.hy; j++) map[i, j] = true;
            }
            */

            for(let c in room_list)
            {
                let room = room_list[ c ];
                for (let i = room.lx; i <= room.hx; i++)
                {
                    for (let j = room.ly; j <= room.hy; j++)
                    {
                        map[i][j] = true;
                    }
                }
            }

            for( c in couple_list)
            {
                let couple = couple_list[c];

//                alert(couple.rect0 + "\n" + couple.rect1);


                switch (couple.v_or_h)
                {
                    case COUPLE_HORIZONAL:
                        c0x = couple.rect0.hx;
                        c0y = g_random_int_range(
                            couple.rect0.room.ly + 1
                            , couple.rect0.room.hy
                            );
                        c1x = couple.rect1.lx;
                        c1y = g_random_int_range(
                            couple.rect1.room.ly + 1
                            , couple.rect1.room.hy
                            );
                        line(c0x, c0y, c1x, c1y);
                        line(couple.rect0.room.hx, c0y, c0x, c0y);
                        line(couple.rect1.room.lx, c1y, c1x, c1y);
                        break;
                    case COUPLE_VERTICAL:
                        c0x = g_random_int_range(
                            couple.rect0.room.lx + 1
                            , couple.rect0.room.hx
                            );
                        c0y = couple.rect0.hy;
                        c1x = g_random_int_range(
                            couple.rect1.room.lx + 1
                            , couple.rect1.room.hx
                            );
                        c1y = couple.rect1.ly;
                        line(c0x, c0y, c1x, c1y);
                        line(c0x, couple.rect0.room.hy, c0x, c0y);
                        line(c1x, couple.rect1.room.ly, c1x, c1y);
                        break;
                }
            }
        }


        function Draw(screen) {
            let st = "";
            let wst = "";
            for (let j = 0; j < MAP_H; j++) {

                for (let i = 0; i < MAP_W; i++) {
                    //if (map[i][j]) {
                    //  st += "[]";
                    //} else {
                    let wst = "__";
                    if (map[i][j]) wst = "[]";
                    if (roomcmap[i][j]) wst = "@@";
                    if (bcmap[i][j]) wst = "Bb";

                    st += wst;
                    //}
                }
                /*            
                for (let i = 0; i < MAP_W; i++) {

                if (roomcmap[i][j]) st += "@@"; else st += "._";
                
                */
                st += "\n";
            }
                        
             for (let j = 0; j < MAP_H; j++) {

                 for (let i = 0; i < MAP_W; i++) {

                     let wst = "__";

                     for (let k in mlist) {
                         if ((mlist[k].x == i) && (mlist[k].y == j)) wst = "[]";
                     }

                     for (let k in rlist) {
                         if ((rlist[k].x == i) && (rlist[k].y == j)) wst = "@@";
                     }
                     for (let k in ilist) {
                         if ((ilist[k].x == i) && (ilist[k].y == j)) wst = "Bb";
                     }
                     st += wst;
                 }
                 st += "\n";
            }
            //document.getElementById("cnsl").value = st;

        }

        function line(x0, y0, x1, y1)
        {
            let min_x, max_x, min_y, max_y, i, j;

            min_x = Math.min(x0, x1);
            max_x = Math.max(x0, x1);
            min_y = Math.min(y0, y1);
            max_y = Math.max(y0, y1);

            if ((x0 <= x1) && (y0 >= y1))
            {
                for (i = min_x; i <= max_x; i++) map[i][max_y] = true;
                for (j = min_y; j <= max_y; j++) map[max_x][j] = true;
                return;
            };
            if ((x0 > x1) && (y0 > y1))
            {
                for (i = min_x; i <= max_x; i++) map[i][min_y] = true;
                for (j = min_y; j <= max_y; j++) map[max_x][j] = true;
                return;
            };
            if ((x0 > x1) && (y0 <= y1))
            {
                for (i = min_x; i <= max_x; i++) map[i][min_y] = true;
                for (j = min_y; j <= max_y; j++) map[min_x][j] = true;
                return;
            };
            if ((x0 <= x1) && (y0 < y1))
            {
                for (i = min_x; i <= max_x; i++) map[i][max_y] = true;
                for (j = min_y; j <= max_y; j++) map[min_x][j] = true;
                return;
            };
        }

        function rect_split(rect_parent)
        {
            let rect_child = new _rect();
            if (rect_parent.hy - rect_parent.ly <= MINIMUM_RECT_SIZE * 2)
            {
                rect_parent.done_split_v = true;
            };
            if (rect_parent.hx - rect_parent.lx <= MINIMUM_RECT_SIZE * 2)
            {
                rect_parent.done_split_h = true;
            };
            if ((rect_parent.done_split_v) &&
                (rect_parent.done_split_h))
            {
                return;
            };
            rect_child = rect_add(rect_parent.lx, rect_parent.ly,
                      rect_parent.hx, rect_parent.hy);

            if (rect_parent.done_split_v == false)
            {
                let split_coord_y;
                split_coord_y = g_random_int_range(
                    rect_parent.ly + MINIMUM_RECT_SIZE
                    , rect_parent.hy - MINIMUM_RECT_SIZE
                    );
                rect_parent.hy = split_coord_y;
                rect_child.ly = split_coord_y;
                rect_parent.done_split_v = true;
                rect_child.done_split_v = true;
                couple_add(COUPLE_VERTICAL, rect_parent, rect_child);
                rect_split(rect_parent);
                rect_split(rect_child);

                return;
            };

            if (rect_parent.done_split_h == false)
            {
                let split_coord_x;
                split_coord_x = g_random_int_range(
                    rect_parent.lx + MINIMUM_RECT_SIZE
                    , rect_parent.hx - MINIMUM_RECT_SIZE
                    );
                rect_parent.hx = split_coord_x;
                rect_child.lx = split_coord_x;
                rect_parent.done_split_h = true;
                rect_child.done_split_h = true;
                couple_add(COUPLE_HORIZONAL, rect_parent, rect_child);
                rect_split(rect_parent);
                rect_split(rect_child);

                return;
            };
        }

        function room_make()
        {
            let x, y, w, h;

            for(let c in rect_list)
            {
                let rect = rect_list[ c ];

                w = g_random_int_range(
                    MINIMUM_ROOM_SIZE
                    , rect.hx - rect.lx - (MARGIN_BETWEEN_RECT_ROOM * 2) + 1
                    );

                h = g_random_int_range(
                    MINIMUM_ROOM_SIZE
                    , rect.hy - rect.ly - (MARGIN_BETWEEN_RECT_ROOM * 2) + 1
                    );

                x = g_random_int_range(rect.lx + MARGIN_BETWEEN_RECT_ROOM
                    , rect.hx - MARGIN_BETWEEN_RECT_ROOM - w + 1
                    );

                y = g_random_int_range(
                    rect.ly + MARGIN_BETWEEN_RECT_ROOM
                    , rect.hy - MARGIN_BETWEEN_RECT_ROOM - h + 1
                    );

                rect.room = room_add(x, y, x + w, y + h);

            };
        }



        function couple_more()
        {
            rectmap = [[]];
            let i, j;

            for (let j = 0; j < MAP_W; j++) {
                rectmap[j] = [];
                for (let i = 0; i < MAP_H; i++) {
                    rectmap[j][i] = null;
                }
            }

            for(let c in rect_list)
            {
                let rect = rect_list[c];

                for (i = rect.lx; i < rect.hx; i++)
                {
                    for (j = rect.ly; j < rect.hy; j++)
                    {
                        rectmap[i][j] = rect;
                    };
                };
            };
            for (i = 0; i < MAP_W - 2; i++)
            {
                for (j = 0; j < MAP_H - 2; j++) {

                    if (!Boolean(rectmap[i][j])) alert("rectnull" + i + ":" + j);

                    if (rectmap[i][j] != rectmap[i][j + 1])
                    {
                        if (g_random_int_range(0, 64) == 0)
                        {
                            couple_add(COUPLE_VERTICAL, rectmap[i][j], rectmap[i][j + 1]);
                        };
                    };
                    if (rectmap[i][j] != rectmap[i + 1][j])
                    {
                        if (g_random_int_range(0, 64) == 0)
                        {
                            couple_add(COUPLE_HORIZONAL, rectmap[i][j], rectmap[i + 1][j]);
                        };
                    };
                };
            };

        }

        function rect_add(lx, ly, hx, hy)
        {
            let rect = new _rect();
            rect.lx = lx;
            rect.ly = ly;
            rect.hx = hx;
            rect.hy = hy;
            rect_list.push(rect);
            return rect;
        }

        function room_add(lx, ly, hx, hy)
        {
            let room = new _room();
            room.lx = lx;
            room.ly = ly;
            room.hx = hx;
            room.hy = hy;
            room_list.push(room);
            return (room);
        }

        function couple_add(v_or_h, rect0, rect1)
        {
            let couple = new _couple();
            couple.v_or_h = v_or_h;
            couple.rect0 = rect0;
            couple.rect1 = rect1;
            couple_list.push(couple);
            return (couple);
        }

        function g_random_int_range(lx, hx) {

            //return Math.floor( Math.random()*(hx - lx)) + lx;
            return Math.floor( rnd.next()*(hx - lx)) + lx;
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

    