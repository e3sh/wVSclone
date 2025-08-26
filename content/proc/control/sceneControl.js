// sceneControl
//sceneが増えてきてmainがすっきりとしなくなったので分離の為作成。2011/05/04
/**
 * @class
 * @classdesc
 * ゲームのシーン（画面）の切り替えとライフサイクルを管理するクラスです。<br>\
 * 登録された各シーンのステップと描画を制御し、<br>\
 * シーン間のスムーズな遷移のためのワイプエフェクトを提供します。
 */
class sceneControl {
    /**
     * @constructor
     * @param {stateControl} state GameCore.state
     * @description
     * `sceneControl`インスタンスを初期化します。<br>\
     * 利用可能な全てのシーンを登録し、最初のシーン（タイトル）を設定します。<br>\
     * ワイプエフェクト用の変数も準備します。
     */
    constructor(state) {
        const scrn = state.System.dev.graphics[state.Constant.layer.EFFECT]; //Wipescreen

        const titleSce = [];
        const sceneList = [];

        sceneList[1] = new gameScene(state); titleSce[1] = "Main"; //state.Result.load()はここ//hiscoreをlocalstorageから復帰
        sceneList[2] = new sceneTitle(state); titleSce[2] = "Title";
        sceneList[3] = new sceneGover(state); titleSce[3] = "Gover";
        sceneList[4] = new sceneConfig(state); titleSce[4] = "Config"; //state.Config.load()はここ//configをlocalstorageから復帰
        sceneList[5] = new sceneResult(state); titleSce[5] = "Result";
        sceneList[6] = new scenePause(state); titleSce[6] = "Pause";
        sceneList[7] = new sceneStatusDisp(state); titleSce[7] = "Status";
        sceneList[8] = new sceneOption(state); titleSce[8] = "Option";
        sceneList[9] = new sceneLvUp(state); titleSce[9] = "LvUp";

        let wipeEffectCount;
        let wipemode = "fade";

        let twcw = [];
        let twcwEnable = true;
        let twcwIdlist = [];

        for (let i in sceneList) {
            sceneList[i].init();
        }

        const TITLERC = 2;
        const MAINRC = 0;
        const LVUPRC = 9;

        let rc = TITLERC; // 最初のSceneはTitle
        let runscene = rc;

        let sceneStartTime = 0;
        let beforeSceneTime = 0;
        let beforeSceneNo =0;

        /**
         * 全ての登録済みシーンの`reset_enable`フラグを`true`に設定します。<br>\
         * これにより、各シーンが次に実行される際に自身の初期化処理を行います。
         */
        function reset() {
            for (let i in sceneList) {
                sceneList[i].reset_enable = true;
            }
        }
        /**
         * @method
         * @param {Screen} g dev.graphics[x] 
         * @param {inputMainTask} input inputListObject 
         * @description
         * 現在実行中のシーンの`step`メソッドを呼び出し、ゲームの論理的な更新を行います。<br>\
         * シーン切り替えが発生している場合は、新しいシーンへの移行処理を制御します。
         */
        this.step = function (g, input) {
            //fcnt ++;
            if (rc != 0) {
                //Sceneの切り替えが発生している。
                //wipeEffectCount = scrn.cw/2;
                let fg = false; // continue flag
                if (rc >= 10) { //resultからGameSceneへ戻るときは+10(としてContinueであることを知らせている。過去の名残。returnを
                    //状態ステータスのオブジェクト参照とかにすればスマートなのでよいが、困ってないので何か都合が悪い状況になったら修正する。)
                    rc = rc % 10;
                    fg = true;
                    //continue flag on時(次の面に行く場合)にはWipe表示
                    wipeEffectCount = scrn.cw / 2;
                    wipemode = "fade";
                }
                //(GameStartの時もWipe表示)TITLE画面からGameSceneへ来た時
                if (runscene == TITLERC && rc == 1) {
                    wipeEffectCount = scrn.cw / 2;
                    wipemode = "circle";
                }

                beforeSceneNo = runscene;
                //移動してくるときにWipeEffect有りとなるのば、rc_code>=10の場合（TITLEからGameSceneの場合は関係なし)
                runscene = rc;

                beforeSceneTime = g.time() - sceneStartTime;
                sceneStartTime = g.time();

                // 該当Sceneの.reset_enableがfalseの場合はreset経由せずに直接戻る
                if (sceneList[runscene].reset_enable) {
                    if (runscene == TITLERC) reset(); //TITLEに戻るときにすべてのsceneのreset_enableをtrueに戻しておく。

                    //GameSceneのPauseから復帰のステータスが残ったままになってしまい、quit後の再実行時不具合になるため。
                    sceneList[runscene].reset(fg);
                }
            }
            rc = sceneList[runscene].step(g, input);

            wipeEffectCount = (wipeEffectCount > 0) ?
                wipeEffectCount - (3 * 60 / (1000 / state.System.deltaTime())) :
                0;

            if (twcwEnable) {
                for (let i in twcw) {
                    if (twcw[i].running) twcw[i].step();
                }
            }
        };
        /**
         * @method
         * @returns {object} SceneStatus
         * @example
         *  result = scene.status();
         *  result.now.title ,result.now.startTime, result.before.title, result.before.execTime 
         * @description
         * 現在と前回のシーンステータスを返します。<br>\
         * ― 現在実行中ののシーン名と開始システムタイム<br>\
         * ― 前回実行したシーン名と実行時間
         */
        this.status = function(){

            return {
                now:   { title:titleSce[rc], startTime:Math.trunc(sceneStartTime)},             
                before:{ title:titleSce[beforeSceneNo], execTime:Math.trunc(beforeSceneTime)}
                }
        }

        /**
         * @method
         * @description
         * 現在実行中のシーンの`draw`メソッドを呼び出し、ゲーム画面を描画します。<br>\
         * シーン切り替え中の場合は、ワイプエフェクトを重ねて描画します。<br>\
         * デバッグモードが有効な場合は、現在のシーン名を表示します。
         */
        this.draw = function () {

            if (wipeEffectCount > 0) {

                EffectWipeFrame(scrn.cw / 2 - wipeEffectCount, wipemode);
            } else {
                //scrn.fill(0, 0, scrn.cw, scrn.ch, "black");
                //scrn.fill(192, 120, 640, 400);
            }

            sceneList[runscene].draw();

            if (twcwEnable) {
                for (let i in twcw) {
                    if (twcw[i].running) {
                        twcw[i].draw();
                    } else {
                        twcw.splice(i, 1);
                        //delete twcw[i]; //これでは配列要素は減らない
                        //console.log(twcw.length);
                    }
                }
            }

            if (state.Config.debug) {
                let st = "SCENE:" + titleSce[runscene];

                const bar = {};

                bar.x = state.System.dev.layout.debugstatus.x;
                bar.y = state.System.dev.layout.debugstatus.y - 24;
                bar.l = st.length * 8;

                bar.draw = function (device) {
                    device.globalCompositeOperation = "source-over";
                    device.beginPath();
                    device.fillStyle = "black";
                    device.lineWidth = 1;
                    device.fillRect(this.x, this.y, this.l, 8);
                    //device.stroke();
                };
                if (state.System.blink()) scrn.putFunc(bar);
                scrn.putchr8(st, bar.x, bar.y);

                scrn.kprint("StartTime:" + Math.trunc(sceneStartTime),bar.x, bar.y+8); 
                scrn.kprint("bs:" + titleSce[beforeSceneNo] + "/r:" + Math.trunc(beforeSceneTime),bar.x, bar.y+16); 
            }
        };

        /**
         * 
         * @param {number} size フェード薄さ/(円/箱)抜きのサイズ 
         * @param {string} [mode="fade"] "fade" or "box" or "circle"
         * @description
         * 画面ワイプエフェクトを描画します。
         * `fade`（フェードイン/アウト）、`box`（ボックス状に閉じる）、`circle`（円形に閉じる）のモードがあり、<br>\
         * 画面全体を覆う黒い（または半透明の）グラフィックを生成します。
         */
        function EffectWipeFrame(size, mode = "fade") {

            let cw = scrn.cw;
            let ch = scrn.ch;

            let alpha, c;

            switch (mode) {
                case "fade":
                    alpha = ((cw - size * 2) / cw);
                    //let alpha = Math.abs(Math.sin(((cw-size*2) /cw)*Math.PI)); 
                    c = "rgba(0,0,0," + alpha + ")";

                    scrn.fill(0, 0, cw, ch, c);
                    break;
                case "box":
                    c = "black";

                    scrn.fill(0, 0, cw, ch / 2 - size, c);
                    scrn.fill(0, ch / 2 + size, cw, ch / 2 - size, c);

                    scrn.fill(0, 0, cw / 2 - size, ch, c);
                    scrn.fill(cw / 2 + size, 0, cw / 2 - size, ch, c);
                    break;
                case "circle":
                    c = "black";
                    scrn.fill(0, 0, cw, ch, c);

                    let earc = { x: cw / 2, y: ch / 2, r: size };
                    earc.draw = function (device) {
                        device.globalCompositeOperation = "destination-out";
                        device.beginPath();
                        device.fillStyle = "green";
                        device.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
                        device.fill();
                        device.restore();
                        device.globalCompositeOperation = "source-over";
                    };
                    scrn.putFunc(earc);
                    break;
                default:
                    break;
            }
        }

        /**
         * @class
         * @classdesc
         * 矩形領域の開閉アニメーションを制御するための内部クラスです。<br>\
         * 指定された領域が徐々に閉じたり開いたりする視覚効果を生成します。
         */
        class tweenclosewindow {
            constructor(id) {

                let center_x, center_y, count, w, h, vw, vh;
                let device;

                /**
                 * @member
                 * @description
                 * task runnning status
                 */
                this.running = false;

                /**
                 * @member
                 * @description
                 * tweenWindowId
                 */
                this.windowId = id;

                /**
                 * @member
                 * @description
                 * modeclose?
                 */
                this.close;

                /**
                 * @method
                 * @param {Screen} dev dev.graphics[x]
                 * @param {Rect} rect Rect{x:y:w:h:} 
                 * @param {number} c lifetime(frame)
                 * @param {boolean} [close] defalt:close any:open 
                 * @description
                 * ウィンドウアニメーションのパラメータを設定します。<br>\
                 * 描画デバイス、アニメーション対象の矩形領域、フレーム数、開閉方向（`close`）を指定します。
                 */
                this.set = function (dev, rect, c, close) {

                    center_x = rect.x + rect.w / 2;
                    center_y = rect.y + rect.h / 2;

                    if (!Boolean(close)) { //default close else open
                        w = rect.w;
                        h = rect.h;

                        vw = -(rect.w / c);
                        vh = -(rect.h / c);
                        this.close = true;

                    } else {
                        w = 0;
                        h = 0;

                        vw = rect.w / c;
                        vh = rect.h / c;
                        this.close = false;
                    }
                    count = c;
                    device = dev;

                    this.running = true;
                };

                /**
                 * @method
                 * @description
                 * ウィンドウアニメーションの進行を1ステップ進めます。<br>\
                 * 矩形の幅と高さを計算し、フレームカウンタを減少させます。<br>\
                 * アニメーションが終了すると`running`フラグを`false`にします。
                 */
                this.step = function () {
                    w += vw;
                    h += vh;

                    count--;
                    if (count <= 0) {
                        this.running = false;
                    }
                };

                /**
                 * @method
                 * @description
                 * ウィンドウアニメーションの現在の状態を描画します。<br>\
                 * 半透明の黒い矩形と白い枠線を描画して、開閉するウィンドウを表現します。
                 */
                this.draw = function () {

                    const bx = { x: center_x - w / 2, y: center_y - h / 2, w: w, h: h };
                    bx.draw = function (device) {
                        device.beginPath();
                        device.globalAlpha = 1.0;
                        device.lineWidth = 1;
                        device.strokeStyle = "rgba(255,255,255,1.0)";
                        device.strokeRect(this.x, this.y, this.w, this.h);
                        device.fillStyle = "rgba(0,0,0,0.5)";
                        device.fillRect(this.x, this.y, this.w, this.h);
                        device.restore();
                    };
                    device.putFunc(bx);
                };
            }
        }
        /**
         * @method
         * @param {Screen} device dev.graphics[x]
         * @param {Rect} rect 矩形領域
         * @param {number} count フレーム数
         * @param {boolean} [close] 開閉方向 defalt:close any:open 
         * @param {stringn} [id] windowname 
         * @description
         * ウィンドウ開閉アニメーション（`tweenclosewindow`）を登録し、実行します。<br>\
         * 指定されたデバイス、矩形領域、フレーム数で新しいアニメーションインスタンスを作成します。
         */
        this.setTCW = function (device, rect, count, close, id) {

            let setup = true;
            if (Boolean(id)){
                if (Boolean(close)){
                    //open
                    if (twcwIdlist.includes(id)){
                        setup = false; //open中に同じidのopen指示が来た時には登録しない
                    }else{
                        twcwIdlist.push(id);//リストに追加
                    }
                }else{
                    //close
                    for(let i in twcwIdlist){
                        if (twcwIdlist[i] == id){twcwIdlist.splice(i)}
                    }

                }
            }

            if (setup){
                const tcw = new tweenclosewindow(id);
                tcw.set(device, rect, count, close);

                twcw.push(tcw);
            }
        };
        /**
         * @method
         * @description
         * 登録されている全てのウィンドウ開閉アニメーションを一時停止します。
         */
        this.pauseTCW = function () {
            twcwEnable = false;
        };
        /**
         * @method
         * @description
         * 一時停止中のウィンドウ開閉アニメーションを再開します。
         */
        this.resumeTCW = function () {
            twcwEnable = true;
        };


    }
}

