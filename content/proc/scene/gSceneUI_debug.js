//gameSceneUI_debug
//実ゲームシーン本体部分のうち、debug表示部分のみ
//
//GameSceneの行が増えすぎたので分割して修正しやすくするのが目的
//2025/06/24分割処理

function gameSceneUI_debug(state){
//dev deviceControlClass 

    //宣言部
    let dev = state.System.dev;

	let BG = dev.graphics[0];
    let UI = dev.graphics[3];
    let FG = dev.graphics[2];

	this.reset = game_reset;
	this.draw = game_draw;
	this.colDraw = BGDraw;


	let obCtrl = state.obCtrl; //= new gObjectControl(dev.graphics1, state);
	let mapsc  = state.mapsc; //= new mapSceControl();

	let fdrawcnt = 0;

	//==========================================================================================
	//処理部

	function game_reset() {
	    //ゲーム画面の描画を開始(Flip/Drawを自動で実行　各フレームで)
		//dev.graphics[0].setInterval(1);//BG
		//dev.graphics[1].setInterval(1);//SPRITE
		//dev.graphics[2].setInterval(1);//FG
		//dev.graphics[3].setInterval(0);//UI

	    //UI.clear();
	}

	function game_draw() {

		let scdispview = false;

		fdrawcnt++;
	    if ((fdrawcnt % 6) == 0) {
	        fdrawcnt = 0;
	        scdispview = true;
	    }
		scdispview = true;//debug

		//==　ここから文字表示画面（出来るだけ書き換えを少なくする）
	    //プライオリティ最前面の画面追加したので
	    
		if (!scdispview) return;

		//debug　true　の場合以下表示
		let wtxt;
		if (state.Config.debug) {

			wtxt = read_debugStates();
			if (state.Config.viewlog) wtxt = wtxt.concat(state.obUtil.messagelog.read()); 
			//let wtxt = read_debugStates().concat(obCtrl.messagelog.read());
			for (let s in wtxt) dev.graphics[2].putchr8(wtxt[s], dev.layout.debugstatus.x, dev.layout.debugstatus.y + 8 * s);

			//wtxt = obCtrl.messagelog.read();
			//for (let s in wtxt) work3.putchr8(wtxt[s], dev.layout.map_x, dev.layout.map_y + 150 + 8 * s);

			wtxt = state.obUtil.messageview.read();
			if (state.Config.viewlog) for (let s in wtxt) dev.graphics[2].kprint(wtxt[s], dev.layout.debugmessage.x, dev.layout.debugmessage.y + 8 * s);
			//if (state.Config.viewlog) for (let s in wtxt) dev.graphics[2].putchr8(wtxt[s], dev.layout.map_x, dev.layout.map_y + 150 + 8 * s);
		}else{
			wtxt = state.obUtil.messageconsole.read();
			if (state.Config.viewlog) for (let s in wtxt) dev.graphics[2].kprint(wtxt[s], dev.layout.debugmessage.x, dev.layout.debugmessage.y + 10 * s);
			//if (state.Config.viewlog) for (let s in wtxt) dev.graphics[2].putchr8(wtxt[s], dev.layout.map_x, dev.layout.map_y + 150 + 8 * s);
		}

		if (state.Config.debug) {
			let wcol = {23:"orange", 24:"cyan", 25:"limegreen"};
			for (let i in obCtrl.itemstack) {
				let w = obCtrl.itemstack[i];
				UI.fill(dev.layout.items.x + i * 3 + 16, dev.layout.items.y, 2, 2, wcol[w]);
			}
		}
	}

	function BGDraw(mapChip) {

		if (state.Config.debug){
			for (let i in mapChip) {
				let mc = mapChip[i];

				if (dev.gs.in_stage_range(mc.x, mc.y, mc.w, mc.h)) {
					let w = dev.gs.worldtoView(mc.x, mc.y);
					
					//壁の当たり判定有無確認用のデバックコード
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

						BG.putFunc(cl);
						//FG.putFunc(cl);
					}
				}
			} 
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

		//let spec = state.Game.player.spec;

		wtxt.push("wx,wy:" + Math.floor(dev.gs.world_x) + "," + Math.floor(dev.gs.world_y));
		wtxt.push("play:" + Math.floor(dev.sound.info()) + "." + dev.sound.running() );
		//wtxt.push("lv:" + spec.LV + " v"+ spec.VIT + ":m" + spec.MND + ":i" + spec.INT );
		wtxt.push("Living:" + obCtrl.rollcall("mayura"));

		return wtxt;
	}
}
