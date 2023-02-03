// シナリオ
//　scenario processor version Javascript
//　各オブジェクトの行動を指定するリスト。

//共通
function sce_common_vset(num) {
    // 移動開始で速さ num の移動量を与える
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        o.vset( num );
    }

    this.move = function (scrn, o) {

        //if (o.mapCollision) o.vset(0);
        return o.sc_move();
    }
}

function sce_common_signal(num) {
    //シグナル出力
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {

        o.vset(0);

        o.normal_draw_enable = false;
        o.custom_draw_enable = false;

        o.x = o.gt.world_x + 1;//画面外だと処理が止まるので
        o.y = o.gt.world_y + 1;//常に画面内にあるようにする
    }

    this.move = function (scrn, o) {

            o.x = o.gt.world_x + 1;//画面外だと処理が止まるので
        o.y = o.gt.world_y + 1;//常に画面内にあるようにする

        if (o.frame == 0) {
            o.SIGNAL( num ); 
        } else {
            o.SIGNAL(0);
            o.status = 0;
        }
        o.frame++;

        return o.sc_move();
    }
}
