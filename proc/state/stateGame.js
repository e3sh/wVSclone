//stateGame
//進行状態やプレイヤーステータス等(アイテムはここだろう）
//save_loadの実装で中断セーブが出来るようになる予定
function stateGame() {

    this.item;
    this.itemstack;
    this.nowstage;
    this.cold;
    
    this.player = {};

    this.player.zanki = 2;
    this.player.hp = 10;
    this.player.maxhp = this.player.hp;
    this.player.weapon = 0;
    //this.player.equip.--- etc...
    //this.player.status.dex --- etc..

    this.outviewMove = true;
    this.outviewCollision =true;
    this.outviewHit = true;

    this.load = function () {
        //中断セーブからの復帰

        if (Boolean(localStorage)) {

            var f = false;

            if (Boolean(localStorage.getItem("savedata"))) {
                f = true;
                var s = JSON.parse(localStorage.getItem("savedata"));

                //alert(s);

                this.item = s.item;
                this.itemstack = s.itemstack;
                this.nowstage = s.stage;
                this.player = s.player;
            }
            ret_code = f ? 0 : 1; //	        alert(f ? "gload" : "gnondata");
        } else {
            ret_code = 2; //	        alert("gnon localstorage");
        }
        //正常時:0 /異常時:any
        return ret_code;
    }

    this.save = function () {
        //中断セーブ
        var s = {}
        s.item = this.item;
        s.itemstack = this.itemstack;
        s.stage = this.nowstage;
        s.player = this.player;

        var jsontext = JSON.stringify(s);

        //alert(jsontext);

        var ret_code = 0;
        
        if (Boolean(localStorage)) { //ローカルストレージ使えたらセーブ実施
            localStorage.setItem("savedata", jsontext);
        } else {
            ret_code = 2;
        }
        //正常時:0 /異常時:any
        return ret_code;
    }
}