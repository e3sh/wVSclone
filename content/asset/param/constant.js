function ConstantData(){

    this.objtype = {
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
    }

    this.layer = {
        BG:0, 
        SP:1,
        FG:2,
        FSP:2,
        BUI:2,
        UI:3,
        EFFECT:4,
        MSG:4 //(screen.length-1)
    }

    this.signal = {
        PAUSE: 1,
        RESULT: 835,
        LVLUP: 1709,
        DEAD: 4649,
        BOSS: 6055
    }


    this.DEBUGMODE_ENABLE = true;//false;
}
//BG:0 SP:1 FG:3 FSP:4 BUI:5 UI:6 EFFECT:7 DEBUG:8

//task_Debug 4 MSG
//task_Load 4 MSG
//task_Device 4 MSG

//task_main 
// sceneControl 4 EFFECT
// gameScene 0 1 2 3 BG SP FG UI
// _UIdebug 0:BGcollision 2:debugtext 3:itemstacklist BG UI MSG 
// _UIminimap 3:map 4:point UI EFFECT
// _UIstateinv 3 4:point Ui EFFECT
// sceneCongig 0 2 3 BUI UI
// sceneGover 2 3 BUI UI
// sceneLvUp 2 3 BUI UI
// sceneOption 3 UI
// scenePause 3 UI
// sceneResult 2 3 BUI UI
// sceneStatusDisp 3 UI
// sceneTitle 0 3 BUI UI

