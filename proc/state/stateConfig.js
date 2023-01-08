//stateConfig
//設定パラメータ
function stateConfig(){

    /*
    this.fullpower;
    this.sideshot;
    this.itemreset;
    this.option;
    this.startstage;
    */
    this.lamp_use;
    this.map_use;
    this.itemreset;
    this.shotfree;
    this.startstage;

    this.use_audio;

    //this.cold; //これはコンティニュー関係だからそのうちGameへ
    
    this.debug;

    configReset();//値の初期化

    //ローカルストレージからのロード
    this.load = function () {

        var ret_code = 0;

        if (Boolean(localStorage)) {

        //    if (Boolean(localStorage.getItem("fullpower"))) {
        //        this.fullpower = (localStorage.getItem("fullpower") == "on") ? true : false;
        //    }

            //var t = ["fullpower", "sideshot", "itemreset", "option", "startstage"];
            var t = ["lamp_use", "map_use", "itemreset", "shotfree", "startstage"];

            var f = false;

            for (var i = 0; i <= 3; i++) {
                if (Boolean(localStorage.getItem(t[i]))) {
                    f = true;
                    this[t[i]] = (localStorage.getItem(t[i]) == "on") ? true : false;
                    //this.config[t[i]] = w_config[i];
                }
            }

            if (Boolean(localStorage.getItem(t[4]))) {
                f = true;
                this[t[4]] = parseInt(localStorage.getItem(t[4]));
                //this.config[t[5]] = w_number[5];
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

            /*
            localStorage.setItem("fullpower", (this.fullpower) ? "on" : "off");
            localStorage.setItem("sideshot", (this.sideshot) ? "on" : "off");
            localStorage.setItem("itemreset", (this.itemreset) ? "on" : "off");
            localStorage.setItem("option", (this.option) ? "on" : "off");
            localStorage.setItem("startstage", new String(this.startstage));
            */
            localStorage.setItem("lamp_use", (this.fullpower) ? "on" : "off");
            localStorage.setItem("map_use", (this.sideshot) ? "on" : "off");
            localStorage.setItem("itemreset", (this.itemreset) ? "on" : "off");
            localStorage.setItem("shotfree", (this.option) ? "on" : "off");
            localStorage.setItem("startstage", new String(this.startstage));

            //              localStorage.setItem("highscore", new String(this.result.highscore));
            //text.print("設定をセーブしました。"//this.msg + localStorage.length, 100, 320, "white");
        } else {
            ret_code = 2; //ローカルストレージが使用できない?

        }
        //正常時:0 /異常時:any
        return ret_code;
    }
    
    //コンフィグの初期化（初期値に設定）
    this.reset = configReset;
    
    function configReset() {
        /*
        this.fullpower = false;
        this.sideshot = false;
        this.itemreset = true;
        this.option = false;
        this.startstage = 1;
        */
        this.lamp_use = false;
        this.map_use = false;
        this.itemreset = true;
        this.shotfree = false;
        this.startstage = 1;

        //this.use_audio = true;

        //this.cold = true; //これはコンティニュー関係だからそのうちGameへ

        //this.debug = false; //debug表示　
        this.debug = true;
    }
}
