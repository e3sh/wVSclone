﻿// シナリオ
//　scenario processor version Javascript
//　各オブジェクトの行動を指定するリスト。

//敵の弾の動きについてのシナリオ
function sce_en_bullet_homing(flag) {
    //　自機を目標にしてのホーミング移動(誘導弾）
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        o.vset(2);
        o.get_target(98);
        o.lifecount = 0;

        //o.mp = 45;
        //o.cancelcol = flag;
        o.cancelcol = false;
        o.display_size = 1.5;
    }

    this.move = function (scrn, o) {

        switch (o.frame) {
            case 10:
                o.target_rotate_r(15);

                //if (o.vector > 180) { o.mp = 5; } else { o.mp = 4; }

                o.vset(4);
                break;
            case 15:
                //o.get_target( 98 );
                o.frame = 9;
                break;
            default:
                break;
        }
        o.frame++;

        o.lifecount++;
        
        if (o.cancelcol) this.mapCollision = false;

        return o.sc_move();
    }
}

function sce_en_bullet_random() {
    //　ランダムでのばら撒き弾(出現後ランダム左右50度に角度を変える。
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        let num = Math.floor(Math.random() * 50) - 25;
        o.vector = (o.vector + num + 360) % 360;
        o.vset(4);
    }

    this.move = function (scrn, o) {

        return o.sc_move();
    }
}

function sce_en_bullet_accel() {
    //減速加速する弾のパターン
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        o.vset(4);
    }

    this.move = function (scrn, o) {

        switch (o.frame) {
            case 15:
                o.vx /= 2;
                o.vy /= 2;
                break;
            case 23:
                o.vx /= 2;
                o.vy /= 2;
                break;
            case 30:
                o.vx /= 2;
                o.vy /= 2;
                break;
            case 90:
                o.vset(6);
                break;
            default:
                break;
        };
        o.frame++;

        return o.sc_move();
    }
}

function sce_en_bullet_hominglaser() {
    //敵用ホーミングレーザー
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        //	o.vector = 0;
        //        o.vector = (o.vector > 180) ? o.vector - 45 : o.vector + 45;
        o.vset(3);
        o.get_target(98);

        //o.display_size = 2.0;
        o.display_size = 2.0;
        //o.alpha = 128;

        //	o.mp = 4;

        o.w_cnt = 15;
        //        o.normal_draw_enable = false;
        //        o.custom_draw_enable = true;
    }

    this.move = function (scrn, o) {

        switch (o.w_cnt) {
            case 25:
                //				o.vector = o.target_r( o.target.x, o.target.y);
                break;
            case 26:
                //if (o.frame > 90) o.get_target(2);

                if (o.frame < 180) o.target_rotate_r(15 + ((o.frame < 20) ? 15 : 0));
                o.vset(3 + ((o.frame > 40) ? 1 : 0) + ((o.frame > 50) ? 1 : 0));
                break;
            case 30:
                o.w_cnt = 22;
                break;
            default:
                break;
        };

        //if (o.frame%5==0)o.set_object_ex(32, o.x, o.y, o.vector, 56);
        if (o.frame == 0)o.set_object_ex(32, o.x, o.y, o.vector, 56);

        o.w_cnt++
        o.frame++;

        return o.sc_move();
    }
}

