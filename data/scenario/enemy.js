// シナリオ
//　scenario processor version Javascript
//　各オブジェクトの行動を指定するリスト。

//敵の動作シナリオ（ボスは別ファイル）
function sce_ememy_move_n(num1, num2) {
    //　出現後、まっすぐ進んだ後向き変更してしばらく後にさらに向き変更する
    //　途中でいろいろ弾打ったりするパターン　　
    //-----------------------------------------------------------------------

    this.init = function (scrn, o) {
        o.vset(1);

        o.pickgetf = false;
        o.pickviewitem = 0;

        o.custom_draw_enable = true;
    }

    this.draw = sce_enemy_inv_gr;

    this.move = function (scrn, o) {

        switch (o.frame) {
            case 80:
                o.get_target(98);
                break;
            case 90:
                //				o.vector = o.target_r( o.target.x, o.target.y );
                break;
            case 100:
                o.vector = o.target_v(); //o.vector = o.target_r( o.target.x, o.target.y );
                o.set_object(103);
                break;
            case 110:
                o.set_object(3);
                break;
            case 120:
                //o.set_object(4);
                o.vector += num1;
                o.vector = o.vector % 360;
                o.vset(1);
                break;
            case 140:
                //inventry check
                var f = sce_enemy_inv_check(o.pick);
                if (f != 0 ){
                    o.pickgetf = true;
                    o.pickviewitem = f;
                } 
                //    o.set_object(103);
                break;
            case 160:
                o.vector = +num1;
                o.vector = o.vector % 360;
                o.vset(1);
                break;
            case 200:
                o.vector = +num1;
                o.vector = o.vector % 360;
                o.vset(1);
                o.frame = 50;
                break;
            default:
                break;
        }
        o.frame++;
        //o.frame++; //frame rate *2

        return o.sc_move();
    }
}

function sce_ememy_turn( num ){
    //　回りながら移動する敵の動き、途中弾撃つ
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        o.vset(4);

        o.pickgetf = false;
        o.pickviewitem = 0;

        o.custom_draw_enable = true;
    }

    this.draw = sce_enemy_inv_gr;

    this.move = function (scrn, o) {

        switch (o.frame) {
            case 5:
//                o.set_object(3);
                o.set_object_ex(3, o.x, o.y, o.vector + Math.floor(Math.random() * 40) - 20, "exev_5expansion");
                break;
            case 15:
                o.vector += num;
                o.vset(4);
                break;
            case 25:
                o.vector += num;
                o.vset(4);
                break;
            case 35:
                o.vector += num;
                o.vset(4);
                break;
            case 45:
                o.frame = 1;
                //inventry check
                var f = sce_enemy_inv_check(o.pick);
                if (f != 0 ){
                    o.pickgetf = true;
                    o.pickviewitem = f;
                }
                break;
            default:
                break;
        }
        o.frame++;

        return o.sc_move();
    }
}

function sce_ememy_change_s() {
    //　まっすぐ下に降りて来ながらExevent1番実行した後、0.5秒後シナリオを9に変更
    //　ほぼ動作テスト用
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        o.vset(4);
        o.vector = 180;
    }

    this.move = function (scrn, o) {

        if (o.frame == 15) {
            o.set_object(102);
            o.change_sce(9);
        }
        o.frame++;

        return o.sc_move();

    }
}

function sce_ememy_moveshot() {

    //移動しながら定期的に弾をばら撒いていく（その１）
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        o.vset(4);

        o.pickgetf = false;
        o.pickviewitem = 0;
    
        o.custom_draw_enable = true;
    }

    this.draw = sce_enemy_inv_gr;

    this.move = function (scrn, o) {

        o.vset(4);

        if (o.vector > 180) { o.mp = 5; } else { o.mp = 4; }

        if (o.frame % 50 == 5) {
            //inventry check
            var f = sce_enemy_inv_check(o.pick);
            if (f != 0 ){
                o.pickgetf = true;
                o.pickviewitem = f;
            }
            //            o.set_object(12);
            if (o.frame > 3600) {
                o.set_object_ex(8, o.x, o.y, o.vector, "en_bullet_homing");
            } else {
                o.set_object_ex(5, o.x, o.y, o.vector, "en_bullet_turn");
            }
        }
        o.frame++;

        return o.sc_move();
    }
}

