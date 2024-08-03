//gameScene
//ゲーム本体部分のループや画面推移を管理する予定
//タイトルなどは別シーンとして管理すればいいかも
//（デバッグ表示やカーソル表示、FPS表示などのゲーム部分と
//別になる部分と分離して管理しやすくするのが目的。
//
function gameScene(state){
//dev deviceControlClass 

    //宣言部
    let dev = state.System.dev;

	let work = dev.graphics[1];//1 SP
    let work2 = dev.graphics[0];//0 BG
    let work3 = dev.graphics[3];//3 UI
    let forgroundBG = dev.graphics[2];//2 FG

	work2.backgroundcolor = "black";

	this.init = game_init;
	this.reset = game_reset;
	this.step = game_step;
	this.draw = game_draw;

	this.reset_enable = true;
	this.score = 0;

	let obCtrl = state.obCtrl; //= new gObjectControl(dev.graphics1, state);
	let mapsc  = state.mapsc; //= new mapSceControl();

	let escore;

	//let scr_cnt = 0;
	let dead_cnt = 0;

	let tex_bg = [];
	let mapChip = [];
	let bgData = [];

	//let ldflg = false;
	//let scenechange = false;
	//let ec_draw_count = 0;

	let sndcf = false;

	let mapdisp = false;
	let lampf = false;

	//let mapv = false;

	let fdrawcnt = 0;
	let drawexecute = false;

	let mmrefle = true; //mini map reflash

	let useosc = false;  //Use Off Screen Canvas

	let UI_force_reflash = false;

	let mmcanvas;
	let mmdevice;

	if (typeof OffscreenCanvas !== "undefined"){ 
		mmcanvas = new OffscreenCanvas(150, 150);
	
		mmdevice = mmcanvas.getContext("2d");

		useosc = true;
	}
	
	//縮小マップ枠
	let SubmapframeDraw = {}
	SubmapframeDraw.draw = function (device) {
	    device.beginPath();
	    device.fillStyle = "rgba(0,0,0,0.3)";
	    device.fillRect(dev.layout.map_x, dev.layout.map_y, 150, 150);
		//device.globalAlpha = 1.0;
1	    /*
		device.beginPath();
	    device.strokeStyle = "rgba(0,0,255,0.5)";
	    device.rect(dev.layout.map_x, dev.layout.map_y, 150, 150);
	    device.stroke();
		*/
	}

	//一番下の行消す(clipすんのがいいかも
	let ButtomlineBackgroundDraw = {}
	ButtomlineBackgroundDraw.draw = function (device) {
	    device.beginPath();
	    device.fillStyle = "rgba(0,0,0,0.5)";
	    device.fillRect(dev.layout.clip_x, dev.layout.clip_y, 360, 36);
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
		/*
	    device.beginPath();
		device.strokeStyle = "white";//"dimgray";
	    device.lineWidth = 2;
		device.moveTo(dev.layout.hp_x +1        , dev.layout.hp_y +14);
		device.lineTo(dev.layout.hp_x + this.exp, dev.layout.hp_y +14);
	    device.stroke();
		*/
	}
	//縮小マップ表示
	let SubmapDraw = new smd(mmdevice, mmcanvas); 
	function smd(ctx, elm) { 
		this. mcp = mapChip;
		let osc = false;
		//this.draw = osc? this.predr: this.ondr;

		this.d = ctx;
		this.e = elm;

		this.x = dev.layout.map_x;
		this.y = dev.layout.map_y;
		/*
		this.draw = function (device) {
			//for (let i = 0, loopend = this.mcp.length; i < loopend; i++) {
			for (let i in this.mcp){
				let mc = this.mcp[i];
				if (mc.lookf){
					//if ((mc.visible) && ((mc.type == 11) || (mc.type == 12))) {
					if (mc.visible) {
						let c = ["dimgray", "steelblue", "orange"];

						device.beginPath();
						//device.strokeStyle = (mc.type == 12) ? "orange" : "blue";
						device.strokeStyle = c[mc.type -10];
						device.lineWidth = 1;
						device.rect(this.x + mc.x / 20, this.y + mc.y / 20, 2, 2);
						device.stroke();
					}
				}
			}
		}
		*/
		this.create = function(){
		//	ondr(this.d);
			this.d.clearRect(0, 0, 150, 150);
			for (let i = 0, loopend = this.mcp.length; i < loopend; i++) {
			//	for (let i in this.mcp){
					let mc = this.mcp[i];
					//if (mc.lookf){
						//if ((mc.visible) && ((mc.type == 11) || (mc.type == 12))) {
						if (mc.visible) {
							let c;
							if (mc.lookf){
								c = ["dimgray", "steelblue", "orange"];
							} else {
								c = ["darkslategray", "darkslategray", "orange"];
							}
							this.d.beginPath();
							//device.strokeStyle = (mc.type == 12) ? "orange" : "blue";
							this.d.strokeStyle = c[mc.type -10];
							this.d.lineWidth = 1;
							this.d.rect(this.x + mc.x / 20, this.y + mc.y / 20, 2, 2);
							this.d.stroke();
						}
					//}
			//	}
			}
		}

		this.draw = function(device){
			device.drawImage(this.e, this.x, this.y);
		}
	}
	//forgroundBG.putFunc(cl);//submapは[2]に表示、点は[3]に表示に変更

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

	mapdisp = true; //以前の処理では自動で消されない画面に書いていたので常時表示処理させる為に常にtrue；

	//let getweapon = new get_weapon_check( state );

	//==========================================================================================
	//処理部

	function game_init(){

		//obCtrl = new gObjectControl(work, state);//stateへ統合
		//mapsc = new mapSceControl();//stateへ統合(別Sceneでmap確認できるようにmapviewscene)

		mapsc.init();

		state.Result.load();

		//state.Result.highscore = 0;
		state.Result.score = 0;
		state.Game.item = obCtrl.item;
		state.Result.combo = obCtrl.combo;

		//scenechange = false;
	}

	function game_reset(contflg) {
	    //ゲーム画面の描画を開始(Flip/Drawを自動で実行　各フレームで)
		dev.graphics[0].setInterval(1);//BG
		dev.graphics[1].setInterval(1);//SPRITE
		dev.graphics[2].setInterval(1);//FG
		dev.graphics[3].setInterval(0);//UI

	    work3.clear();

		//フロアチェンジ前の座標がSubmapが見たことにされる為、1度表示されて正しい座標に移動後から壁のlookfを有効にする。	
		drawexecute = false;
		mmrefle = true;
		
	    if (!Boolean(contflg)) { contflg = false; }//default: Coldstart /true:continue false:newgame
	    //scenechange = false;

	    if (state.Game.cold) {//タイトル画面から始めた場合

	        obCtrl.reset(false);
	        mapsc.init();

	        if (contflg) {//Continue
	            dead_cnt = 2 - state.Game.player.zanki;

	            obCtrl.item = state.Game.item;
	            obCtrl.itemstack = state.Game.itemstack;
	        } else {//InitialStart
	            dead_cnt = 0;
	            state.Game.nowstage = state.Config.startstage;

				state.Game.reset();//↑3行も含む処理(2024/03/10)
	        }
	        state.Game.player.barrier = false;//バリア中オンにする

	        mapsc.change(state.Game.nowstage);
	        mapsc.reset(state.System.time()); //初期マップ展開

	        dev.sound.change(0); //start music
	        dev.sound.play();
	    }

	    ec_draw_count = 0;

	    if (contflg && (!state.Game.cold)) {//result画面から戻ってきた場合
	        //stage推移
	        let w = mapsc.stage;
	        w++;

			if ( w > 30 ) w = 1;//ステージ最終面だった場合最初に戻る。エンディングがある場合は変更
	        mapsc.change(w);
	        mapsc.stage = w;
	        state.Game.nowstage = w;
	        let wsc = obCtrl.score;
	        obCtrl.reset(false); //continueflag無しでリセットするとスコアも消されてしまうため、事前に取っておく
	        obCtrl.score = wsc;
	        mapsc.reset(state.System.time()); //初期マップ展開 今回はこれでいいと思われる

	        //mapsc.start(true); //マップ初期配置のものを展開する。

			dev.sound.change(1); //normal bgm
	        dev.sound.play();
	    }

	    //tex_bg = dev.images[mapsc.bgImage()];
	    tex_bg = dev.game.asset.image[mapsc.bgImage()].img;

		mapChip = mapsc.mapChip();
	    bgData = mapsc.bgPtn();

		SubmapDraw.mcp = mapChip; 
	    //work2.clear("darkgreen");

	    //work2.reset();

	    escore = new gs_score_effect(obCtrl.score);
	    ehighscore = new gs_score_effect(state.Result.highscore);

	    sndcf = true;

		lampf = state.Config.lamp_use ? true : false;
	    mapdisp = state.Config.map_use ? false : true; 
		//mapdisp = false;
	    mapv = false;
        //debug code-- 2023/01/07
		//lampf = true ;
	    //mapdisp = false;
		//^^^^^
		obCtrl.messageconsole.write("==STAGE START==");

		if (state.Game.cold && contflg)	 obCtrl.tutTable(9);//CONTINUEについて説明
		if (state.Game.nowstage%5==0)	 obCtrl.tutTable(6);//ボスについて説明
		if (state.Game.nowstage%15==6)	 obCtrl.tutTable(13);//10面要アイテム説明
		if (state.Game.nowstage%15==11)	 obCtrl.tutTable(14);//15面要アイテム説明
	}

	function game_step(g, input) {

		dev.gs.commit();

		if (!this.reset_enable){
			this.reset_enable = true; // reset無しで戻ってきたときにtrueに変更
			mapsc.pauseOff(state.System.time());
			UI_force_reflash = true;
		} 

		//StateGameに今の状態を反映
		state.Game.lamp = lampf; 
		state.Game.map =  !mapdisp; //現状の処理で使用時falseとなっているの為Not演算で反転

	    if (!dev.sound.running()) {
//	        if (mapsc.flame < 120000) {
				let wsn = 1; //NormalBGM
//				if (state.Game.nowstage%15 == 0) wsn = 16;//BattleBGM
				if (obCtrl.rollcall("boss")) wsn = 16;//BattleBGM 
				if (obCtrl.rollcall("timeover")) wsn = 3;//timeover sound 
	            dev.sound.change(wsn);
//	        } else {
//	            dev.sound.change(3);// timeover sound
//	        }
	        if (obCtrl.rollcall("mayura")) dev.sound.play();//自機が居るときにBGM鳴らす
	    }

		//if ((mapsc.flame >= (120000 - 2000)) && sndcf && obCtrl.rollcall("timeover")) {
		if ( sndcf && obCtrl.rollcall("warning")){
			obCtrl.tutTable(3);//TIMEついて説明
			//dev.sound.effect(2);
			dev.sound.change(2);//dev.sound.change(2); //Warning sound
	        if (obCtrl.rollcall("mayura")) dev.sound.play();
	        //dev.sound.next(3);

	        sndcf = false;
	    }

	    //ゲームの進行
	    if (obCtrl.interrapt) {
			// SIGNAL LIST
			//   1: PauseScene
			// 835: resultScene
			//1709: LvUpScene
			//4649: Restart/Gover(zanki状態による)
			//6055:（未使用）Boss
			//他数字は空き
			// GameScene切り替え依頼をobjから行う場合にSIGNALで
			// interraptがtrueとなる。次のフレームで自動でfalse。
			//
			//UI_force_reflash = true;

	        if (obCtrl.SIGNAL == 1) {
	            mapsc.enable = false;
	            mapsc.counter_runnning = false;

	            dev.sound.volume(0.0);

				state.Game.item = obCtrl.item;
				state.Game.itemstack = obCtrl.itemstack;
				state.Game.player.zanki = 2 - dead_cnt;

				obCtrl.interrapt = false;
				obCtrl.SIGNAL = 0;

				this.reset_enable = false;
				mapsc.pauseOn(state.System.time());
				
				return 6;//pause
	        }

			/*
	        if (obCtrl.SIGNAL == 6055) {//boss戦に入ったのでマップシナリオカウント停止
	            mapsc.enable = true;
	            mapsc.counter_runnning = false;
	        }
			*/

	        if (obCtrl.SIGNAL == 835) {//リザルト画面要求(面クリアー処理予定

	            obCtrl.score += Math.floor((120000 - mapsc.flame) / 100);

	                state.Result.score = obCtrl.score;
	                state.Game.item = obCtrl.item;
	                state.Game.itemstack = obCtrl.itemstack;
	                state.Game.player.zanki = 2 - dead_cnt;
	                state.Result.combo = obCtrl.combo;
	                state.Result.combomax = obCtrl.combomax;
	                state.Result.obCount = obCtrl.obCount;
	                state.Result.total = obCtrl.total;
	                state.Result.hidan = obCtrl.hidan;

	                state.Game.cold = false;

	                obCtrl.interrapt = false;
	                obCtrl.SIGNAL = 0;

	                obCtrl.draw(work2);

	                //scenechange = true;

	                dev.sound.change(4);//Stageclear
	                dev.sound.play();



	                return 5; //result
	        }

	        if (obCtrl.SIGNAL == 1709) {//LevelUp要求

				mapsc.enable = true;
				mapsc.counter_runnning = false;

				state.Game.item = obCtrl.item;
				state.Game.itemstack = obCtrl.itemstack;
				state.Game.player.zanki = 2 - dead_cnt;

				obCtrl.interrapt = false;
				obCtrl.SIGNAL = 0;

				this.reset_enable = false;
				mapsc.pauseOn(state.System.time());

				return 9; //Lvup
			}

	        if (obCtrl.SIGNAL == 4649) {//リスターとシグナルが来た(自機が死んで3.0sec位あと）
	            dead_cnt++;
	            if (dead_cnt < 3) {
	                if (state.Config.itemreset) {
	                    obCtrl.item = []; //取得アイテムカウント消す(パワーアップだけでもよいがとりあえず）
	                    obCtrl.itemstack = [];
	                }
	                obCtrl.combo = [];
	                //state.Game.player.maxhp = 10;//ゲームオーバーまで体力上昇分を保留する。2012/04/04
	                state.Game.player.hp = state.Game.player.maxhp;

	                obCtrl.restart();

	                mapsc.counterReset(state.System.time());

					dev.sound.change(0); //normal bgm
					dev.sound.play();

	                sndcf = true;
	            } else {

	                state.Result.score = obCtrl.score; ;
	                state.Game.item = obCtrl.item;
	                state.Game.itemstack = obCtrl.itemstack;
	                state.Game.player.zanki = 2 - dead_cnt;
                    state.Result.combo = obCtrl.combo;
                    state.Result.combomax = obCtrl.combomax;
                    state.Result.obCount = obCtrl.obCount;
                    state.Result.total = obCtrl.total;
                    state.Result.hidan = obCtrl.hidan;

                    obCtrl.draw(work2);

                    //scenechange = true;

                    if (Boolean(localStorage)) { //ローカルストレージ使えたらハイスコア記録しとく
                        localStorage.setItem("highscore", new String(state.Result.highscore));
                    }

                    dev.sound.change(6); //gameover sound
                    dev.sound.play();

	                return 3; //gover
	            }
	        }
	    } else {　//not Interrapt
	        //bg_scroll = true;
	        mapsc.enable = true;
	        mapsc.counter_runnning = true;

			//UI_force_reflash = false;
	        //demo_mode = false;
	    //}

	    //item
			let wchk = false;
			for (let i in obCtrl.item) {
			//	
				if (i == 21) {//extend
					if (obCtrl.item[21] > 0) {
						obCtrl.item[21] = 0;
						dead_cnt--;
						dev.sound.effect(11); //get音
					}
				}
				if (i == 26) {//lamp
					if (obCtrl.item[26] > 0) {
						obCtrl.item[26] = 0;
						lampf = true;
						//dev.sound.effect(9); //cursor音
					}
				}
				if (i == 27) {//map
					if (obCtrl.item[27] > 0) {
						obCtrl.item[27] = 0;
						mapdisp = false; //falseで表示
						//dev.sound.effect(9); //cursor音
						for (let i in mapChip){
						//	mapChip[i].lookf = true; //mapを一気に表示
						}
					}
				}
				//weaponチェックはplayer.jsでチェックしている。
				//if (!wchk) wchk = getweapon.check(i);//1frameでは１個分の武器のみ取得チェック(重複すると消滅等発生する為)
				//get_weapon_checksub( i );
		}
		}
		obCtrl.move(mapsc, input);
		mapsc.step(obCtrl, state.System.time());

		if (state.Result.highscore < obCtrl.score) state.Result.highscore = obCtrl.score;

	    return 0;
	}

	function game_draw() {
        
		BGDraw();
		BGShadowDraw();
		
        //==この↑は背景描画
		obCtrl.drawShadow(work2);//objectのshadowを背景面に反映
	    obCtrl.draw(work);
	    obCtrl.draw(forgroundBG, true); //prioritySurface = true の物を別Screenに描画する処理(通常のDrawではパスされる。）

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
			
			//work3.reset();
			//work3.clear();
			if (!mapdisp || lampf) {
				//work3.putFunc(SubmapframeDraw);//forgroundBG.putFunc(SubmapframeDraw);
				//if (!mapdisp){//mapdispはfalseで表示(今となってはなぜかわからん/そのうち修正)
				//	if (mmrefle){
				//		SubmapDraw.create();
				//		mmrefle = false;
						//work3.putFunc(SubmapDraw);
				//	}
				//	work3.putFunc(SubmapDraw);
				//}
				obCtrl.drawPoint(dev.graphics[4], lampf);
				//obCtrl.drawPoint(work3, lampf);//dev.graphics[3]
			}

			//work3.putFunc(ButtomlineBackgroundDraw);
			playerHPber.draw();
			UIDraw( UI_force_reflash );

	        //debug　true　の場合以下表示

			let wtxt;
 	        if (state.Config.debug) {

				wtxt = read_debugStates();
				if (state.Config.viewlog) wtxt = wtxt.concat(obCtrl.messagelog.read()); 
    	        //let wtxt = read_debugStates().concat(obCtrl.messagelog.read());
	    	    for (let s in wtxt) dev.graphics[2].putchr8(wtxt[s], dev.layout.status_x, dev.layout.status_y + 8 * s);

				//wtxt = obCtrl.messagelog.read();
	    	    //for (let s in wtxt) work3.putchr8(wtxt[s], dev.layout.map_x, dev.layout.map_y + 150 + 8 * s);

				wtxt = obCtrl.messageview.read();
	    	    if (state.Config.viewlog) for (let s in wtxt) dev.graphics[2].kprint(wtxt[s], dev.layout.map_x, dev.layout.map_y + 150 + 8 * s);
	    	    //if (state.Config.viewlog) for (let s in wtxt) dev.graphics[2].putchr8(wtxt[s], dev.layout.map_x, dev.layout.map_y + 150 + 8 * s);
	    	}else{
				wtxt = obCtrl.messageconsole.read();
				if (state.Config.viewlog) for (let s in wtxt) dev.graphics[2].kprint(wtxt[s], dev.layout.map_x, dev.layout.map_y + 150 + 10 * s);
				//if (state.Config.viewlog) for (let s in wtxt) dev.graphics[2].putchr8(wtxt[s], dev.layout.map_x, dev.layout.map_y + 150 + 8 * s);
			}
			//tutorialDisplay 
			if ( obCtrl.tutorialDisplayTime > state.System.time()){
				wtxt = obCtrl.tutorialconsole.read();
				for (let s in wtxt) dev.graphics[2].kprint(wtxt[s], dev.layout.zanki_x, dev.layout.zanki_y - 80 + 10 * s);
			}
			
		}
		if (!mapdisp){ mapv = true; }

		if (UI_force_reflash) UI_force_reflash = false;
		drawexecute = true;         
	}

	function BGDraw() {
		/*全体画面の背景表示は都度更新も随時更新もあまり負荷変らない為、随時更新で処理する。
		if (!dev.gs.changestate) return;
		
		dev.graphics[0].reset(); //work2
		dev.graphics[0].clear();

		dev.graphics[2].reset(); //ForgroundBF
		dev.graphics[2].clear();
		*/

		for (let i in mapChip) {
			let mc = mapChip[i];

			if (dev.gs.in_stage_range(mc.x, mc.y, mc.w, mc.h)) {
				mc.view = true;//視界に入っている（当たり判定有効扱いの為のフラグ）
				let w = dev.gs.worldtoView(mc.x, mc.y);

				if (mc.visible) {//表示するマップチップ（当たり判定用で表示しないものもあるため）
					if (mc.lookf != drawexecute) mmrefle = true;
					mc.lookf = drawexecute;//true;　//画面内に入ったことがあるフラグ
					let wfg = false; //with forground?
					if (mc.type%2 == 1) wfg = true; //Forground表示のパターン(壁):type偶数はBG/奇数がFG
					let ceilview = true;
					if (obCtrl.ceilflag && mc.type == 13 && obCtrl.ceilindex == i) ceilview = false;//天井を表示しない 
					//if (Boolean(tex_bg[mc.no])) {
					if (Boolean(bgData[mc.no])){
						if (ceilview){
						if (wfg) {
							let shiftx = 0;
							let shifty = -24;

							shiftx = Math.trunc((w.x - w.sx - dev.gs.viewwidth/2) /24);
							shifty = Math.trunc((w.y - w.sy - dev.gs.viewheight/2) /24);

							if (mc.no == 1){
								forgroundBG.fill(
									w.x + shiftx,
									w.y + shifty,
									mc.w, 
									mc.h,
									obCtrl.ceilshadow
								);
							}else{
								forgroundBG.putPattern(
									tex_bg, bgData[mc.no], 
									w.x + shiftx,// - Math.abs(shiftx)/2,
									w.y + shifty,// - Math.abs(shifty)/2,
									mc.w,// + Math.abs(shiftx)/2, 
									mc.h //+ Math.abs(shifty)/2
								);
							}

						} else {
							work2.putPattern(
								tex_bg, bgData[mc.no], 
								w.x, 
								w.y, 
								mc.w, mc.h
							);
						}
						}
						//work2.putchr(Number(mc.no).toString(), w.x, w.y);
					} else {
						let cl = {}
						cl.x = w.x;
						cl.y = w.y;
						cl.w = mc.w;
						cl.h = mc.h;

						cl.draw = function (device) {
							device.beginPath();

							device.strokeStyle = "green";
							device.lineWidth = 1;
							device.rect(this.x, this.y, this.w, this.h);
							device.stroke();
						}

						work2.putFunc(cl);
						//work2.putchr(Number(mc.no).toString(), w.x, w.y);
					}
				}
				
				//壁の当たり判定有無確認用のデバックコード
				if (state.Config.debug){
					if (mc.c) {
						let cl = {}
						cl.x = w.x;
						cl.y = w.y;
						cl.w = mc.w;
						cl.h = mc.h;

						cl.draw = function (device) {
							device.beginPath();

							device.strokeStyle = "green";
							device.lineWidth = 3;
							device.rect(this.x, this.y, this.w, this.h);
							device.stroke();
						}

						work2.putFunc(cl);
						forgroundBG.putFunc(cl);
					}
					//work2.putchr((mc.type).toString(16), w.x, w.y);
				}
			} else {
				mc.view = false;
			}
		}
	}

	function BGShadowDraw() {
	
		for (let i in mapChip) {
			let mc = mapChip[i];
			if (dev.gs.in_stage_range(mc.x, mc.y, mc.w, mc.h)) {
				mc.view = true;//視界に入っている（当たり判定有効扱いの為のフラグ）
				let w = dev.gs.worldtoView(mc.x, mc.y);
	
				if (mc.visible) {//表示するマップチップ（当たり判定用で表示しないものもあるため）
					let alpha = 0.6;
					if ( obCtrl.ceilflag && mc.type == 13 && obCtrl.ceilindex == i) alpha = 0.15;
					if (mc.type%2 == 1) {//Forground表示のパターン(壁)に影をつける
	
						let shiftx = 0;
						let shifty = -24;
	
						shiftx = Math.trunc((w.x - w.sx - dev.gs.viewwidth/2) /24) + 4;
						shifty = Math.trunc((w.y - w.sy - dev.gs.viewheight/2) /24) + 4;

						let cl = {}
						cl.x = w.x - shiftx;
						cl.y = w.y - shifty;
						cl.w = mc.w -1;
						cl.h = mc.h -1;
						cl.fs = "rgba(0,0,0," + alpha + ")";

						cl.draw = function (device) {
						device.beginPath();

						device.fillStyle = this.fs //"blue";
						//device.lineWidth = 1;
						device.fillRect(this.x, this.y, this.w, this.h);
					}
					work2.putFunc(cl);
					//work2.putchr(Number(mc.no).toString(), w.x, w.y);
					}
				}
			}
		}
	}

	let ui = { cnt: 0,state:[], score:[], time: 0};

	let playerHPber = new effect_tlHPbar();

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
			dead_cnt,
			mapdisp,
			lampf,
			obCtrl.item[20],//ball
			obCtrl.item[22],//key
			obCtrl.item[35],//coin
			obCtrl.itemstack.length,
			state.Game.player.weapon,
			state.Game.player.level,
			mapsc.stage,
			//Math.floor((120000 - mapsc.flame) / 1000),
			state.Game.player.hp,
			state.Game.player.maxhp,
			state.Game.player.barrier,
			mmrefle
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
		}else{
			if (!cs) work3.fill(dev.layout.hiscore_x, dev.layout.hiscore_y,156,32);//,"green");
			if (!ct) work3.fill(dev.layout.time_x, dev.layout.time_y,120,16);//,"red");
		}

		if (!cs || !cf){
			//work3.putchr("Hi-Sc:" + ui.score[0], dev.layout.hiscore_x, dev.layout.hiscore_y);
			//work3.putchr("Score:" + ui.score[1], dev.layout.score_x, dev.layout.score_y);

			let NextLup = Math.pow(state.Game.player.spec.ETC+1 ,2)* 100;
			let NextMkr = ( obCtrl.score >= NextLup) ? "#":" ";
			let Nextstr = "       " + NextMkr + "Next." + NextLup;
			work3.putchr("Exp." + ui.score[1], dev.layout.hiscore_x, dev.layout.hiscore_y);
			Nextstr = Nextstr.substring(Nextstr.length-11);
			work3.putchr(Nextstr, dev.layout.score_x, dev.layout.score_y);

			if  (cf) obCtrl.messageview.write("** SCORE Draw ** f:" + ui.cnt);
		}

		if (!ct || !cf){
			work3.putchr("Time:" + ui.time, dev.layout.time_x, dev.layout.time_y);
			if  (cf) obCtrl.messageview.write("** Time Draw ** f:" + ui.cnt);
		}

		if  (cf) return;

		obCtrl.messageview.write("** UI Draw ** f:"+ ui.cnt);
		ui.cnt = 0;

		if (!mapdisp || lampf) {
			work3.putFunc(SubmapframeDraw);//forgroundBG.putFunc(SubmapframeDraw);
			if (!mapdisp){//mapdispはfalseで表示(今となってはなぜかわからん/そのうち修正)
				if (mmrefle){
					SubmapDraw.create();
					obCtrl.messageview.write("** Submap Create **");
					mmrefle = false;
					//work3.putFunc(SubmapDraw);
				}
				work3.putFunc(SubmapDraw);
			}
			//obCtrl.drawPoint(dev.graphics[3], lampf);
			//obCtrl.drawPoint(work3, lampf);//dev.graphics[3]
		}
		
		if (state.Game.mode !=1 ){
			UI_PlayerType();
		}else{
			UI_PlayerType2();
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
	function read_debugStates(){
		let wtxt = [];

		wtxt.push("o:" + obCtrl.cnt() + "/" + obCtrl.num() + "/" + obCtrl.nonmove + "/" + obCtrl.collisioncount);
		wtxt.push("f:" + mapsc.flame + "/ " + dev.gs.changestate);

		if (obCtrl.interrapt) {
			wtxt.push("interrapt:" + obCtrl.SIGNAL);
		} else {
			wtxt.push("running:" + obCtrl.SIGNAL);
		}

		for (i in obCtrl.item) 
		{
			if (Boolean(obCtrl.item[i])) wtxt.push("item[" + i + "]:" + obCtrl.item[i]);
		}

		let n1 = 0;
		for (i in obCtrl.total) {
			if (i == 2) n1 = obCtrl.total[i];
		}

		let n2 = 1;
		for (i in obCtrl.obCount) {
			if (i == 2) n2 = obCtrl.obCount[i];
		}

		let spec = state.Game.player.spec;

		wtxt.push("wx,wy:" + Math.floor(dev.gs.world_x) + "," + Math.floor(dev.gs.world_y));
		wtxt.push("play:" + Math.floor(dev.sound.info()) + "." + dev.sound.running() );
		//wtxt.push("lv:" + spec.LV + " v"+ spec.VIT + ":m" + spec.MND + ":i" + spec.INT );
		wtxt.push("Living:" + obCtrl.rollcall("mayura"));

		return wtxt;
	}
	//==========
	function UI_PlayerType(){

		work3.putFunc(ButtomlineBackgroundDraw);

		//残機表示
		let zc = 2 - dead_cnt;
		if (zc < 3) {
			for (let i = 0; i < 2 - dead_cnt; i++) {
				work3.put("Mayura1", dev.layout.zanki_x + i * 32, dev.layout.zanki_y);
			}
		} else {
			work3.put("Mayura1", dev.layout.zanki_x, dev.layout.zanki_y);
			work3.putchr8("x" + zc, dev.layout.zanki_x + 16, dev.layout.zanki_y);
		}

		//Lamp/map
		if(!mapdisp){ work3.put("Map",dev.layout.map_x + 36, dev.layout.map_y + 12) }//dev.layout.zanki_x + 360, dev.layout.zanki_y-16);}
		if(lampf) { work3.put("Lamp",dev.layout.map_x + 12, dev.layout.map_y + 12) }//dev.layout.zanki_x + 336, dev.layout.zanki_y-16);}

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
		work3.putchr("Stage " + mapsc.stage, dev.layout.stage_x, dev.layout.stage_y);
		
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
	//==========
	function UI_PlayerType2(){

		//work3.putFunc(ButtomlineBackgroundDraw);

		//残機表示
		let zc = 2 - dead_cnt;

		if (zc < 3) {
			for (let i = 0; i < 2 - dead_cnt; i++) {
				work3.put("miniMay", dev.layout.zanki_x + i * 32, dev.layout.zanki_y);
			}
		} else {
			work3.put("miniMay", dev.layout.zanki_x, dev.layout.zanki_y);
			work3.kprint("x" + zc, dev.layout.zanki_x + 16, dev.layout.zanki_y);
		}

		//Lamp/map
		if(!mapdisp) work3.put("Map",dev.layout.map_x + 36, dev.layout.map_y + 12);
		if(lampf) work3.put("Lamp",dev.layout.map_x + 12, dev.layout.map_y + 12);

		//ball表示
		if (Boolean(obCtrl.item[20])) {
			let n = obCtrl.item[20];

			work3.kprint("①:" + n,
			dev.layout.zanki_x + 256, dev.layout.zanki_y - 12);
		}

		//取得アイテム表示
		if (Boolean(obCtrl.itemstack)) {
			//①BALL ②B　③S　④L
			let wchr = { 20: "①", 23: "②", 24: "③", 25: "④" }
			let witem = [];

			for (let i in obCtrl.itemstack) {
				let w = obCtrl.itemstack[i];
				witem.push(w);
			}
			//n = witem.length;
			w = "";
			for  (let i = 0; i < witem.length; i++)
				w += wchr[witem[i]];
			work3.kprint(w + "<-", dev.layout.zanki_x + 136, dev.layout.zanki_y);
		}

		n = 0;
		if (Boolean(obCtrl.item[22])) {
			n = obCtrl.item[22];
		}
		if (n > 0) work3.put("sKey", dev.layout.zanki_x + 64, dev.layout.zanki_y);

		let wweapon = ["Wand", "Knife", "Axe", "Boom", "Spear", "Bow"];

		if (!Boolean(state.Game.player.weapon)) state.Game.player.weapon = 0;
		if (!Boolean(state.Game.player.level)) state.Game.player.level = 0;

		work3.kprint("武器", dev.layout.zanki_x + 96 - 16, dev.layout.zanki_y - 16);
		work3.put(wweapon[state.Game.player.weapon], dev.layout.zanki_x + 96, dev.layout.zanki_y);
		if (state.Game.player.level > 0){
			let wt = "+" + state.Game.player.level + 
			((state.Game.player.level > 2 )?" Max":"");
			work3.kprint(wt, dev.layout.zanki_x + 96 - 16, dev.layout.zanki_y + 8);
		}
		work3.kprint("Stage " + mapsc.stage, dev.layout.stage_x, dev.layout.stage_y +40);

		let w_hp = (state.Game.player.hp > 0) ? state.Game.player.hp : 0;

		HpbarDraw.hp = w_hp; 
		HpbarDraw.mhp = state.Game.player.maxhp;
		HpbarDraw.br = state.Game.player.barrier;
		work3.putFunc(HpbarDraw);

		let wst = "HP:" + w_hp + "/" + state.Game.player.maxhp;

		if (state.Game.player.barrier) {
			wst = "HP:" + w_hp +"/SHIELD";       
		}
		work3.kprint(wst, dev.layout.hp_x + 8, dev.layout.hp_y + 4);
	}	
}
