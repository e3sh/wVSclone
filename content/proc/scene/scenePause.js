//Scene
//
function scenePause(state) {

    let dev = state.System.dev;
    //宣言部
    let work = dev.graphics[3];
 
    //let keys = dev.key_state;

    this.init = scene_init;
    this.reset = scene_reset;
    this.step = scene_step;
    this.draw = scene_draw;

    this.reset_enable = true;

    let menuvf = false;
    let dppmode = false;//debug player paramater mode

    let keywait = 10;
    //let keylock;
    //let keywait = 0;

    let ret_code = 0;
    
    let tutCn = 0;
    const tutCtable = tutorialCommentTable();

    const DSP_X = 320;
    const DSP_Y = 160;

    //処理部
    function scene_init() {

        tsel = 0.0;

        //初期化処理
    }

    function scene_reset() {
        dev.graphics[0].setInterval(0);//BG　WORK2
		dev.graphics[1].setInterval(0);//SPRITE
		dev.graphics[2].setInterval(0);//FG
    
        //work.setInterval(0);//UI

        ret_code = 0;

        //work.fill(DSP_X - 100, DSP_Y, 272, 100, "rgb(32,0,0)");

        work.putchr(" == PAUSE ==", DSP_X - 50, DSP_Y);
        work.putchr("Push <Z>key or [Space] ", DSP_X - 100, DSP_Y + 20);
        //work.fill(DSP_X - 50, DSP_Y + 40, 8*18, 18, "rgb(0,0,0)");
        work.putchr8("   Return game.", DSP_X - 50, DSP_Y + 40);
        work.kprint("　　　ゲームに戻る", DSP_X - 50, DSP_Y + 50);

        work.putchr("Push <@>key /", DSP_X - 100, DSP_Y + 60);
        //work.fill(DSP_X - 50, DSP_Y + 80, 8*18, 18, "rgba(0,0,0)"); 
        work.putchr8(" Save and Quit.", DSP_X - 50, DSP_Y + 80);
        work.kprint("中断してタイトルに戻る", DSP_X - 50, DSP_Y + 90); 

        let res = {load: true, ready:true, data:state.Game, title:"STAT/INV"};
        res.data.stage = state.mapsc.stage;

        if (res.load){
            let t = state.Game.dataview2(res);
            for (let i in t){
                work.kprint(t[i],8, i*8 + 8);
            }
        }
        /*
        let itemname = [
            {no:50, sp:"AmuletR"}
           ,{no:51, sp:"AmuletG"}
           ,{no:52, sp:"AmuletB"}
           ,{no:53, sp:"CandleR"}
           ,{no:54, sp:"CandleB"}
           ,{no:55, sp:"RingR"} 
           ,{no:56, sp:"RingB"}
           ,{no:57, sp:"Mirror"}
           ];
           
        let ypos = 400 -24;
        for (let i=51; i<59; i++){
            if (Boolean(state.obCtrl.item[i])){
                if (state.obCtrl.item[i] > 0) {
                    work.put(itemname[i-51].sp, 12, ypos);
                    ypos -= 24;
                }
            }
        }
        */
        state.obUtil.keyitem_view_draw(work);

        work.draw();
        //work.reset();
        menuvf = false;

        state.Game.cold = true;

        //keylock = true;
        //keywait = 30;
    }

    function scene_step(g, input) {

        keywait--;
        if (keywait > 0) return 0;

        //let kstate = dev.key_state.check();
        let kstate = input.keycode;

        // Select時にWASDを方向キーに使う場合の対策コード
        //let dc = dev.directionM( kstate );
        //if (dc.up)      kstate[38] = true;
        //if (dc.down)    kstate[40] = true;
        //if (dc.left)    kstate[37] = true;
        //if (dc.right)   kstate[39] = true;
       
        let zkey     = (input.trigger.weapon)?true:false;
        //let qkey     = false;
        let numkey   = false; //menu select num
        let arrowkey = (input.up || input.down || input.left || input.right)?true:false;//false; //list select 

        for (let i in kstate){
            if (Boolean(kstate[i])){
                //if (i == 90 || i == 32 ) zkey = true;// [z] or [space]
                //if (i == 81) {//[q]
                //    qkey = true;
                //    delete(kstate[81]);// = false;//押しっぱなし検出する為、予防
                //}
                numkey = ((i >= 48) && (i <= 57))? true: false; //Fullkey[0]-[9]
                //arrowkey = (input.up || input.down || input.left || input.right)?true:false;//up(i >= 37) && (i <= 40))? true: false; //Arrowkey
            }
        }

	    if (input.back){//(input.quit){//(qkey) {2025/06/26変更　QEを別操作に使用予定の為
            if (state.Game.save() == 0) {
	            //alert("ゲーム中断セーブ実施しました。\nタイトルに戻ります。");
                dev.sound.volume(1.0);
                dev.sound.change(9);
                dev.sound.play();
                        
                return 2;//Title
            } else {
                alert("ローカルストレージが使えません。\n中断セーブ出来なかったので、\nゲーム継続します。");
                zkey = true;
            }
        }

        if (zkey) {
            //obCtrl.interrapt = false;
            //obCtrl.SIGNAL = 0;

            dev.sound.volume(1.0);
            work.fill(DSP_X - 100, DSP_Y, 12 * 24, 20 * 5);
            work.draw();

            dev.graphics[0].setInterval(1);//BG　WORK2
            dev.graphics[1].setInterval(1);//SPRITE
            dev.graphics[2].setInterval(1);//FG
            //dev.graphics[3].setInterval(0);//UI
            //work.setInterval(1);//UI

            return 1;//GameScene
        }

        if (arrowkey){
            let s = tutCn;
            for (let i in kstate){
                if (Boolean(kstate[i])){
                    let vy =  
                    + ((input.up)? -1 :0) //upkey
                    //((i == 39)? +40 :0) //rightkey
                    + ((input.down)? +1 :0);//downkey

                    do{
                        s += vy
                        if (s <0 || s>tutCtable.length) break;
                    }while (!Boolean(tutCtable[s]))
                }
            }
            if (s < 0) s = tutCtable.length -1;
            if (s > tutCtable.length) s = 0;
            tutCn = s;
            //HELPMESSAGE
        }

        let inp = -1;
        if (numkey) {
            const debugmode_proc =()=>{
                for (let i in kstate){
                    if (Boolean(kstate[i])){
                        inp = i-48;
                        break;
                    }
                }
                ret_code = 0;

                if (!dppmode){
                    switch (inp){
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
                            state.Game.player.level = (state.Game.player.level++ >= 3) ? 0: state.Game.player.level;
                            break;
                        case 7:
                            ret_code = 8; //sceneOption
                            break;
                        case 8:
                            ret_code = 7; //sceneStatusDisp
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
                }else{
                    switch (inp){
                        case 1://heal Hp
                            state.Game.player.hp += 10;
                            if (state.Game.player.hp > state.Game.player.maxhp)
                                state.Game.player.hp = state.Game.player.maxhp;
                            dev.sound.effect(10);
                            break;
                        case 2://get Lamp
                            state.obCtrl.get_item(26);
                            break;
                        case 3://get Map
                            state.obCtrl.get_item(27);
                            break;
                        case 4:
                            dppmode = (!dppmode);
                            break;
                        case 5://get Key
                            state.obCtrl.get_item(22);
                            break;
                        case 6://get KeyItems
                            for (let i=51; i<59; i++){
                                if (!Boolean(state.obCtrl.item[i]))
                                    state.obCtrl.get_item(i); // DEBUG fullItemTest  
                            } 
                            break;
                        case 7://get ExtendItem
                            state.obCtrl.get_item(21);
                            break;
                        case 0:
                            menuvf = (!menuvf);
                            break;
                        default:
                            break;
                    }
                }
            }
            if (state.Constant.DEBUGMODE_ENABLE) {debugmode_proc();} else {
                if (Boolean(kstate[48])) menuvf = (!menuvf);
            }
        }

        if (numkey || arrowkey){
            work.reset();

            work.fill(0, 264, 400, 30);
            work.fill(0, 240, 8 * 22, 8 * 11);//, "navy");

            if (Boolean(tutCtable[tutCn])){
                let c=(Boolean(state.obUtil.tutorialDone[tutCn]))?":":".";
                for (let i in tutCtable[tutCn]){
                    work.kprint(tutCn + c + i + " " + tutCtable[tutCn][i], 0, 264 + 10 * i);
                }
                for (let i=0; i<5; i++){
                    work.kprint(tutCtable[100+i][0], 100, 56 + 8 * i);
                }
                state.obUtil.keyitem_view_draw(work ,true);
            }else{
                work.kprint(tutCn + ".: Message Empty.", 0, 264);
            }

            //work.fill(0, 240, 8 * 22, 8 * 11);//, "navy");

            if (menuvf){
                let arr = [];

                const debugmode_view =()=>{
                    work.fill(0, 240, 8 * 22, 8 * 11, "navy");
                    work.putchr8("Input ["+ inp +"]" + (dppmode?" PPmode":""), 16, 240);

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
                        arr.push("0: Menu Display   :" + (menuvf?"ON":"OFF"));
                    }else{
                        arr.push("1: Debug Display  :" + (state.Config.debug?"ON":"OFF"));
                        arr.push("2: Lamp(nextStage):" + (state.Config.lamp_use?"ON":"OFF"));
                        arr.push("3: Map (nextStage):" + (state.Config.map_use?"ON":"OFF"));
                        arr.push("4: Change menu    :->");
                        arr.push("5: Bullet(inRange):" + (state.Config.bulletmode?"ON":"OFF"));
                        arr.push("6: Weapon Level   :+" + state.Game.player.level);
                        arr.push("7: Map Option Menu:->");//Import/Export;
                        arr.push("8: Obj Status Disp:->");
                        arr.push("9: (Debug)Log View:" + (state.Config.viewlog?"ON":"OFF"));
                        arr.push("0: Menu Display   :" + (menuvf?"ON":"OFF"));
                    }
                    for (let i in arr){
                        work.putchr8(arr[i], 0, 248 + i * 8);
                    }
                }
                if (state.Constant.DEBUGMODE_ENABLE) {debugmode_view();} else {
                    work.fill(0, 240, 8 * 22, 8 * 11, "gray");
                    work.putchr8("DEBUGMODE_DISABLE", 16, 248);
                }

                //savedata check
                let res = {load: true, ready:true, data:state.Game, title:"STAT/INV"};
                if (res.load){
                    let t = state.Game.dataview2(res);
                    for (let i in t){
                        work.kprint(t[i],8, i*8 + 8);
                    }
                    work.draw();
                }
            }
            work.draw();
            keywait = 10;
        }

        return ret_code;
        //進行
    }

    function scene_draw() {
        //表示
    }
}
