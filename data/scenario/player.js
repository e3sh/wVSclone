// シナリオ
//　scenario processor version Javascript
//　各オブジェクトの行動を指定するリスト。
//

// 自機の動作に関するシナリオ
function sce_player() {

    const SHIELD_TIME = 300;

    // 自機の移動　====
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        o.triger = 10;
        o.shot = 0;
        o.trigerSub = 10;
        o.shotSub = 0;
        o.autotrig = 10;
        o.autoshot = 0;

        //o.int_shot = 0;
        //	        o.mp = 1;
        o.custom_draw_enable = true;

        o.gt.viewpos(o.x - o.gt.viewwidth / 2, o.y - o.gt.viewheight / 2);

        //o.display_size = 1.5;

        o.old_x = o.x;
        o.old_y = o.y;

        o.hp = o.gameState.player.hp;
        o.maxhp = o.gameState.player.maxhp;
        o.barrier = o.gameState.player.barrier;

        o.before_hp = o.hp;
        o.before_weapon = o.gameState.player.weapon;

        o.doorflag = false;

        //残機無限増やしの抑制の為、ExtendItemを状況により消す。
        if (o.gameState.player.zanki >= Math.floor(o.gameState.nowstage / 5) + 2) {
            o.bomb4(21); //Extendのステータスを0にする。
        }
    }

    this.draw = damage_gr1;

    this.move = function (scrn, o) {

        o.frame++;

        if (o.frame <= SHIELD_TIME) {
            o.hp = o.maxhp; //出現して5秒間は無敵(60fps)
            o.attack = 10;
            o.gameState.player.barrier = true;
            //    o.damageflag = false;
        }
        if (o.frame == SHIELD_TIME) {
            //無敵時間終わったら元に戻す
            o.hp = o.before_hp;
            o.attack = 1;
            o.gameState.player.hp = o.before_hp;
            o.gameState.player.barrier = false;
        }

        o.vset(0);
        var speed = 6;

        var upkey = false;
        var downkey = false;
        var leftkey = false;
        var rightkey = false;

        if (Boolean(o.key_state[37])) {
            if (o.key_state[37]) {//<=
                leftkey = true;
                o.vector = 270;
            }
        }
        if (Boolean(o.key_state[38])) {
            if (o.key_state[38]) {//↑
                upkey = true;
                o.vector = 0;
            }
        }
        if (Boolean(o.key_state[39])) {
            if (o.key_state[39]) {//=>
                rightkey = true;
                o.vector = 90;
            }
        }
        if (Boolean(o.key_state[40])) {
            if (o.key_state[40]) {//↓
                downkey = true;
                o.vector = 180;
            }
        }

        if (upkey && leftkey) {
            o.vector = 360 - 45;
        }
        if (upkey && rightkey) {
            o.vector = 0 + 45;
        }
        if (downkey && leftkey) {
            o.vector = 180 + 45;
        }
        if (downkey && rightkey) {
            o.vector = 180 - 45;
        }

        if (upkey || downkey || leftkey || rightkey) {
            o.vset(speed);
        }

        if (o.vector > 180) { o.mp = 2; } else { o.mp = 1; }

        var v = o.vector;

        var powup = 0;
        var oneup = 0;
        var keyget = 0;
        for (var i in o.item) {
            if (i == 20) {
                powup = o.item[i];
            }
            if (i == 21) {
                oneup = o.item[i];
            }
            if (i == 22) {
                keyget = o.item[i];
            }
        }

        var zkey = false;
        if (Boolean(o.key_state[90])) {
            if (o.key_state[90]) {//zkey↓
                zkey = true;
            }
        }
        if (Boolean(o.key_state[32])) {
            if (o.key_state[32]) {//spacebar↓
                zkey = true;
            }
        }

        var xkey = false;

        if (Boolean(o.key_state[88])) {
            if (o.key_state[88]) {//xkey↓
                xkey = true;
            }
        }
        if (Boolean(o.key_state[17])) {
            if (o.key_state[17]) {//ctrlkey↓
                xkey = true;
            }
        }

        var ckey = false;

        if (Boolean(o.key_state[67])) {
            if (o.key_state[67]) {//ckey↓
                ckey = true;
            }
        }


        var esckey = false;
        if (Boolean(o.key_state[27])) {
            if (o.key_state[27]) {//↓
                esckey = true;
            }
        }

        o.triger--;
        if ((o.triger <= 0) && (!zkey)) {
            o.shot = 0;
            o.triger = 5;
        }

        o.trigerSub--;
        if ((o.trigerSub <= 0) && (!xkey)) {
            o.shotSub = 0;
            o.trigerSub = 5;
        }

        o.autotrig--;
        if (o.autotrig <= 0) {
            o.autoshot = 0;
            o.autotrig = 5;
        }

        //       if (eval(o.mouse_state.button) == 0) {
        if (zkey) {
            //o.vset(4);
            if (o.shot == 0) {
                o.shot = 1;

                o.sound.effect(7); //スイング音
                o.triger = 15;
                //o.set_object_ex(20, o.x, o.y, 0, 43, o.gameState.player.weapon + "_");
                switch (o.gameState.player.weapon) {
                      case 0:
                        o.set_object(39); //wand
                        if ((powup > 0) || (o.config.shotfree)) {
                            o.set_object(6);
                            o.item[20]--;
                            if (o.item[20] < 0) o.item[20] = 0;

                            o.triger = 30;
                        }
                        break;
//                    case 1:
//                        o.set_object(10); //sword
//                        break;
//                    case 2:
//                        o.set_object(38); //spare
//                        break;
//                    case 3:
//                        o.set_object(37); //boom
//                        break;
//                    case 4:
//                        o.set_object(36); //axe
//                        break;
                      default:
                        if ((powup > 0) || (o.config.shotfree)) {
                            o.collect2();//wand 以外の武器使用時はショットボタンは画面内アイテム回収/玉消費
                            o.item[20]--;
                            if (o.item[20] < 0) o.item[20] = 0;

                            o.triger = 30;
                        }
                        break;   
                }
            }
        }

        if (xkey) {
            if (o.shotSub == 0) {
                o.shotSub = 1;
                if (o.itemstack.length > 0) {
                    var w = o.itemstack.pop();

                    if (w == 23) {
                        o.sound.effect(13);
                        o.bomb3();
                        o.set_object_ex(6, o.x, o.y, 0, 47); //Bomb爆発演出(赤)
                        o.item[23]--;
                    }

                    if (w == 24) {
                        o.sound.effect(10);
                        if (!o.gameState.player.barrier) o.before_hp = o.hp;
                        o.frame = 0;
                        o.item[24]--;
                        //    o.set_object_ex(20, o.x, o.y, 0, 44, "Shield");
                    }

                    if (w == 25) {
                        o.sound.effect(10);
                        if (o.frame <= SHIELD_TIME) {
                            o.before_hp += 3;
                            o.maxhp++;

                            if (o.before_hp > o.maxhp) o.before_hp = o.maxhp;

                            o.gameState.player.hp = o.before_hp;
                        } else {
                            o.hp += 3;
                            o.maxhp++;

                            if (o.hp > o.maxhp) o.hp = o.maxhp;

                            o.gameState.player.hp = o.hp;
                        }
                        o.gameState.player.maxhp = o.maxhp;
                        o.item[25]--;
                        o.set_object_ex(20, o.x, o.y, 0, 43, "+3");
                    }

                    o.trigerSub = 30;
                }
            }
        }
        /*
        if (ckey) { //item drop　->change　itemget　2023/1/12
            
            if (o.shotSub == 0) {
                o.shotSub = 1;
                //　item　drop
　                if (o.itemstack.length > 0) {

                    var w = o.itemstack.pop();
                    o.item[w]--;

                    this.set_object_ex(w,
                    o.x + o.Cos(o.vector) * 40,
                    o.y + o.Sin(o.vector) * 40,
                    o.vector, "common_vset0" //38
                    );
                }
                //o.collect2();

                o.trigerSub = 30;
            }
            
        }
        */

        if (esckey) {
            if (o.shot == 0) {
                o.shot = 1;
                o.SIGNAL(1); //pause
                o.triger = 30;
            }
        }

        //AutoWeapon
        //o.vset(4);
        if ((o.autoshot == 0) && (o.gameState.player.weapon !=0 )) {
//          if (o.gameState.player.weapon !=0 ) {
            o.autoshot = 1;
            //o.collect3();
            //o.sound.effect(7); //スイング音
            o.autotrig = 20;
            //o.set_object_ex(20, o.x, o.y, 0, 43, o.gameState.player.weapon + "_");
            switch (o.gameState.player.weapon) {
                case 1:
                    o.set_object(10); //sword
                    break;
                case 2:
                    o.set_object(38); //spare
                    break;
                case 3:
                    o.set_object(37); //boom
                    break;
                case 4:
                    o.set_object(36); //axe
                    break;
                default:
//                    o.set_object(39); //wand
                    break;
            }
        }

        if (o.gameState.player.weapon != o.before_weapon) {

            var ww = [15, 16, 17, 19, 18];

            var w = ww[o.before_weapon];
            var wv = (o.vector + 180) % 360;

            this.set_object_ex(w,
                    o.x + o.Cos(wv) * 40,
                    o.y + o.Sin(wv) * 40,
                    0, "common_vset0" //38
            );

            o.before_weapon = o.gameState.player.weapon;
        }

        //Damege表示
        if (o.damageflag) {
            if (o.frame > SHIELD_TIME) {
                o.set_object_ex(20, o.x, o.y, 0, 42, "-" + o.damage.no);
                o.gameState.player.hp = o.hp;
            }
            o.set_object_ex(6, o.x, o.y, o.vector, "effect_hit");
            o.damage.count = 15;

            //o.gameState.player.hp = o.hp;
        }

        var wvec = this.vector;
        var wvx = this.vx;
        var wvy = this.vy;

        if (o.damage.count > 0) {
            o.damage.count--;
            o.vector = (o.damage.vector + 180) % 360;

            o.vset(this.damage.dist / 10);
        }

        o.damageflag = false;


        // 移動処理
        if (o.mapCollision != true) {
            o.old_x = o.x;
            o.old_y = o.y;

            o.x += o.vx;
            o.y += o.vy;

        } else {
            o.x = o.old_x;
            o.y = o.old_y;
        }

        //視点変更処理（自機以外では基本的に発生しない）(演出では使えるかもしれない）
        var w = o.gt.worldtoView(o.x, o.y);
        var vxf = 0;
        var vyf = 0;

        if ((w.x < 240) && (o.vx < 0)) {
            vxf = 1;
        }

        if ((w.x > o.gt.viewwidth - 240) && (o.vx > 0)) {
            vxf = 1;
        }

        if ((w.y < 240) && (o.vy < 0)) {
            vyf = 1;
        }

        if ((w.y > o.gt.viewheight - 240) && (o.vy > 0)) {
            vyf = 1;
        }
        o.gt.viewpos(o.gt.world_x + o.vx * vxf, o.gt.world_y + o.vy * vyf);

        o.vector = wvec;
        o.vx = wvx;
        o.vy = wvy;

        if (o.doorflag) {
            if (keyget > 0) {
                o.item[22] = 0;

                o.gameState.player.hp = o.hp;

                o.SIGNAL(835);
                //    o.hp = 10;
            }

            o.doorflag = false;
        }


        var f = 0;

        if (o.status == 2) {//状態が衝突の場合

            if (o.config.itemreset) {

                //if (powup == 0) powup = 1;
                //ball
                var bn = (powup > 10) ? 10 : powup;
                for (i = 1; i <= bn; i++) {

                    this.set_object_ex(20, o.x, o.y, Math.floor(Math.random() * 360), 38);
                }

                //items
                var n = o.itemstack.length;

                if (n > 10) n = 10;

                for (i = 0; i < n; i++) {
                    var dropitem = o.itemstack.pop();
                    this.set_object_ex(dropitem, o.x, o.y, Math.floor(Math.random() * 360), 38);
                }

                if (keyget > 0) {
                    this.set_object_ex(22, o.x, o.y, Math.floor(Math.random() * 360), "common_vset0");
                }

            }
            o.display_size = 2.5;
            o.change_sce(7);

            o.sound.change(5);
            o.sound.play(5);

            o.bomb4(33); //timeoverキャラのステータスを0にする。
        }

        if (o.status == 0) f = 1; //未使用ステータスの場合は削除

        return f;
    }

    //===以下表示用=============================================================================

    function damage_gr1(scrn, o) {
        //自機のダメージゲージ表示
        var barriref = false;
        var cl = {};
        //Shield
        if (o.frame <= 300) {

            var w = o.gt.worldtoView(o.x, o.y);

            cl.x = w.x;
            cl.y = w.y;
            cl.r = 30 + o.frame % 5;
            cl.c = "rgb(" + 255 + "," + (255 - o.frame) + "," + (255 - o.frame) + ")"; 
            cl.draw = function (device) {
                device.beginPath();
                device.strokeStyle = this.c; //"white";
                device.lineWidth = "1";
                device.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
                device.stroke();
            }
            scrn.putFunc(cl);

            barriref = true;
        }
    }
}

function sce_player_start() {
    //　自機の発進の動き
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        o.type = 98;
        //      o.mp = 1;
        o.vector = 0;
        o.vset(8);

        o.gt.viewpos(o.x - 210, o.y - 240);
    }

    this.move = function (scrn, o) {

        o.hp = 10;

        switch (o.frame) {
            case 30:
                o.vector = 180;
                o.vset(4);
                break;
            case 58:
                //	            o.type = 98;
            case 60:
                //			o.status = 1;
                o.vset(3);
                o.hp = 10;
                //	            o.bomb();
                o.change_sce(1);
                break;
            default:
                break;
        };
        o.frame++;
        return o.sc_move();
    }
}