function sce_en_bullet_infolaser() {

    //予告レーザー
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        o.vset(0);

        o.msf = false;

        o.display_size = 2.0;
        o.alpha = 0;
        //        o.get_target(98);

        //        o.normal_draw_enable = false;
        //        o.custom_draw_enable = true;
    }

    this.move = function (scrn, o) {

        switch (o.frame) {
            case 0:
                o.normal_draw_enable = false;
                o.custom_draw_enable = true;
                //o.set_object_ex(32, o.x + o.vx, o.y + o.vy, o.vector, 56);
                //break;
            case 44:
                o.set_object_ex(32, o.x + o.vx, o.y + o.vy, o.vector, 56);
                break;
            case 45:
                o.normal_draw_enable = true;
                o.custom_draw_enable = false;
                o.vset(10);
                //o.msf = true;
                break;
            default:
                break;
        };

        if (o.msf) {
            //for (let i = 1; i <= 5; i++) {
                //o.vset(12);
                
                //o.vset(12 * i);
                //o.set_object_ex(32, o.x + o.vx, o.y + o.vy, o.vector, 56);
            //}
            //o.msf = false;
        }
        o.frame++;

        return o.sc_move();
    }
    this.draw = function (scrn, o) {

        //    scrn.putchr8c("47s", o.x, o.y, 3);

        let cl = {};
        let w = o.gt.worldtoView(o.x, o.y);
        
        cl.x = w.x;
        cl.y = w.y;

        o.vset(800);

        cl.tx = w.x + o.vx;
        cl.ty = w.y + o.vy;

        o.vset(0);

        cl.alpha = o.frame / 30;

        cl.alpha = (cl.alpha > 1.0) ? 1.0 : cl.alpha;

        cl.draw = function (device) {
            device.beginPath();

            device.moveTo(this.x, this.y);
            device.lineTo(this.tx, this.ty);
            //            device.strokeStyle = "rgb(255*cl.alpha , 0, 0)";
            device.lineWidth = "2";
            device.strokeStyle = "rgba( 255, 192, 128," + cl.alpha + ")";
            //            device.strokeStyle = 'rgb(255*cl.alpha , 0, 0)';

            device.stroke();
        }
        scrn.putFunc(cl);
    }
}

function sce_en_bullet_turn() {

    //その場でぐるぐる回ってしばらくしたら目標に向かって飛んでいく
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        o.vset(0);
        o.get_target(98);
    }

    this.move = function (scrn, o) {
        /*
        if (o.frame < 60) {
        o.vector = (o.vector + 24) % 360;
        };
        */
        if (o.frame == 60) {
            o.vector = o.target_v();

            //o.vector = Math.floor(o.vector);//o.target_v());

            o.vset(8);
        };

        o.frame++;

        return o.sc_move();
    }
}

function sce_en_bullet_laser_tail() {
    //Laser尻尾(敵用）
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        o.vset(0);
        o.display_size = 1.5;
        
        o.old_x = o.x;
        o.old_y = o.y;

        o.op = {
            ptr: 0,
            x: Array(5),
            y: Array(5),
            r: Array(5)
        }

        let op = o.op;

        op.ptr = 0;
        op.x.fill(o.x);
        op.y.fill(o.y);
        op.r.fill(0);

        o.cf = false;
    }

    this.move = function (scrn, o) {
        /*
        if ((o.frame > 5)&&!o.cf) {
            o.set_object_ex(32, o.x + o.vx, o.y + o.vy, o.vector, 56);//o.status = 0; //時間が来たら消す。
            o.cf = true;
        }
        */
        //親がいなくなったら消滅
        
        if (!Boolean(o.parent)) o.status = 0;//return 1; 
        if (o.parent.status == 0) o.status = 0;//return 1;　
        
        if (o.frame > 150) o.status = 0; //時間が来たら消す。3s
        if (o.alive > 2500) o.status = 0; //時間が来たら消す。3s
                
        o.frame+= o.vecfrm;

        let p = o.parent;

        //o.display_size = 1.0 + o.alive / 6000;
        //if (o.alive > 1500) o.display_size = 1.0 + (3000 - o.alive )/3000; 

        let op = o.op;

        op.x[op.ptr] = p.x;
        op.y[op.ptr] = p.y;
        o.vector = p.vector;
     
        op.ptr++;
        op.ptr = op.ptr % op.x.length; 
        
        o.old_x = o.x;
        o.old_y = o.y;

        o.x = op.x[op.ptr];
        o.y = op.y[op.ptr];

        if ((o.frame > 1)&&!o.cf) {
            o.set_object_ex(32, o.x + o.vx, o.y + o.vy, o.vector, 56);
            //o.set_object(3);
            o.cf = true;
        }
        if (o.status == 0) {
            if (o.alive > 1800){
                o.set_object(3);
            }
        }

        f = 0;
        if (o.status == 0) f = 1; //未使用ステータスの場合は削除

        //return f;
                return o.sc_move();
    }

}