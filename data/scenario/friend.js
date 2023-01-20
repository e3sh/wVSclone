// シナリオ
//　scenario processor version Javascript
//　各オブジェクトの行動を指定するリスト。
//
//支援機（オプション）の動作に関するシナリオ
/*
function sce_friend_rotate() {
    //　味方（支援機）の動作(rotation) 右回転
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        //o.vector = Math.floor(Math.random() * 360);
        o.vset(0);
        o.get_target(98);
        o.startflag = true;
        //o.shot = 0;
        //o.triger = 0;

        o.startv = (o.vector + 315) % 360;
        //o.endv = (o.vector + 45) % 360;
        o.vector = o.startv;
        o.x += o.Cos(o.vector) * 35;
        o.y += o.Sin(o.vector) * 35;

        o.rotatecount = 0;

        o.attack = 1;
    }

    this.move = function (scrn, o) {

        //if (!o.config.option) o.status = 0;

        var f = 0;

        if (o.startflag) {
            o.get_target(98);
            o.startflag = false;
            return 0;
        }

        if (Boolean(o.target)) {
            if (o.target.type != 98) {//ターゲットが自機じゃなくなった場合
                if (o.startflag) {
                    o.get_target(98);
                    o.startflag = false;
                } else {
                    o.change_sce(7);
                    return 1;
                }
            }
        } else {
            o.change_sce(7);
            return 1;
        }
        
        if (o.damageflag) {
            o.set_object_ex(6, o.x + o.Cos(o.vector) * 40, o.y + o.Sin(o.vector) * 40, o.vector, "effect_hit");

            o.damageflag = false;
        }

        o.rotatecount++;
        if (o.rotatecount > 10) {
            o.vector = (o.target.vector + 315) % 360;
            o.rotatecount = 0;
            o.status = 0;
        }

        o.x = o.target.x + o.Cos(o.vector) * 35;
        o.y = o.target.y + o.Sin(o.vector) * 35;

        o.vector = (o.vector + 9) % 360;

        if (o.status == 0) f = 1; //未使用ステータスの場合は削除

        return f;
    }
}
*/
function sce_friend_start() {
    //　味方（支援機）の発進
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        o.vset(0);
    }

    this.move = function (scrn, o) {

        if (!o.config.option) o.status = 0;

        o.hp = 10;

        switch (o.frame) {
            case 30:
                o.vector = 180;
             //   o.vset(4);
                o.get_target(98);
                break;
            case 58:
                //				o.get_target( 98 );
            case 59:
                //	o.status = 0;
                o.vector = o.target_v(); //o.vector = o.target_r(o.target.x, o.target.y);
                //	        	o.vset( 1 );
            case 60:
                o.vset(0);
                o.change_sce(21);
                break;
            default:
                break;
        };
        o.frame++;

        return o.sc_move();
    }

}

function sce_friend_sidearm() {
    //支援機の動作２
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        //		o.vector = Math.floor(Math.random() * 360 );
        o.vset(0);
        o.triger = 15;
        //		o.get_target( 98 );
        o.m_trig = 0;

        o.frame = 60;
    }

    this.move = function (scrn, o) {

        if (!o.config.option) o.status = 0;

        var wr = o.vector;
//        wr = (wr > 180) ? wr + 70 : wr - 70;
        o.triger--;
        if (o.triger <= 0) {
            o.shot = 0;
            o.triger = 0;
        }

        var powup = 0;
        for (var i in o.item) {
            if (i == 7) {
                powup = o.item[i];
            }
        }

        if (powup < 10) { o.mp = 15; } else { o.mp = 24; }  

        if (eval(o.mouse_state.button) == 0) {
            if (o.shot == 0) {
                o.shot = 1;

                if (((powup >= 3) && (powup <= 4)) || (powup >= 8)) {
                    o.set_object_ex(6, o.x, o.y, (o.vector > 180) ? o.vector + 87 : o.vector - 87, 13);
                }

                o.m_trig = 1 - o.m_trig;
                //                o.set_object_ex(20, o.x, o.y, 0, 42, "test:"+o.m_trig);
                if (powup >= 5) {
                    if (o.m_trig == 0) o.set_object(13);
                }

                if (o.frame > 45) {
                    if (powup >= 10) {
                        o.set_object(23);
                        o.frame = 0;
                    }
                }

                o.triger = 15;
                if (powup >= 7) o.triger = 5;
            }
            //	        wr = (wr > 180) ? wr + 60 : wr - 60;
            //	o.vset( 5 );
            wr = o.vector
        }

        var f = 0;

        if (o.target.type != 98) {//ターゲットが自機じゃなくなった場合
            o.change_sce(7);
        }

        //        this.add_score(this.score);

        if (this.status == 0) f = 1; //未使用ステータスの場合は削除

        o.x = o.target.x + Math.cos((wr - 90) * (Math.PI / 180.0)) * 32;
        o.y = o.target.y + Math.sin((wr - 90) * (Math.PI / 180.0)) * 32;

        //		o.vector = (o.vector + 12 + 360) % 360;

        o.frame++;

        return f;
    }
}

