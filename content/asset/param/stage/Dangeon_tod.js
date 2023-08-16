function Dangeon_tod( seed ) {
    
    MAP_W = 10;
    MAP_H = 10;

    DMAP_W = MAP_W * 2 + 2;
    DMAP_H = MAP_H * 2 + 2;

    var rnd = new myrnd( seed );

    var map = [[]];
    var dispmap = [[]];

    this.map = dispmap;
    this.mw = DMAP_W;
    this.mh = DMAP_H;

    this.create = function () {

        for (var i = 0; i < MAP_W; i++) {
            map[i] = [];
            for (var j = 0; j < MAP_H; j++) {
                map[i][j] = -1;

            }
        }

        for (var i = 0; i < DMAP_W; i++) {
            dispmap[i] = [];
            for (var j = 0; j < DMAP_H; j++) {
                dispmap[i][j] = "  ";
            }
        }

        var vx = [0, 1, 0, -1];
        var vy = [-1, 0, 1, 0];

        for (var i = 0; i < MAP_W; i++) {
            for (var j = 0; j < MAP_H; j++) {

                //            var m = Math.floor(Math.random() * 4);
                var m = Math.floor(rnd.next() * 4);

                if (map[i][j] == -1) {
                    wallmake(i, j, m);
                }
            }
        }

        for (var i = 0; i < MAP_W; i++) {
            for (var j = 0; j < MAP_H; j++) {

                var wx = i * 2 + 1;
                var wy = j * 2 + 1;
                var wm = map[i][j];

                dispmap[wx][wy] = "□";

                dispmap[wx + vx[wm]][wy + vy[wm]] = ((wm % 2) ? "━" : "┃");
            }
        }

    }

    this.draw = function () {


    }

    function wallmake(x, y, m) {

        var vx = [0, 1, 0, -1];
        var vy = [-1, 0, 1, 0];

        map[x][y] = m;

        if ((x + vx[m] < 0) || (x + vx[m] >= MAP_W)) {return 1;}
        if ((y + vy[m] < 0) || (y + vy[m] >= MAP_H)) {return 1;}

        if (map[x + vx[m]][y + vy[m]] != -1) { return 1; }

        x += vx[m];
        y += vy[m];

        //       var r = Math.floor(Math.random() * 3)-1;
        var r = Math.floor(rnd.next() * 3) - 1;

        m += r;
        if (m < 0) m = 3;
        if (m >= 3) m = 0;

        return wallmake(x, y, m);
    }

    function print() {



        var st = "";

        for (var i = 0; i < DMAP_H; i++) {
            for (var j = 0; j < DMAP_W; j++) {

                st += dispmap[j][i];
            }
            st += "\n";
        }

       //document.getElementById("cnsl").value = st;
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




    