﻿// シナリオ
//　scenario processor version Javascript
//　各オブジェクトの行動を指定するリスト。
//

// 自機の動作に関するシナリオ
function sce_player() {

    const SHIELD_TIME_BASE = 300;
    let SHIELD_TIME = SHIELD_TIME_BASE;
    const TRIG_WAIT = 20;

    let op = {
        ptr: 0,
        x: Array(40),
        y: Array(40)
    }

    const wpn = {
        0:{ch:6,sce:"common_vset8"},//wand
        1:{ch:10,sce:"friend_rotate"},//sword
        2:{ch:38,sce:"friend_rotate_full"},//axe
        3:{ch:37,sce:"friend_boom"},//boom
        4:{ch:36,sce:"friend_straight"},//spear
        5:{ch:46,sce:"common_vset10"} //arrow
    }

    let delay_st;
    let lvupf;

    // 自機の移動　====
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        o.triger = 10;//Zkey Lockwait Counter
        o.shot = 0; //Zkey trig ok:0 ng:1
        o.trigerSub = 10; //Xkey Lockwait Counter
        o.shotSub = 0; //Xkey trig ok:0 ng:1
        o.autotrig = 10;//AutoWeapon wait counter
        o.autoshot = 0;//Autowapon trig ok:0 ng:1

        o.jump = 0;
        o.jpcount = 40;
        o.jpvec = -8;

        o.shiftx = 0;
        o.shifty = 0;

        o.mvkeytrig = 0;        
        o.maxspeed = 6;
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
        o.before_wlevel = o.gameState.player.level;

        o.lighton = true;

        o.doorflag = false;

        o.repro = false;

        //o.spec = o.gameState.player.spec;

        o.spec.LV = o.gameState.player.level;
        o.spec.HP = o.gameState.player.maxhp;
        o.spec.VIT = o.gameState.player.spec.VIT;
        o.spec.INT = o.gameState.player.spec.INT;
        o.spec.MND = o.gameState.player.spec.MND;
        o.spec.ETC = o.gameState.player.spec.ETC;

        o.gameState.player.spec = o.spec;

        SHIELD_TIME = SHIELD_TIME_BASE + o.spec.VIT*30; //0.5s(30f)

        //o.spec.VIT = 0; //HPrecover+ : init 3 +
        //o.spec.INT = 0, //BombPower+ : init -10
        //o.spec.MND = 0, //ShieldTime+: init 300flame(5s) +

        lvupf = false;

        op.ptr = 0;
        op.x.fill(o.x);
        op.y.fill(o.y);

        //残機無限増やしの抑制の為、ExtendItemを状況により消す。
        if (o.gameState.player.zanki >= Math.floor(o.gameState.nowstage / 5) + 2) {
            o.bomb4(21); //Extendのステータスを0にする。
        }
        o.set_object(100);//InformationCursorSetup
    }

    this.draw = damage_gr1;

    this.move = function (scrn, o) {

        o.frame+= o.vecfrm;

        if (o.frame <= SHIELD_TIME) {
            o.hp = o.maxhp; //出現して5秒間は無敵(60fps)
            o.attack = 10;
            o.gameState.player.barrier = true;
            o.lighton = true;
            //    o.damageflag = false;
            o.maxspeed = 4.5;//SHIELD中はスピードダウン
        }
        if ((o.frame > SHIELD_TIME) && o.gameState.player.barrier) {
            //無敵時間終わったら瞬間に元に戻す
            o.hp = o.before_hp;
            o.attack = 1;
            o.gameState.player.hp = o.before_hp;
            o.gameState.player.barrier = false;
            o.lighton = false;

            o.maxspeed = 6;//通常時の移動速度
        }

        if (o.jump == 0) o.vset(0);
        var speed = 0;
        
        let upkey = o.entrypadaxis.up;
        let downkey = o.entrypadaxis.down;
        let leftkey = o.entrypadaxis.left;
        let rightkey = o.entrypadaxis.right;

        if (leftkey) {
            o.vector = 270;
        }
        if (upkey) {
            o.vector = 0;
        }
        if (rightkey) {
            o.vector = 90;
        }
        if (downkey) {
            o.vector = 180;
        }


        if (upkey && leftkey) {
            o.vector = 360 - 45;//315
        }
        if (upkey && rightkey) {
            o.vector = 0 + 45;//45
        }
        if (downkey && leftkey) {
            o.vector = 180 + 45;//225
        }
        if (downkey && rightkey) {
            o.vector = 180 - 45;//135
        }

        if (upkey || downkey || leftkey || rightkey) {
            //加速制御
            //動き始め(15f[0.25s]はゆっくりとなるように(手触り感調整)
            //o.mvkeytrig++;
            //if (v != o.vector) o.mvkeytrig = 12; //入力方向が変わったあとの加速まで 3fwait　0.05s
            o.mvkeytrig = (o.mvkeytrig + o.vecfrm > 30)?30 : o.mvkeytrig + o.vecfrm; // keyoff後の加速維持動作入力猶予0.25s
            //speed = (o.mvkeytrig/4 > o.maxspeed)? o.maxspeed: o.mvkeytrig/5;
            //speed = (o.mvkeytrig > 8)? o.maxspeed: o.maxspeed * (o.mvkeytrig/8);
            speed = (o.mvkeytrig > 15)? o.maxspeed: 1; //加速始動時　15fwait　0.25s
            //if (v != o.vector) o.mvkeytrig=0;
            
            //speed = o.maxspeed;
            if (o.jump == 0) o.vset(speed);
        }else{
            o.mvkeytrig-= o.vecfrm;
            o.mvkeytrig = (o.mvkeytrig-o.vecfrm < 0)?0 : o.mvkeytrig;
        }

        if (o.vector > 180) { o.mp = 2; } else { o.mp = 1; }

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

        o.triger-= o.vecfrm;
        if ((o.triger <= 0) && (!zkey)) {
            o.shot = 0;
            o.triger = 5;
        }

        o.trigerSub-= o.vecfrm;
        if ((o.trigerSub <= 0) && (!xkey)) {
            o.shotSub = 0;
            o.trigerSub = 5;
        }

        o.autotrig-= o.vecfrm;
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

                            o.triger = TRIG_WAIT;
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

                            o.triger = TRIG_WAIT;
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
                        o.bomb3(o.spec.INT*2);
                        o.set_object_ex(6, o.x, o.y, 0, 47); //Bomb爆発演出(赤)
                        o.item[23]--;
                    }

                    if (w == 24) {
                        o.sound.effect(10);
                        if (!o.gameState.player.barrier) o.before_hp = o.hp;

                        SHIELD_TIME = SHIELD_TIME_BASE + o.spec.VIT*30;
                        o.frame = 0;
                        o.item[24]--;
                        //    o.set_object_ex(20, o.x, o.y, 0, 44, "Shield");
                    }

                    if (w == 25) {
                        let rhp = 3 + o.spec.MND;

                        o.sound.effect(10);
                        if (o.frame <= SHIELD_TIME) {
                            o.before_hp += rhp;
                            o.maxhp++;

                            if (o.before_hp > o.maxhp) o.before_hp = o.maxhp;

                            o.gameState.player.hp = o.before_hp;
                        } else {
                            let rhp = 3 + o.spec.MND;

                            o.hp += rhp;//3;
                            o.maxhp++;

                            if (o.hp > o.maxhp) o.hp = o.maxhp;

                            o.gameState.player.hp = o.hp;
                        }
                        o.gameState.player.maxhp = o.maxhp;
                        o.spec.HP = o.maxhp;
                        o.item[25]--;
                        o.set_object_ex(20, o.x, o.y, 0, 43, "+"+rhp );
                    }

                    o.trigerSub = TRIG_WAIT;


                }
            }
        }
        
        if (ckey) { //Jump
            if (o.shot == 0 && o.jump == 0) {

                o.jump = 1;
                o.jpcount = 40;
                o.jpvec = -5.6 - 0.4 * o.vecfrm;;
                o.colcheck = false;

                o.triger = TRIG_WAIT;
            }
            
        }

        if (esckey) {
            if (o.shot == 0) {
                o.shot = 1;
                o.SIGNAL(1); //pause
                o.triger = TRIG_WAIT;
            }
        }

        if (o.jump == 1){
            //o.autoshot = 1;//Jump中、攻撃抑止
            o.jpcount--;
            o.shifty = o.shifty + o.jpvec;
            o.jpvec = o.jpvec + 0.4 * o.vecfrm;
            o.prioritySurface = true;
            if (o.shifty > 0){
                o.jump = 0;
                o.shifty = 0;
                o.prioritySurface = false;
                o.colcheck = true;
            }
        }

        //AutoWeapon
        //o.vset(4);
        if ((o.autoshot == 0) && (o.gameState.player.weapon !=0 )) {
//          if (o.gameState.player.weapon !=0 ) {
            o.autoshot = 1;
            //o.collect3();
            //o.sound.effect(7); //スイング音
            let wdelay = ((o.gameState.player.level >3 )? 3 : o.gameState.player.level)*4;
            // lv.0 20 0.3s /lv.1 16 0.25s /lv.2 12 0.2s /lv.3 08 0.12s(Max)
            o.autotrig = 20 -wdelay;//20 0.3s
            //o.set_object_ex(20, o.x, o.y, 0, 43, o.gameState.player.weapon + "_");
            switch (o.gameState.player.weapon) {
                case 1:
                    o.set_object(10); //sword
                    //o.autotrig = 30;
                    break;
                case 2:
                    o.set_object(38); //axe
                    //o.autotrig = 30;
                    break;
                case 3:
                    o.set_object(37); //boom
                    o.autotrig = 240 /(o.gameState.player.level + 1);
                    //o.autotrig = 30;
                    break;
                case 4:
                    o.set_object(36); //spare
                    //o.autotrig = 30;
                    break;
                case 5:
                    o.set_object_ex(46, o.x, o.y, o.vector - 10, "common_vset10");
                    o.set_object_ex(46, o.x, o.y, o.vector, "common_vset10");
                    o.set_object_ex(46, o.x, o.y, o.vector + 10, "common_vset10");
                    //o.set_object(46)
                    o.set_object(47); //Bow and Arrow
                    //o.autotrig = 30;
                    break;
                default:
//                    o.set_object(39); //wand
                    break;
            }
        }

        if (o.gameState.player.weapon != o.before_weapon) {

            var ww = [15, 16, 17, 19, 18, 50];

            var w = ww[o.before_weapon];
            var wv = (o.vector + 180) % 360;

            this.set_object_ex(w,
                    o.x + o.Cos(wv) * 40,
                    o.y + o.Sin(wv) * 40,
                    0, "common_vset0"
                    ,o.before_wlevel 
            );

            o.before_weapon = o.gameState.player.weapon;
            o.spec.LV = o.gameState.player.level;
            //o.before_wlevel = o.gameState.player.level;
            o.autotrig = 5;//持ち替えた場合にwaitなしに
        }
        o.before_wlevel = o.gameState.player.level;
        
        //Damege表示
        if (o.damageflag) {
            if (o.frame > SHIELD_TIME) {
                o.set_object_ex(20, o.x, o.y, 0, 42, "-" + o.damage.no);
                o.gameState.player.hp = o.hp;
                o.set_object_ex(6, o.x, o.y, o.vector, "effect_hit");
            }else{
                o.set_object_ex(6, o.x, o.y, o.vector, "effect_hit_shield");
            }
            o.damage.count = 15;

            //effect_hit_shield
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
            //o.x += o.vx;  o.y += o.vy;
            o.x += (o.vx * o.vecfrm);  o.y += (o.vy * o.vecfrm);

            if ((o.x == o.old_x)&&(o.y == o.old_y)){}else{
                op.x[op.ptr] = o.x;
                op.y[op.ptr] = o.y + o.shifty;
                op.ptr++;
                op.ptr = op.ptr % op.x.length; 
            }
            //var w = o.gt.worldtoWorld(o.x, o.y);
            //o.x = w.x;  o.y = w.y;

        } else {
            o.x = o.old_x;
            o.y = o.old_y;
        }

        //視点変更処理（自機以外では基本的に発生しない）(演出では使えるかもしれない）
        var w = o.gt.worldtoView(o.x, o.y);

        // view shift
        var sx = o.gt.world_x;
        var sy = o.gt.world_y;

        if ((o.gt.viewwidth/2) - (w.x - w.sx) > 120 ){ sx = o.x  - (o.gt.viewwidth/2) + 120;}
        if ((o.gt.viewwidth/2) - (w.x - w.sx) < -120){ sx = o.x  - (o.gt.viewwidth/2) - 120;}
        if ((o.gt.viewheight/2) - (w.y - w.sy) > 50){ sy = o.y  - (o.gt.viewheight/2) + 50;}
        if ((o.gt.viewheight/2) - (w.y - w.sy) < -50){sy = o.y  - (o.gt.viewheight/2)  - 50;}

        if (!o.gt.in_view(o.x, o.y)){
           if (o.x != o.old_x) sx = o.x - o.gt.viewwidth/2;
           if (o.y != o.old_y) sy = o.y - o.gt.viewheight/2;
        }

        o.gt.viewpos(sx, sy);
        //

        o.vector = wvec;
        o.vx = wvx;
        o.vy = wvy;

        if (o.doorflag && o.jump == 0) {
            if (keyget > 0) {
                o.item[22] = 0;
        
                //o.gt.viewpos(o.x - o.gt.viewwidth/2, o.y - o.gt.viewheight/2);

                o.gameState.player.hp = o.hp;

                o.gameState.player.spec.VIT = o.spec.VIT;
                o.gameState.player.spec.INT = o.spec.INT;
                o.gameState.player.spec.MND = o.spec.MND;
                o.gameState.player.spec.ETC = o.spec.ETC;

                o.SIGNAL(835);//STAGE CLEAR
                //    o.hp = 10;
            }
            o.doorflag = false;
        }else{ o.doorflag = false; }

        //LvUp (score > o.spec.MIN,VIT,INT)
        /*
        o.spec.VIT = o.gameState.player.spec.VIT;
        o.spec.INT = o.gameState.player.spec.INT;
        o.spec.MND = o.gameState.player.spec.MND;

        let total_st = o.spec.VIT + o.spec.INT + o.spec.MND; 
        */
        let lups = Math.pow(o.spec.ETC+1 , 2)* 100 ;//100, 400, 900, 1600, 2500,....
        if ((o.score > lups)&& !lvupf){
            o.set_object_ex(20, o.x, o.y, 0, 43, "Lvup");
            o.spec.ETC++;
            o.sound.effect(14);
            delay_st = o.alive;
            //o.SIGNAL(1709);//LVUP
            lvupf = true;
        }

        if (lvupf){ //↑のLvUp検出で音を鳴らしてから0.5秒後にLvUpMenuへ
            //スコア数値の表示演出完了待ち（数字じゃなくてゲージにするか？）
            if (o.alive > delay_st +500){
                lvupf = false;
                o.SIGNAL(1709);//LVUP
            }
        }

        //option
        if ((o.item[20] >= 10) && !o.repro){
            o.set_object_ex(0, o.x, o.y, o.vector, "sce_friend_option_0");
            o.repro = true;
        }
        if (o.item[20] < 10) o.repro = false;

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
            o.display_size = 1.3;
            o.change_sce("effect_bomb_x");//7

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
        //Shield
        //var tw = o.gt.worldtoView(o.x, o.y);
        //scrn.putchr8("@"+o.mvkeytrig, tw.x, tw.y);
        
        /*
        //Aura Display
        if (o.gameState.player.level > 0){
            var pw = {};

            var w = o.gt.worldtoView(o.x, o.y);

            pw.x = w.x -16;
            pw.y = w.y +16;

            pw.r = o.frame % 6;

            var num = o.gameState.player.level * 96
            pw.c = "rgb(" + num + "," + num + "," + 128 + ")"; 
            pw.draw = function (device) {

            device.beginPath();
	        device.strokeStyle = this.c; 
            //device.fillStyle = "white";
	        device.lineWidth = 1;

            for (var i=0; i < 1 + this.r; i++){
                device.lineWidth = 1;
                device.rect(this.x, this.y - i * 3 - 1, 32, 1);
                device.stroke();
            }
            //device.fillRect(this.x- this.r , this.y, 1, 32);
	        //device.stroke();
            }
            scrn.putFunc(pw);
        }
        */
        
        //Shield Display
        if (o.frame <= SHIELD_TIME) {

            var cl = {};
            var w = o.gt.worldtoView(o.x, o.y);

            cl.x = w.x + o.shiftx;
            cl.y = w.y + o.shifty;
            cl.r = 30 + o.frame % 5;
            let cn = Math.trunc(255 * ((SHIELD_TIME - o.frame)/SHIELD_TIME));
            cl.c = "rgb(" + 255 + "," + cn + "," + cn + ")"; 
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
        
        lbar = {}

        lbar.hp = o.hp;
        lbar.mhp = o.maxhp;
        var w = o.gt.worldtoView(o.x, o.y);

        lbar.x = w.x + o.shiftx;
        lbar.y = w.y + o.shifty;
        //lbar.br = barriref ? "skyblue" : (lbar.hp/lbar.mhp>0.3)?"limegreen":"red";

        lbar.cbar = (barriref)?"skyblue" : (lbar.hp/lbar.mhp>0.5)?"limegreen":(lbar.hp/lbar.mhp>0.3)?"yellowgreen":"red"; 
		lbar.cborder = (lbar.hp/lbar.mhp>0.5)?"white":(lbar.hp/lbar.mhp>0.3)?"yellow":"orange"; 

        lbar.draw = function(device){
            device.beginPath();
	        device.fillStyle = this.cbar;
	        device.lineWidth = 1;
	        device.fillRect(this.x -16, this.y +16+3, (this.hp/this.mhp)*32, 2);
	        device.stroke();

	        device.beginPath();
	        device.strokeStyle = this.cborder;  
	        device.lineWidth = 1;
	        device.rect(this.x -17, this.y+16+2, 34, 4);
	        device.stroke();
        }
        if (o.hp != o.maxhp) scrn.putFunc(lbar);

        for (let i=0; i < op.x.length; i++){
            let w = o.gt.worldtoView(
                op.x[(op.ptr + i) % op.x.length],
                op.y[(op.ptr + i) % op.x.length]
            );
            
            if (i > op.x.length - o.item[20]) {
                /*
                if (((i-1) % 10) == 0){
                    //scrn.fill(w.x-8, w.y-8,16,16,c);
                    scrn.putFunc( {   x: w.x ,y: w.y ,r: 6 - o.frame%6/2,
                            draw: function (device) {
                                device.beginPath();
                                device.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
                                device.fillStyle = "white";
                                device.fill();
                            }
                        } );
                }else{
                    */
                    scrn.fill(w.x, w.y, 2, 2,"white");
                }
            /*
            }else{
                //scrn.fill(w.x, w.y, 2, 2,"gray");
            }
            */            
            if (i > op.x.length - o.itemstack.length){    
                if (Boolean(o.itemstack[op.x.length - i])){
                    if (o.itemstack[op.x.length - i] == 23){
                        scrn.fill(w.x, w.y, 3, 3,"Orange");
                    }else if (o.itemstack[op.x.length - i] == 24){
                        scrn.fill(w.x, w.y, 3, 3,"Cyan");
                    }else if (o.itemstack[op.x.length - i] == 25){
                        scrn.fill(w.x, w.y, 3, 3,"Green");
                    }
                }
            }

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