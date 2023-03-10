//stateConfig
//設定パラメータ
function stateConfig(){

    this.lamp_use;
    this.map_use;
    this.itemreset;
    this.shotfree;
    this.startstage;

    this.use_audio;
    
    this.debug;
    this.bulletmode;

    this.keyAn = [];

    configReset();//値の初期化

    //ローカルストレージからのロード
    this.load = function () {

        var ret_code = 0;

        if (Boolean(localStorage)) {

            var t = ["lamp_use", "map_use", "itemreset", "shotfree", "debug", "bulletmode", "startstage"];

            var f = false;

            for (var i = 0; i <= 5; i++) {
                if (Boolean(localStorage.getItem(t[i]))) {
                    f = true;
                    this[t[i]] = (localStorage.getItem(t[i]) == "on") ? true : false;
                }
            }

            if (Boolean(localStorage.getItem(t[6]))) {
                f = true;
                this[t[6]] = parseInt(localStorage.getItem(t[6]));
            }

            if (Boolean(localStorage.getItem('keyassign'))) {
                f = true;
                let json = localStorage.getItem('keyassign');
                this.keyAn = JSON.parse(json);
            }

            ret_code = f ? 0 : 1; //alert(f ? "load" : "nondata");
        } else {
            ret_code = 2; //alert("non localstorage");
        }
        //正常時:0 /異常時:any
        return ret_code;
    }

    //ローカルストレージへのセーブ
    this.save = function () {

        var ret_code = 0;

        if (Boolean(localStorage)) {

            localStorage.setItem("lamp_use", (this.lamp_use) ? "on" : "off");
            localStorage.setItem("map_use", (this.map_use) ? "on" : "off");
            localStorage.setItem("itemreset", (this.itemreset) ? "on" : "off");
            localStorage.setItem("shotfree", (this.shotfree) ? "on" : "off");
            localStorage.setItem("debug", (this.debug) ? "on" : "off");
            localStorage.setItem("bulletmode", (this.bulletmode) ? "on" : "off");
            localStorage.setItem("startstage", new String(this.startstage));

            let json = JSON.stringify(this.keyAn, undefined, 1);
            localStorage.setItem('keyassign', json);

        } else {
            ret_code = 2; //ローカルストレージが使用できない?

        }
        //正常時:0 /異常時:any
        return ret_code;
    }
    
    //コンフィグの初期化（初期値に設定）
    this.reset = configReset;
    
    function configReset() {

        this.lamp_use = false;
        this.map_use = false;
        this.itemreset = true;
        this.shotfree = false;
        this.startstage = 1;//開始ステージ　0:Stage1_test/1－30：Stage1/30-：Stage_tod

        this.use_audio = true;

        this.debug = false; //trueでdebugステータス表示。
        this.bulletmode = false; //trueで画面外から弾が飛んでこなくなる。

        //[0-4:Keycode attack bomb, jump, quit, esc] z:90, x:88, c:67, q:81, esc:27
        //[5-9:btn_num attack bomb, jump, quit, esc] a: 0, x: 2, b: 1, y: 3, start: 9
        this.keyAn = [ 90, 88, 67, 81, 27, 0, 2, 1, 3, 9]; // 未使用。機能未実装
    }
}
