//=============================================================
// Layoutクラス
// 画面表示位置の記載（ScoreとHi-scoreとかイベント表示等の表示座標)
//=============================================================
function gameLayout() {

    const GS_SIZE_X = 640;//GameScreenSize
    const GS_SIZE_Y = 400;//GameScreenSize

    const DSP_SP_X = 0;//192;
    const DSP_SP_Y = 0;//120;

    // NextExp
    this.score_x = DSP_SP_X + GS_SIZE_X - (8 * 12);
    this.score_y = DSP_SP_Y + GS_SIZE_Y - 24;
    // Exp.
    this.hiscore_x = DSP_SP_X + GS_SIZE_X - (8 * 12);
    this.hiscore_y = DSP_SP_Y + GS_SIZE_Y - 32;
    //Debug Status
    this.status_x = DSP_SP_X + GS_SIZE_X - 120;
    this.status_y = DSP_SP_Y + 32;
        
    this.zanki_x = DSP_SP_X + 20;//160;
    this.zanki_y = DSP_SP_Y + GS_SIZE_Y - 16;

    this.time_x = DSP_SP_X + GS_SIZE_X - (8 * 9);
    this.time_y = DSP_SP_Y + GS_SIZE_Y -8;

    this.stage_x = DSP_SP_X + GS_SIZE_X - (8 * 9);
    this.stage_y = DSP_SP_Y + GS_SIZE_Y -16;

    this.map_x = DSP_SP_X;// 640 - 150;
    this.map_y = DSP_SP_Y; // 480 - 48 - 150;

    this.hp_x = DSP_SP_X + 20+148;//168;
    this.hp_y = DSP_SP_Y + GS_SIZE_Y -32;

    this.clip_x = DSP_SP_X ;//+ 140;
    this.clip_y = DSP_SP_Y + GS_SIZE_Y -36;
}


