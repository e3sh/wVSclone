//gameObjectの分割分UtilityMethodを分離
//記入2025/06/25コメント追加
/**
 * @class
 * @classdesc
 * ゲームオブジェクトに関連する補助的なメソッドと共有データを提供します。<br>\
 * メッセージログ、アイテム関連の処理、およびデバッグ情報の表示をサポートし、<br>\
 * オブジェクトの操作やデバッグ作業を効率化します。
 */
class gObjectUtility {
    /**
     * @constructor
     * @param {stateControl} state GamoCore.state
     * @description
     * `gObjectUtility`インスタンスを初期化します。<br>\
     * 各種メッセージログ（通常のメッセージ、ビュー、コンソール、チュートリアル）の<br>\
     * バッファを準備し、チュートリアルコメントをロードします。
     */
    constructor(state) {

        const dev = state.System.dev;

        this.item = state.obCtrl.item;
        this.itemstack = state.obCtrl.itemstack;

        const ch_ptn = state.Database.chrPattern; //character();
        const motion_ptn = state.Database.motionPattern; //motionPattern();

        const msglog = new textbufferControl(25);
        const msgview = new textbufferControl(26);
        const msgcnsl = new textbufferControl(21);

        this.messagelog = msglog;
        this.messageview = msgview;
        this.messageconsole = msgcnsl;

        const tutcnsl = new textbufferControl(5);
        this.tutorialconsole = tutcnsl;
        const tutComment = state.Database.tutCommentTable; //return comment [[],[],[]];

        //this.tutTable = tutCheck;
        let tutDtime = 0;
        this.tutorialDisplayTime = tutDtime;

        let tutoDone = [];
        this.tutorialDone = tutoDone;

        /**
         * @param {number} num チュートリアル番号(キャラクタ番号)
         * @description
         * 指定された番号のチュートリアルコメントを表示し、<br>\
         * 一度表示されたチュートリアルは`tutoDone`フラグで追跡します。<br>\
         * tutorialDisplayTime`を設定して表示時間を制御します。
         *  
         */
        let tutCheck = (num) => {
            let h = "> ";
            if (Boolean(tutComment[num])) {
                if (!Boolean(tutoDone[num])) {
                    for (let m of tutComment[num]) {
                        this.tutorialconsole.write(h + m);
                        h = "  ";
                    }
                    this.tutorialDisplayTime = state.System.time() + 10000; //10s
                    tutoDone[num] = true; //説明済みFlag 
                } else {
                    //objc.tutorialconsole.write("> " + itemtable[num] + "is done.");
                    //if (num < 15) this.item[num] = 2;//説明済み
                }
            }
        };
        /**
         * @method
         */
        this.tutTable = tutCheck;

        /**
         * @param {number} num 行数
         * @description
         * テキスト行を管理し、指定された行数（`num`）に収まるように<br>\
         * バッファを制御する内部クラスです。<br>\
         * ログやメッセージコンソールの表示に使用されます。
         */
        function textbufferControl(num = 20) {

            const LINE = num + 1;
            const WIDTH = 40;

            let buffer = [];

            /**
             * 
             * @returns {string[]} テキスト行の配列
             * @description 
             * バッファに格納されている現在のテキスト行の配列を返します。
             */
            this.read = function () {

                return buffer;
            };

            /**
             * 
             * @param {string} str 文字列
             * @description
             * 指定された文字列をバッファに追加します。<br>\
             * バッファが最大行数を超えた場合、古い行を削除して新しい行を追加します。
             */
            this.write = function (str) {

                if (str.length > WIDTH) str = str.substring(0, WIDTH);

                buffer.push(str);

                let bfw = [];
                for (let i in buffer) {
                    if (i > (buffer.length - LINE)) {
                        bfw.push(buffer[i]);
                    }
                }
                buffer = bfw;
            };
            /**
             * @description
             * バッファに格納されている全てのテキスト行をクリアします。
             */
            this.clear = function () {
                buffer = [];
            };
        }

        const PLAYER = state.Constant.objtype.PLAYER;
        const FRIEND = state.Constant.objtype.FRIEND;
        const BULLET_P = state.Constant.objtype.BULLET_P;
        const ENEMY = state.Constant.objtype.ENEMY;
        const BULLET_E = state.Constant.objtype.BULLET_E;
        const ITEM = state.Constant.objtype.ITEM;
        const ETC = state.Constant.objtype.ETC;

        const MOB = state.Constant.objtype.MOB;

        const FLOOR = state.Constant.objtype.FLOOR;
        const WALL = state.Constant.objtype.WALL;
        const DOOR = state.Constant.objtype.DOOR;
        const CEIL = state.Constant.objtype.CEIL;
        const CIRCLE = state.Constant.objtype.CIRCLE;
        const STONEB = state.Constant.objtype.STONEB;

        const KEYITEMS = state.Constant.item.KEYITEMS;
        const HELPTEXT = state.Constant.item.HELPTEXT;

        const AMULET_R = state.Constant.item.AMULET_R;
        const AMULET_G = state.Constant.item.AMULET_G;
        const AMULET_B = state.Constant.item.AMULET_B;
        const RING_R = state.Constant.item.RING_R;
        const RING_B = state.Constant.item.RING_B;
        const CANDLE_B = state.Constant.item.CANDLE_B;
        const CANDLE_R = state.Constant.item.CANDLE_R;
        const MIRROR = state.Constant.item.MIRROR;

        /**
         * @method
         * @returns {String[]} 現在のゲームオブジェクトのリスト
         * @description
         * 現在のゲーム内の全てのオブジェクトのリスト（タイプ、ビュー内判定、HP、ステータス、モーションパターン、キャラ番号など）を<br>\
         * 整形された文字列配列として返します。デバッグ情報表示に利用されます
         */
        this.list = function () {

            let st = [];
            const obj = state.obCtrl.objList;

            for (let j = 0; j < obj.length; j++) {
                let n = "   " + String(j);
                st[j] = n.substring(n.length - 3) + ".No.Object";
            }

            // type ,x ,y ,status, mp
            for (let i in obj) {
                let o = obj[i];
                let inv = o.gt.in_view(o.x, o.y) ? "v" : "-";
                //let inw = o.gt.in_world(o.x, o.y)?"wo":"w-";
                //let s = "" + o.type + "," + Math.trunc(o.x) + "," + Math.trunc(o.y) + ","  + o.status + "," + o.mp;
                //type, inview, hp, status,mp,chr
                let n = "   " + String(i);
                //let s = n.substring(n.length-3) + ":" + o.type + "," + inv + "," + o.hp + ","  + o.status + "," + o.mp + "," + o.chr;
                let s = n.substring(n.length - 3) + inv + ch_ptn[o.chr].comment + "," + o.hp + "," + o.status;

                st[i] = s;
                //st.push(s);
            }
            return st;
        };

        /**
         * @method
         * @returns {string[]}
         * @description
         * 画面内に表示されているスプライトオブジェクトのみを抽出し、<br>\
         * そのリストを整形された文字列配列として返します。
         */
        this.list_inview = function () {

            let st = [];
            const obj = state.obCtrl.objList;

            let t = "DISPLAY SPRITE OBJECTS/";
            st.push(t);

            // type ,x ,y ,status, mp
            for (let i in obj) {
                let o = obj[i];
                if (o.normal_draw_enable || o.custom_draw_enable) {
                    if (o.gt.in_view(o.x, o.y)) {
                        let n = "   " + String(i);
                        //let s = n.substring(n.length-3) + ":" + o.type + "," + ch_ptn[o.chr].comment + "," + o.hp + ","  + o.status + "," + o.mp + ",";
                        let s = n.substring(n.length - 3) + ":" + ch_ptn[o.chr].comment;

                        st.push(s);
                    }
                }
            }
            return st;
        };

        /**
         * @method
         * @param {number} num ゲームオブジェクトリストのインデックス
         * @returns {string[]} プロパティ一覧の文字列
         * @description
         * 指定されたインデックスのオブジェクトの全てのプロパティと値を、<br>\
         * デバッグ用に整形された文字列配列として返します。
         */

        this.lookObj = function (num) {

            let st = [];
            const obj = state.obCtrl.objList;

            if (obj[num] instanceof Object) {

                let o = Object.entries(obj[num]);

                o.forEach(function (element) {
                    let w = String(element).split(",");
                    //let w = element.split(",");
                    //st.push(element);
                    let s = w[0];
                    if (s.length < 13) {
                        s = s + " ".repeat(13);
                        s = s.substring(0, 13);
                    }
                    let s2 = w[1];
                    /*
                    for (let i = 2; i < w.length; i++){
                        s2 = s2 + w[i];
                    }
                    */
                    st.push("." + s + ":" + s2);
                });
                st.push("");
                st.push("Object.entries end.");
            } else {
                st.push("No.Object");
            }
            st.push("");
            st.push("Return [1-9] Key.");

            return st;
        };
        /**
         * @method
         * @param {Screen} scrn dev.graphics[x]
         * @param {number} num ゲームオブジェクトリストのインデックス
         * @param {number} x 表示座標x
         * @param {number} y 表示座標y
         * @returns {boolean}　処理完了正否
         * @description
         * 指定されたオブジェクトを画面上の特定の位置に描画します。<br>\
         * オブジェクトが非表示設定の場合、[DUMMY]と表示します。
         */
        this.lookObjv = function (scrn, num, x, y) {

            let result = false;
            const obj = state.obCtrl.objList;

            if (obj[num] instanceof Object) {

                let o = obj[num];

                if (o.visible) {
                    mtnptn_put(scrn,
                        x, y, o.mp,
                        o.mp_cnt_anm,
                        o.vector,
                        o.alpha,
                        o.display_size
                    );
                    result = true;

                    if (!o.normal_draw_enable) {
                        scrn.putchr8("[DUMMY]", x - 28, y + 16);
                    }
                }
            }

            return result;
        };
        /**
         * @method
         * @param {Screen} scrn dev.graphics[x]
         * @returns {point} 画面座標
         * @description
         * プレイヤーオブジェクトを画面に描画し、その画面座標を返します。<br>\
         * このメソッドは、プレイヤーを画面の中央に配置するなど、他のUI要素の基準点として利用されます。
         */

        this.player_objv = function (scrn) {

            const obj = state.obCtrl.objList;
            let rc = { x: 0, y: 0 };

            for (let o of obj) {
                if (o instanceof Object) {
                    if (Boolean(o.type)) {
                        if (o.type == PLAYER) {
                            cntl_draw(scrn, o);
                            rc = o.gt.worldtoView(o.x, o.y);
                            break;
                        }
                    }
                }
            }
            return rc;
        };

        /**
         * @method
         * @param {Screen} scrn dev.graphics[x]
         * @param {number} num ゲームオブジェクトリストのインデックス
         * @param {number} x 表示座標x
         * @param {number} y 表示座標y
         * @returns {boolean} 持参/またはITEM
         * @description
         * 指定されたオブジェクトが持っているアイテム、またはオブジェクト自体がアイテムの場合、<br>\
         * そのアイテムのスプライトを画面に描画します（デバッグ表示用）。
         */
        this.lookpick = (scrn, num, x, y) => {

            let result = false;
            const obj = state.obCtrl.objList;

            if (obj[num] instanceof Object) {
                /*
                let spname = [];
                spname[15] = "Wand";
                spname[16] = "Knife";
                spname[17] = "Axe";
                spname[18] = "Spear";
                spname[19] = "Boom";
                spname[20] = "Ball1";
                spname[21] = "miniMay";
                spname[22] = "sKey";
                spname[23] = "BallB1";
                spname[24] = "BallS1";
                spname[25] = "BallL1";
                spname[26] = "Lamp";
                spname[27] = "Map";
                spname[35] = "Coin1";
                spname[50] = "Bow";
                */
                let o = obj[num];

                if (o.type == ENEMY) {
                    if (o.pick.length > 0) {
                        for (let i of o.pick) {
                            //scrn.put(spname[i], x, y);
                            mtnptn_put(scrn, x, y, ch_ptn[i].mp);
                            //scrn.print("e"+ch_ptn[i].mp ,x,y);
                            x = x + 16;
                        }
                        result = true;
                    }
                }
                if (o.type == ITEM) {
                    mtnptn_put(scrn, x, y, o.mp); //, mpcnt, r, alpha, size){
                    //scrn.print("i"+o.mp ,x,y);

                    //scrn.put(spname[o.chr], x, y);
                    result = true;
                }
            }
            return result;
        };
        /**
         * @method
         * @param {Screen} device dev.graphics[x]
         * @param {boolean} mode ヘルプテキスト表示モード
         * @description
         * キーアイテム（強化アイテム）の所持状況を画面に描画します。<br>\
         * アイテムのアイコンと所持数（+1以上の場合）を表示し、<br>\
         * ヘルプテキスト表示モードでは対応するステータス名も表示します。
         */
        this.keyitem_view_draw = function (device, mode = false) {

            this.item = state.obCtrl.item;

            //const helptext = { 51: "INT", 52: "MND", 53: "VIT", 56: "STR", 57: "DEX" };

            let xpos = dev.layout.keyitem.x;
            let ypos = dev.layout.keyitem.y;
            for (let i of KEYITEMS) {
                //this.item[i] = 2; // DEBUG fullItemTest
                if (Boolean(this.item[i])) {
                    if (this.item[i] > 0) {
                        device.put(
                            motion_ptn[ch_ptn[i].mp].pattern[0][0],
                            xpos, ypos);
                        if (this.item[i] > 1) {
                            device.kprint("+" + (this.item[i] - 1), xpos, ypos + 6);
                        }

                        if (mode) {
                            if (Boolean(HELPTEXT[i]))
                                device.kprint(HELPTEXT[i], xpos - 12, ypos - 16);
                        }
                        //device.kprint(motion_ptn[[ch_ptn[i].mp]].pattern[0],12,ypos);
                        //device.kprint("ch-mp:" + ch_ptn[i].mp,12,ypos);
                        //device.kprint("mp:" + motion_ptn[ch_ptn[i].mp].pattern[0][0],12,ypos+8);
                        xpos += 22;
                    }
                }
            }
            this.keyitem_enhance_check();
        };
        /**
         * @method
         * @description
         * 全てのキーアイテムの所持数を0にリセットします。
         */
        this.keyitem_reset = function () {

            this.item = state.obCtrl.item;

            for (let i of KEYITEMS){//} = 51; i < 59; i++) {
                this.item[i] = 0;
            }
        };
        /**
         * @method
         * @description
         * キーアイテムの所持状況に基づいてプレイヤーの能力値（STR, DEX, AGIなど）を更新します。<br>\
         * これにより、アイテム取得がプレイヤーのステータスに反映されます。
         */
        this.keyitem_enhance_check = function () {

            this.item = state.obCtrl.item;

            for (let i of KEYITEMS){//}= 51; i < 59; i++) {
                if (!Boolean(this.item[i])) { this.item[i] = 0; }
            }

            state.Game.player.enh.INT = (this.item[AMULET_R] > 0) ? this.item[AMULET_R] : 0; //AmuletR
            state.Game.player.enh.MND = (this.item[AMULET_G] > 0) ? this.item[AMULET_G] : 0; //AmuletG
            state.Game.player.enh.VIT = (this.item[AMULET_B] > 0) ? this.item[AMULET_B] : 0; //AmuletB

            state.Game.player.enh.STR = (this.item[RING_R] > 0) ? this.item[RING_R] : 0; //RingR
            state.Game.player.enh.DEX = (this.item[RING_B] > 0) ? this.item[RING_B] : 0; //RingB

            this.ceilshadow = (this.item[CANDLE_B] > 0) ? "rgba( 0,64,64,0.2)" : //CandleB:      
                ((this.item[CANDLE_R] > 0) ? "rgba(48,48, 0,0.4)" : "rgba(4,4,4,0.8)"); //CandleR:None

            state.Game.spec_check();
        };

        /**
         * @method
         * @param {number} ch キャラクター番号
         * @returns {string}スプライト名
         * @description
         * キャラクター番号（`chr`）から、そのキャラクターのモーションパターンの、<br>\
         * 最初のフレームのスプライト名を返します。
         */
        this.dict_Ch_Sp = function (ch) {
            return motion_ptn[ch_ptn[ch].mp].pattern[0][0];
        };

        //draw functions
        function cntl_draw (scrn, o) {
            //表示
            if (Boolean(motion_ptn[o.mp].wait)) {
                o.mp_cnt_frm++;
                if (o.mp_cnt_frm > motion_ptn[o.mp].wait / 2) {
                    o.mp_cnt_anm++;
                    o.mp_cnt_frm = 0;
                    if (o.mp_cnt_anm >= motion_ptn[o.mp].pattern.length) o.mp_cnt_anm = 0;
                }
            }

            let w = o.gt.worldtoView(o.x, o.y);

            mtnptn_put(scrn,
                w.x + o.shiftx,
                w.y + o.shifty,
                o.mp, o.mp_cnt_anm,
                o.vector, o.alpha, o.display_size
            );
        }

        function mtnptn_put(scrn, x, y, mp, mpcnt, r, alpha, size) {
            //mtnptn_put(scrn, x, y, mp,[mpcnt],[r],[alpha],[size])
            if (!Boolean(mpcnt)) mpcnt = 0;
            if (!Boolean(r)) r = 0;
            if (!Boolean(alpha)) alpha = 255;
            if (!Boolean(size)) size = 1.0;

            let ptn;
            try {
                ptn = motion_ptn[mp].pattern[mpcnt][0];
            }
            catch (e) {
                mpcnt = 0;
                ptn = motion_ptn[mp].pattern[mpcnt][0];
            }

            let wvh = motion_ptn[mp].pattern[mpcnt][1];
            let wr = motion_ptn[mp].pattern[mpcnt][2];

            if ((wvh == -1) && (wr == -1)) {
                wvh = 0;
                wr = r;
            };

            scrn.put(ptn, x, y, wvh, wr, alpha, size);
            //scrn.putchr8(`${ptn} ${wvh} ${wr} ${alpha} ${size}`, x, y);
        }
    }
}

