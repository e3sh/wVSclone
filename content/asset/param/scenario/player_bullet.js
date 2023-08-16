// シナリオ
//　scenario processor version Javascript
//　各オブジェクトの行動を指定するリスト。

//自機・支援機が発射する弾の動作シナリオ
function sce_pl_bullet_homing() {

    // 自機ホーミング弾
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        //		o.vector = 0;

        o.vector = (o.vector > 180) ? o.vector + 80 : o.vector - 80;

        o.vset(16);
        o.get_target(2);

        //        o.normal_draw_enable = false;
        //        o.custom_draw_enable = true;
    }

    this.move = function (scrn, o) {

        switch (o.frame) {
            case 1:
                //				o.vector = o.target_r( o.target.x, o.target.y);
                break;
            case 2:
                o.get_target(2);

                o.target_rotate_r(15);
                o.vset(16);
                break;
            case 5:
                o.frame = 1;
                break;
            default:
                break;
        };
        o.frame++;

        return o.sc_move();
    }  

    //ターゲットサーチLine　custom_draw_enable = true;　で描画する
    this.draw = function (scrn, o) {

        if (!Boolean(o.target)) return;

        var cl = {};
        cl.sx = o.x;
        cl.sy = o.y;
        cl.ex = o.target.x;
        cl.ey = o.target.y;
        cl.draw = function (device) {
            device.beginPath();

            device.moveTo(this.sx, this.sy);
            device.lineTo(this.ex, this.ey);
            //    device.lineWidth = "5";
            device.strokeStyle = "red";
            device.stroke();
        }
        scrn.putFunc(cl);
    }
}

function sce_pl_bullet_homing2() {

    //自機ホーミング弾Ver.2(横からでてから前に飛ぶ）laser45
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        //	o.vector = 0;

        o.vector = (o.vector > 180) ? o.vector - 5 : o.vector + 5;

        o.vset(4);
        o.get_target(2);

        o.w_cnt = 0;
        //        o.normal_draw_enable = false;
        //        o.custom_draw_enable = true;
    }

    this.move = function (scrn, o) {

        switch (o.w_cnt) {
            case 1:
                //				o.vector = o.target_r( o.target.x, o.target.y);
                break;
            case 2:
                if (o.frame > 90) o.get_target(2);

                o.target_rotate_r(15 + ((o.frame < 20) ? 15 : 0));
                o.vset(4 + ((o.frame > 20) ? 4 : 0) + ((o.frame > 25) ? 8 : 0));
                break;
            case 4:
                o.w_cnt = 1;
                break;
            default:
                break;
        };

        o.w_cnt++
        o.frame++;

        return o.sc_move();
    }
}

function sce_pl_bullet_subshot(num) {

    //0番用シナリオ(打ち出しはob_exから）
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        o.vset(num);
        o.mp = 7;

        o.alpha = 128;
    }

    this.move = function (scrn, o) {

        if (o.frame > 12) o.status = 0; //時間が来たら消す。

        o.frame++;

        return o.sc_move();
    }
}

function sce_pl_bullet_laser_head() {
    //Laser頭
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        o.vector = 0;
        o.y = o.y - 20;
        //    o.vector = (o.vector > 180) ? o.vector + 87 : o.vector - 87;

        o.vset(28);
        o.get_target(2);

        o.alpha = 64;

        o.w_cnt = 0;
        //        o.normal_draw_enable = false;
        //        o.custom_draw_enable = true;
    }

    this.move = function (scrn, o) {

        switch (o.w_cnt) {
            case 1:
                //				o.vector = o.target_r( o.target.x, o.target.y);
                break;
            case 2:
                o.get_target(2);

                o.target_rotate_r(3);
                o.vset(28);
                break;
            case 4:
                o.w_cnt = 1;
                break;
            default:
                break;
        };
        o.set_object_ex(23, o.x, o.y, o.vector, 46);

        o.w_cnt++
        o.frame++;

        return o.sc_move();
    }
}

function sce_pl_bullet_laser_tail() {
    //Laser尻尾
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        o.vset(0);
    }

    this.move = function (scrn, o) {

        if (o.frame > 10) o.status = 0; //時間が来たら消す。

        o.frame++;

        return o.sc_move();
    }
}
