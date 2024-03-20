//stateGame
//進行状態やプレイヤーステータス等(アイテムはここだろう）
//save_loadの実装で中断セーブが出来るようになる予定
function stateGame() {

    const INITIAL_HP = 10;

    this.item;
    this.itemstack;
    this.nowstage;
    this.cold;
    
    function statePlayer(){

        this.zanki = 2;
        this.hp = INITIAL_HP; //Initial HP
        this.maxhp = this.hp;
        this.weapon = 0;//初期装備0:wand
        //this.player.equip.--- etc...
        //this.player.status.dex --- etc..
        this.speed = 6;//maxspeed 現在未使用/SpeedUp実装時使用？(player処理では定数で記述中)
        this.level = 0;//現状weaponLevelで使用予定
        this.skill_ex = [0, 0, 0, 0, 0, 0];//武器毎の獲得スコア累積 /処理未作成の為未使用（2024/02/14）
        this.skill_lv = [0, 0, 0, 0, 0, 0];//武器毎のlevel　/処理未作成の為未使用（2024/02/14）
        let stack_ = [];
        this.stack = stack_;
        //{ 15:0, 16:0, 17:0, 18:0, 19:0, 50:0 };//GetWeaponItemLvWork use ObjCtrl getitem and player_sce
        //15:rod 16:sword 17:axe 19:spare 18:boom 50:bow

        this.spec = new stateSpec();
    }

    class stateSpec {
            LV; HP; MP; 
            STR; DEX; AGI;
            VIT; INT; MND; 
            LAK; ETC;

            constructor(){
                this.LV = 0; //WeaponLevel ( = state.Game.player.level) 
                this.HP = 0; //Maxhp (notuse)
                //this.MP = 0; //MagicPoint (notuse) 
                //this.STR;
                //this.DEX;
                //this.AGI;
                this.VIT = 0; //HPrecover+ : init 3 +
                this.INT = 0; //BombPower+ : init -10
                this.MND = 0; //ShieldTime+: init 300flame(5s) +
                //this.LAK;
                this.ETC = 0;

                //console.log("ss" + this.LV);
            }
    }
    
    this.player = new statePlayer();

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

    this.mode = 0;//Palyer Type Select
    this.score = 0;
    
    this.reset = function(){

        this.player.zanki = 2;
        this.player.hp = INITIAL_HP;
        this.player.maxhp = this.player.hp;
        this.player.weapon = 0;//初期装備0:wand
     
        this.player.level = 0;//現状weaponLevelで使用予定

        this.player.spec = new stateSpec();

        this.player.spec.LV = 0; //WeaponLevel ( = state.Game.player.level) 
        this.player.spec.HP = 0; //Maxhp (notuse)
        this.player.spec.MP = 0; //MagicPoint (notuse) 
        this.player.spec.VIT = 0; //HPrecover+ : init 3 +
        this.player.spec.INT = 0; //BombPower+ : init -10
        this.player.spec.MND = 0; //ShieldTime+: init 300flame(5s) +
        this.player.spec.ETC = 0; //LvUp回数記録
    }

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