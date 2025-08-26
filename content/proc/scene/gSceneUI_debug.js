//gameSceneUI_debug
//実ゲームシーン本体部分のうち、debug表示部分のみ
//
//GameSceneの行が増えすぎたので分割して修正しやすくするのが目的
//2025/06/24分割処理
/**
 * @class
 * @classdesc
 * 実ゲームシーン本体部分のうち、debug表示部分
 */
class gameSceneUI_debug {
	/**
	 * @constructor
	 * @param {stateControl} state 
	 */
	constructor(state) {
		//dev deviceControlClass 
		//宣言部
		const dev = state.System.dev;

		const BG = dev.graphics[state.Constant.layer.BG];
		const UI = dev.graphics[state.Constant.layer.UI];
		const FG = dev.graphics[state.Constant.layer.FG];
		const MSG = dev.graphics[state.Constant.layer.MSG];

		this.colDraw = BGDraw;

		const obCtrl = state.obCtrl; //= new gObjectControl(dev.graphics1, state);
		const mapsc = state.mapsc; //= new mapSceControl();

		let fdrawcnt = 0;

		//==========================================================================================
		//処理部
		/**
		 * @method
		 * @description
		 * empty
		 */
		this.reset = () => { };
		/**
		 * @method
		 * @returns {void}
		 * @description
		 * draw
		 */
		this.draw = () => {

			let scdispview = false;

			fdrawcnt++;
			if ((fdrawcnt % 6) == 0) {
				fdrawcnt = 0;
				scdispview = true;
			}
			scdispview = true; //debug

			//==　ここから文字表示画面（出来るだけ書き換えを少なくする）
			//プライオリティ最前面の画面追加したので
			if (!scdispview) return;

			//debug　true　の場合以下表示
			const BGCOL = "rgba(96,96,96,0.3";
			const BGRW = 120;

			let wtxt;
			if (state.Config.debug) {

				wtxt = read_debugStates();
				if (state.Config.viewlog) wtxt = wtxt.concat(state.obUtil.messagelog.read());

				MSG.fill(dev.layout.debugstatus.x, dev.layout.debugstatus.y, 120, wtxt.length * 8, BGCOL);
				//for (let s in wtxt) MSG.putchr8(wtxt[s], dev.layout.debugstatus.x, dev.layout.debugstatus.y + 8 * s);
				for (let s in wtxt) MSG.kprint(wtxt[s], dev.layout.debugstatus.x, dev.layout.debugstatus.y + 8 * s);

				if (state.Config.viewlog) {
					wtxt = state.obUtil.messageview.read();
					MSG.fill(dev.layout.debugmessage.x, dev.layout.debugmessage.y, 120, wtxt.length * 8, BGCOL);
					for (let s in wtxt) MSG.kprint(wtxt[s], dev.layout.debugmessage.x, dev.layout.debugmessage.y + 8 * s);
				}
			} else {
				if (state.Config.viewlog) {
					wtxt = state.obUtil.messageconsole.read();

					FG.fill(dev.layout.debugmessage.x, dev.layout.debugmessage.y, 120, wtxt.length * 10, BGCOL);
					for (let s in wtxt) FG.kprint(wtxt[s], dev.layout.debugmessage.x, dev.layout.debugmessage.y + 10 * s);
				}
			}

			if (state.Config.debug) {
				let wcol = { 23: "orange", 24: "cyan", 25: "limegreen" };
				for (let i in obCtrl.itemstack) {
					let w = obCtrl.itemstack[i];
					UI.fill(dev.layout.items.x + i * 3 + 16, dev.layout.items.y, 2, 2, wcol[w]);
				}
			}

			if (state.Config.debug) {
				if (state.Config.viewlog) {
					wtxt = state.obUtil.list_inview();

					MSG.fill(dev.layout.debugspriteobject.x, dev.layout.debugspriteobject.y, 120, wtxt.length * 8, BGCOL);
					for (let s in wtxt) MSG.kprint(wtxt[s], dev.layout.debugspriteobject.x, dev.layout.debugspriteobject.y + 8 * s);
					//if (state.Config.viewlog) for (let s in wtxt) dev.graphics[2].putchr8(wtxt[s], dev.layout.map_x, dev.layout.map_y + 150 + 8 * s);
				}
			}
		};

		function BGDraw(mapChip) {

			if (state.Config.debug) {
				for (let i in mapChip) {
					let mc = mapChip[i];

					if (dev.gs.in_stage_range(mc.x, mc.y, mc.w, mc.h)) {
						let w = dev.gs.worldtoView(mc.x, mc.y);

						//壁の当たり判定有無確認用のデバックコード
						if (mc.c) {
							let cl = {};
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
							};

							BG.putFunc(cl);
							//FG.putFunc(cl);
						}
					}
				}
			}
		}

		//==========
		function read_debugStates() {
			let wtxt = [];

			wtxt.push("o:" + obCtrl.cnt() + "/" + obCtrl.num() + "/" + obCtrl.nonmove + "/" + obCtrl.collisioncount);
			wtxt.push("f:" + mapsc.flame + "/ " + dev.gs.changestate);

			if (obCtrl.interrapt) {
				wtxt.push("interrapt:" + obCtrl.SIGNAL);
			} else {
				wtxt.push("running:" + obCtrl.SIGNAL);
			}

			for (i in obCtrl.item) {
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

			//let spec = state.Game.player.spec;
			wtxt.push("wx,wy:" + Math.floor(dev.gs.world_x) + "," + Math.floor(dev.gs.world_y));
			wtxt.push("play:" + Math.floor(dev.sound.info()) + "." + dev.sound.running());
			//wtxt.push("lv:" + spec.LV + " v"+ spec.VIT + ":m" + spec.MND + ":i" + spec.INT );
			wtxt.push("Living:" + obCtrl.rollcall("mayura"));

			return wtxt;
		}
	}
}