function sce_friend_straight() {
    //　味方（支援機）の動作(rotation) まっすぐ抜き差し
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        o.vset(0);
        //o.get_target(98);
        o.startflag = true;

        o.x += o.Cos(o.vector) * 35;
        o.y += o.Sin(o.vector) * 35;

        o.shotcount = 0;

        //o.attack = 1;
    }

    this.move = function (scrn, o) {

        var f = 0;
        /*
        if (o.startflag) {
            o.get_target(98);
            o.startflag = false;
            return 0;
        }
        */
        if (!Boolean(o.parent)) {
            o.change_sce(7);
            return 1;
        }
        /*
        if (o.target.type != 98) {//ターゲットが自機じゃなくなった場合
            if (o.startflag) {
                o.get_target(98);
                o.startflag = false;
            } else {
                o.change_sce(7);
            }
        }
        */
        if (o.damageflag) {
            //o.set_object_ex(6, o.x + o.Cos(o.vector) * 40, o.y + o.Sin(o.vector) * 40, o.vector, "effect_hit");

            o.damageflag = false;
        }

        o.shotcount++;
        if (o.shotcount > 10) {
            o.vector = (o.parent.vector + 315) % 360;
            o.shotcount = 0;
            o.status = 0;
        }

        var r = Math.abs(o.shotcount - 5);

        o.x = o.parent.x + o.Cos(o.vector) * (50 - r) ;
        o.y = o.parent.y + o.Sin(o.vector) * (50 - r) ;

        if (o.status == 0) f = 1; //未使用ステータスの場合は削除

        return f;
    }
}

function sce_friend_boom() {
    //　味方（支援機）の動作/ブーメラン
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        o.vset(4);
        o.get_target(o.parent.type);//消したらバグる。
        o.startflag = true;

        o.x += o.Cos(o.vector) * 35;
        o.y += o.Sin(o.vector) * 35;

        o.shotcount = 0;

        o.bup_vector = o.vector;

        //o.attack = 1;
    }

    this.move = function (scrn, o) {

        o.vector = o.bup_vector;

        var f = 0;
        /*
        if (o.startflag) {
            //o.get_target(98);
            o.startflag = false;
            return 0;
        }
        */
        if (!Boolean(o.parent)) {
            o.change_sce(7);
            return 1;
        }
        /*
        if (o.target.type != 98) {//ターゲットが自機じゃなくなった場合
            if (o.startflag) {
                o.get_target(98);
                o.startflag = false;
            } else {
                o.change_sce(7);
            }
        }
        */
        if (o.damageflag) {
            //o.set_object_ex(6, o.x + o.Cos(o.vector) * 40, o.y + o.Sin(o.vector) * 40, o.vector, "effect_hit");

            o.damageflag = false;
            o.status = 2;
            //f = 1; //敵にダメージで消滅
        }

        o.shotcount++;
        if (o.shotcount > 30) {
            //o.target_rotate_r(45);
            o.vector = o.target_v(o.parent.x, o.parent.y);

        }
        o.vset(4);

        o.bup_vector = o.vector;

        if ((o.target_d(o.parent.x, o.parent.y) < 24) || (o.shotcount > 180)) {
            o.status = 0;
        }

        o.vector = (o.shotcount * 5) % 360;

        o.x += o.vx;
        o.y += o.vy;

        if (o.status == 0) f = 1; //未使用ステータスの場合は削除

        if (o.states == 2) f = 1;//敵にダメージで消滅
        return f;
    }
}

//支援機（オプション）の動作に関するシナリオ
function sce_friend_rotate_full() {
    //　味方（支援機）の動作(rotation) 左右回転(axe用?）
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        o.vset(0);

        o.x += o.Cos(o.vector) * 35;
        o.y += o.Sin(o.vector) * 35;

        o.rotatecount = 0;

        //o.attack = 2;

        o.startv = o.vector;
        o.leftrotate = (o.vector > 179)? true : false;
    }

    this.move = function (scrn, o) {

        var f = 0;

        if (!Boolean(o.parent)) {
            o.change_sce(7);
            return 1;
        }

        if (o.damageflag) {
            //o.set_object_ex(6, o.x + o.Cos(o.vector) * 40, o.y + o.Sin(o.vector) * 40, o.vector, "effect_hit");

            o.damageflag = false;
        }

        o.rotatecount++;
        if (o.rotatecount > 20) {
            o.rotatecount = 0;
            o.status = 0;
        }
        if (o.leftrotate) {
            o.vector = (o.startv + (360 - (o.rotatecount * 18)))%360;
        } else {
            o.vector = (o.startv + (o.rotatecount * 18))%360;
        }

        o.x = o.parent.x + o.Cos(o.vector) * 35;
        o.y = o.parent.y + o.Sin(o.vector) * 35;

        if (o.status == 0) f = 1; //未使用ステータスの場合は削除

        return f;
    }
}

function sce_friend_rotate() {
    //　味方（支援機）の動作(rotation) 左右回転　4分の1(sword/wand)
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        //o.vector = Math.floor(Math.random() * 360);
        o.vset(0);

        o.leftrotate = (o.vector > 179)? true : false;
        if (o.leftrotate){
            o.startv = (o.vector + 60 ) % 360;
        }else{
            o.startv = (360 + (o.vector - 60)) % 360;
        }

        o.x += o.Cos(o.vector) * 35;
        o.y += o.Sin(o.vector) * 35;

        o.rotatecount = 0;

        //o.attack = 1;
    }

    this.move = function (scrn, o) {

        //if (!o.config.option) o.status = 0;

        var f = 0;

        if (!Boolean(o.parent)) {
            o.change_sce(7);
            return 1;
        }
        
        if (o.damageflag) {
            //o.set_object_ex(6, o.x + o.Cos(o.vector) * 40, o.y + o.Sin(o.vector) * 40, o.vector, "effect_hit");

            o.damageflag = false;
        }

        o.rotatecount++;
        if (o.rotatecount > 10) {
            o.rotatecount = 0;
            o.status = 0;
        }
        if (o.leftrotate) {
            o.vector = o.startv - (o.rotatecount * 12);
        } else {
            o.vector = (o.startv + (o.rotatecount * 12))%360;
        }

        o.x = o.parent.x + o.Cos(o.vector) * 35;
        o.y = o.parent.y + o.Sin(o.vector) * 35;

        if (o.status == 0) f = 1; //未使用ステータスの場合は削除

        return f;
    }
}