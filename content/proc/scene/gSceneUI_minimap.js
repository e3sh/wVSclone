//gameSceneUI_minimap
//実ゲームシーン本体部分のうち、minimap表示部分のみ
//
//GameSceneの行が増えすぎたので分割して修正しやすくするのが目的
//2025/06/24分割処理

function gameSceneUI_minimap(state){
//dev deviceControlClass 

    //宣言部
    let dev = state.System.dev;

	this.reset = game_reset;
	this.draw = game_draw;
	this.check = renewcheck;

	this.reset_enable = true;

	let obCtrl = state.obCtrl; //= new gObjectControl(dev.graphics1, state);
	let mapsc  = state.mapsc; //= new mapSceControl();

	let fdrawcnt = 0;

	let mapChip = [];

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

		this.create = function(){
		//	ondr(this.d);
			this.d.clearRect(0, 0, 150, 150);
			for (let i = 0, loopend = this.mcp.length; i < loopend; i++) {
			let mc = this.mcp[i];
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
			}
		}
		this.draw = function(device){
			device.drawImage(this.e, this.x, this.y);
		}
	}

	//==========================================================================================
	//処理部
	function game_reset() {
	    //ゲーム画面の描画を開始(Flip/Drawを自動で実行　各フレームで)
		//dev.graphics[0].setInterval(1);//BG
		//dev.graphics[1].setInterval(1);//SPRITE
		//dev.graphics[2].setInterval(1);//FG
		//dev.graphics[3].setInterval(0);//UI
		//dev.graphics[4].setInterval(0);//Effect

	    //work3.clear();

		mapChip = mapsc.mapChip();

		SubmapDraw.mcp = mapChip; 
	}

	function game_draw() {//mapreflash flag
		if (state.Game.map || state.Game.lamp) {
			//obCtrl.drawPoint(dev.graphics[4], state.Game.lamp);
			dev.graphics[3].putFunc(SubmapframeDraw);
			if (state.Game.map) {
				dev.graphics[3].putFunc(SubmapDraw);
				dev.graphics[3].put("Map",dev.layout.map_x + 36, dev.layout.map_y + 12);
			}
			if (state.Game.lamp) {
				dev.graphics[3].put("Lamp",dev.layout.map_x + 12, dev.layout.map_y + 12);
			}
		}
	}

	function renewcheck(refle){

		if (refle && state.Game.map) {
			SubmapDraw.create();
			obCtrl.messageview.write("** Submap Create **");
			refle = false;
		}

		return refle;
	}
}