function sce_ememy_randomshot() {
    // ランダム弾用母機
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        o.vset(4);
        o.w_cnt = 0;

        o.display_size = 1.5;

        o.hit_x *= 1.5;
        o.hit_y *= 1.5;

        o.hp = 20;

        o.pickgetf = false;
        o.pickviewitem = 0;

        o.custom_draw_enable = true;
    }

    this.draw = sce_enemy_inv_gr;

    this.move = function (scrn, o) {

        if (o.vector > 180) { o.mp = 5; } else { o.mp = 4; }

        switch (o.frame) {
            case 10:
                o.vset(0);
                break;
            case 13:
                o.set_object(12);
                break;
            case 30:
                o.frame = 12;
                o.w_cnt++;
                break;
            default:
                break;
        };
        o.frame++;

        if (o.w_cnt > 5) {
            o.w_cnt = 0;
            //			o.vector = 170 + Math.floor( Math.random() * 20 );
            o.vset(2);
            o.frame = 0;

            //inventry check
            var f = sce_enemy_inv_check(o.pick);
            if (f != 0 ){
                o.pickgetf = true;
                o.pickviewitem = f;
            }    
        }

        if (o.jump == 1 ) {
            o.shifty = o.shifty + o.jpvec;
            o.jpvec = o.jpvec + 0.4;
            o.prioritySurface = true;

            o.mapCollision = false;
            if (o.shifty > 0){
                o.jump = 0;
                o.shifty = 0;
                o.prioritySurface = false;
                o.colcheck = true;

                o.vset(2);
                o.vector = Math.floor(Math.random() * 360);//適当な向きに飛ぶ

                o.wmapc = false;
            }            
            return o.sc_move();
        }
        if (o.vector > 180) { o.mp = 5; } else { o.mp = 4; }

        if (o.mapCollision) {
            if (o.colcnt > 1) {//連続衝突するとジャンプして回避してみる
                o.wmapc = true;
                speed = 2;

                o.jump = 1;
                o.jpvec = -6.0;
                o.colcheck = false;

                o.vector = Math.floor(Math.random() * 360);//適当な向きに飛ぶ
                o.vset(speed);
                //o.wmapc = true;
            } else { 
                o.colcheck = true;
            }
        }
        return o.sc_move();
    }
}

function sce_ememy_move_std(){
    //　出現後、まっすぐ進んだ後ぶつかったら向き変更
    //-----------------------------------------------------------------------

    this.init = function (scrn, o) {
        o.vset(2);
        o.wmapc = false;
        o.colcnt = 0;
    }

    this.move = function (scrn, o) {
        o.frame++;

        if (o.jump == 1 ) {
            o.shifty = o.shifty + o.jpvec;
            o.jpvec = o.jpvec + 0.4;
            o.prioritySurface = true;

            o.mapCollision = false;
            if (o.shifty > 0){
                o.jump = 0;
                o.shifty = 0;
                o.prioritySurface = false;
                o.colcheck = true;

                o.vset(2);
                o.vector = Math.floor(Math.random() * 360);//適当な向きに飛ぶ

                o.wmapc = false;
            }            
            return o.sc_move();
        }

        if (o.wmapc) {
            var v = (Math.floor(Math.random() * 2) == 0) ? 1 : 3;
            //o.vector = v;

            o.wmapc = false;

            o.vector += v*90;
            o.vector = o.vector % 360;

            o.vset(2);

            //o.colcnt = 0;
        }

        if (o.vector > 180) { o.mp = 5; } else { o.mp = 4; }

        if (o.mapCollision) {
            if (o.colcnt > 1) {//連続衝突するとジャンプして回避してみる
                o.wmapc = true;
                speed = 2;

                o.jump = 1;
                o.jpvec = -6.0;
                o.colcheck = false;

                o.vector = Math.floor(Math.random() * 360);//適当な向きに飛ぶ
                o.vset(speed);
                //o.wmapc = true;
            } else { 
                o.colcheck = true;
            }
        }

        /*
        if (o.frame > 90 + Math.floor(Math.random() * 4) * 60) {
        o.frame = 0;
        }
        */

        return o.sc_move();
    }
}

