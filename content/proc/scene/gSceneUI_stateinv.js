//gameSceneUI_stateinv
//実ゲームシーン本体部分のうち、ステータスやタイム、装備・持ち物など表示部分
//(minimap、debugを除く表示部分）
//GameSceneの行が増えすぎたので分割して修正しやすくするのが目的
//2025/06/24分割処理
function gameSceneUI_stateinv(state){
//dev deviceControlClass 
    //宣言部
    let dev = state.System.dev;

    let work3 = dev.graphics[3];//3 UI

	this.reset = game_reset;
	this.draw = game_draw;

	let obCtrl = state.obCtrl; //= new gObjectControl(dev.graphics1, state);//
	let mapsc  = state.mapsc; //= new mapSceControl();

	let escore;

	let fdrawcnt = 0;

	let UI_force_reflash = true; //false;

	this.force_reflash = ()=>{UI_force_reflash = true;}
	
	//一番下の行消す(clip
	let ButtomlineBackgroundDraw = {}
	ButtomlineBackgroundDraw.draw = function (device) {
	    device.beginPath();
	    device.fillStyle = "rgba(0,0,0,0.5)";
	    device.fillRect(dev.layout.clip_x, dev.layout.clip_y, 640, 36);
		//device.globalAlpha = 1.0;
	}
    //hpbar
	let HpbarDraw = { hp: 0, mhp: 0, br: true, shw:0, bbw:0, exp: 0, }
	//br:SHIELD展開中 shw: SHIELD width(シールドゲージの幅0-100 
	//bbw:beforehp bar width exp:notUse.
	HpbarDraw.draw = function (device) {
		let cbar = (this.hp/this.mhp>0.5)?"limegreen":"yellowgreen";//(this.hp/this.mhp>0.3)?"yellowgreen":"red"; 
		let cborder = (this.hp/this.mhp>0.5)?"white":(this.hp/this.mhp>0.3)?"yellow":"orange"; 

	    device.beginPath();
	    device.fillStyle = "black";//clear 
	    device.fillRect(dev.layout.hp_x, dev.layout.hp_y, 102, 15);

		device.fillStyle = "red";//effect 
	    device.fillRect(dev.layout.hp_x + 1, dev.layout.hp_y + 1, this.bbw, 14-1);
	    device.fillStyle = cbar;//hpbar 
	    device.fillRect(dev.layout.hp_x + 1, dev.layout.hp_y + 1, (this.hp/this.mhp)*100, 14-1);
		if (this.br){//shieldbar
	    	device.fillStyle = "cyan"; 
	    	device.fillRect(dev.layout.hp_x + 1, dev.layout.hp_y + 3, this.shw, 14-3);

			let c = (this.shw%10)*5 + 205;
	    	device.fillStyle = "rgb(0," + c + "," + c + ")";
			//(this.shw > 50)?"rgb(0," + c + "," + c + ")": 
			//(this.shw < 25)?"rgb(" + c + ",128, 128)":"rgb(" + c + "," + c + ",160)"; //"skyblue"; 
	    	device.fillRect(dev.layout.hp_x + 1, dev.layout.hp_y + 4, this.shw-1, 14-4);
		}
		//border
		device.strokeStyle = cborder; 
		device.lineWidth = 2;
	    device.rect(dev.layout.hp_x, dev.layout.hp_y, 102, 15);
	    device.stroke();
	}
	//Expbar
	let expbarDraw = { 
		now: 0, 
		next: 0,
		draw : function (device) {
			device.beginPath();
			device.fillStyle = "darkgray";//clear 
			device.fillRect(dev.layout.score_x, dev.layout.score_y+5, 100, 3);
	

			device.fillStyle = ((this.now/this.next) >= 1)?"yellowgreen":"orange"//expbar 
			device.fillRect(dev.layout.score_x+1, dev.layout.score_y+3, (this.now/this.next)*100, 4);

			//border
			//device.strokeStyle = "darkgray"; 
			//device.lineWidth = 1;
			//device.rect(dev.layout.score_x, dev.layout.score_y, 100, 8);
			//device.stroke();
		}
	 }

	//LvUpStatusMatar
	let stbar = new statusBarMeter(["cyan","orange","limegreen","white"]);

	function statusBarMeter(setupParam){
        //setupParamater [barcolor, ...,}]
        let status;

        this.setStatusArray = function(ary){
            status = ary;
        }

        this.draw = function(device, x, y){
            
            let o = { s:status, b:setupParam, x:x, y:y }
            o.draw = function(device){
                device.beginPath();

                for (let i in this.s){
					device.fillStyle = this.b[i];
                    for (let j=0; j<this.s[i]; j++){
						if (j<7){
                        	device.fillRect(this.x + j*4, this.y + i*5, 3, 4);
						}
                    }
                }

            }
            device.putFunc(o);
        }
    }

	//チュートリアルメッセージ枠
	const tutWindowBackgroundDraw = {}
	tutWindowBackgroundDraw.draw = function (device) {
		device.beginPath();
		device.globalAlpha = 1.0;
		device.lineWidth = 1;
		device.strokeStyle = "rgba(255,255,255,1.0)";
		device.strokeRect(dev.layout.tutmsg_x-1, dev.layout.tutmsg_y-1, 386, 50);
		device.fillStyle = "rgba(0,0,0,0.5)";
		device.fillRect(dev.layout.tutmsg_x, dev.layout.tutmsg_y, 384, 48);
		device.restore();
	}

	const minimapDisp = new gameSceneUI_minimap(state);
	this.check = function(refle){
		let f = minimapDisp.check(refle);
		if (f != refle){
			UI_force_reflash = true;
		}
		return f;
	}
	//let getweapon = new get_weapon_check( state );

	//==========================================================================================
	//処理部
	function game_reset() {
	    escore = new gs_score_effect(obCtrl.score);
	    ehighscore = new gs_score_effect(state.Result.highscore);

		dev.graphics[3].reset();
		dev.graphics[3].clear();//UI

		minimapDisp.reset();
	
		UI_force_reflash = true;
		UIDraw( UI_force_reflash );
	}

	let closing = false;
	function game_draw() {

		if (state.Game.lamp || state.Game.map) minimapDisp.rader(dev.graphics[4], state.Game.lamp);//rader
        //minimapDisp.rader;

	    //==　ここから文字表示画面（出来るだけ書き換えを少なくする）
	    //プライオリティ最前面の画面追加したので
	    
		let scdispview = false;
        
	    fdrawcnt++;
	    if ((fdrawcnt % 6) == 0) {
	        fdrawcnt = 0;
	        scdispview = true;
	    }
		scdispview = true;//debug
	    
		if (scdispview){
			playerHPber.draw();
			UIDraw( UI_force_reflash );

	        //debug　true　の場合以下表示

			let wtxt;
			//tutorialDisplay 
			if ( state.obUtil.tutorialDisplayTime > state.System.time()){
				dev.graphics[2].putFunc(tutWindowBackgroundDraw);
				wtxt = state.obUtil.tutorialconsole.read();
				for (let s in wtxt) dev.graphics[2].kprint(wtxt[s], dev.layout.tutmsg_x, dev.layout.tutmsg_y + 10 * s);
				closing = true;
			}else{
				if (closing){
					state.scene.setTCW(
						dev.graphics[2],
						{x:dev.layout.tutmsg_x-1, y:dev.layout.tutmsg_y-1, w:386, h:50},
						20
					);
					closing = false;
				}
			}
		}

		if (UI_force_reflash) UI_force_reflash = false;
		drawexecute = true;         
	}
	//---------------------
	let ui = { cnt: 0,state:[], score:[], time: 0};

	let playerHPber = new effect_tlHPbar();
	//---------------------
	function effect_tlHPbar(){
		let before_barwidth = 0;
		let device = dev.graphics[4];

		this.draw = function(){
			let w_hp = (state.Game.player.hp > 0) ? state.Game.player.hp : 0;
			let now_bw = Math.trunc((w_hp / state.Game.player.maxhp)*100);

			HpbarDraw.hp = w_hp; 
			HpbarDraw.mhp = state.Game.player.maxhp;
			HpbarDraw.br = state.Game.player.barrier;
			HpbarDraw.shw = state.Game.player.shieldtime;
			HpbarDraw.bbw = before_barwidth;

			device.putFunc(HpbarDraw);
		   
			let wst = "HP:" + w_hp + "/" + state.Game.player.maxhp;// + "." + before_barwidth;
	
			if (state.Game.player.barrier) {
				//wst = "HP:" + w_hp +"/SHIELD";       
			}
			device.putchr8(wst, dev.layout.hp_x + 8, dev.layout.hp_y + 4);

			if (before_barwidth > now_bw) before_barwidth = before_barwidth - 1;
			if (before_barwidth <= now_bw) before_barwidth = now_bw;

		}
	}

	//UI表示は都度更新と随時更新では負荷減効果あり、必要時都度更新で処理する。
	//(ミニマップのレーダー(点)は常時なのでここでは処理しない)

	function UIDraw( force_reflash ){

		let insco = [
			ehighscore.read(state.Result.highscore),//state.Result.highscore,
			escore.read(obCtrl.score)//obCtrl.score,
		];

		let inste = [ 
			//ehighscore.read(state.Result.highscore),//state.Result.highscore,
			//escore.read(obCtrl.score),//obCtrl.score,
			state.Game.player.zanki,
			state.Game.map,
			state.Game.lamp,
			obCtrl.item[20],//ball
			obCtrl.item[22],//key
			obCtrl.item[35],//coin
			obCtrl.item.length,//アイテム数が変わった場合、何か拾った(keyitem)
			obCtrl.itemstack.length,
			state.Game.player.weapon,
			state.Game.player.level,
			mapsc.stage,
			//Math.floor((120000 - mapsc.flame) / 1000),
			state.Game.player.hp,
			state.Game.player.maxhp,
			state.Game.player.barrier
		];

		let intim = Math.floor((120000 - mapsc.flame) / 1000);

		let cf= true; //Status :equal = true/change = false <- Draw exec 
		for (let i in ui.state) if (ui.state[i] !== inste[i]) cf = false;

		let cs= true; //Score
		for (let i in ui.score)	if (ui.score[i] !== insco[i]) cs = false;

		let ct= true; //Time 
		if (ui.time !== intim) ct = false;

		ui.state = inste;
		ui.score = insco;
		ui.time = intim;
		ui.cnt++;

		if (force_reflash){ cf = false; cs = false; ct = false;}

		//work3.fill(dev.layout.hiscore_x + 12 * 6, dev.layout.hiscore_y, 12 * 7, 32); // , "darkblue");

		//obCtrl.messageview.write(JSON.stringify(uistate) + "/" + cf);
		if  (cf && cs && ct) return;

		//obCtrl.messageview.write("** SCORE Draw **" + ui.cnt);

		if (!cf){
			work3.reset();
			work3.clear();

			work3.putFunc(ButtomlineBackgroundDraw);
		}else{
			if (!cs) { 
				work3.fill(dev.layout.hiscore_x, dev.layout.hiscore_y,8*12,16);//半透明を表示するために一旦クリア
				work3.fill(dev.layout.hiscore_x, dev.layout.hiscore_y,8*12,16,"rgba(0,0,0,0.5)");
			}

			if (!ct) { 
				work3.fill(dev.layout.time_x, dev.layout.time_y,8*9,8);//半透明を表示するために一旦クリア
				work3.fill(dev.layout.time_x, dev.layout.time_y,8*9,8,"rgba(0,0,0,0.5)");
			}
		}

		if (!cs || !cf){ 
			//work3.putchr("Hi-Sc:" + ui.score[0], dev.layout.hiscore_x, dev.layout.hiscore_y);
			//work3.putchr("Score:" + ui.score[1], dev.layout.score_x, dev.layout.score_y);
			let nowLvexp = Math.pow(state.Game.player.spec.ETC ,2)* 100;
			let NextLup = Math.pow(state.Game.player.spec.ETC+1 ,2)* 100;
			//let NextMkr = ( obCtrl.score >= NextLup) ? "#":" ";
			let Nextstr = ( obCtrl.score >= NextLup) ? 
				" NextLvReady":"       Next." + NextLup;

			expbarDraw.now = obCtrl.score - nowLvexp;
			expbarDraw.next = NextLup - nowLvexp;
			//if (expbarDraw.now <= NextLup) 
			work3.putFunc(expbarDraw);

			work3.putchr8("Exp." + ui.score[1], dev.layout.hiscore_x, dev.layout.hiscore_y);
			Nextstr = Nextstr.substring(Nextstr.length-13);
			work3.kprint(Nextstr, dev.layout.score_x, dev.layout.score_y);
			//work3.putchr8(Nextstr, dev.layout.score_x, dev.layout.score_y);

			if  (cf) state.obUtil.messageview.write("** SCORE Draw ** f:" + ui.cnt);
		}

		if (!ct || !cf){ 
			work3.putchr8("Time:" + ui.time, dev.layout.time_x, dev.layout.time_y);
			if  (cf) state.obUtil.messageview.write("** Time Draw ** f:" + ui.cnt);
		}

		if  (cf) return;

		state.obUtil.messageview.write("** UI Draw ** f:"+ ui.cnt);
		ui.cnt = 0;

		minimapDisp.draw();//submap display
		
		if (state.Game.mode !=1 ){
			UI_PlayerType();
		}
	}

	//==========
	function gs_score_effect( sc ){

		let wscore = sc;
	
		this.read = function (score) {
	
			if (score <= wscore) {
				wscore = score;
			} else {
	
				let num = Math.ceil((score - wscore) / 5);
	
				wscore += num;
			}
	
			let sc = wscore;
	
			let wd = [];
			let wt = "";
	
			for (i = 0; i < 7; i++) {
				let num = sc % 10;
				wd[7 - i] = num;
				sc = (sc - num) / 10;
			}
	
			for (i in wd) {
				wt = wt + "" + wd[i];
			}
	
			return wt;
		}
	}

	//==========
	function UI_PlayerType(){

		//work3.putFunc(ButtomlineBackgroundDraw);

		//残機表示
		let zc = state.Game.player.zanki;//2 - dead_cnt;
		if (zc < 3) {
			for (let i = 0; i < zc; i++) {
				work3.put("Mayura1", dev.layout.zanki_x + i * 32, dev.layout.zanki_y);
			}
		} else {
			work3.put("Mayura1", dev.layout.zanki_x, dev.layout.zanki_y);
			work3.putchr8("x" + zc, dev.layout.zanki_x + 16, dev.layout.zanki_y);
		}

		//Lamp/map
		//if(state.Game.map){ work3.put("Map",dev.layout.map_x + 36, dev.layout.map_y + 12) }//dev.layout.zanki_x + 360, dev.layout.zanki_y-16);}
		//if(state.Game.lamp) { work3.put("Lamp",dev.layout.map_x + 12, dev.layout.map_y + 12) }//dev.layout.zanki_x + 336, dev.layout.zanki_y-16);}

		//ball表示
		if (Boolean(obCtrl.item[20])) {
			let n = obCtrl.item[20];
			if (n <= 3) {
				for (let i = 0; i < n; i++) {
					work3.put("Ball1",
					dev.layout.zanki_x + i * 20 + 288, dev.layout.zanki_y - 8);
				}
			} else {
				work3.put("Ball1",
				dev.layout.zanki_x + 288, dev.layout.zanki_y - 8);

				work3.putchr8("x" + n, dev.layout.zanki_x + 288 + 10, dev.layout.zanki_y - 12);
			}
		}
		//Coin表示
		if (Boolean(obCtrl.item[35])) {
			let n = obCtrl.item[35];
			if (n <= 6) {
				for (let i = 0; i < n; i++) {
					work3.put("Coin1",
					dev.layout.zanki_x + i * 8 + 288, dev.layout.zanki_y + 8);
				}
			} else {
				work3.put("Coin1",
				dev.layout.zanki_x + 288, dev.layout.zanki_y + 8);
				work3.putchr8("x" + n, dev.layout.zanki_x + 288 + 10, dev.layout.zanki_y + 8);
			}
		}
		//取得アイテム表示
		if (Boolean(obCtrl.itemstack)) {

			let wchr = { 20: "Ball1", 23: "BallB1", 24: "BallS1", 25: "BallL1" }
			let witem = [];

			for (let i in obCtrl.itemstack) {
				let w = obCtrl.itemstack[i];
				witem.push(w);
			}

			work3.putchr8("[X]", dev.layout.zanki_x + 132 - 16, dev.layout.zanki_y - 16);
			n = witem.length;

			if (n >= 8) {n = 6; work3.putchr8("...", dev.layout.zanki_x + n * 20 + 128, dev.layout.zanki_y + 8);}
			//if (n >= 7) n = 7;

			for (let i = 0; i < n; i++) {
				if (i == 0) {
					work3.put(wchr[witem[witem.length - 1 - i]],
					dev.layout.zanki_x + i * 20 + 132, dev.layout.zanki_y);
					//640 - (12 * 12), 479 - 32 + 5);
				} else {
					work3.put(wchr[witem[witem.length - 1 - i]],
					dev.layout.zanki_x + i * 20 + 136, dev.layout.zanki_y + 8);
				}
			}
			state.obUtil.keyitem_view_draw(work3);
		}

		n = 0;
		if (Boolean(obCtrl.item[22])) {
			n = obCtrl.item[22];
		}
		if (n > 0) work3.put("Key", dev.layout.zanki_x + 64, dev.layout.zanki_y);

		let wweapon = ["Wand", "Knife", "Axe", "Boom", "Spear", "Bow"];

		if (!Boolean(state.Game.player.weapon)) state.Game.player.weapon = 0;
		if (!Boolean(state.Game.player.level)) state.Game.player.level = 0;

		work3.putchr8("[Z]", dev.layout.zanki_x + 96 - 16, dev.layout.zanki_y - 16);
		work3.put(wweapon[state.Game.player.weapon], dev.layout.zanki_x + 96, dev.layout.zanki_y);
		if (state.Game.player.level > 0){
			let wt = "+" + state.Game.player.level + 
				((state.Game.player.level > 2 )?" Max":"");
				work3.putchr8(wt, dev.layout.zanki_x + 96 - 16, dev.layout.zanki_y + 8);
			}
		work3.putchr8("Stage " + mapsc.stage, dev.layout.stage_x, dev.layout.stage_y);
		
		let w_hp = (state.Game.player.hp > 0) ? state.Game.player.hp : 0;

		HpbarDraw.hp = w_hp; 
		HpbarDraw.mhp = state.Game.player.maxhp;
		HpbarDraw.br = state.Game.player.barrier;
		HpbarDraw.shw = state.Game.player.shieldtime;
		HpbarDraw.bbw = Math.trunc(w_hp/state.Game.player.maxhp);
		
		//let BaseLup = Math.pow(state.Game.player.spec.ETC   ,2)* 100;
		//let NextLup = Math.pow(state.Game.player.spec.ETC+1 ,2)* 100;
		//HpbarDraw.exp = Math.abs(Math.trunc((obCtrl.score-BaseLup)/(NextLup-BaseLup)*100));
		work3.putFunc(HpbarDraw);
	   
		let wst = "HP:" + w_hp + "/" + state.Game.player.maxhp;

		if (state.Game.player.barrier) {
			//wst = "HP:" + w_hp +"/SHIELD";       
		}
		work3.putchr8(wst, dev.layout.hp_x + 8, dev.layout.hp_y + 4);

		stbar.setStatusArray([
            state.Game.player.base.VIT,
            state.Game.player.base.INT,
            state.Game.player.base.MND //,
            //state.Game.player.spec.ETC
			//Math.abs(Math.trunc((obCtrl.score-BaseLup)/(NextLup-BaseLup)*7))
        ]);
		stbar.draw(work3, dev.layout.zanki_x + 252, dev.layout.zanki_y -16);
	}
}
