//gameSceneUI_stateinv
//実ゲームシーン本体部分のうち、ステータスやタイム、装備・持ち物など表示部分
//(minimap、debugを除く表示部分）
//GameSceneの行が増えすぎたので分割して修正しやすくするのが目的
//2025/06/24分割処理
/**
 * @class
 * @classdesc
 * 実ゲームシーン本体部分のうち、ステータスやタイム、装備・持ち物など表示部分を管理するクラスです。<br>\
 * HPバー、経験値バー、アイテム表示、チュートリアルメッセージなどを画面に描画します。
 */
class gameSceneUI_stateinv {
	/**
	 * 
	 * @param {stateControl} state GameCore.state
	 * @description
	 * `gameSceneUI_stateinv`を初期化します。<br>\
	 * UI、BUI、EFFECTの各描画レイヤーを設定し、<br>\
	 * 各種UI要素（HPバー、経験値バーなど）の描画オブジェクトを準備します。
	 */
	constructor(state) {
		//dev deviceControlClass 
		//宣言部
		const dev = state.System.dev;

		const BUI_layer = dev.graphics[state.Constant.layer.BUI];
		const UI_layer = dev.graphics[state.Constant.layer.UI];
		const EFFECT_layer = dev.graphics[state.Constant.layer.EFFECT];

		this.reset = game_reset;
		this.draw = game_draw;

		const obCtrl = state.obCtrl; //= new gObjectControl(dev.graphics1, state);//
		const mapsc = state.mapsc; //= new mapSceControl();

		let escore;

		let fdrawcnt = 0;

		let UI_force_reflash = true; //false;
		/**
		 * @method
		 * @description
		 * UIの強制再描画フラグを`true`に設定します。<br>\
		 * これにより、次のフレームでUIが確実に更新されます。
		 */
		this.force_reflash = () => { UI_force_reflash = true; };

		//一番下の行消す(clip

		/**
		 * @description
		 * 画面下部のUI表示領域の背景を描画するカスタム描画オブジェクトです。<br>\
		 * 半透明の黒い矩形を描画して、UIを視覚的に区切ります。
		 */
		const ButtomlineBackgroundDraw = {};
		ButtomlineBackgroundDraw.draw = function (device) {
			device.beginPath();
			device.fillStyle = "rgba(0,0,0,0.5)";
			device.fillRect(dev.layout.clip.x, dev.layout.clip.y, 640, 36);
			//device.globalAlpha = 1.0;
		};
		//hpbar
		/**
		 * @description
		 * HPバーを描画するカスタム描画オブジェクトです。<br>\
		 * 現在のHPと最大HPに基づいて、色と長さを調整したバーを表示します。<br>\
		 * HP減少時のエフェクトやシールドゲージも表現します。
		 */
		const HpbarDraw = { hp: 0, mhp: 0, br: true, shw: 0, bbw: 0, exp: 0, };
		//br:SHIELD展開中 shw: SHIELD width(シールドゲージの幅0-100 
		//bbw:beforehp bar width exp:notUse.
		HpbarDraw.draw = function (device) {
			let cbar = (this.hp / this.mhp > 0.5) ? "limegreen" : "yellowgreen"; //(this.hp/this.mhp>0.3)?"yellowgreen":"red"; 
			let cborder = (this.hp / this.mhp > 0.5) ? "white" : (this.hp / this.mhp > 0.3) ? "yellow" : "orange";

			device.beginPath();
			device.fillStyle = "black"; //clear 
			device.fillRect(dev.layout.hp.x, dev.layout.hp.y, 102, 15);

			device.fillStyle = "red"; //effect 
			device.fillRect(dev.layout.hp.x + 1, dev.layout.hp.y + 1, this.bbw, 14 - 1);
			device.fillStyle = cbar; //hpbar 
			device.fillRect(dev.layout.hp.x + 1, dev.layout.hp.y + 1, (this.hp / this.mhp) * 100, 14 - 1);
			if (this.br) { //shieldbar
				device.fillStyle = "cyan";
				device.fillRect(dev.layout.hp.x + 1, dev.layout.hp.y + 3, this.shw, 14 - 3);

				let c = (this.shw % 10) * 5 + 205;
				device.fillStyle = "rgb(0," + c + "," + c + ")";
				//(this.shw > 50)?"rgb(0," + c + "," + c + ")": 
				//(this.shw < 25)?"rgb(" + c + ",128, 128)":"rgb(" + c + "," + c + ",160)"; //"skyblue"; 
				device.fillRect(dev.layout.hp.x + 1, dev.layout.hp.y + 4, this.shw - 1, 14 - 4);
			}
			//border
			device.strokeStyle = cborder;
			device.lineWidth = 2;
			device.rect(dev.layout.hp.x, dev.layout.hp.y, 102, 15);
			device.stroke();
		};
		//Expbar
		/**
		 * @description
		 * 経験値バーを描画するカスタム描画オブジェクトです。<br>\
		 * 現在の経験値と次のレベルアップに必要な経験値に基づいて、<br>\
		 * 色と長さを調整したバーを表示します。
		 */
		const expbarDraw = {
			now: 0,
			next: 0,
			draw: function (device) {
				device.beginPath();
				device.fillStyle = "darkgray"; //clear 
				device.fillRect(dev.layout.nextexp.x, dev.layout.nextexp.y + 5, 100, 3);


				device.fillStyle = ((this.now / this.next) >= 1) ? "yellowgreen" : "orange"; //expbar 
				device.fillRect(dev.layout.nextexp.x + 1, dev.layout.nextexp.y + 3, (this.now / this.next) * 100, 4);

				//border
				//device.strokeStyle = "darkgray"; 
				//device.lineWidth = 1;
				//device.rect(dev.layout.score_x, dev.layout.score_y, 100, 8);
				//device.stroke();
			}
		};

		//LvUpStatusMatar
		const stbar = new statusBarMeter(["cyan", "orange", "limegreen", "white"]);

		/**
		 * @param {string[]} setupParam　バーの色名配列 
		 * @description
		 * ステータスバー（HP, MPなど）のメーターを描画するクラスです。<br>\
		 * 指定されたステータス値に基づいて、色付きのバーを表示します。
		 */
		function statusBarMeter(setupParam) {
			//setupParamater [barcolor, ...,}]
			let status;
			/**
			 * @method
			 * @param {*} ary 
			 * @description
			 * メーターとして表示するステータス値の配列を設定します。
			 */
			this.setStatusArray = function (ary) {
				status = ary;
			};
			/**
			 * @method
			 * @param {*} device 
			 * @param {*} x 
			 * @param {*} y 
			 * @description
			 * 設定されたステータス値に基づいて、複数のバーメーターを画面に描画します。
			 */
			this.draw = function (device, x, y) {

				let o = { s: status, b: setupParam, x: x, y: y };
				o.draw = function (device) {
					device.beginPath();

					for (let i in this.s) {
						device.fillStyle = this.b[i];
						for (let j = 0; j < this.s[i]; j++) {
							if (j < 7) {
								device.fillRect(this.x + j * 4, this.y + i * 5, 3, 4);
							}
						}
					}

				};
				device.putFunc(o);
			};
		}

		//チュートリアルメッセージ枠
		/**
		 * @description
		 * チュートリアルメッセージウィンドウの背景を描画するカスタム描画オブジェクトです。<br>\
		 * 半透明の黒い矩形と白い枠線を描画して、メッセージ領域を視覚的に強調します。
		 */
		const tutWindowBackgroundDraw = {};
		tutWindowBackgroundDraw.draw = function (device) {
			device.beginPath();
			device.globalAlpha = 1.0;
			device.lineWidth = 1;
			device.strokeStyle = "rgba(255,255,255,1.0)";
			device.strokeRect(dev.layout.tutmsg.x - 1, dev.layout.tutmsg.y - 1, 386, 50);
			device.fillStyle = "rgba(0,0,0,0.5)";
			device.fillRect(dev.layout.tutmsg.x, dev.layout.tutmsg.y, 384, 48);
			device.restore();
		};

		const minimapDisp = new gameSceneUI_minimap(state);

		/**
		 * @method
		 * @param {booolean} refle 現在の更新フラグ
		 * @returns {boolean} 確認後の更新フラグ
		 * @description
		 * ミニマップの更新が必要かをチェックし、必要ならUIの強制再描画フラグを立てます。
		 */
		this.check = function (refle) {
			let f = minimapDisp.check(refle);
			if (f != refle) {
				UI_force_reflash = true;
			}
			return f;
		};
		//let getweapon = new get_weapon_check( state );
		let nextlvrdy = false;

		//==========================================================================================
		//処理部
		/**
		 * @description
		 * UI表示をリセットします。<br>\
		 * スコアエフェクトを初期化し、UIレイヤーをクリアし、<br>\
		 * ミニマップの表示もリセットして強制再描画を行います。
		 */
		function game_reset() {
			escore = new gs_score_effect(obCtrl.score);
			//ehighscore = new gs_score_effect(state.Result.highscore);

			dev.graphics[3].reset();
			dev.graphics[3].clear(); //UI

			minimapDisp.reset();

			UI_force_reflash = true;
			UIDraw(UI_force_reflash);
		}

		let opening = false;
		let openstime = 0;
		let closing = false;

		let mapviewflag = false;
		let delaystartf = false;
		let delaytime = 0;

		/**
		 * @description
		 * UI要素の描画を制御します。<br>\
		 * チュートリアルメッセージ、HPバー、経験値バー、アイテム所持状況などを、<br>\
		 * 必要に応じてアニメーションや更新制御を伴って描画します。
		 */
		function game_draw() {

			if (state.Game.map || state.Game.lamp) {
				if (!delaystartf) {
					delaystartf = true;
					delaytime = state.System.time() + (1000 / 2); //30f
					state.scene.setTCW(
						BUI_layer,
						{ x: dev.layout.map.x, y: dev.layout.map.y, w: 150, h: 150 },
						30, "open"
					);
				}
				if (delaystartf && (state.System.time() >= delaytime)) {
					if (!mapviewflag) UI_force_reflash = true;
					mapviewflag = true;
				}
			} else {
				mapviewflag = false;
				delaystartf = false;
			}

			if (mapviewflag) minimapDisp.rader(EFFECT_layer, state.Game.lamp); //rader

			//minimapDisp.rader;
			//==　ここから文字表示画面（出来るだけ書き換えを少なくする）
			//プライオリティ最前面の画面追加したので
			let scdispview = false;

			fdrawcnt++;
			if ((fdrawcnt % 6) == 0) {
				fdrawcnt = 0;
				scdispview = true;
			}
			scdispview = true; //debug

			if (scdispview) {
				playerHPber.draw();
				UIDraw(UI_force_reflash);

				if (nextlvrdy) {
					if (state.System.blink()) {
						EFFECT_layer.fill(dev.layout.nextexp.x + 1, dev.layout.nextexp.y, 12 * 8, 7, "yellowgreen");
						EFFECT_layer.kprint(" HomePortal->", dev.layout.nextexp.x, dev.layout.nextexp.y);
					}
					let w = Math.trunc(state.System.time() / 100) % 5;
					EFFECT_layer.put("cursorx", dev.layout.status.x + 8, dev.layout.status.y + 9 - w);
				}

				let wtxt;
				//tutorialDisplay 
				if (state.obUtil.tutorialDisplayTime > state.System.time()) {

					if (!opening) {
						opening = true;
						openstime = state.System.time() + 1000 / 3; //20f
						state.scene.setTCW(
							BUI_layer,
							{ x: dev.layout.tutmsg.x - 1, y: dev.layout.tutmsg.y - 1, w: 386, h: 50 },
							20, "open"
						);
					}

					if (opening && (state.System.time() > openstime)) {
						BUI_layer.putFunc(tutWindowBackgroundDraw);
						wtxt = state.obUtil.tutorialconsole.read();
						for (let s in wtxt) BUI_layer.kprint(wtxt[s], dev.layout.tutmsg.x, dev.layout.tutmsg.y + 10 * s);
						closing = true;
					}
				} else {
					if (closing) {
						state.scene.setTCW(
							BUI_layer,
							{ x: dev.layout.tutmsg.x - 1, y: dev.layout.tutmsg.y - 1, w: 386, h: 50 },
							20
						);
						opening = false;
						closing = false;
					}
				}
			}

			if (UI_force_reflash) UI_force_reflash = false;
			//drawexecute = true;
		}
		//---------------------
		const ui_data = { cnt: 0, state: [], score: [], time: 0 };

		/**
		 * @description
		 * HPバーの視覚的な更新エフェクトを管理する関数です。<br>\
		 * HPの減少を滑らかに表示するための補助バーを制御します。
		 */
		let playerHPber = new effect_tlHPbar();
		//---------------------
		function effect_tlHPbar() {
			let before_barwidth = 0;
			let device = EFFECT_layer;

			this.draw = function () {
				let w_hp = (state.Game.player.hp > 0) ? state.Game.player.hp : 0;
				let now_bw = Math.trunc((w_hp / state.Game.player.maxhp) * 100);

				HpbarDraw.hp = w_hp;
				HpbarDraw.mhp = state.Game.player.maxhp;
				HpbarDraw.br = state.Game.player.barrier;
				HpbarDraw.shw = state.Game.player.shieldtime;
				HpbarDraw.bbw = before_barwidth;

				device.putFunc(HpbarDraw);

				let wst = "HP:" + w_hp + "/" + state.Game.player.maxhp; // + "." + before_barwidth;

				if (state.Game.player.barrier) {
					//wst = "HP:" + w_hp +"/SHIELD";       
				}
				device.putchr8(wst, dev.layout.hp.x + 8, dev.layout.hp.y + 4);

				if (before_barwidth > now_bw) before_barwidth = before_barwidth - 1;
				if (before_barwidth <= now_bw) before_barwidth = now_bw;

			};
		}

		//UI表示は都度更新と随時更新では負荷減効果あり、必要時都度更新で処理する。
		//(ミニマップのレーダー(点)は常時なのでここでは処理しない)
		/**
		 * 
		 * @param {boolean} force_reflash 強制再描画フラグ
		 * @returns {void}
		 * @description
		 * UI全体を描画する主要な関数です。<br>\
		 * スコア、プレイヤー状態、時間などの各種UI要素のデータをチェックし、<br>\
		 * 変更があった場合や強制再描画フラグが立っている場合に描画を更新します。
		 */
		function UIDraw(force_reflash) {

			let insco = [
				escore.read(obCtrl.score) //obCtrl.score,
			];

			let inste = [
				//ehighscore.read(state.Result.highscore),//state.Result.highscore,
				//escore.read(obCtrl.score),//obCtrl.score,
				state.Game.player.zanki,
				state.Game.map,
				state.Game.lamp,
				obCtrl.item[20], //ball
				obCtrl.item[22], //key
				obCtrl.item[35], //coin
				obCtrl.item.length, //アイテム数が変わった場合、何か拾った(keyitem)
				obCtrl.itemstack.length,
				state.Game.player.weapon,
				state.Game.player.level,
				mapsc.stagename(),
				//Math.floor((120000 - mapsc.flame) / 1000),
				state.Game.player.hp,
				state.Game.player.maxhp,
				state.Game.player.barrier
			];

			let intim = Math.floor((120000 - mapsc.flame) / 1000);

			let cf = true; //Status :equal = true/change = false <- Draw exec 
			for (let i in ui_data.state) if (ui_data.state[i] !== inste[i]) cf = false;

			let cs = true; //Score
			for (let i in ui_data.score) if (ui_data.score[i] !== insco[i]) cs = false;

			let ct = true; //Time 
			if (ui_data.time !== intim) ct = false;

			ui_data.state = inste;
			ui_data.score = insco;
			ui_data.time = intim;
			ui_data.cnt++;

			if (force_reflash) { cf = false; cs = false; ct = false; }

			//UI_layer.fill(dev.layout.hiscore_x + 12 * 6, dev.layout.hiscore_y, 12 * 7, 32); // , "darkblue");
			//obCtrl.messageview.write(JSON.stringify(ui_datastate) + "/" + cf);
			if (cf && cs && ct) return;

			//obCtrl.messageview.write("** SCORE Draw **" + ui_data.cnt);
			if (!cf) {
				UI_layer.reset();
				UI_layer.clear();

				UI_layer.putFunc(ButtomlineBackgroundDraw);
			} else {
				if (!cs) {
					UI_layer.fill(dev.layout.exp.x, dev.layout.exp.y, 8 * 12, 16); //半透明を表示するために一旦クリア
					UI_layer.fill(dev.layout.exp.x, dev.layout.exp.y, 8 * 12, 16, "rgba(0,0,0,0.5)");
				}

				if (!ct) {
					UI_layer.fill(dev.layout.time.x, dev.layout.time.y, 8 * 9, 8); //半透明を表示するために一旦クリア
					UI_layer.fill(dev.layout.time.x, dev.layout.time.y, 8 * 9, 8, "rgba(0,0,0,0.5)");
				}
			}

			if (!cs || !cf) {
				let nowLvexp = Math.pow(state.Game.player.spec.ETC, 2) * 100;
				let NextLup = Math.pow(state.Game.player.spec.ETC + 1, 2) * 100;
				let Nextstr = (obCtrl.score >= NextLup) ? " NextLvReady" : "       Next." + NextLup;

				nextlvrdy = (obCtrl.score >= NextLup) ? true : false;

				expbarDraw.now = obCtrl.score - nowLvexp;
				expbarDraw.next = NextLup - nowLvexp;
				//if (expbarDraw.now <= NextLup) 
				UI_layer.putFunc(expbarDraw);

				UI_layer.putchr8("Exp." + ui_data.score[0], dev.layout.exp.x, dev.layout.exp.y);
				Nextstr = Nextstr.substring(Nextstr.length - 13);
				UI_layer.kprint(Nextstr, dev.layout.nextexp.x, dev.layout.nextexp.y);
				//UI_layer.putchr8(Nextstr, dev.layout.score_x, dev.layout.score_y);
				if (cf) state.obUtil.messageview.write("** EXP Draw ** f:" + ui_data.cnt);
			}

			if (!ct || !cf) {
				UI_layer.putchr8("Time:" + ui_data.time, dev.layout.time.x, dev.layout.time.y);
				if (cf) state.obUtil.messageview.write("** Time Draw ** f:" + ui_data.cnt);
			}

			if (cf) return;

			state.obUtil.messageview.write("** UI Draw ** f:" + ui_data.cnt);
			ui_data.cnt = 0;

			minimapDisp.draw(); //submap display

			if (state.Game.mode != 1) {
				UI_PlayerType();
			}
		}

		//==========
		/**
		 * スコア表示の数値が滑らかに変化するエフェクトを管理するクラスです。<br>\
		 * 現在のスコアが目標値に達するまで、徐々に数値を増加させて表示します。
		 * @param {number} sc スコア
		 */
		function gs_score_effect(sc) {

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
			};
		}

