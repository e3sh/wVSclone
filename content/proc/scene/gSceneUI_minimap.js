//gameSceneUI_minimap
//実ゲームシーン本体部分のうち、minimap表示部分のみ
//
//GameSceneの行が増えすぎたので分割して修正しやすくするのが目的
//2025/06/24分割処理
/**
 * @class
 * @classdesc
 * 実ゲームシーン本体部分のうち、ミニマップ表示部分のみを管理するクラスです。<br>\
 * ミニマップの描画、更新、およびマップ上のオブジェクトのレーダー表示を行います。
 */
class gameSceneUI_minimap {
	/**
	 * @constructor
	 * @param {stateControl} state GameCore.state
	 * @description
	 * `gameSceneUI_minimap`を初期化します。<br>\
	 * ミニマップ描画用のOffscreenCanvasを準備し、<br>\
	 * ミニマップの枠と描画オブジェクトを設定します。
	 */
	constructor(state) {
		//dev deviceControlClass 
		//宣言部
		const dev = state.System.dev;

		const UI = dev.graphics[state.Constant.layer.UI];
		const EFFECT = dev.graphics[state.Constant.layer.EFFECT];

		this.reset_enable = true;

		const obCtrl = state.obCtrl; //= new gObjectControl(dev.graphics1, state);
		const mapsc = state.mapsc; //= new mapSceControl();

		let mapChip = [];

		let mmcanvas;
		let mmdevice;

		let mapviewflag = false;
		let delaystartf = false;
		let delaytime = 0;

		mmcanvas = new OffscreenCanvas(150, 150);
		mmdevice = mmcanvas.getContext("2d");

		//縮小マップ枠
		/**
		 * @description
		 * ミニマップの背景フレームを描画するカスタム描画オブジェクトです。<br>\
		 * 透明度付きの黒い矩形を描画して、ミニマップの領域を視覚的に区切ります。
		 */
		let SubmapframeDraw = {};
		SubmapframeDraw.draw = function (device) {
			device.beginPath();
			device.fillStyle = "rgba(0,0,0,0.3)";
			device.fillRect(dev.layout.map.x, dev.layout.map.y, 150, 150);
		};

		//縮小マップ表示
		/**
		 * @description
		 * ミニマップの実際のマップチップを描画するクラスです。<br>\
		 * マップチップの色を、`lookf`フラグ（視界に入ったことがあるか）に応じて変更します。
		 */
		let SubmapDraw = new smd(mmdevice, mmcanvas);
		function smd(ctx, elm) {
			this.mcp = mapChip;
			let osc = false;
			//this.draw = osc? this.predr: this.ondr;
			this.d = ctx;
			this.e = elm;

			this.x = dev.layout.map.x;
			this.y = dev.layout.map.y;
			/**
			 * @description
			 * ミニマップのマップチップ画像を生成します。<br>\
			 * マップチップの可視性と`lookf`フラグに基づいて色を決定し、<br>\
			 * オフスクリーンCanvasに描画します。
			 */
			this.create = function () {
				//	ondr(this.d);
				this.d.clearRect(0, 0, 150, 150);
				for (let i = 0, loopend = this.mcp.length; i < loopend; i++) {
					let mc = this.mcp[i];
					if (mc.visible) {
						let c;
						if (mc.lookf) {
							c = ["dimgray", "steelblue", "orange"];
						} else {
							c = ["darkslategray", "darkslategray", "orange"];
						}
						this.d.beginPath();
						//device.strokeStyle = (mc.type == 12) ? "orange" : "blue";
						this.d.strokeStyle = c[mc.type - 10];
						this.d.lineWidth = 1;
						this.d.rect(mc.x / 20, mc.y / 20, 2, 2);
						this.d.stroke();
					}
				}
			};
			/**
			 * @param {*} device
			 * @description
			 * ミニマップ画像を画面に描画するメソッドです。<br>\
			 * このメソッドは、`UI.putFunc`を通じて呼び出されます。
			 */
			this.draw = function (device) {
				device.drawImage(this.e, this.x, this.y);
			};
		}

		//==========================================================================================
		//処理部
		/**
		 * @method
		 * @description
		 * ミニマップ表示をリセットします。<br>\
		 * 強制的に再描画するフラグを設定し、ミニマップの表示状態を初期化します。
		 */
		this.reset =()=>{

			mapviewflag = false;
			delaystartf = false;
			delaytime = 0;

			mapChip = mapsc.mapChip();

			SubmapDraw.mcp = mapChip;
		}

		/**
		 * @method
		 * @description
		 * ミニマップとランプ表示の描画を制御します。<br>\
		 * マップまたはランプが有効な場合、遅延後にミニマップを表示開始します。
		 */
		this.draw =()=>{

			if (state.Game.map || state.Game.lamp) {
				if (!delaystartf) {
					delaystartf = true;
					delaytime = state.System.time() + (1000 / 2); //30f
				}
				if (delaystartf && (state.System.time() >= delaytime)) {
					mapviewflag = true;
				}

			} else {
				mapviewflag = false;
				delaystartf = false;
			}

			if (mapviewflag) {
				//obCtrl.drawPoint(dev.graphics[4], state.Game.lamp);
				UI.putFunc(SubmapframeDraw);
				if (state.Game.map) {
					UI.putFunc(SubmapDraw);
					UI.put("Map", dev.layout.map.x + 36, dev.layout.map.y + 12);
				}
				if (state.Game.lamp) {
					UI.put("Lamp", dev.layout.map.x + 12, dev.layout.map.y + 12);
				}
			}
		}
		/**
		 * 
		 * @param {boolean} refle 再描画フラグ(問い合わせ前)
		 * @returns  再描画フラグ(問い合わせ後)
		 * @description
		 * ミニマップの更新が必要かをチェックし、必要なら再作成します。<br>\
		 * マップが有効で、再描画フラグが立っている場合にミニマップを更新します。
		 */
		this.check =(refle)=>{

			if (refle && state.Game.map) {
				SubmapDraw.create();
				state.obUtil.messageview.write("** Submap Create **");
				refle = false;
			}

			return refle;
		}

		/**
		 * @method
		 * @param {Screen} wscreen 表示画面
		 * @param {boolean} flag lampフラグ(マップ持っててランプ持ってない場合は自分の位置のみ表示する為)
		 * @description
		 * ミニマップ上にプレイヤーや敵などのオブジェクトの位置を点として描画します。<br>\
		 * オブジェクトのタイプに応じて色分けし、`lamp`フラグで表示対象を制御します。
		 */
		this.rader =(wscreen, flag)=>{

			const t = state.Constant.objtype;

			let col = [];
			col[t.PLAYER] = "white";
			col[t.FRIEND] = "skyblue";
			col[t.BULLET_P] = "skyblue";
			col[t.ENEMY] = "red";
			col[t.BULLET_E] = "orange";
			col[t.ITEM] = "yellow";
			col[t.ETC] = "green";

			if (!Boolean(wscreen)) wscreen = EFFECT;

			let nt = Date.now();

			let cl = {};

			cl.obj = obCtrl.objList;
			cl.col = col;
			cl.draw = function (device) {

				for (let i in this.obj) {
					let o = this.obj[i];

					if (o.visible) {

						if ((o.type == t.BULLET_P) || (o.type == t.BULLET_E) || (o.type == t.ETC)) continue;
						//if (o.type == t.ETC) continue;
						if ((o.type != t.PLAYER) && (!flag)) continue;

						if (o.normal_draw_enable) {
							device.beginPath();
							device.strokeStyle = this.col[o.type];
							device.lineWidth = 1;
							device.rect(
								dev.layout.map.x + o.x / 20,
								dev.layout.map.y + o.y / 20,
								o.hit_x / 20, o.hit_y / 20);
							device.stroke();
						}

						if (o.lighton) {
							device.beginPath();
							device.strokeStyle = this.col[o.type];
							device.lineWidth = 1;
							device.arc(
								dev.layout.map.x + (o.x + o.hit_x / 2) / 20,
								dev.layout.map.y + (o.y + o.hit_y / 2) / 20,
								(nt % 27) / 9 * 2, 0, 2 * Math.PI, false);
							device.stroke();
						}
					}
				}
			};

			wscreen.putFunc(cl);
		}
	}
}
