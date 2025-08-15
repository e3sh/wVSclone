function ConstantData(){

    this.objtype = Object.freeze({
        // mob    
        PLAYER:98,  FRIEND:0,   BULLET_P:1, 
        ENEMY:2,    BULLET_E:3,
        ITEM:4,
        ETC:5,
        MOB:9,

        // terrian
        FLOOR:10, 
        WALL:11, 
        DOOR:12, 
        CEIL:13, 
        CIRCLE:14, 
        STONEB:16
    });

    this.layer = Object.freeze({
        BG:0, 
        SP:1,
        FG:2,
        FSP:2,
        BUI:3,
        UI:4,
        EFFECT:5,
        MSG:6 //(screen.length-1)
    });

    this.signal = Object.freeze({
        PAUSE: 1,
        RESULT: 835,
        LVLUP: 1709,
        DEAD: 4649,
        BOSS: 6055
    });

    this.scene = Object.freeze({
        MAIN: 1,        
        TITLE: 2,
        GAMEOVER: 3,
        CONFIG: 4,
        RESULT: 5,
        PAUSE: 6,
        STATUS: 7,
        OPTION: 8,
        LEVELUP: 9
    });

    this.item = Object.freeze({
        BALL: 20,
        COIN: 35,
        KEY: 22,
        BOMB: 23,
        SHIELD: 24,
        LIFEUP: 25,
        EXTEND: 21,
        LAMP: 26,
        MAP: 27         
    });

    this.sound = Object.freeze({
        START: 0,
        NORMAL_BGM: 1,
        TIMEOVER: 3,
        BOSS: 16,
        WARNING: 2,
        STAGECLEAR: 4,
        GAMEOVER: 6,
        GET: 11,
        DEAD: 5,
        SWING: 7,
        BOMB: 13,
        USE: 10,
        LEVELUP: 14,
        JUMP: 17,
        HIT: 12,
        DAMAGE: 8,
        CURSOR: 9,
        FANFARE: 15
    });

    this.DEBUGMODE_ENABLE = true;//false;
}
//BG:0 SP:1 FG:2 FSP:2 BUI:3 UI:4 EFFECT:5 MSG:6

//task_Debug    MSG
//task_Load     MSG
//task_Devic    MSG

//task_main 
// sceneControl     EFFECT
// gameScene        BG SP FG UI
// _UIdebug         BG BUI UI MSG 
// _UIminimap       UI EFFECT
// _UIstateinv      BUI UI EFFECT
// sceneCongig      BUI UI
// sceneGover       BUI UI
// sceneLvUp        BUI UI
// sceneOption      UI
// scenePause       UI
// sceneResult      BUI UI
// sceneStatusDisp  UI
// sceneTitle       BUI UI