function sce_ememy_move_std2() {
    //　自機を追跡してくるパターン。
    //　60F毎に向き変更。iteminv_view 2023/1/14
    //-----------------------------------------------------------------------

    this.init = function (scrn, o) {
        o.vset(2);
        o.wmapc = false; //衝突連続状態
        o.colcnt = 0;  //衝突状態カウント
        o.lockon_flag = false; //追跡状態
        //o.growf = true; //出現した状態　20flameでfalse

        o.colcheck = true;

        o.get_target(98);

       // o.pick_enable = false;
       o.autotrig = 10;
       o.autoshot = 0;
       o.weapongetf = false;
       o.weapontype = 0;

       o.jump = 0;
       o.jpvec = -5.0;

       o.shiftx = 0;
       o.shifty = 0;

       o.mvkeytrig = 0;        
       o.maxspeed = 2;

       o.pickgetf = false; //何か持っているか?
       o.pickviewitem = 0;
       
       o.display_size = 1.0;

       o.custom_draw_enable = true;
    }

    this.draw = sce_enemy_inv_gr;

    this.move = function (scrn, o) {
        o.frame++;

        if (o.jump == 1 ) {
            o.shifty = o.shifty + o.jpvec;
            o.jpvec = o.jpvec + 0.4;
            o.prioritySurface = true;
            if (o.shifty > 0){
                o.jump = 0;
                o.shifty = 0;
                o.prioritySurface = false;
                o.colcheck = true;

                o.wmapc = false;
            }            
            return o.sc_move();
        }

        var speed = 0;

        //if (o.growf) {
        //    if (o.mapCollision) o.mapCollision = false; ;
        //}

        if (Boolean(o.target)) {//target(自機が存在している場合)一定距離だとロックオン
        //    if (o.target_d(o.target.x, o.target.y) < 300) { o.lockon_flag = true; }  
            o.lockon_flag = (o.target_d(o.target.x, o.target.y) < 240)? true :false ; 
        }

        if (!o.wmapc) {
            o.mvkeytrig = (o.mvkeytrig++ > 30)?30 : o.mvkeytrig;
            speed = (o.mvkeytrig/15 > o.maxspeed)? o.maxspeed: o.mvkeytrig/15
        }else{
            o.mvkeytrig = 0;
            //o.mvkeytrig--;
            //o.mvkeytrig = (o.mvkeytrig-- < 0)?0 : o.mvkeytrig;
            //o.wmapc = false;
        }

        if ((o.wmapc) && (o.lockon_flag)) {

            var v = o.target_v();

            var nv = 0;

            for (var i = 45; i < 320; i += 45) {

                if ((v > i - 22.5) && (v <= i + 22.5)) {
                    nv = i;
                }
            }
            o.vector = nv;
            
            o.vset(speed);

            o.wmapc = false;

            //o.colcnt = 0;
        }else{
            //o.vset(maxspeed);
        }

        if (o.vector > 180) { o.mp = 5; } else { o.mp = 4; }

        if (o.mapCollision) {
            //o.colcnt++;
            if (o.colcnt > 1) {//連続衝突するとジャンプして回避してみる
                o.wmapc = true;
                speed = o.maxspeed;

                o.jump = 1;
                o.jpvec = -6.0;
                o.colcheck = false;

                o.vector = Math.floor(Math.random() * 360);//適当な向きに飛ぶ
                o.vset(speed);
                //o.wmapc = true;
            } else { 
                o.colcheck = true;
            }
        }else{
            //o.colcnt = 0;
        }

        o.autotrig--;
        if (o.autotrig <= 0) {
            o.autoshot = 0;
            o.autotrig = 5;
        }

        if (o.lockon_flag) {
            if ((o.autoshot == 0) && (o.weapongetf)) {
                o.autoshot = 1;
                o.autotrig = 30;
                switch (o.weapontype) {
                case 1:
                    o.set_object(41); //sword
                    break;
                case 2:
                    o.set_object(42); //axe
                    break;
                case 3:
                    o.set_object(43); //boom
                    break;
                case 4:
                    o.set_object(44); //spare
                    break;
                case 6:
                    o.set_object(49); //bow and arrow
                    o.set_object(48); //bow and arrow
                    break;
                default:
                    o.set_object(45); //wand
                    break;
                }
            }
        }
        
        if (o.frame > 20) {
            //ロックオン中は20f毎に向き調整
            if (o.lockon_flag) {
                o.target_rotate_r(120);//45);
            }
            o.vset(speed);

            o.frame = 0;
            o.get_target(98);
            
            //inventry check
            var f = sce_enemy_inv_check(o.pick);
            if (f != 0 ){
                o.pickgetf = true;
                o.pickviewitem = f;

                var wt = sce_enemy_weapon_check(f);
                if (wt != 0){
                    o.weapongetf = true;
                    o.weapontype = wt;
                }
            }                
            //o.growf = false;
        }
        /*
        if (o.growf){
            o.display_size = 0.3 + (0.7/(6-(o.frame / 5)));
        }else{
            o.display_size = 1.0;
        }
        */
        //o.growf = false;

        return o.sc_move();
    }
}

