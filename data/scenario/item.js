// シナリオ
//　scenario processor version Javascript
//　各オブジェクトの行動を指定するリスト。

//アイテムの動作に関わるシナリオ
function sce_item_direct_homing() {
    //[s]自機に直接ホーミング(typeと絵を変更も）＜変更はbomb2処理で
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        //	    o.type = 4;
        //	    o.mp = 18;
        //	    o.score = 8;
        o.vector = 0;
        o.vset(16);
        o.display_size = 1.0;

   }

    this.move = function (scrn, o) {

        switch (o.frame) {
            case 1:
                o.get_target(98);
                break;
            case 3:
                o.get_target(98);
                o.vector = o.target_v();
            case 4:
                if (Boolean(this.target)) {
                    var d = o.target_d(o.target.x, o.target.y);
                    d = (d < 15) ? d + 1 : 16;
                    o.vset(d);
                }
            case 8:
                o.frame = 2;
                break;
            default:
                break;
        };
        if (o.mapCollision) o.change_sce("common_vset0");

        o.frame++;

        return o.sc_move();
    }
}

function sce_item_near_homing() {
    //得点アイテム用(近づくとホーミングしてくる用）
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        o.vset(0);
        o.get_target(98);
    }

    this.move = function (scrn, o) {

        if (!Boolean(this.target)) {
            o.get_target(98);
        }

        if (Boolean(this.target)) {
            var d = o.target_d(o.target.x, o.target.y);

            if (d < 40) {
                //            d = (d < 15) ? d + 1 : 16;
                o.vector = o.target_v();
                o.vset(4);
            }
        };

        return o.sc_move();
    }
}

function sce_item_movingstop() {
    //死んでアイテム放出用（少し進んで止まる）
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        o.vset(1);
    }

    this.move = function (scrn, o) {

        if (o.frame > 100) o.vset(0);
/*
        if (o.frame > 200) {
            o.vector = 180;
            o.vset(1);
        }
*/
        o.frame++;

        return o.sc_move();
    }
}