		//==========
		function UI_PlayerType() {
			//UI_layer.putFunc(ButtomlineBackgroundDraw);

			//残機表示
			let zc = state.Game.player.zanki; //2 - dead_cnt;
			if (zc < 3) {
				for (let i = 0; i < zc; i++) {
					UI_layer.put("Mayura1", dev.layout.zanki.x + i * 32, dev.layout.zanki.y);
				}
			} else {
				UI_layer.put("Mayura1", dev.layout.zanki.x, dev.layout.zanki.y);
				UI_layer.putchr8("x" + zc, dev.layout.zanki.x + 16, dev.layout.zanki.y);
			}

			//ball表示
			if (Boolean(obCtrl.item[20])) {
				let n = obCtrl.item[20];
				if (n <= 3) {
					for (let i = 0; i < n; i++) {
						UI_layer.put("Ball1",
							dev.layout.ball.x + i * 20, dev.layout.ball.y);
					}
				} else {
					UI_layer.put("Ball1",
						dev.layout.ball.x, dev.layout.ball.y);

					UI_layer.putchr8("x" + n, dev.layout.ball.x + 6, dev.layout.ball.y);
				}
			}
			//Coin表示
			if (Boolean(obCtrl.item[35])) {
				let n = obCtrl.item[35];
				if (n <= 6) {
					for (let i = 0; i < n; i++) {
						UI_layer.put("Coin1",
							dev.layout.coin.x + i * 8, dev.layout.coin.y);
					}
				} else {
					UI_layer.put("Coin1",
						dev.layout.coin.x, dev.layout.coin.y);
					UI_layer.putchr8("x" + n, dev.layout.coin.x + 6, dev.layout.coin.y);
				}
			}
			//取得アイテム表示
			if (Boolean(obCtrl.itemstack)) {

				let wchr = { 20: "Ball1", 23: "BallB1", 24: "BallS1", 25: "BallL1" };
				let witem = [];

				for (let i in obCtrl.itemstack) {
					let w = obCtrl.itemstack[i];
					witem.push(w);
				}

				UI_layer.putchr8("[X]", dev.layout.items.x - 16, dev.layout.items.y - 18);
				let n = witem.length;

				//if (n >= 8) {n = 6; UI_layer.putchr8("...", dev.layout.items.x + n * 20 -8, dev.layout.items.y+8);}
				if (n >= 6) n = 6;

				for (let i = 0; i < n; i++) {
					if (i == 0) {
						UI_layer.put(wchr[witem[witem.length - 1 - i]],
							dev.layout.items.x + i * 20, dev.layout.items.y);

						let num = witem[witem.length - 1 - i] - 23;

						UI_layer.fill(dev.layout.items.x + num * 32 + 24, dev.layout.items.y + 4, 32, 12, "blue");
						//640 - (12 * 12), 479 - 32 + 5);
					} // else {
					let num = witem[witem.length - 1 - i] - 23;

					let color = "rgb(0," + (255 - (i * 30)) + "," + (255 - (i * 30)) + ")";
					//console.log(color);
					UI_layer.fill(dev.layout.items.x + num * 32 + 48, dev.layout.items.y + (i * 3), 6, 2, color);
					//UI_layer.put(wchr[witem[witem.length - 1 - i]],
					//dev.layout.items.x + i * 20, dev.layout.items.y+8);
					//}
				}

				for (let i = 0; i <= 2; i++) {
					let w = obCtrl.item[23 + i];
					if (Boolean(w)) {
						UI_layer.put(wchr[23 + i],
							dev.layout.items.x + i * 32 + 32, dev.layout.items.y + 8);

						if (w > 1) {
							UI_layer.putchr8("x" + w,
								dev.layout.items.x + i * 32 + 32, dev.layout.items.y + 8);
						}
					}
				}
			}
			//keyitems
			state.obUtil.keyitem_view_draw(UI_layer);

			let n = 0;
			if (Boolean(obCtrl.item[22])) {
				n = obCtrl.item[22];
			}
			if (n > 0) UI_layer.put("Key", dev.layout.key.x, dev.layout.key.y);

			let wweapon = ["Wand", "Knife", "Axe", "Boom", "Spear", "Bow"];

			if (!Boolean(state.Game.player.weapon)) state.Game.player.weapon = 0;
			if (!Boolean(state.Game.player.level)) state.Game.player.level = 0;

			UI_layer.putchr8("[Z]", dev.layout.weapon.x - 16, dev.layout.weapon.y - 18);
			UI_layer.put(wweapon[state.Game.player.weapon], dev.layout.weapon.x, dev.layout.weapon.y);
			if (state.Game.player.level > 0) {
				let wt = "+" + state.Game.player.level +
					((state.Game.player.level > 2) ? " Max" : "");
				UI_layer.putchr8(wt, dev.layout.weapon.x - 16, dev.layout.weapon.y + 8);
			}
			//UI_layer.putchr8("Stage " + mapsc.stage, dev.layout.stage.x, dev.layout.stage.y);
			UI_layer.putchr8(mapsc.stagename(), dev.layout.stage.x, dev.layout.stage.y);

			let w_hp = (state.Game.player.hp > 0) ? state.Game.player.hp : 0;

			HpbarDraw.hp = w_hp;
			HpbarDraw.mhp = state.Game.player.maxhp;
			HpbarDraw.br = state.Game.player.barrier;
			HpbarDraw.shw = state.Game.player.shieldtime;
			HpbarDraw.bbw = Math.trunc(w_hp / state.Game.player.maxhp);

			//let BaseLup = Math.pow(state.Game.player.spec.ETC   ,2)* 100;
			//let NextLup = Math.pow(state.Game.player.spec.ETC+1 ,2)* 100;
			//HpbarDraw.exp = Math.abs(Math.trunc((obCtrl.score-BaseLup)/(NextLup-BaseLup)*100));
			UI_layer.putFunc(HpbarDraw);

			let wst = "HP:" + w_hp + "/" + state.Game.player.maxhp;

			if (state.Game.player.barrier) {
				//wst = "HP:" + w_hp +"/SHIELD";       
			}
			UI_layer.putchr8(wst, dev.layout.hp.x + 8, dev.layout.hp.y + 4);

			stbar.setStatusArray([
				state.Game.player.base.VIT,
				state.Game.player.base.INT,
				state.Game.player.base.MND //,
				//state.Game.player.spec.ETC
				//Math.abs(Math.trunc((obCtrl.score-BaseLup)/(NextLup-BaseLup)*7))
			]);
			stbar.draw(UI_layer, dev.layout.status.x, dev.layout.status.y);
		}
	}
}
