// シナリオ
//　scenario processor version Javascript
//　各オブジェクトの行動を指定するリスト。
//
//支援機（オプション）の動作に関するシナリオ

function sce_friend_straight() {
    //　味方（支援機）の動作(rotation) まっすぐ抜き差し
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        o.vset(0);
        //o.get_target(98);
        o.startflag = true;

        let v;
        if (o.parent.type == 98){
            v = o.parent.turlet.vector();
        }else{
            v = o.parent.vector;    
        }
        o.vector = v;

        o.x += o.Cos(o.vector) * 50;
        o.y += o.Sin(o.vector) * 50;//35;

        o.shotcount = 0;

        //o.attack = 1;
    }

    this.move = function (scrn, o) {

        let f = 0;
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
        
        o.shotcount+= o.vecfrm;
        let v;
        if (o.parent.type == 98){
            v = o.parent.turlet.vector();
        }else{
            v = o.parent.vector;    
        }
        if (o.shotcount > 10) {
            o.vector = (v + 315) % 360;
            o.shotcount = 0;
            o.status = 0;
        }else{
            o.vector = v;
        }

        let r = Math.abs(o.shotcount - 5);

        o.x = o.parent.x + o.Cos(o.vector) * (50 - r) - o.Cos(o.vector) * r * 10 * (o.parent.spec.LV);
        o.y = o.parent.y + o.parent.shifty + o.Sin(o.vector) * (50 - r) - o.Sin(o.vector) * r * 10 * (o.parent.spec.LV);

        if (o.status == 0) f = 1; //未使用ステータスの場合は削除

        return f;
    }
}

function sce_friend_boom() {
    //　味方（支援機）の動作/ブーメラン
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        o.vset(6);
        o.get_target(o.parent.type);//消したらバグる。
        o.startflag = true;

        o.x += o.Cos(o.vector) * 35;
        o.y += o.Sin(o.vector) * 26;//35;

        o.shotcount = 0;

        o.bup_vector = o.vector;

        //o.attack = 1;
    }

    this.move = function (scrn, o) {

        o.vector = o.bup_vector;

        let f = 0;
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
            //o.status = 2;
            //f = 1; //敵にダメージで消滅
        }

        
        o.shotcount+= o.vecfrm;
        if (o.shotcount > 20) {
            //o.vset(3)
            if (o.shotcount < 120) o.target_rotate_r(8);
            //o.vector = o.target_v(o.parent.x, o.parent.y);
            //o.vector = o.target_v(o.parent.x, o.parent.y);

        }
        
        o.vset(6);
        //if (o.shotcount < 20) o.vset(7);

        o.bup_vector = o.vector;

        if ((o.target_d(o.parent.x, o.parent.y) < 18) || (o.shotcount > 300)) {
            o.parent.triger = 5;
            o.parent.autotrig = 5;

            o.status = 0;
        }

        o.vector = (o.shotcount * 5) % 360;

        o.x += o.vx * o.vecfrm;;
        o.y += o.vy * o.vecfrm;;

        if (o.status == 0) f = 1; //未使用ステータスの場合は削除

        //if (o.states == 2) f = 1;//敵にダメージで消滅

        if (o.shotcount > 180) return o.sc_move();
        return f;
    }
}

