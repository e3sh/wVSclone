// シナリオ
//　scenario processor version Javascript
//　各オブジェクトの行動を指定するリスト。

//ボスキャラの動作に関するシナリオ
function sce_boss_0() {
    // 5Way用母機　中ボス
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        o.vset(8);
        o.get_target(98);
        o.w_cnt = 0;

        o.custom_draw_enable = true;
    }

    this.draw = sce_boss_damage_gr;

    this.move = function (scrn, o) {

        switch (o.frame) {
            case 15:
                o.get_target(98);
                o.vset(0);
                break;
            case 22:
                o.vector = o.target_v();
                //o.set_object(103);
                break;
            case 27:
                //o.set_object(103);
                break;
            case 32:
                o.set_object(103);
                break;
            case 60://35
                o.frame = 12;
                o.w_cnt++;
                break;
            default:
                break;
        };
        o.frame++;

        if (o.w_cnt > 10) {
            o.w_cnt = 5;
            //o.vector = 90 + Math.floor(Math.random() * 180);
            o.vector += Math.floor(Math.random() * 180);
            o.vset(1);
            o.frame = 0;
        }

        return o.sc_move();
    }
 }

function sce_boss_1(){

    //　弾を撒き散らす。ボス
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        o.vset(4);
        //o.mp = 12; //通常のキャラにする
        o.chr = 1;//鍵を出さないようにボスをはずす

        o.display_size = 0.001;
        o.weight = 2.0;

        o.hit_x *= 2.0;
        o.hit_y *= 2.0;

        o.custom_draw_enable = false;

        o.wdspf = true;

        o.cnt = 0;
    }

    this.draw = sce_boss_damage_gr;

    this.move = function (scrn, o) {

        if (o.wdspf) {
            o.display_size = 2.0 * (o.frame / 60.0);
        } else {
            o.display_size = 2.0;
            o.custom_draw_enable = true;
        }

        switch (o.frame) {
            case 13:
                //    o.SIGNAL(6055);//ボス戦開始のお知らせ(マップシナリオ進行の停止）
            case 14:
                o.vset(0);

                break;
            case 60:
                o.wdspf = false;

                if (o.hp <= 0) {
                    //    o.bomb();
                } else {
                    o.cnt++;

                    if (o.cnt > 7) {
                        o.cnt = 0;
                        o.set_object(30);
                    }
                }
                o.vset(0);
                o.vector = (o.vector + 8 + 360) % 360;
                o.frame = 59; // 59;
                break;
            default:
                break;
        };

        if (o.status == 2) {
            o.set_object_ex(14, o.x, o.y, 180, 50);
            o.status = 2;
        }

        o.frame++;

        //		if (o.hp <=0 ) o.pause_system(42);
        //		if (o.hp <= 0) o.bomb();

        return o.sc_move();
    }
}

function sce_boss_2(){
    // HLaser用母機
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        o.vset(0);
        o.get_target(98);
        o.w_cnt = 0;

        o.display_size = 0.001;
        o.weight = 2.0;

        o.hit_x *= 2.0;
        o.hit_y *= 2.0;

        o.custom_draw_enable = true;

        o.wdspf = true;
    }

    this.draw = sce_boss_damage_gr;

    this.move = function (scrn, o) {

        if (o.wdspf) {
            o.display_size = 2.0 * (o.frame / 60);
        } else {
            o.display_size = 2.0;
        }

        switch (o.frame) {
            case 60:
                o.wdspf = false;
                o.get_target(98);
                o.vset(0);
                break;
            case 82:
                o.get_target(98);
                o.vector = o.target_v();
                o.vset(0);
                //    o.set_object(103);
                break;
            case 87:
                //    o.set_object(103);
                break;
            case 92:
                //o.set_object_ex(3, o.x, o.y, o.vector, "exev_3way_exp");
                //o.set_object(100);   // o.set_object(103);
                break;
            case 95:
                o.frame = 72; // 72;
                o.w_cnt++;
                break;
            default:
                break;
        };
        o.frame++;

        if ((o.w_cnt % 10 == 0) && (o.frame == 90)) {
            o.set_object_ex(32, o.x, o.y, (o.vector + 45) % 360, 49);
            o.set_object_ex(32, o.x, o.y, (o.vector + 315) % 360, 49);
        }

        if ((o.w_cnt % 10 == 5) && (o.frame == 90)) {

            var larm = (o.vector + 90) % 360;
            var rarm = (o.vector + 270) % 360;

            o.set_object_ex(32, o.x + o.Cos(larm)*100, o.y + o.Sin(larm)*100, o.vector, 51);
            o.set_object_ex(32, o.x, o.y, o.vector, 51);
            o.set_object_ex(32, o.x + o.Cos(rarm) * 100, o.y + o.Sin(rarm) * 100, o.vector, 51);
        }

        //        if (o.w_cnt > 10) {
        //            o.w_cnt = 5;
        //            o.vector = 90 + Math.floor(Math.random() * 180);
        //	o.vector = 180;
        //            o.vset(1);
        //            o.frame = 0;
        //       }

        if (o.status == 2) {
            o.bomb();
            //o.SIGNAL(0); //ボス戦終了のお知らせ(マップシナリオ進行の停止）
        }
        return o.sc_move();
    }
}
/*
function sce_boss_damage_gr(scrn, o) {
    //Bossのダメージゲージ表示

    cl = {};
    var w = o.gt.worldtoView(o.x, o.y);
    cl.x = w.x;
    cl.y = w.y;
    cl.sr = ((360 * ((o.maxhp - o.hp) / o.maxhp) - 90) * (Math.PI / 180));
    cl.draw = function (device) {
        device.beginPath();
        device.strokeStyle = "white";
        device.lineWidth = "5";
        device.beginPath();
        device.arc(this.x, this.y, 32 + 10, this.sr, 1.5 * Math.PI, false);
        device.stroke();

        device.beginPath();
        device.strokeStyle = "silver";
        device.lineWidth = "1";
        device.arc(this.x, this.y, 30 + 10, 0, 2 * Math.PI, false);

        device.stroke();
        device.beginPath();
        device.arc(this.x, this.y, 34 + 10, 0, 2 * Math.PI, false);
        device.stroke();
    }
    scrn.putFunc(cl);
    //        scrn.putchr8(o.display_size+ " ", o.x+100, o.y+100);
}
*/
function sce_boss_damage_gr(scrn, o) {
    //Bossのダメージゲージ表示

    cl = {};
    var w = o.gt.worldtoView(o.x, o.y);
    cl.x = w.x;
    cl.y = w.y;
    //cl.sr = ((360 * ((o.maxhp - o.hp) / o.maxhp) - 90) * (Math.PI / 180));
    cl.sr = (o.hp / o.maxhp) * 0.5 * Math.PI;
    cl.draw = function (device) {
        var st = (1.25 -0.5) * Math.PI;
        var ed = (0.75 -0.5) * Math.PI;
        var v = st - this.sr;

        device.beginPath();
        device.strokeStyle = "limegreen";//"white";
        device.lineWidth = "5";
        device.beginPath();
        device.arc(this.x, this.y, 32 + 10, st, v, true);
        device.stroke();

        device.beginPath();
        device.strokeStyle = "silver";
        device.lineWidth = "1";
        device.arc(this.x, this.y, 30 + 10, st, ed, true);

        device.stroke();
        device.beginPath();
        device.arc(this.x, this.y, 34 + 10, st, ed, true);
        device.stroke();
    }
    scrn.putFunc(cl);
    //        scrn.putchr8(o.display_size+ " ", o.x+100, o.y+100);
}
