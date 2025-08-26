//=============================================================
// Layoutクラス
// 画面表示位置の記載
//=============================================================
/**
 * @class
 * @classdesc
 * UI要素の画面上の配置を定義するレイアウトクラスです。<br>\
 * 各種UIパーツ（HPバー、スコア、ミニマップ、アイテムリストなど）の<br>\
 * X, Y座標を保持し、画面構成を統一します。
 */
class gameLayout {
    /**
     * @description
     * `gameLayout`インスタンスを初期化します。<br>\
     * ゲーム画面のサイズと、UI要素の基準となるオフセットを定義し、<br>\
     * 各UIパーツの具体的な表示座標を設定します。
     */
    constructor() {

        const GS_SIZE_X = 640; //GameScreenSize
        const GS_SIZE_Y = 400; //GameScreenSize

        const DSP_SP_X = 0; //192;
        const DSP_SP_Y = 0; //120;

        // NextExp
        /**
         * @member
         * @type {object}
         * @property {number} x座標
         * @property {number} y座標
         * @description
         * StatusUIの一部
         */
        this.nextexp;
        // Exp.
        /**
         * @member
         * @type {object}
         * @property {number} x座標
         * @property {number} y座標
         * @description
         * StatusUIの一部
         */
        this.exp;

        /**
         * @member
         * @type {object}
         * @property {number} x座標
         * @property {number} y座標
         * @description
         * StatusUIの一部
         */
        this.zanki;
        /**
         * @member
         * @type {object}
         * @property {number} x座標
         * @property {number} y座標
         * @description
         * StatusUIの一部
         */
        this.ball;
        /**
         * @member
         * @type {object}
         * @property {number} x座標
         * @property {number} y座標
         * @description
         * StatusUIの一部
         */
        this.coin;
        /**
         * @member
         * @type {object}
         * @property {number} x座標
         * @property {number} y座標
         * @description
         * StatusUIの一部
         */
        this.items;
        /**
         * @member
         * @type {object}
         * @property {number} x座標
         * @property {number} y座標
         * @description
         * StatusUIの一部
         */
        this.key;
        /**
         * @member
         * @type {object}
         * @property {number} x座標
         * @property {number} y座標
         * @description
         * StatusUIの一部
         */
        this.weapon;
        /**
         * @member
         * @type {object}
         * @property {number} x座標
         * @property {number} y座標
         * @description
         * StatusUIの一部
         */
        this.time;
        /**
         * @member
         * @type {object}
         * @property {number} x座標
         * @property {number} y座標
         * @description
         * StatusUIの一部
         */
        this.stage;                
        /**
         * @member
         * @type {object}
         * @property {number} x座標
         * @property {number} y座標
         * @description
         * StatusUIの一部
         */
        this.hp;
        /**
         * @member
         * @type {object}
         * @property {number} x座標
         * @property {number} y座標
         * @description
         * StatusUIの基本位置(枠)
         */
        this.clip;
        /**
         * @member
         * @type {object}
         * @property {number} x座標
         * @property {number} y座標
         * @description
         * Minimap
         */
        this.map;
        /**
         * @member
         * @type {object}
         * @property {number} x座標
         * @property {number} y座標
         * @description
         * StatusUIの一部
         */
        this.keyitem;
        /**
         * @member
         * @type {object}
         * @property {number} x座標
         * @property {number} y座標
         * @description
         * StatusUIの一部
         */
        this.status;
        /**
         * @member
         * @type {object}
         * @property {number} x座標
         * @property {number} y座標
         * @description
         * StatusUIの一部
         */
        this.tutmsg;        
        /**
         * @member
         * @type {object}
         * @property {number} x座標
         * @property {number} y座標
         * @description
         * TextWindow26Line(Right)
         */
        this.debugstatus;
        /**
         * @member
         * @type {object}
         * @property {number} x座標
         * @property {number} y座標
         * @description
         * TextWindow21Line(Left)
         */
        this.debugmessage;
        /**
         * @member
         * @type {object}
         * @property {number} x座標
         * @property {number} y座標
         * @description
         * Text(notWindow)Center
         */
        this.debugspriteobject;

        this.setDefault = ()=>{
            // NextExp
            this.nextexp = {
                x: DSP_SP_X + GS_SIZE_X - (8 * 12), //
                y: DSP_SP_Y + GS_SIZE_Y - 24
            };

            // Exp.
            this.exp = {
                x: DSP_SP_X + GS_SIZE_X - (8 * 12),
                y: DSP_SP_Y + GS_SIZE_Y - 32
            };

            // Debug Status
            this.debugstatus = {
                x: DSP_SP_X + GS_SIZE_X - 120,
                y: DSP_SP_Y + 32
            };

            this.debugmessage = {
                x: DSP_SP_X,
                y: DSP_SP_Y + 150
            };

            this.debugspriteobject = {
                x: DSP_SP_X + 160,
                y: DSP_SP_Y + 0
            };

            // Zanki
            this.zanki = {
                x: DSP_SP_X + 20,
                y: DSP_SP_Y + GS_SIZE_Y - 16
            };

            //ball  
            this.ball = {
                x: DSP_SP_X + 20 + 288,
                y: DSP_SP_Y + GS_SIZE_Y - 26
            };

            //coin
            this.coin = {
                x: DSP_SP_X + 20 + 288,
                y: DSP_SP_Y + GS_SIZE_Y - 8
            };

            //items
            this.items = {
                x: DSP_SP_X + 20 + 128,
                y: DSP_SP_Y + GS_SIZE_Y - 16
            };

            //key
            this.key = {
                x: DSP_SP_X + 20 + 64,
                y: DSP_SP_Y + GS_SIZE_Y - 16
            };

            //weapon
            this.weapon = {
                x: DSP_SP_X + 20 + 96,
                y: DSP_SP_Y + GS_SIZE_Y - 16
            };

            //time
            this.time = {
                x: DSP_SP_X + GS_SIZE_X - (8 * 9),
                y: DSP_SP_Y + GS_SIZE_Y - 8
            };

            //stage number 
            this.stage = {
                x: DSP_SP_X + GS_SIZE_X - (8 * 9),
                y: DSP_SP_Y + GS_SIZE_Y - 16
            };

            //minimap
            this.map = {
                x: DSP_SP_X,
                y: DSP_SP_Y
            };

            //hpbar
            this.hp = {
                x: DSP_SP_X + 168,
                y: DSP_SP_Y + GS_SIZE_Y - 34
            };

            //underline
            this.clip = {
                x: DSP_SP_X,
                y: DSP_SP_Y + GS_SIZE_Y - 36
            };

            //itemlist
            this.keyitem = {
                x: DSP_SP_X + 368,
                y: DSP_SP_Y + GS_SIZE_Y - 16
            };

            //tutorial window
            this.tutmsg = {
                x: DSP_SP_X + 20,
                y: DSP_SP_Y + GS_SIZE_Y - 96
            };

            //lvupstatus
            this.status = {
                x: DSP_SP_X + 20 + 252,
                y: DSP_SP_Y + GS_SIZE_Y - 34
            };
        }
        this.setDefault();

        this.setStatusUIpos = (x, y)=>{

            //underline
            this.clip.x = x;
            this.clip.y = y;
            // NextExp
            this.nextexp.x = x + GS_SIZE_X - (8 * 12);
            this.nextexp.y = y + 12;
            // Exp.
            this.exp.x = x + GS_SIZE_X - (8 * 12);
            this.exp.y = y + 4;
            // Zanki
            this.zanki.x = x + 20;
            this.zanki.y = y + 20;
            //ball  
            this.ball.x = x + 308;
            this.ball.y = y + 10;
            //coin
            this.coin.x = x + 308;
            this.coin.y = y + 28;
            //items
            this.items.x = x + 148;
            this.items.y = y + 20;
            //key
            this.key.x = x + 84;
            this.key.y = y + 20;
            //weapon
            this.weapon.x = x + 106;
            this.weapon.y = y + 20;
            //time
            this.time.x = x + GS_SIZE_X - (8 * 9);
            this.time.y = y + 28;
            //stage name 
            this.stage.x = x + GS_SIZE_X - (8 * 9); 
            this.stage.y = y + 20;
            //hpbar
            this.hp.x = x + 168;
            this.hp.y = y + 2;
            //itemlist
            this.keyitem.x = x + 368;
            this.keyitem.y = y + 20;
            //lvupstatus
            this.status.x = x + 272;
            this.status.y = y + 2
        }
        this.setStatusUIpos(DSP_SP_X, DSP_SP_Y + GS_SIZE_Y - 36);

        this.setMinimapUIpos = (x, y)=>{
            //minimap
            this.map.x = x;
            this.map.y = y;
        }
        this.setMinimapUIpos(16,16);
    }
}


