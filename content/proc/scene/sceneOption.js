//Scene
//
/**
 * @class
 * @classdesc
 * オプション画面を管理するシーンです。<br>\
 * ゲームの各種デバッグ機能や、マップ関連のユーティリティ（エクスポート、表示切り替えなど）を提供します。
 */
class sceneOption {
    /**
     * @constructor
     * @param {stateControl} state GameCore.state
     * @description
     * `sceneOption`インスタンスを初期化します。<br>\
     * デバッグ表示のモードや、キーロックのための変数を準備します。 
     */
    constructor(state) {

        const dev = state.System.dev;
        //宣言部
        const UI_layer = dev.graphics[state.Constant.layer.UI];

        //let keys = dev.key_state;
        this.reset_enable = true;

        let keywait = 10;

        let mobvf = true;

        let ret_code = state.Constant.scene.PAUSE; //scenePause
        let retmf = false; //return mode false:pause true:gameS

        let sel = 0;

        let cmapdf = false;

        let nowstage = state.Game.nowstage;

        //処理部
        /**
         * @method
         * @description
         * シーンの初期化処理を実行します。
         */
        this.init = ()=>{
            //初期化処理
        }
        /**
         * @method
         * @description
         * オプションシーンの状態をリセットします。<br>\
         * 背景描画を停止し、UI表示をクリアし、<br>\
         * 各種デバッグ表示フラグを初期化します。 
         */
        this.reset = ()=>{
            //dev.graphics[0].setInterval(0);//BG　WORK2
            //dev.graphics[1].setInterval(0);//SPRITE
            //dev.graphics[2].setInterval(0);//FG
            dev.pauseBGSP();

            UI_layer.setInterval(0); //UI

            sel = 0;
            nowstage = state.Game.nowstage;

            ret_code = state.Constant.scene.PAUSE; //scenePause
            retmf = false; //return mode false:pause true:gameS
        }
        /**
         * @method
         * @param {Screen} g dev.graphics[x]
         * @param {inputMainTask} input inputResultObject
         * @returns {number} screenResultStatus
         * @description
         * オプション画面の入力処理と各種デバッグ機能の実行ロジックです。<br>\
         * キーボード入力（Z, C, V, I, E, R, 数字キー、矢印キー）を検出し、<br>\
         * 画面クリア、MOB表示切り替え、マップ表示切り替え、マップエクスポートなどを実行します。
         */
        this.step = (g, input)=> {

            keywait--;
            if (keywait > 0) return 0;

            // input key section
            let kstate = input.keycode; //dev.key_state.check();
            let zkey = input.trigger.weapon;//false; //exit button
            let ckey = input.trigger.jump;//false; //dispalyclear
            let vkey = input.vkey;//false; //inventry_view
            let xkey = input.trigger.useitem;//false; //map_reset
            let ekey = input.trigger.select;//false; //map_reset

            let numkey = (input.numkey != -1)? true: false;//((i >= 48) && (i <= 57)) ? true : false; //Fullkey[0]-[9]
            let arrowkey = (input.up || input.down || input.left || input.right) ? true : false; //Arrowkey

            if (zkey || ckey || xkey || ekey || vkey || numkey || arrowkey) keywait = 8;

            // select key function section
            if (zkey) {

                UI_layer.reset();
                UI_layer.clear();
                UI_layer.draw();

                if (retmf) {
                    dev.resumeBGSP();
                    //state.Game.cold = true;
                }
                return ret_code;
                //return 6;//return scenePause
            }

            if (ckey) {
                dev.clearBGSP();
            }

            if (vkey) {
                mobvf = (!mobvf);
            }

            if (xkey) {
                cmapdf = (cmapdf) ? false : true;
                //IMPORT
            }
            if (ekey) {
                //EXPORT
                state.mapsc.mapexport(nowstage);
            }

            if (numkey) { }
            if (arrowkey) {
                let s = sel;
                s = s + ((input.up) ? -1 : 0) //upkey
                    + ((input.down) ? +1 : 0); //downkey

                if (s < 0) s = 0;
                sel = s;

                s = nowstage;
                s = s + ((input.left) ? -1 : 0) //leftkey 
                    + ((input.right)  ? +1 : 0); //rightkey

                retmf = true;
                ret_code = state.Constant.scene.TITLE; // TITLE;

                if (s < 0) s = 0;
                nowstage = s;
                state.mapsc.change(s); //
            }

            let s = "";
            for (let i in kstate) {
                if (kstate[i]) s = s + "[" + i + "]";
            }
            UI_layer.reset();
            UI_layer.clear();

            let st = [];
            st.push("INPUT KEY:" + s);
            st.push("=== COMMAND ===");
            st.push("Z: " + (retmf ? "RETURN TITLE" : "EXIT"));
            st.push("C: CLEAR_SCREEN");
            st.push("V: MOB  VIEW: " + ((mobvf) ? "ON" : "OFF"));
            st.push("X: CMAP VIEW: " + ((cmapdf) ? "ON" : "OFF"));

            //st.push("I: MAP_IMPORT（"+(ikey?"?":"未実装")+"）" );
            st.push("E: MAP_EXPORT");
            //st.push("R: -//MAP_RESET" );
            for (let i in st) {
                UI_layer.kprint(st[i], 0, 0 + i * 8);
            }

            mapDraw();
            if (mobvf) charDraw(sel);
            if (cmapdf) cmapDraw();
            UI_layer.kprint("Stage:" + state.mapsc.chacheUseStatus(), 150, 0);
            UI_layer.kprint("Stage:" + nowstage, 150, 8);

            UI_layer.draw();

            return 0;
            //進行
        }
        /**
         * @method
         * @description
         * オプション画面のUI要素を描画します。<br>\
         * 現在の入力キー、コマンドリスト、マップ表示、オブジェクト表示などを表示します。
         */
        this.draw = () =>{
            //UI_layer.reset();
        }

        // drawPoint ==================================
        // マップ用オブジェクト位置描画 sce
        /**
         * 
         * @param {number} sel selectNumber
         * @description
         * マップの初期配置オブジェクトを画面に描画します（デバッグ用）。<br>\
         * オブジェクトのキャラクタータイプに応じてスプライトを色分けして表示します。
         */
        function charDraw(sel) {

            const ctable = {
                0: "Mayura1", //自機
                1: "Unyuu1", //敵
                14: "Unyuu3", //Boss
                15: "Wand", //Wand
                16: "Knife", //Knife
                17: "Axe", //Axe
                18: "Spear", //Spear
                19: "Boom", //Boom
                20: "Ball1", //玉
                21: "miniMay", //1UP
                22: "Key", //Key
                23: "BallB1", //爆弾
                24: "BallS1", //ﾊﾞﾘｱ
                25: "BallL1", //回復
                26: "Lamp", //Lamp
                27: "Map", //Map
                34: "Unyuu2", //sBoss
                35: "Coin1", //Coin
                40: "TrBox", //TrBox
                50: "Bow" //Bow
                ,
                51: "AmuletR" // MP50 AmuletR
                ,
                52: "AmuletG" // MP51,AmuletG
                ,
                53: "AmuletB" // MP52,AmuletB
                ,
                54: "CandleR",
                55: "CandleB",
                56: "RingR",
                57: "RingB",
                58: "Mirror"
            };

            let obj = state.mapsc.ini_sc();

            for (let i in obj) {
                let o = obj[i];

                let c = "" + o.ch;
                if (Boolean(ctable[o.ch])) c = ctable[o.ch];

                let x = (i > 39) ? 540 : 16;
                let y = ((i > 39) ? (i - 40) * 8 : i * 8 + 64);
                let s = "  :" + o.sc;
                let z = 0.5;

                if (i == sel) {
                    s = "  :[SELECT]";
                    //UI_layer.fill(150 + o.x/8, o.y/8, 16, 16, "green");
                    z = 1.0;
                }

                UI_layer.put(c, x, y, 0, 0, 255, z);
                UI_layer.kprint(s, x, y);

                UI_layer.put(c,
                    150 + Math.floor(o.x / 8), Math.floor(o.y / 8),
                    0, 0, 255,
                    z);
            }
        }

        //マップ表示
        /**
         * @description
         * マップチップの簡易表示を描画します。<br>\
         * マップチップの可視性とタイプに基づいて色を決定し、矩形を塗りつぶして表示します。
         */
        function mapDraw() {

            const mcp = state.mapsc.mapChip();
            //0:floor 1:wall 2:door 3:ciel 4:circle,5:?,6:stoneb
            const c = ["dimgray", "steelblue", "orange", " rgba(255,0,0,0.3)", "white", "gray", "cyan"];
            for (let i = 0, loopend = mcp.length; i < loopend; i++) {

                let mc = mcp[i];

                //mc.colitem && mc.colitem.remove();//EXPORTに支障が出るため
                //mc.colitem = null;//一律リセット
                if (mc.visible) {
                    //    let c = ["dimgray", "steelblue", "orange"];
                    UI_layer.fill(150 + mc.x / 8, mc.y / 8, mc.w / 8 - 1, mc.h / 8 - 1, c[mc.type - 10]);
                }
            }
        }
        //colmap 表示
        /**
         * @description
         * 衝突判定マップを画面に描画します（デバッグ用）。<br>\
         * マップの各セルが衝突可能かどうかを色分けして表示します。
         */
        function cmapDraw() {
            let cmap = state.mapsc.cmap();

            for (let i in cmap) { // xline
                for (let j in cmap[i]) { //yline
                    UI_layer.fill(150 + 12 + i * 4, 12 + j * 4, 3, 3, (cmap[i][j]) ? "blue" : "darkblue");
                }
            }
        }
        //export file
        //function exportFile(filename = "sample.json", obj){
        //    const json = JSON.stringify(obj, null, 2);
        //    const blob = new Blob([json], {type: "application/json"});
        //    const url = URL.createObjectURL(blob);
        //    const a = document.createElement("a");
        //    a.href = url;
        //    a.download = filename;
        //    a.click();
        //    URL.revokeObjectURL(url);
        //}
        //import file
        function importFile() {
            //
        }
    }
}


