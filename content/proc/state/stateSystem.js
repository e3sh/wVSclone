//stateSystem
//デバイスパラメータやサウンド状況等
/**
 * @class
 * @classdesc
 * デバイスパラメータやサウンド状況などのシステム関連情報を管理するクラスです。<br>\
 * デバイスコントロール、デルタタイム、ライフタイム、点滅機能など、<br>\
 * ゲームの基盤となるシステム情報へのアクセスを提供します。
 */
class stateSystem {
    /**
     * @constructor
     * @param {GameCore} g GameCoreインスタンス
     */
    constructor(g) {

        this.dev = new deviceControl(g);
        this.deltaTime = g.deltaTime;
        this.time = g.time;
        this.blink = g.blink;
    }
}
