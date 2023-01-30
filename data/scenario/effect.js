// シナリオ
//　scenario processor version Javascript
//　各オブジェクトの行動を指定するリスト。

//画面効果用シナリオ
function sce_effect_vanish() {
    // 爆発表示せずに消える（STATUSを0に）
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        o.type = 5; //　その他
        o.status = 5; //廃棄処理中　
    }
    this.move = function (scrn, o) {

        return -1;
    }
}

function sce_effect_bomb() {
    //BOMB　移動停止させて、表示を爆発にし1.5秒後に消える。
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        o.vset(0);
        o.mp = 12;
        o.type = 5; //　その他
        o.status = 5; //廃棄処理中　
        o.frame = 0;

        //o.alpha = 254;
    }

    this.move = function (scrn, o) {

        switch (o.frame) {
            case 5:
                //
                break;
            case 90:
                //            return -1;
                o.status = 0;
                break;
            default:
                break;
        };
        o.frame++;

        //if (o.frame > 30) o.alpha -= 3;
            if (o.frame >= 30) o.status = 0; //return -1;

        return o.sc_move();
    }
}

function sce_effect_hit() {
    //Hit　移動停止させて、表示を爆発(hit)にし1.5秒後に消える。
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        o.vset(0);
        o.mp = 11;
        o.type = 5; //　その他
        o.status = 5; //廃棄処理中　
        o.frame = 0;

        o.alpha = 254;
    }

    this.move = function (scrn, o) {

        switch (o.frame) {
            case 5:
                //
                break;
            case 60:
                //            return -1;
                o.status = 0;
                break;
            default:
                break;
        };
        o.frame++;

        if (o.frame > 30) o.alpha -= 3;
         //   if (o.frame >= 30) o.status = 0; //return -1;

        return o.sc_move();
    }
}

function sce_effect_hit_shield() {
    //Hit　移動停止させて、表示を爆発(hit)にし1/4秒後に消える。
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        o.vset(0);
        o.mp = 11;
        o.type = 5; //　その他
        o.status = 5; //廃棄処理中　
        o.frame = 0;

        //o.alpha = 254;

        o.normal_draw_enable = false;
        o.custom_draw_enable = true;    }

    this.move = function (scrn, o) {

        switch (o.frame) {
            case 5:
                //
                break;
            case 30:
                //            return -1;
                o.status = 0;
                break;
            default:
                break;
        };
        o.frame++;

        //if (o.frame > 30) o.alpha -= 3;
         //   if (o.frame >= 30) o.status = 0; //return -1;

        return o.sc_move();
    }

    this.draw = function (scrn, o) {

        //var w = o.gt.worldtoView(o.x, o.y);
        var w = o.gt.worldtoView(o.x, o.y);

        var cl = {};
        cl.x = w.x; 
        cl.y = w.y; 
        cl.r = o.frame % 15;
        cl.c = (o.frame > 15)?"red":"white";

        cl.draw = function (device) {

            device.beginPath();
            //device.fillStyle = "white";
            device.strokeStyle = this.c;
            device.lineWidth = "2";
            device.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
            device.stroke();
            //device.fill();
        }
        scrn.putFunc(cl);
    }
}

function sce_effect_billboard( num ) {
    //看板の動き(だんだん消えていくパターン）
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        o.vector = num;
        o.vset(2);
    }

    this.move = function (scrn, o) {

        if (o.alpha > 10) {
            o.alpha -= 5;
        } else {
            return -1; //o.alpha = 0;
        }

        return o.sc_move();
    };
}

function sce_effect_bombcircle(col) {

    //Bomb演出テスト用
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {

        o.vset(0);
        o.circle_r = 20;
        o.type = 5;

        o.normal_draw_enable = false;
        o.custom_draw_enable = true;
    }

    this.move = function (scrn, o) {

        if (o.frame > 10) o.status = 0; //時間が来たら消す。

        o.circle_r += ((o.frame + 1) * 10);

        o.frame++;

        return o.sc_move();
    }
    this.draw = function (scrn, o) {

        var cl = {};

        var w = o.gt.worldtoView(o.x, o.y);

        cl.x = w.x;
        cl.y = w.y;
        cl.r = o.circle_r;
        cl.draw = function (device) {
            device.beginPath();

            device.globalCompositeOperation = "lighter";

            device.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
            device.fillStyle = col;
            device.fill();

            device.globalCompositeOperation = "source-over";
        }
        scrn.putFunc(cl);
    }
}

function sce_effect_warnning_mark(col) {

    //warning mark 表示
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {

        o.vset(0);
        o.type = 5;
        o.mp = 28;
    }

    this.move = function (scrn, o) {

        if (o.frame > 30) o.status = 0; //時間が来たら消す。

        o.frame++;

        return o.sc_move();
    }
}

