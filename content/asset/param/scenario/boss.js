// シナリオ
//　scenario processor version Javascript
//　各オブジェクトの行動を指定するリスト。

//ボスキャラの動作に関するシナリオ
function sce_boss_0() {
    // 5Way用母機　中ボス
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        //o.name = "boss";
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
        o.name = "boss";
        o.vset(4);
        //o.mp = 12; //通常のキャラにする
        o.chr = 1;//鍵を出さないようにボスをはずす

        o.display_size = 0.001;
        o.weight = 2.0;

        o.hit_x *= 2.0;
        o.hit_y *= 2.0;

        o.custom_draw_enable = false;

        //o.wdspf = true;

        o.cnt = 0;
    }

    this.draw = sce_boss_damage_gr;

    this.move = function (scrn, o) {

        if (o.alive < 1000) {// 出現から1s(1000ms)
            o.display_size = 2.0 * (o.alive / 1000);
        } else {
            o.display_size = 2.0;
            o.custom_draw_enable = true;

            o.cnt += o.vecfrm;

            if (o.cnt > 7) {
                o.cnt = 0;
                o.set_object(30);
            }
            o.vset(2);
            o.vector = (o.vector + 8*o.vecfrm + 360) % 360;
            //o.frame = 59; // 59;
        };

        if (o.status == 2) {
            o.set_object_ex(14, o.x, o.y, 180, 50);//Boss2
            o.status = 2;
        }

        return o.sc_move();
    }
}

function sce_boss_2(){

    const GLOWTIME = 2000;//ms(waittime)
    // HLaser用母機
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        o.name = "boss";
        o.vset(1);
        o.get_target(98);
        o.w_cnt = 0;

        //o.display_size = 0.001;
        o.display_size = 2.0;
        o.weight = 4.0;

        o.hit_x *= 2.0;
        o.hit_y *= 2.0;

        o.custom_draw_enable = true;
        o.smode = 0;

        o.maxhp = 300;
    }

    this.draw = sce_boss_damage_gr;

    this.move = function (scrn, o) {

        if (o.alive < GLOWTIME) {// 出現から1.5s(1500ms)
            //o.display_size = 2.0 * (o.alive / 1500);
            o.alpha = 255*(o.alive/GLOWTIME);

            o.hp = o.maxhp;//出現中はHP減らない処理（一撃でmaxhpダメージ与えれば倒せるが）
            //o.type = 5;//出現中はEffectタイプにして無敵
        } else {
            o.display_size = 2.0;
            o.type = 2;

            o.get_target(98);
            o.vector = o.target_v();
            o.vset(1);

            let tc = Math.trunc((o.alive-GLOWTIME)/100)%100;//0.1s:100 count loop
            if (tc <= 1) {
                o.smode = 1;
                o.get_target(98);
                o.vector = o.target_v();
                o.vset(1);
            }
            o.vset(1);
            
            if ((tc > 10)&&(tc < 45)) o.vset(0);

            if ((tc > 15)&&(o.smode == 1)){
                o.set_object_ex(32, o.x, o.y, (o.vector + 90) % 360, 49);
                o.set_object_ex(32, o.x, o.y, (o.vector + 270) % 360, 49);
                o.set_object(3);
                o.smode = 2;
            }

            if ((tc > 50)&&(tc < 90)) o.vset(0);

            if ((tc > 55)&&(o.smode == 2)){
                let larm = (o.vector + 90) % 360;
                let rarm = (o.vector + 270) % 360;

                o.set_object_ex(32, o.x + o.Cos(larm)*32, o.y + o.Sin(larm)*32, o.vector, 51);
                o.set_object_ex(32, o.x, o.y, o.vector, 51);
                o.set_object_ex(32, o.x + o.Cos(rarm) * 32, o.y + o.Sin(rarm) * 32, o.vector, 51);

                o.smode = 0;
            }
        }
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
    let w = o.gt.worldtoView(o.x, o.y);
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
    if (!Boolean(o.hpbbw)) o.hpbbw = Math.trunc((o.hp / o.maxhp)*100);

    cl = {};
    let w = o.gt.worldtoView(o.x, o.y);
    cl.x = w.x;
    cl.y = w.y + 3 * o.display_size;
    //cl.sr = ((360 * ((o.maxhp - o.hp) / o.maxhp) - 90) * (Math.PI / 180));
    cl.sr = (o.hp / o.maxhp) * 0.5 * Math.PI;

    cl.bbw = (o.hpbbw/100) * 0.5 * Math.PI;

    let now_bw = Math.trunc((o.hp / o.maxhp)*100);
    if (o.hpbbw > now_bw) o.hpbbw = o.hpbbw - 1;
    if (o.hpbbw <= now_bw) o.hpbbw = now_bw;

    cl.cbar = (o.hp / o.maxhp>0.5)?"limegreen":"yellowgreen";//(o.hp / o.maxhp>0.3)?"yellowgreen":"red"; 
    cl.cborder = (o.hp / o.maxhp>0.5)?"white":(o.hp / o.maxhp>0.3)?"yellow":"orange"; 

    cl.colf = (o.hp/o.maxhp>0.3)?true :false ;
    cl.draw = function (device) {

        let st = (1.25 -0.5) * Math.PI;
        let ed = (0.75 -0.5) * Math.PI;
        let v = st - this.sr;

        let bv = st - this.bbw;

        device.beginPath();
        device.strokeStyle = "red";
        device.lineWidth = "5";
        device.beginPath();
        device.arc(this.x, this.y, 32 + 10, st, bv, true);
        device.stroke();

        device.beginPath();
        device.strokeStyle = this.cbar;
        device.lineWidth = "5";
        device.beginPath();
        device.arc(this.x, this.y, 32 + 10, st, v, true);
        device.stroke();

        device.beginPath();
        device.strokeStyle = this.cborder;
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