//支援機（オプション）の動作に関するシナリオ
function sce_friend_rotate_full() {
    //　味方（支援機）の動作(rotation) 左右回転(axe用?）
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        o.vset(0);

        o.x += o.Cos(o.vector) * 40 * (1 + o.parent.spec.LV * 0.3);//35;
        o.y += o.Sin(o.vector) * 20 * (1 + o.parent.spec.LV * 0.3);//35;

        o.rotatecount = 0;

        //o.attack = 2;

        o.startv = o.vector;
        o.leftrotate = (o.vector > 179)? true : false;
    }

    this.move = function (scrn, o) {

        let f = 0;

        if (!Boolean(o.parent)) {
            o.change_sce(7);
            return 1;
        }

        if (o.damageflag) {
            //o.set_object_ex(6, o.x + o.Cos(o.vector) * 40, o.y + o.Sin(o.vector) * 40, o.vector, "effect_hit");

            o.damageflag = false;
        }

        o.rotatecount+= o.vecfrm;
        if (o.rotatecount > 20) {
            o.rotatecount = 0;
            o.status = 0;
        }
        if (o.leftrotate) {
            o.vector = (o.startv + (360 - (o.rotatecount * 18)))%360;
        } else {
            o.vector = (o.startv + (o.rotatecount * 18))%360;
        }

        o.x = o.parent.x + o.Cos(o.vector) * 40 * (1 + o.parent.spec.LV * 0.3);//35;
        o.y = o.parent.y + o.parent.shifty + o.Sin(o.vector) * 20 * (1 + o.parent.spec.LV * 0.3);//35;

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

        o.x += o.Cos(o.vector) * 35 * (1 + o.parent.spec.LV * 0.3);
        o.y += o.Sin(o.vector) * 26 * (1 + o.parent.spec.LV * 0.3);//35;

        o.rotatecount = 0;

        //o.attack = 1;
    }

    this.move = function (scrn, o) {

        //if (!o.config.option) o.status = 0;

        let f = 0;

        if (!Boolean(o.parent)) {
            o.change_sce(7);
            return 1;
        }
        
        if (o.damageflag) {
            //o.set_object_ex(6, o.x + o.Cos(o.vector) * 40, o.y + o.Sin(o.vector) * 40, o.vector, "effect_hit");

            o.damageflag = false;
        }

        o.rotatecount+= o.vecfrm;;
        if (o.rotatecount > 10) {
            o.rotatecount = 0;
            o.status = 0;
        }
        if (o.leftrotate) {
            o.vector = o.startv - (o.rotatecount * 12);
        } else {
            o.vector = (o.startv + (o.rotatecount * 12))%360;
        }

        o.x = o.parent.x + o.Cos(o.vector) * 35 * (1 + o.parent.spec.LV * 0.3);
        o.y = o.parent.y + o.parent.shifty + o.Sin(o.vector) * 26 * (1 + o.parent.spec.LV * 0.3);//35;

        if (o.status == 0) f = 1; //未使用ステータスの場合は削除

        return f;
    }
}

function sce_friend_front() {
    //　味方（支援機）の動作 前で停滞
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        o.vset(0);
        o.startflag = true;

        if (o.parent.type == 98){
            o.vector = o.parent.turlet.vector();
        }else{
            o.vector = o.parent.vector;    
        }
        o.x += o.Cos(o.vector) * 35;
        o.y += o.Sin(o.vector) * 35;

        o.shotcount = 0;
    }

    this.move = function (scrn, o) {

        let f = 0;
        if (!Boolean(o.parent)) {
            o.change_sce(6);
            return 1;
        }

        if (o.damageflag) {
            o.damageflag = false;
        }

        o.shotcount+= o.vecfrm;
        if (o.shotcount > 20) {
            o.shotcount = 0;
            o.status = 0;
        }

        if (o.parent.type == 98){
            o.vector = o.parent.turlet.vector();
        }else{
            o.vector = o.parent.vector;    
        }

        o.x = o.parent.x + o.Cos(o.vector) * (35 - o.shotcount/2);
        o.y = o.parent.y + o.parent.shifty + o.Sin(o.vector) * (35 - o.shotcount/2) ;

        if (o.status == 0) f = 1; //未使用ステータスの場合は削除

        return f;
    }

    function sce_friend_rotate_circle() {
        //　味方（支援機）の動作(rotation) 回転(Ball用）(player_bulletに同様のものを作るため未使用)2024/4/2
        //-----------------------------------------------------------------------
        RSPEED = 5;

        this.init = function (scrn, o) {
            o.vset(0);
    
            o.x += o.Cos(o.vector) * 20;
            o.y += o.Sin(o.vector) * 20;
    
            o.rotatecount = 0;
    
            o.startv = o.vector;
            o.leftrotate = (o.vector > 179)? true : false;
        }
    
        this.move = function (scrn, o) {
    
            let f = 0;
    
            if (!Boolean(o.parent)) {
                o.change_sce(7);
                return 1;
            }
    
            if (o.damageflag) {
                o.damageflag = false;
            }
    
            o.rotatecount+= o.vecfrm;
            o.rotatecount = o.rotatecount%(360/RSPEED);

            if (o.leftrotate) {
                o.vector = (o.startv + (360 - (o.rotatecount * RSPEED)))%360;
            } else {
                o.vector = (o.startv + (o.rotatecount * RSPEED))%360;
            }
    
            o.x = o.parent.x + o.Cos(o.vector) * 20;
            o.y = o.parent.y + o.parent.shifty + o.Sin(o.vector) * 20;
    
            if (o.status == 0){
                o.parent.w_repro = false;//親の使用中フラグをリセット
                f = 1; //未使用ステータスの場合は削除  
            } 
    
            return f;
        }
    }
      
}