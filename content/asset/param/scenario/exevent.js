// シナリオ
//　scenario processor version Javascript
//　各オブジェクトの行動を指定するリスト。

// 旧システムのexevent関連( n way弾 )
function sce_exev_3way() {
    //=============================================================================
    //ExEvent処理用シナリオ
    this.init = function (scrn, o) {
        o.vset(0);
        this.normal_draw_enable = false;

        o.set_object_ex(5, o.x, o.y, o.vector - 5, 12);
        o.set_object_ex(5, o.x, o.y, o.vector, 12);
        o.set_object_ex(5, o.x, o.y, o.vector + 5, 12);
    }

    this.move = function (scrn, o) {
        //基本的に呼び出しのみで使用するので呼び出したのは即効削除

        o.status = 0;

        return o.sc_move();
    }
}
    //-----------------------------------------------------------------------
function sce_exev_5way_nallow() {

    this.init = function (scrn, o) {
        o.vset(0);
        this.normal_draw_enable = false;

        o.set_object_ex(5, o.x, o.y, o.vector - 10, 12);
        o.set_object_ex(5, o.x, o.y, o.vector - 5, 12);
        o.set_object_ex(5, o.x, o.y, o.vector, 12);
        o.set_object_ex(5, o.x, o.y, o.vector + 5, 12);
        o.set_object_ex(5, o.x, o.y, o.vector + 10, 12);
    }

    this.move = function (scrn, o) {
        //基本的に呼び出しのみで使用するので呼び出したのは即効削除

        o.status = 0;

        return o.sc_move();
    }
}

    //-----------------------------------------------------------------------
function sce_exev_5way_normal() {

    this.init = function (scrn, o) {
        o.vset(0);
        this.normal_draw_enable = false;

        o.set_object_ex(5, o.x, o.y, o.vector - 30, 12);
        o.set_object_ex(5, o.x, o.y, o.vector - 15, 12);
        o.set_object_ex(5, o.x, o.y, o.vector, 12);
        o.set_object_ex(5, o.x, o.y, o.vector + 15, 12);
        o.set_object_ex(5, o.x, o.y, o.vector + 30, 12);
    }

    this.move = function (scrn, o) {
        //基本的に呼び出しのみで使用するので呼び出したのは即効削除

        o.status = 0;

        return o.sc_move();
    }
}
//-----------------------------------------------------------------------
function sce_exev_5expansion() {

    this.init = function (scrn, o) {
        o.vset(0);
        this.normal_draw_enable = false;

        o.set_object_ex(3, o.x, o.y, o.vector, "common_vset2");
        o.set_object_ex(3, o.x, o.y, o.vector, "common_vset4");
        o.set_object_ex(3, o.x, o.y, o.vector, "common_vset6");
        o.set_object_ex(3, o.x, o.y, o.vector, "common_vset8");
        o.set_object_ex(3, o.x, o.y, o.vector, "common_vset10");
    }

    this.move = function (scrn, o) {
        //基本的に呼び出しのみで使用するので呼び出したのは即効削除

        o.status = 0;

        return o.sc_move();
    }
}
//-----------------------------------------------------------------------
function sce_exev_3way_exp() {
    this.init = function (scrn, o) {
        o.vset(0);
        this.normal_draw_enable = false;

        o.set_object_ex(5, o.x, o.y, o.vector - 5, "exev_5expansion");
        o.set_object_ex(5, o.x, o.y, o.vector, "exev_5expansion");
        o.set_object_ex(5, o.x, o.y, o.vector + 5, "exev_5expansion");
    }

    this.move = function (scrn, o) {
        //基本的に呼び出しのみで使用するので呼び出したのは即効削除

        o.status = 0;

        return o.sc_move();
    }
}