function sce_effect_bombExp() {
    //BOMB　移動停止させて、表示を爆発にし1.5秒後に消える。(誘爆用）
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        o.vset(0);
        o.mp = 12;
        o.type = 5; //　その他
        o.status = 5; //廃棄処理中　
        o.frame = 0;

        o.custom_draw_enable = true;

        //o.alpha = 254;
    }

    this.move = function (scrn, o) {

        switch (o.frame) {
            case 5:
                //
                break;
            case 10:
                o.set_object_ex(11, o.x, o.y, o.vector, "pl_bullet_subshot_zero");
                break;
            case 15:
                o.set_object_ex(11, o.x, o.y, o.vector, "pl_bullet_subshot_zero");
                break;
            case 90:
                //            return -1;
                o.status = 0;
                break;
            default:
                break;
        };
        o.frame++;

        //if (o.frame > 30) o.alpha -= 3;
        if (o.frame >= 30) o.status = 0; //return -1;

        return o.sc_move();
    }

    this.draw = function (scrn, o) {

        var w = o.gt.worldtoView(o.x, o.y);


        var cl = {};
        cl.x = w.x; // o.move_target_x; // * (256 / 640); //o.mouse_state.x;
        cl.y = w.y; // o.move_target_y; // * (192 / 480); //o.mouse_state.y;
        cl.r = ((o.frame < 16) ? o.frame : 30 - o.frame) * 3;

        cl.draw = function (device) {

            device.beginPath();
            device.fillStyle = "red";
            //device.lineWidth = "1";
            //device.strokeStyle = "red";
            device.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
            device.fill();
            //device.stroke();
        }
        scrn.putFunc(cl);
        //scrn.

    }
}

//"search_target_item"

function sce_effect_informationCursor() {
    //存在する方向を示す（鍵(22)用)
    //視野(画面)内にある場合は表示消す。自分が持っている場合も表示消す。見つかってない場合も表示させない。
    //フィールドに落ちている場所または持っている敵の方向を示すようにする。
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        o.vset(0);
        o.type = 5; //　その他
        o.frame = 0;

        o.display_size = 1.0;

        o.normal_draw_enable = false;
        //o.custom_draw_enable = true;

        o.prioritySurface = true;//UI Surfaceに表示したい。
    }

    this.move = function (scrn, o) {

        if (!Boolean(o.parent)) return 1;
        if (o.parent.status == 0) return 1;

        o.x = o.parent.x + o.Cos(o.vector) * 80;
        o.y = o.parent.y + o.Sin(o.vector) * 80;

        if (!o.gt.in_view(o.gameState.key_x, o.gameState.key_y)){
            if (o.gameState.keyon) o.normal_draw_enable = o.gameState.lamp; //
        }else{
            o.normal_draw_enable = false;
        }

        //switch (o.frame) {
        //    case 5:
                //
        //        break;
        //    case 30://0.5s毎に処理
                o.search_target_item(22);
                o.vector = o.target_r(o.gameState.key_x,o.gameState.key_y);

                //if (!o.gt.in_view(o.gameState.key_x, o.gameState.key_y)){
                //    if (o.gameState.keyon) o.normal_draw_enable = true;
                //}else{
                //    o.normal_draw_enable = false;
                //}
                //o.x = o.parent.x;
                //o.y = o.parent.y;
                //鍵
                //o.target_r(o.gameState.key_x,o.gameState.key_y)
                //            return -1;
                //o.status = 0;
        //        o.frame = 0;
        //        break;
        //    case 180:
        //        break;
        //    default:
        //        break;
        //};
        o.frame++;

        //if (o.frame > 30) o.alpha -= 3;
         //   if (o.frame >= 30) o.status = 0; //return -1;

        return o.sc_move();
    }

    this.draw = function (scrn, o) {

        //TestStatusView
        /*
        scrn.putchr8("frm:" + o.frame, scrn.cw/2,scrn.ch/2);
        scrn.putchr8("keyon:" + o.gameState.keyon, scrn.cw/2,scrn.ch/2 +8);
        if (o.gameState.keyon){
            scrn.putchr8("x:" + o.gameState.key_x, scrn.cw/2,scrn.ch/2 +16);
            scrn.putchr8("y:" + o.gameState.key_y, scrn.cw/2,scrn.ch/2 +24);
            var r = o.target_r(o.gameState.key_x,o.gameState.key_y);

            scrn.putchr8("r:" + Math.trunc(r),scrn.cw/2, scrn.ch/2 +32);
            if (!o.gt.in_view(o.gameState.key_x, o.gameState.key_y)){//物が画面内にない場合矢印表示
                var w = o.gt.worldtoView(o.x, o.y);

                scrn.put("Arrow", 
                    w.x + o.Cos(r)*150, 
                    w.y + o.Sin(r)*150, 
                    0, r, 255, 2.0);
            }                
                //scrn.putchr8("[]"
                // , w.x + o.Cos(r)*150
                // , w.y + o.Sin(r)*150
                //);
        }
       */
    }
}