function sce_enemy_weapon_check( item ){//アイテムリストが武器かどうかをチェック

    var ITEMLIST = [];

    ITEMLIST[1] = 16; //SWORD
    ITEMLIST[2] = 17; //AXE
    ITEMLIST[3] = 19; //BOOM
    ITEMLIST[4] = 18; //SPEAR
    ITEMLIST[5] = 15; //Wand
    ITEMLIST[6] = 50; //Bow

    //    16, 18, 19, 17, 15, //WEAPONS
    //　item: 15 WAND, 16 SWORD, 17 AXE, 18 SPEAR, 19 BOOM 50:BOw
    //  rc 0 NONE, 1 SWORD, 2 SPARE, 3 BOOM, 4 AXE, 5 WAND, 6 BOW 99 Dummy

    var rc = 0; //nonitem
    
    for (var i of ITEMLIST){ //武器リストと突き合わせ
        if (i == item ){
            rc = ITEMLIST.indexOf(i);
            return rc;
        }
    }
    return rc;
}

function sce_ememy_move_gen_grow(){
    //　ジェネレータから発生して動き出すまでの演出パターン。
    //　add 2023/1/27
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        o.vset(2);
        o.get_target(98);
        o.display_size = 0.3;
        o.colcheck = false;
    }

    this.move = function (scrn, o) {
        o.frame++;
        //o.mapCollision = false; ;

        if (o.vector > 180) { o.mp = 5; } else { o.mp = 4; }

        o.display_size = 0.3 + (0.7 * (o.frame / 20));
        
        if (o.frame > 20) {
            o.colcheck = true;
            o.change_sce("ememy_move_std2"); //出現完了でシナリオを通常に変更
        }

        return o.sc_move();
    }
}

function sce_ememy_generator() {
    //　敵機を吐き出してくるジェネレータ。
    //-----------------------------------------------------------------------

    this.init = function (scrn, o) {
        o.vset(0);
        o.gencnt = 0;
        o.lockon_flag = false;
        o.mp = 31; //絵だけ青ウニュウに
        //o.hit_x = 8;　//重なり対策で当たり判定を小さく
        //o.hit_y = 8;

        o.get_target(98);
        o.hp = 18;
    }

    this.move = function (scrn, o) {
        o.frame++;

        if (Boolean(o.target)) {
            if (o.target_d(o.target.x, o.target.y) < 300) { o.lockon_flag = true; }
        }

        if (o.frame > 120 && o.frame%3==0) {
            //発生予兆
            //o.x = o.old_x + (1 - o.frame%3)*4;
            //o.display_size = 1.0 + (1 - o.frame%6)*0.05;
            o.display_size = 1.0 + ((o.frame-120)/200);

            if (o.frame > 160) o.display_size = 1.05 + (1 - o.frame%6)*0.05;
        }
        if (o.frame > 180) {
            o.display_size = 1.0;
            if (o.gencnt >= 5){ //5匹産んだら移動開始
                o.change_sce("ememy_move_std2");
            }

            if ((o.lockon_flag) && (o.gencnt < 5)) {
                var v = o.target_v();

                o.set_object_ex(1, o.x + o.Cos(v) * 20, o.y + o.Sin(v) * 20, v, 
                //"ememy_move_std2");
                "ememy_move_gen_grow");
                o.gencnt++;
            }
            o.frame = 0;
            o.get_target(98);
            o.vset(0);
        }

        return o.sc_move();
    }
}

function sce_enemy_trbox() {
    //　宝箱用/動かない/当たり判定の都合上、敵にする。(別タイプを設定したら不要）
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        //今の問題点（敵タイプなので誘爆で壊れてしまう）

        o.vset(0);

        o.colcheck = true;
        o.attack = 0;//宝箱から攻撃くらったら困るので0
    }

    this.move = function (scrn, o) {
        var f = 0;

        o.frame++;

        // o.sc_moveを使えないので、（押しても動かさないため）直接記述

        if (this.status == 2) {//状態が衝突の場合
            this.change_sce(7);
            //this.sound.effect(8); //爆発音

            //入ってるアイテムを出す。
            for (var i = 0; i < this.pick.length; i++) {
                this.set_object_ex(this.pick[i], this.x, this.y, Math.floor(Math.random() * 360), "item_movingstop");
            }
            this.add_score(this.score);
        }

        if (this.damageflag) {
            var onst = this.gt.in_view_range(this.x - (this.hit_x / 2), this.y - (this.hit_y / 2), this.hit_x, this.hit_y);
            if (onst) {
                //this.sound.effect(12); //hit音
            }
        }

        if (this.status == 0) f = 1; //未使用ステータスの場合は削除

        // 移動処理はなし、押されても動かない。

        this.damageflag = false;

        return f;
    }
}
//TimeOverEnemy
function sce_ememy_timeover() {
    //　自機を目標にしてのホーミング移動(時間切れ）
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        o.vset(6);
        o.get_target(98);
        o.lifecount = 0;

        //o.cancelcol = flag;
        o.cancelcol = true;
        o.display_size = 2.0;

        o.hit_x *= 2.0;
        o.hit_y *= 2.0;

        o.attack = 10; //攻撃力

        o.pick_enable = false;
    }

    this.move = function (scrn, o) {

        switch (o.frame) {
            case 10:
                o.target_rotate_r(30);

                //if (o.vector > 180) { o.mp = 5; } else { o.mp = 4; }

                o.vset(6);
                break;
            case 15:
                o.get_target(98);
                o.frame = 9;
                break;
            default:
                break;
        }
        o.frame++;

        o.lifecount++;
        if ((o.lifecount % 300) == 250) {
            o.set_object_ex(8, o.x, o.y, o.vector, "en_bullet_homing");
        }

        if (o.cancelcol) this.mapCollision = false;

        return o.sc_move();
    }
}

