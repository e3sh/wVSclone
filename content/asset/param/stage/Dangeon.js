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
            var rnd = new myrnd(stageno); //seed);

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

        var rect_list = [];
        var room_list = [];
        var couple_list = [];

        var map = [[]];
        var roomcmap = [[]];
        var bcmap = [[]];
        var typemap = [[]];

        var mlist = [];//通路
        var rlist = [];//部屋
        var ilist = [];//部屋の内、壁のない場所

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
                for (var j = 0; j < MAP_W; j++)
                {
                    map[j] = [];
                    for (var i = 0; i < MAP_H; i++)
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

            for (var j = 0; j < MAP_W; j++) {
                for (var i = 0; i < MAP_H; i++) {
                    if (map[j][i]) map[j][i] = false; else map[j][i] = true;
                }
            }


            var vx = [-1, 0, 1, -1, 1, -1, 0, 1];
            var vy = [-1, -1, -1, 0, 0, 1, 1, 1];

            var w = [];

            var eracemap = [[]];

            for (var i = 0; i < MAP_W; i++) {
                roomcmap[i] = [];
                eracemap[i] = [];

                for (var j = 0; j < MAP_H; j++) {
                    var f = true;
                    var b = 0;
                    var typ = 0;

                    if ((i == 0) || (i == MAP_H - 1) || (j == 0) || (j == MAP_W - 1)) {

                        eracemap[i][j] = f;
                        roomcmap[i][j] = b;
                        continue; 
                    }

                    for (var k in vx) {
                        if (!map[i + vx[k]][j + vy[k]]) {
                            b++;
                        }
                    }
                    roomcmap[i][j] = b;

                    if (map[i][j]) {
                        for (var k in vx) {
                            if (!map[i + vx[k]][j + vy[k]]) {
                                f = false;
                            }
                        }
                    }
                    eracemap[i][j] = f;
                }
            }

            for (var i = 0; i < MAP_W; i++) {
                typemap[i] = [];
                for (var j = 0; j < MAP_H; j++) {

                    if (!map[i][j]) {

                        var w = {};
                        w.x = i;
                        w.y = j;

                        mlist.push(w);
                    }

                    var typ = 0;

                    if ((i == 0) || (i == MAP_H - 1) || (j == 0) || (j == MAP_W - 1)) {
                        //
                    } else {
                        var c = 0;
                        for (var k in vx) {
                            if (map[i + vx[k]][j + vy[k]]) {
                                typ += Math.pow(2, c);
                            }
                            c++;
                        }
                    }
                    typemap[i][j] = typ;
                }
            }

            for (var i = 0; i < MAP_W; i++) {
                bcmap[i] = [];
 //               typemap[i] = [];

                for (var j = 0; j < MAP_H; j++) {
//                    var typ = 0;

                    if (!map[i][j] && (roomcmap[i][j] >= 8)) bcmap[i][j] = true; else bcmap[i][j] = false;
                    //if (!map[i][j] && (roomcmap[i][j] >= 6)) bcmap[i][j] = true; else bcmap[i][j] = false;
                    if (!map[i][j] && (roomcmap[i][j] >= 5)) roomcmap[i][j] = true; else roomcmap[i][j] = false;
                    if (eracemap[i][j]) map[i][j] = false;

/*
                    if ((i == 0) || (i == MAP_H - 1) || (j == 0) || (j == MAP_W - 1)) {
                        //
                    }else{
                        var c = 0;
                        for (var k in vx) {
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

            for (var i = 0; i < MAP_W; i++) {
                for (var j = 0; j < MAP_H; j++) {

                    if (roomcmap[i][j]) {

                        var w = {};
                        w.x = i;
                        w.y = j;

                        rlist.push(w);
                    }
                }
            }

            for (var i = 0; i < MAP_W; i++) {
                for (var j = 0; j < MAP_H; j++) {

                    if (bcmap[i][j]) {

                        var w = {};
                        w.x = i;
                        w.y = j;

                        ilist.push(w);
                    }
                }
            }
        }


        function map_print()
        {
            var c0x, c0y, c1x, c1y;

            /*
            foreach (var c in rect_list)
            {
                var rect = rect_list[ c ];

                break;
                for (i = rect.lx, j = rect.ly; i <= rect.hx; i++) map[i, j] = true;
                for (i = rect.lx, j = rect.hy; i <= rect.hx; i++) map[i, j] = true;
                for (i = rect.lx, j = rect.ly; j <= rect.hy; j++) map[i, j] = true;
                for (i = rect.hx, j = rect.ly; j <= rect.hy; j++) map[i, j] = true;
            }
            */

            for(var c in room_list)
            {
                var room = room_list[ c ];
                for (var i = room.lx; i <= room.hx; i++)
                {
                    for (var j = room.ly; j <= room.hy; j++)
                    {
                        map[i][j] = true;
                    }
                }
            }

            for( c in couple_list)
            {
                var couple = couple_list[c];

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
            var st = "";
            var wst = "";
            for (var j = 0; j < MAP_H; j++) {

                for (var i = 0; i < MAP_W; i++) {
                    //if (map[i][j]) {
                    //  st += "[]";
                    //} else {
                    var wst = "__";
                    if (map[i][j]) wst = "[]";
                    if (roomcmap[i][j]) wst = "@@";
                    if (bcmap[i][j]) wst = "Bb";

                    st += wst;
                    //}
                }
                /*            
                for (var i = 0; i < MAP_W; i++) {

                if (roomcmap[i][j]) st += "@@"; else st += "._";
                
                */
                st += "\n";
            }
                        
             for (var j = 0; j < MAP_H; j++) {

                 for (var i = 0; i < MAP_W; i++) {

                     var wst = "__";

                     for (var k in mlist) {
                         if ((mlist[k].x == i) && (mlist[k].y == j)) wst = "[]";
                     }

                     for (var k in rlist) {
                         if ((rlist[k].x == i) && (rlist[k].y == j)) wst = "@@";
                     }
                     for (var k in ilist) {
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
            var min_x, max_x, min_y, max_y, i, j;

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
            var rect_child = new _rect();
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
                var split_coord_y;
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
                var split_coord_x;
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
            var x, y, w, h;

            for(var c in rect_list)
            {
                var rect = rect_list[ c ];

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
            var i, j;

            for (var j = 0; j < MAP_W; j++) {
                rectmap[j] = [];
                for (var i = 0; i < MAP_H; i++) {
                    rectmap[j][i] = null;
                }
            }

            for(var c in rect_list)
            {
                var rect = rect_list[c];

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
            var rect = new _rect();
            rect.lx = lx;
            rect.ly = ly;
            rect.hx = hx;
            rect.hy = hy;
            rect_list.push(rect);
            return rect;
        }

        function room_add(lx, ly, hx, hy)
        {
            var room = new _room();
            room.lx = lx;
            room.ly = ly;
            room.hx = hx;
            room.hy = hy;
            room_list.push(room);
            return (room);
        }

        function couple_add(v_or_h, rect0, rect1)
        {
            var couple = new _couple();
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

            var seed = num;

            this.next = readnum;

            function readnum() {
                var rndnum = (1103515245 * seed + 12345) % 32768;

                seed = rndnum;

                return rndnum / 32767.1;
            }
        }

    }

    