//gameScene
//ゲーム本体部分のループや画面推移を管理(main)
//2025/06/24

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
	let obUtil = state.obUtil;
	let mapsc  = state.mapsc; //= new mapSceControl();

	let dead_cnt = 0;

	let tex_bg = [];
	let mapChip = [];
	let bgData = [];

	let sndcf = false;

	let mapdisp = false;
	let lampf = false;

	let drawexecute = false;

	let mmrefle = true; //mini map reflash

	mapdisp = true; //以前の処理では自動で消されない画面に書いていたので常時表示処理させる為に常にtrue；

	const debugDisp = new gameSceneUI_debug(state);
	const UIDisp = new gameSceneUI_stateinv(state);

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

		//scenechange = false;
	}

	function game_reset(contflg) {
	    //ゲーム画面の描画を開始(Flip/Drawを自動で実行　各フレームで)
		dev.graphics[0].setInterval(1);//BG
		dev.graphics[1].setInterval(1);//SPRITE
		dev.graphics[2].setInterval(1);//FG
		dev.graphics[3].setInterval(0);//UI

		work2.clear();
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

				//LoadGameの場合は前回LvUp時のExp.まで補填(ExpはSaveしてない)
				obCtrl.score = Math.pow(state.Game.player.spec.ETC , 2)* 100 ;
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

	    tex_bg = dev.game.asset.image[mapsc.bgImage()].img;

		mapChip = mapsc.mapChip();
	    bgData = mapsc.bgPtn();

	    sndcf = true;

		lampf = state.Config.lamp_use ? true : false;
	    mapdisp = state.Config.map_use ? false : true; 

		debugDisp.reset();
		UIDisp.reset();

		//^^^^^
		obUtil.messageconsole.write("==STAGE START==");

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
			UIDisp.force_reflash();
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
			const SIGNAL_LIST = [
				1	,//PauseScene
				835	,//resultScene
				1709,//LvUpScene
				4649,//Restart/Gover(zanki状態による)
				6055//未使用）Boss
			];
			//他数字は空き
			// GameScene切り替え依頼をobjから行う場合にSIGNALで
			// interraptがtrueとなる。次のフレームで自動でfalse。
			//シーン切り替えのあるシグナルの場合はinterrapt有効
			//無いシグナルはanyでUI_force_reflashのみの実行指示
			if (!SIGNAL_LIST.includes(obCtrl.SIGNAL)){
				obCtrl.interrapt = false;
				//UI_force_reflash = true;
				UIDisp.force_reflash();
			}
		}

		if (obCtrl.interrapt) {	
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

				//StageClearBonus
	            obCtrl.score += mapsc.stage*100;//Math.floor((120000 - mapsc.flame) / 100);

	                state.Result.score = obCtrl.score;
	                state.Game.item = obCtrl.item;
	                state.Game.itemstack = obCtrl.itemstack;
	                state.Game.player.zanki = 2 - dead_cnt;
	                state.Result.obCount = obCtrl.obCount;
	                state.Result.total = obCtrl.total;

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
	                //state.Game.player.maxhp = 10;//ゲームオーバーまで体力上昇分を保留する。2012/04/04
	                state.Game.player.hp = state.Game.player.maxhp;
					state.Game.player.zanki = 2 - dead_cnt;

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
                    state.Result.obCount = obCtrl.obCount;
                    state.Result.total = obCtrl.total;

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
	        mapsc.enable = true;
	        mapsc.counter_runnning = true;

	    	//item
			//let wchk = false;
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
		debugDisp.colDraw(mapChip);
		
        //==この↑は背景描画
		obCtrl.drawShadow(work2);//objectのshadowを背景面に反映(work2:BG)
	    obCtrl.draw(work);//work:SP
	    obCtrl.draw(forgroundBG, true); //prioritySurface = true の物を別Screenに描画する処理(通常のDrawではパスされる。）

		//if (state.Game.lamp) obCtrl.drawPoint(dev.graphics[4], state.Game.lamp);//rader UIDisp内MinimapDispで処理
	    
		mmrefle = UIDisp.check(mmrefle);
		UIDisp.draw();
		debugDisp.draw();

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
}