function sce_enemy_inv_check(pick ){//敵が拾っているアイテムリストのうち1つを返す

    var ITEMLIST = [
        22, 27, 26, 21, //KEY,MAP,LAMP,1UP　
        15, 16, 17, 18, 19, 50, //WEAPONS
        23, 24, 25, //COLORBALLS
        20, //BALL
    //    35,//:COINはPASS
        00
    ];

    var rc = 0; //nonitem
    for (var i of ITEMLIST){ //持っているもののうち、優先順位が高いものを選択
        for (var j of pick) {
            if (i == j ){
               rc = j;
               return rc;
            }
        }
    }
    return rc;
   
    /*
    ENEMY INV CHECK (敵の持ち物チェック）
        (ITEMLIST)  MotionPatternNo. SPDATAName
        15 WAND     MP38    Wand
        16 SWORD    MP15    Knife
        17 AXE      MP37    Axe
        18 SPEAR    MP35    Spear
        19 BOOM     MP36    Boom
        20 BALL     MP26    Ball1-3
        21 1UP      MP 1    Mayura1-4
        22 KEY      MP27    Key
        23 B_BALL   MP28    BallB1-3
        24 S_BALL   MP29    BallS1-3
        25 L_BALL   MP30    BallL1-3
        26 LAMP     MP33    Lamp
        27 MAP      MP34    Map
        (35 COIN)   MP32    Coin1-4
        (40 TRBOX)DISPLAY用 MP39 TrBox
        50 BOW      MP43    Bow
        表示優先順位
        1)KEY　LANP　MAP　1UP
        2)WEAPON全般
        3)COLORBALL
    */
}

function sce_enemy_inv_gr(scrn, o){
    var spname = [];

    if (!o.pickgetf) return;　//アイテム持っていない場合、処理せず。
    if (o.weapongetf && o.lockon_flag) return; //武器使用時表示しない。
  

    spname[15] = "Wand";
    spname[16] = "Knife";
    spname[17] = "Axe";
    spname[18] = "Spear";
    spname[19] = "Boom";
    spname[20] = "Ball1";
    spname[21] = "Mayura1";
    spname[22] = "sKey";
    spname[23] = "BallB1";
    spname[24] = "BallS1";
    spname[25] = "BallL1";
    spname[26] = "Lamp";
    spname[27] = "Map";
    spname[50] = "Bow";
    

    var w = o.gt.worldtoView(o.x, o.y);

    if ((w.x >= 0) && (w.x <= scrn.cw) && (w.y >= 0) && (w.y <= scrn.ch)) {
        //scrn.putchr8("@", w.x, w.y);
        var tx = w.x;
        var ty = w.y;

        w.x = w.x + o.Cos(o.vector) * 16;
        w.y = w.y + o.Sin(o.vector) * 16;

        var f = o.pickviewitem; //sce_enemy_inv_check(o.pick);
        //if (f != 0 ){
            // o.vector = (o.startv + (o.rotatecount * 12))%360;
            //w.x = w.x + o.Cos(o.vector) * 16;
            //w.y = w.y + o.Sin(o.vector) * 16;
            scrn.put(spname[f], w.x, w.y); 
            //scrn.putchr8(o.weapontype, w.x+10, w.y+10);
        //} else {
        if (o.pick.length > 1){
            w.x = tx - o.Cos(o.vector) * o.center_x;
            w.y = ty - o.Sin(o.vector) * o.center_y;

            scrn.put("TrBox", w.x, w.y, 0, 0, 255, 0.75);
            //scrn.putchr8(o.pick.length, w.x, w.y);
        }
        //}
        //scrn.put(ptn, w.x, w.y, wvh, wr, o.alpha, o.display_size);
    }
}

