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

    configReset();//値の初期化

    //ローカルストレージからのロード
    this.load = function () {

        var ret_code = 0;

        if (Boolean(localStorage)) {

            var t = ["lamp_use", "map_use", "itemreset", "shotfree", "startstage"];

            var f = false;

            for (var i = 0; i <= 3; i++) {
                if (Boolean(localStorage.getItem(t[i]))) {
                    f = true;
                    this[t[i]] = (localStorage.getItem(t[i]) == "on") ? true : false;
                }
            }

            if (Boolean(localStorage.getItem(t[4]))) {
                f = true;
                this[t[4]] = parseInt(localStorage.getItem(t[4]));
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
            localStorage.setItem("startstage", new String(this.startstage));

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
        this.startstage = 1;

        this.use_audio = true;
        //this.debug = false; //debug表示　
        this.debug = false;
    }
}
