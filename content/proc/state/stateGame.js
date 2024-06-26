﻿//stateGame
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
        let sp_ = new stateSpec();
        let bs_ = new stateSpec();
        let eh_ = new stateSpec();

        this.spec = sp_;//参照
        this.base = bs_//Base Spec 
        this.enh  = eh_;//Enhance Spec (item /Buff/ Debuff etc)
    }

    let stateSpec = function() {
        let status = Array(11);
        status.fill(0);

        this.STATUS = status;

        this.LV = 0;    this.HP = 0;    this.MP = 0;
        this.STR = 0;   this.DEX = 0;   this.AGI = 0;
        this.VIT = 0;   this.INT = 0;   this.MND = 0;
        this.LAK = 0;   this.ETC = 0;
    }

    let stateSpecMethod = function(){};
        stateSpecMethod.prototype = {
        Set: function(status){
            this.LV  = status[0];//WeaponLevel ( = state.Game.player.level) 
            this.HP  = status[1];
            this.MP  = status[2]; 
            this.STR = status[3];//Near  Ataack+: init 0    
            this.DEX = status[4];//Range Attack+: init 0
            this.AGI = status[5];
            this.VIT = status[6];//HPrecover+ : init 3 +
            this.INT = status[7];//BombPower+ : init -10
            this.MND = status[8];//ShieldTime+: init 300flame(5s) +
            this.LAK = status[9];
            this.ETC = status[10];//spec:LvUp回数記録
        },

        Read: function(){
            let status = Array(11);

            status[0] = this.LV; 
            status[1] = this.HP; 
            status[2] = this.MP; 
            status[3] = this.STR; 
            status[4] = this.DEX; 
            status[5] = this.AGI; 
            status[6] = this.VIT; 
            status[7] = this.INT; 
            status[8] = this.MND; 
            status[9] = this.LAK; 
            status[10] = this.ETC;

            return status;
        },

        Reset: function(){
            //["LV","HP","MP","STR","DEX","AGI","VIT","INT","MND","LAK","ETC"]
            let status = Array(11);
            status.fill(0);
            set(status);
        },

        Loader: function(e){
            if (Boolean(e)){
            this.LV  = e.LV;//WeaponLevel ( = state.Game.player.level) 
            this.HP  = e.HP;
            this.MP  = e.MP; 
            this.STR = e.STR;//Near  Ataack+: init 0    
            this.DEX = e.DEX;//Range Attack+: init 0
            this.AGI = e.AGI;
            this.VIT = e.VIT;//HPrecover+ : init 3 +
            this.INT = e.INT;//BombPower+ : init -10
            this.MND = e.MND;//ShieldTime+: init 300flame(5s) +
            this.LAK = e.LAK;
            this.ETC = e.ETC;//spec:LvUp回数記録
            }else{
                //console.log(Object.entries(e));
                this.LV = 0;    this.HP = 0;    this.MP = 0;
                this.STR = 0;   this.DEX = 0;   this.AGI = 0;
                this.VIT = 0;   this.INT = 0;   this.MND = 0;
                this.LAK = 0;   this.ETC = 0;
            }
        }
    }
    stateSpec.prototype = new stateSpecMethod();

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

    this.mode = 0;//Palyer Type Select //TESTMODE 1
    this.score = 0;
    
    this.reset = function(){

        this.player = new statePlayer();
        /*

        this.player.zanki = 2;
        this.player.hp = INITIAL_HP;
        this.player.maxhp = this.player.hp;
        this.player.weapon = 0;//初期装備0:wand
     
        this.player.level = 0;//現状weaponLevelで使用予定

        this.player.spec.reset();// = new stateSpec();
        /*
        this.player.spec.LV = 0; //WeaponLevel ( = state.Game.player.level) 
        this.player.spec.HP = 0; //Maxhp (notuse)
        this.player.spec.MP = 0; //MagicPoint (notuse) 
        this.player.spec.VIT = 0; //HPrecover+ : init 3 +
        this.player.spec.INT = 0; //BombPower+ : init -10
        this.player.spec.MND = 0; //ShieldTime+: init 300flame(5s) +
        this.player.spec.ETC = 0; //LvUp回数記録
        */
    }

    this.spec_check = function(){

        let base = this.player.base.Read();
        let enh  = this.player.enh.Read();
        let spec = this.player.spec.Read();

        let etc = 0;
        for (let i=3; i<=8; i++){
            spec[i] = base[i] + enh[i];
            etc += base[i];
        }

        spec[10] = etc;
        this.player.spec.Set(spec);

        //console.log("spec:" + this.player.spec.STATUS);
        //console.log("base:" + this.player.base.STATUS);
        //console.log("enh:"  + this.player.enh.STATUS);
    }

    this.load = function () {
        //中断セーブからの復帰

        if (Boolean(localStorage)) {

            let f = false;

            if (Boolean(localStorage.getItem("savedata"))) {
                f = true;
                let s = JSON.parse(localStorage.getItem("savedata"));

                //alert(s);

                this.item = s.item;
                this.itemstack = s.itemstack;
                this.nowstage = s.stage;
                this.player = s.player;

                //SaveDataにMethodが含まれない為、データを移行する。
                let spec = this.player.spec;
                let base = this.player.base;
                let enh = this.player.enh;

                this.player.spec = new stateSpec();
                this.player.base = new stateSpec();
                this.player.enh = new stateSpec();

                this.player.spec.Loader(spec);
                this.player.base.Loader(base);
                this.player.enh.Loader(enh);

                //console.log(spec + base + enh);

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
        let s = {}
        s.item = this.item;
        s.itemstack = this.itemstack;
        s.stage = this.nowstage;
        s.player = this.player;

        let jsontext = JSON.stringify(s);

        //alert(jsontext);

        let ret_code = 0;
        
        if (Boolean(localStorage)) { //ローカルストレージ使えたらセーブ実施
            localStorage.setItem("savedata", jsontext);
        } else {
            ret_code = 2;
        }
        //正常時:0 /異常時:any
        return ret_code;
    }

    this.preload = function(){
        // Load Data Check
        let result = {ready: false, load: false, data:{}};

        if (Boolean(localStorage)) {

            if (Boolean(localStorage.getItem("savedata"))) {
                let s = JSON.parse(localStorage.getItem("savedata"));

                result.data = s;
                result.load = true;//FileLoad ok
            }
            result.ready = true;//LocalStorage ready
        } else {
            result.ready = false;//LocalStorage NG
        }

        //result 
        //ready:false               dataEmpty
        //ready:true load:false     ItemNotFound
        //ready:true load:true data:[object] dataload 
        //
        //data.item
        //data.itemstack
        //data.nowstage;
        //data.player
        //.zanki
        //.hp .maxhp .weapon .level
        //.spec.VIT .MND .INT .ETC
        //.
        //.日時とか入れる？

        return result;
    }

    this.dataview = function(result){
        
        let txt = [];

        if (result.ready){
            if (result.load){
                let s = result.data;

                let w = "";
                for (let i in s.item){
                    if (Boolean(s.item[i])) w = w + "[" + i + "]" + s.item[i] + ".";
                }
                txt.push("item:" + w);

                w = "";
                for (let i in s.itemstack){
                    w = w + s.itemstack[i] + ",";
                }
                txt.push("itemstack:" + w);
                txt.push("nowstage:" + s.stage);

                txt.push("zanki:" + s.player.zanki);
                txt.push("hp:" + s.player.hp);
                txt.push("maxhp:" + s.player.maxhp);
                txt.push("weapon:" + s.player.weapon);
                txt.push("level:" + s.player.level);
                txt.push("VIT:" + s.player.spec.VIT);
                txt.push("MND:" + s.player.spec.MND);
                txt.push("INT:" + s.player.spec.INT);
                txt.push("ETC:" + s.player.spec.ETC);
                txt.push("Load Ok.");
            }else{
                txt.push("Data Not Found.");
            }
            txt.push("Process end.");
        }
        return txt;
    }

    this.dataview2 = function(result){
        
        let weapon = ["Rod", "Sword", "Axe", "Boom", "Spear", "Bow"];
        let items = [];

        items[20] = "①"; //玉
        items[23] = "②"; //B
        items[24] = "③"; //S
        items[25] = "④"; //L

        let txt = [];
        if (!Boolean(result.title)) {txt.push("[SAVEDATA]");} else {txt.push(result.title);}

        if (result.ready){
            if (result.load){
                let s = result.data;
                let p = s.player;

                let w = "";
                for (let i in items){
                    if (Boolean(s.item[i])) w = w + items[i] + ":" + s.item[i] + " ";
                }
                txt.push("ITEM:" + w);

                txt.push("STAGE:" + s.stage);

                txt.push("⑦:" + p.zanki);
                txt.push("HP :" + p.hp + " / " + p.maxhp);
                txt.push("WEAPON :" + weapon[p.weapon] + " +" + p.level);
                txt.push("STR :" + p.spec.STR + " (" + p.base.STR + "+" + p.enh.STR + ")");
                txt.push("DEX :" + p.spec.DEX + " (" + p.base.DEX + "+" + p.enh.DEX + ")");
                txt.push("VIT :" + p.spec.VIT + " (" + p.base.VIT + "+" + p.enh.VIT + ")");
                txt.push("MND :" + p.spec.MND + " (" + p.base.MND + "+" + p.enh.MND + ")");
                txt.push("INT :" + p.spec.INT + " (" + p.base.INT + "+" + p.enh.INT + ")");
            }else{
                txt.push("NOT FOUND.");
            }
        }
        return txt;
    }

}