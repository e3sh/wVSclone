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
    this.player.weapon = 0;//初期装備0:wand
    //this.player.equip.--- etc...
    //this.player.status.dex --- etc..
    this.player.speed = 6;//maxspeed 現在未使用/SpeedUp実装時使用？
    this.player.level = 0;//現状weaponLevelで使用予定

    this.outviewMove = true;//未使用
    this.outviewCollision =true;//画面外の敵も壁の当たり判定処理を行う。
    this.outviewHit = true;//未使用
    
    //keySearch infomation display (gameSceneでセット、objCtrlで参照予定)2023/01/29-
    this.keyon = false;
    this.key_x = 0;
    this.key_y = 0;

    //GameStatus 使用中でtrueにする。GameSceneでセット。各Objから参照用2023/01/30 
    this.lamp = false;
    this.map = false;

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