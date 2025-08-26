//Scene
//
/**
 * @class
 * @classdesc
 * ゲームの一時停止画面を管理するためのコンポーネントです。<br>\
 * プレイヤーがゲームを一時停止した際に表示されるメニューや情報表示、デバッグ機能などを担当します。
 */
class scenePause {
    constructor(state) {

        const dev = state.System.dev;
        //宣言部
        const UI_layer = dev.graphics[state.Constant.layer.UI];

        //let keys = dev.key_state;
        /**
         * @method
         */
        this.init = scene_init;
        /**
         * @method
         */
        this.reset = scene_reset;
        /**
         * @method
         */
        this.step = scene_step;
        /**
         * @method
         */
        this.draw = scene_draw;

        this.reset_enable = true;

        let menuvf = false;
        let dppmode = false; //debug player paramater mode

        let keywait = 10;
        //let keylock;
        //let keywait = 0;
        let ret_code = 0;

        let tutCn = 0;
        const tutCtable = state.Database.tutCommentTable;

        const DSP_X = 320;
        const DSP_Y = 160;

        //処理部
        /**
         * @description
         * initialize
         */
        function scene_init() {

            // tsel = 0.0;
            //初期化処理
        }
        /**
         * @description
         * reset
         */
        function scene_reset() {

            dev.pauseBGSP();

            //UI_layer.setInterval(0);//UI
            ret_code = 0;

            //UI_layer.fill(DSP_X - 100, DSP_Y, 272, 100, "rgb(32,0,0)");
            UI_layer.putchr(" == PAUSE ==", DSP_X - 50, DSP_Y);
            UI_layer.putchr("Push <Z>key or [Space] ", DSP_X - 100, DSP_Y + 20);
            //UI_layer.fill(DSP_X - 50, DSP_Y + 40, 8*18, 18, "rgb(0,0,0)");
            UI_layer.putchr8("   Return game.", DSP_X - 50, DSP_Y + 40);
            UI_layer.kprint("　　　ゲームに戻る", DSP_X - 50, DSP_Y + 50);

            UI_layer.putchr("Push <@>key /", DSP_X - 100, DSP_Y + 60);
            //UI_layer.fill(DSP_X - 50, DSP_Y + 80, 8*18, 18, "rgba(0,0,0)"); 
            UI_layer.putchr8(" Save and Quit.", DSP_X - 50, DSP_Y + 80);
            UI_layer.kprint("中断してタイトルに戻る", DSP_X - 50, DSP_Y + 90);

            let res = { load: true, ready: true, data: state.Game, title: "STAT/INV" };
            res.data.stage = state.mapsc.stage;

            if (res.load) {
                let t = state.Game.dataview2(res);
                for (let i in t) {
                    UI_layer.kprint(t[i], 8, i * 8 + 8);
                }
            }
            state.obUtil.keyitem_view_draw(UI_layer);

            UI_layer.draw();
            //UI_layer.reset();
            menuvf = false;

            state.Game.cold = true;
        }
        /**
         * 
         * @param {*} g 
         * @param {*} input 
         * @returns return_code normal 0;
         */
        function scene_step(g, input) {

            keywait--;
            if (keywait > 0) return 0;

            let kstate = input.keycode;
            let zkey = (input.trigger.weapon) ? true : false;

            let numkey = false; //menu select num
            let arrowkey = (input.up || input.down || input.left || input.right) ? true : false; //false; //list select 

            for (let i in kstate) {
                if (Boolean(kstate[i])) {
                    numkey = ((i >= 48) && (i <= 57)) ? true : false; //Fullkey[0]-[9]
                }
            }

            if (input.back) { //(input.quit){//(qkey) {2025/06/26変更　QEを別操作に使用予定の為
                if (state.Game.save() == 0) {
                    //alert("ゲーム中断セーブ実施しました。\nタイトルに戻ります。");
                    dev.sound.volume(1.0);
                    dev.sound.change(state.Constant.sound.CURSOR);
                    dev.sound.play();

                    return state.Constant.scene.TITLE; //Title
                } else {
                    alert("ローカルストレージが使えません。\n中断セーブ出来なかったので、\nゲーム継続します。");
                    zkey = true;
                }
            }

            if (zkey) {
                dev.sound.volume(1.0);
                UI_layer.fill(DSP_X - 100, DSP_Y, 12 * 24, 20 * 5);
                UI_layer.draw();
                dev.resumeBGSP();
                return state.Constant.scene.MAIN; //GameScene
            }

            if (arrowkey) {
                let s = tutCn;
                for (let i in kstate) {
                    if (Boolean(kstate[i])) {
                        let vy = +((input.up) ? -1 : 0) //upkey

                            //((i == 39)? +40 :0) //rightkey
                            + ((input.down) ? +1 : 0); //downkey

                        do {
                            s += vy;
                            if (s < 0 || s > tutCtable.length) break;
                        } while (!Boolean(tutCtable[s]));
                    }
                }
                if (s < 0) s = tutCtable.length - 1;
                if (s > tutCtable.length) s = 0;
                tutCn = s;
                //HELPMESSAGE
            }

            let inp = -1;
            if (numkey) {
                const debugmode_proc = () => {
                    for (let i in kstate) {
                        if (Boolean(kstate[i])) {
                            inp = i - 48;
                            break;
                        }
                    }
                    ret_code = 0;

                    if (!dppmode) {
                        switch (inp) {
                            case 1:
                                state.Config.debug = (!state.Config.debug);
                                break;
                            case 2:
                                state.Config.lamp_use = (!state.Config.lamp_use);
                                break;
                            case 3:
                                state.Config.map_use = (!state.Config.map_use);
                                break;
                            case 4:
                                //state.System.dev.sound.mute = (!state.System.dev.sound.mute);
                                dppmode = (!dppmode);
                                break;
                            case 5:
                                state.Config.bulletmode = (!state.Config.bulletmode);
                                break;
                            case 6:
                                state.Game.player.level = (state.Game.player.level++ >= 3) ? 0 : state.Game.player.level;
                                break;
                            case 7:
                                ret_code = state.Constant.scene.OPTION; //sceneOption
                                break;
                            case 8:
                                ret_code = state.Constant.scene.STATUS; //sceneStatusDisp
                                break;
                            case 9:
                                state.Config.viewlog = (!state.Config.viewlog);
                                break;
                            case 0:
                                menuvf = (!menuvf);
                                break;
                            default:
                                break;
                        }
                    } else {
                        switch (inp) {
                            case 1: //heal Hp
                                state.Game.player.hp += 10;
                                if (state.Game.player.hp > state.Game.player.maxhp)
                                    state.Game.player.hp = state.Game.player.maxhp;
                                dev.sound.effect(state.Constant.sound.USE);
                                break;
                            case 2: //get Lamp
                                state.obCtrl.get_item(26);
                                break;
                            case 3: //get Map
                                state.obCtrl.get_item(27);
                                break;
                            case 4:
                                dppmode = (!dppmode);
                                break;
                            case 5: //get Key
                                state.obCtrl.get_item(22);
                                break;
                            case 6: //get KeyItems
                                for (let i = 51; i < 59; i++) {
                                    if (!Boolean(state.obCtrl.item[i]))
                                        state.obCtrl.get_item(i); // DEBUG fullItemTest  
                                }
                                break;
                            case 7: //get ExtendItem
                                state.obCtrl.get_item(21);
                                break;
                            case 0:
                                menuvf = (!menuvf);
                                break;
                            default:
                                break;
                        }
                    }
                };
                if (state.Constant.DEBUGMODE_ENABLE) { debugmode_proc(); } else {
                    if (Boolean(kstate[48])) menuvf = (!menuvf);
                }
            }

            if (numkey || arrowkey) {
                UI_layer.reset();

                UI_layer.fill(0, 264, 400, 30);
                UI_layer.fill(0, 240, 8 * 22, 8 * 11); //, "navy");

                if (Boolean(tutCtable[tutCn])) {
                    let c = (Boolean(state.obUtil.tutorialDone[tutCn])) ? ":" : ".";
                    for (let i in tutCtable[tutCn]) {
                        UI_layer.kprint(tutCn + c + i + " " + tutCtable[tutCn][i], 0, 264 + 10 * i);
                    }
                    for (let i = 0; i < 5; i++) {
                        UI_layer.kprint(tutCtable[100 + i][0], 100, 56 + 8 * i);
                    }
                    state.obUtil.keyitem_view_draw(UI_layer, true);
                } else {
                    UI_layer.kprint(tutCn + ".: Message Empty.", 0, 264);
                }

                //UI_layer.fill(0, 240, 8 * 22, 8 * 11);//, "navy");
                if (menuvf) {
                    let arr = [];

                    const debugmode_view = () => {
                        UI_layer.fill(0, 240, 8 * 22, 8 * 11, "navy");
                        UI_layer.putchr8("Input [" + inp + "]" + (dppmode ? " PPmode" : ""), 16, 240);

                        if (dppmode) {
                            arr.push("1: Heal HP :" + state.Game.player.hp + "/" + state.Game.player.maxhp);
                            arr.push("2: Get Lamp       :");
                            arr.push("3: Get Map        :");
                            arr.push("4: Change menu    :->");
                            arr.push("5: Get Key        :");
                            arr.push("6: Get Keyitems   :");
                            arr.push("7: Get Extend     :" + state.Game.player.zanki);
                            arr.push("8:                :");
                            arr.push("9:                :");
                            arr.push("0: Menu Display   :" + (menuvf ? "ON" : "OFF"));
                        } else {
                            arr.push("1: Debug Display  :" + (state.Config.debug ? "ON" : "OFF"));
                            arr.push("2: Lamp(nextStage):" + (state.Config.lamp_use ? "ON" : "OFF"));
                            arr.push("3: Map (nextStage):" + (state.Config.map_use ? "ON" : "OFF"));
                            arr.push("4: Change menu    :->");
                            arr.push("5: Bullet(inRange):" + (state.Config.bulletmode ? "ON" : "OFF"));
                            arr.push("6: Weapon Level   :+" + state.Game.player.level);
                            arr.push("7: Map Option Menu:->"); //Import/Export;
                            arr.push("8: Obj Status Disp:->");
                            arr.push("9: (Debug)Log View:" + (state.Config.viewlog ? "ON" : "OFF"));
                            arr.push("0: Menu Display   :" + (menuvf ? "ON" : "OFF"));
                        }
                        for (let i in arr) {
                            UI_layer.putchr8(arr[i], 0, 248 + i * 8);
                        }
                    };
                    if (state.Constant.DEBUGMODE_ENABLE) { debugmode_view(); } else {
                        UI_layer.fill(0, 240, 8 * 22, 8 * 11, "gray");
                        UI_layer.putchr8("DEBUGMODE_DISABLE", 16, 248);
                    }

                    //savedata check
                    let res = { load: true, ready: true, data: state.Game, title: "STAT/INV" };
                    if (res.load) {
                        let t = state.Game.dataview2(res);
                        for (let i in t) {
                            UI_layer.kprint(t[i], 8, i * 8 + 8);
                        }
                        UI_layer.draw();
                    }
                }
                UI_layer.draw();
                keywait = 10;
            }

            return ret_code;
            //進行
        }
        /**
         * 
         */
        function scene_draw() {
            //表示
        }
    }
}
