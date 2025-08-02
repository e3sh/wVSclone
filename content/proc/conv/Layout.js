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
    this.nextexp = {
        x: DSP_SP_X + GS_SIZE_X - (8 * 12),
        y: DSP_SP_Y + GS_SIZE_Y - 24
    }

    // Exp.
    this.exp = {
        x: DSP_SP_X + GS_SIZE_X - (8 * 12),
        y: DSP_SP_Y + GS_SIZE_Y - 32
    }
 
    // Debug Status
    this.debugstatus ={
        x: DSP_SP_X + GS_SIZE_X - 120,
        y: DSP_SP_Y + 32
    }

    this.debugmessage ={
        x: DSP_SP_X,
        y: DSP_SP_Y + 150
    }

    this.debugspriteobject ={
        x: DSP_SP_X + 160,
        y: DSP_SP_Y + 0
    }

    // Zanki
    this.zanki = {
        x: DSP_SP_X + 20,
        y: DSP_SP_Y + GS_SIZE_Y - 16
    }

    //ball  
    this.ball = {
        x: DSP_SP_X + 20 +288,
        y: DSP_SP_Y + GS_SIZE_Y - 26
    }

    //coin
    this.coin = {
        x: DSP_SP_X + 20 +288,
        y: DSP_SP_Y + GS_SIZE_Y - 8
    }
    
    //items
    this.items = {
        x: DSP_SP_X + 20 +128 , 
        y: DSP_SP_Y + GS_SIZE_Y - 16
    }

    //key
    this.key = {
        x: DSP_SP_X + 20 + 64, 
        y: DSP_SP_Y + GS_SIZE_Y - 16
    }

    //weapon
    this.weapon = {
        x: DSP_SP_X + 20  +96, 
        y: DSP_SP_Y + GS_SIZE_Y - 16
    }

    //time
    this.time = {
        x: DSP_SP_X + GS_SIZE_X - (8 * 9), 
        y: DSP_SP_Y + GS_SIZE_Y -8
    }

    //stage number 
    this.stage = {
        x: DSP_SP_X + GS_SIZE_X - (8 * 9), 
        y: DSP_SP_Y + GS_SIZE_Y -16
    }

    //minimap
    this.map = {
        x: DSP_SP_X, 
        y: DSP_SP_Y
    }

    //hpbar
    this.hp = {
        x: DSP_SP_X + 168, 
        y: DSP_SP_Y + GS_SIZE_Y -34
    }

    //underline
    this.clip = {
        x: DSP_SP_X, 
        y: DSP_SP_Y + GS_SIZE_Y -36
    }

    //itemlist
    this.keyitem = {
        x: DSP_SP_X + 368, 
        y: DSP_SP_Y + GS_SIZE_Y -16
    }

    //tutorial window
    this.tutmsg = {
        x: DSP_SP_X + 20, 
        y: DSP_SP_Y + GS_SIZE_Y -96
    }

    //lvupstatus
    this.status = {
        x: DSP_SP_X + 20 +252,
        y: DSP_SP_Y + GS_SIZE_Y -34
    }
}


