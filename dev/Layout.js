//=============================================================
// Layoutクラス
// 画面表示位置の記載（とりあえずScoreとHi-scoreとかイベント表示とかの位置を
//=============================================================
function gameLayout() {

    const GS_SIZE_X = 640;//GameScreenSize
    const GS_SIZE_Y = 400;//GameScreenSize

    const DSP_SP_X = 0;//192;
    const DSP_SP_Y = 0;//120;

    this.score_x = DSP_SP_X + GS_SIZE_X - 180;
    this.score_y = DSP_SP_Y +16;

    this.hiscore_x = DSP_SP_X + GS_SIZE_X - 180;
    this.hiscore_y = DSP_SP_Y;

    this.status_x = DSP_SP_X + GS_SIZE_X - 120;
    this.status_y = DSP_SP_Y + 32;

    this.combo_x = DSP_SP_X;
    this.combo_y = DSP_SP_Y + 32;

    this.itemchain_x = DSP_SP_X;
    this.itemchain_y = DSP_SP_Y + 24;

    this.zanki_x = DSP_SP_X + 20;
    this.zanki_y = DSP_SP_Y + GS_SIZE_Y - 16;

    this.time_x = DSP_SP_X + GS_SIZE_X - (12 * 10);
    this.time_y = DSP_SP_Y + GS_SIZE_Y - 16 -16;

    this.stage_x = DSP_SP_X + GS_SIZE_X - (12 * 10);
    this.stage_y = DSP_SP_Y + GS_SIZE_Y - 32 - 16;

    this.map_x = DSP_SP_X;// 640 - 150;
    this.map_y = DSP_SP_Y; // 480 - 48 - 150;

    this.hp_x = DSP_SP_X + 168;
    this.hp_y = DSP_SP_Y + GS_SIZE_Y -32;

    this.clip_x = DSP_SP_X;
    this.clip_y = DSP_SP_Y + GS_SIZE_Y -36;

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


