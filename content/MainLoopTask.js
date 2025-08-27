// task ==================================================================

/**
 * @class
 * @classdesc
 * ゲームループのエントリーポイントとなるメインタスクです。<br>\
 * 各種入力デバイスの状態を取得し、ゲームシーンの更新と描画を実行します。<br>\
 * ゲーム全体の進行と各機能の連携を司る主要な制御タスクです。
 */
class taskMainLoop extends GameTask {
    /**
     * @constructor
     * @param {TaskId} id タスクID "main" 
     * @description
     * インスタンスを初期化します。<br>\
     * 基底の`GameTask`コンストラクタを呼び出し、タスクIDを設定します。
     */
    constructor(id){
        super(id);
    }
	
    state; 	scene;
    elm_dbg;  elm_lamp; elm_map;
    /**
     * @method
     * @param {GameCore} g GameCoreインスタンス
     * @description
     * ゲームの状態（`stateControl`）とシーン管理（`sceneControl`）のインスタンスを生成し、<br>\
     * それらを`GameCore`インスタンスにアタッチします。
     */
    init(g){// task.add時に実行される。

        this.state = new stateControl(g);
	    this.scene = new sceneControl(this.state);

        this.state.scene = this.scene;

        g.state = this.state;

        g.state.System.dev.init(g);//keyAssign 
    }
   
    /**
     * @method
     * @param {GameCore} g GameCoreインスタンス
     * @description
     * タスクを非表示および無効に設定し、最初のステップ実行時に有効になるよう準備します。
     */
    pre = function (g) {
        this.visible = false;
        this.enable = false;
    }

    /**
     * @typedef {object} inputMain 入力情報(メインタスク)
     * @property {boolean} up　上　W
     * @property {boolean} down　下　S
     * @property {boolean} left　左　A
     * @property {boolean} right　右　D
     * @property {boolean} trigger.weapon　Z
     * @property {boolean} trigger.useitem　X
     * @property {boolean} trigger.jump　C
     * @property {boolean} trigger.select　E
     * @property {boolean} trigger.tgtlock　L_Ctrl
     * @property {boolean} quit　Q
     * @property {boolean} pause　P-start
     * @property {boolean} start　(false)
     * @property {boolean} back　@
     * @property {object} keycode キーコードオブジェクト(inputKeyboard)
     */
    /**
     * @method
     * @param {GameCore} g GameCoreインスタンス
     * @description
     * キーボード、ゲームパッドなどの入力デバイスの状態をチェックし、<br>\
     * その入力情報に基づいて現在のゲームシーンの`step`メソッドを呼び出します。
     */
    step = function (g) {

        //let kstate = this.state.System.dev.key_state.check();
        //let arrow = this.state.System.dev.directionM( kstate );
        //let pstate = g.gamepad.check();
        /*
        const input = {
            up: arrow.up        // W 
            ,down: arrow.down   // S
            ,left: arrow.left   // A
            ,right: arrow.right // D
            ,trigger:{
                weapon:false
                ,useitem:false
                ,jump:false
                ,select:false
                ,tgtlock:false
            }
            ,quit:false
            ,pause:false
            ,start:false
            ,back:false
            ,keycode: kstate
        }

        let zkey    = false;if (Boolean(kstate[90])) zkey      = kstate[90];//Z,(A)
        let spacekey= false;if (Boolean(kstate[32])) spacekey  = kstate[32];//SPACE
        input.trigger.weapon = (zkey || spacekey)?true:false;//Z, SPACE, (A)

        if (Boolean(kstate[88])) input.trigger.useitem  = kstate[88];//X, (X)
        if (Boolean(kstate[67])) input.trigger.jump     = kstate[67];//C, (B)
        if (Boolean(kstate[69])) input.trigger.select   = kstate[69];//E, (Y)
        if (Boolean(kstate[17])) input.trigger.tgtlock  = kstate[17];//Ctrl,[RB]

        if (Boolean(kstate[80])) input.pause    = kstate[80];//P, (START)
        //if (Boolean(kstate[81])) input.quit     = kstate[81];//Q, (Y)
        if (Boolean(kstate[192])) input.back     = kstate[192];//@, (Back)
        //if (Boolean(kstate[x])) input.start   = kstate[x];//undefind, (START)
        */

        this.scene.step(g, this.state.System.dev.directionM());
    }
    /**
     * @method
     * @param {GameCore} g GameCoreインスタンス
     * @description
     * 現在のゲームシーンの`draw`メソッドを呼び出し、
     * ゲーム画面全体を描画します。
     */
    draw = function (g) {
        this.scene.draw(g);
    }
}
