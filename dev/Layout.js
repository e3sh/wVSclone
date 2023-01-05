//=============================================================
// Layoutクラス
// 画面表示位置の記載（とりあえずScoreとHi-scoreとかイベント表示とかの位置を
//=============================================================
function gameLayout() {


    this.score_x = 640 - 180;
    this.score_y = 16;

    this.hiscore_x = 640 - 180;
    this.hiscore_y = 0;

    this.status_x = 640 - 120;
    this.status_y = 32;

    this.combo_x = 0;
    this.combo_y = 32;

    this.itemchain_x = 0;
    this.itemchain_y = 24;

    this.zanki_x = 20;
    this.zanki_y = 480 - 16;

    this.time_x = 640 - (12 * 10);
    this.time_y = 479 - 16 -16;

    this.stage_x = 640 - (12 * 10);
    this.stage_y = 479 - 32 - 16;

    this.map_x = 0;// 640 - 150;
    this.map_y = 0; // 480 - 48 - 150;

    this.hp_x = 168;
    this.hp_y = 480-32;

/*
    this.score_x = 640 - 156; 
    this.score_y = 16;

    this.hiscore_x = 640 - 156;
    this.hiscore_y = 0;

    this.status_x = 640 - 120;
    this.status_y = 32;

    this.combo_x = 0;
    this.combo_y = 32;

    this.itemchain_x = 0;
    this.itemchain_y = 24;

    this.zanki_x = 20 + 480;
    this.zanki_y = 480 - 16 - 40 - 32;

    this.time_x = 640 - (12 * 9);
    this.time_y = 479 - 16 - 32;

    this.stage_x = 640 - (12 * 9);
    this.stage_y = 479 - 32 - 32;
*/
}


