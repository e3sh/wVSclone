// main
function main_r() {

    var sysParam = [
	//    { canvasId: "Layer0", resolution: { w: 1920, h: 1280 } },
		{ canvasId: "Layer0", resolution: { w: 640, h: 480 } },//BGSurface
		{ canvasId: "Layer1", resolution: { w: 640, h: 480 } },//SPSurface
        { canvasId: "Layer2", resolution: { w: 640, h: 480 } },//FGSurface
        { canvasId: "Layer3", resolution: { w: 640, h: 480 } },//UISurface
        { canvasId: "Layer4", resolution: { w: 640, h: 480 } } //Effect
	]

	var game = new GameCore( sysParam );

    //Game Asset Setup

	game.asset.imageLoad( "FontGraph","pict/aschr.png" );
	game.asset.imageLoad( "SPGraph"	,"pict/cha.png" );
	game.asset.imageLoad( "bg1"		,"pict/bg1.png" );
	game.asset.imageLoad( "bg2"		,"pict/bg2.png" );
	game.asset.imageLoad( "bg3"		,"pict/bg3.png" );

	//var ad = game.asset.soundLoad("jump", "sound/jump");

    //Game Device Setup
	game.setSpFont({ name: "stfont",	 id: "FontGraph", pattern: FontPtnCutArray(  0,   0,12,16) });
	game.setSpFont({ name: "8x8white",	 id: "FontGraph", pattern: FontPtnCutArray(  0, 128, 8, 8) });
	game.setSpFont({ name: "8x8red",	 id: "FontGraph", pattern: FontPtnCutArray(128, 128, 8, 8) });
	game.setSpFont({ name: "8x8green",	 id: "FontGraph", pattern: FontPtnCutArray(  0, 192, 8, 8) });
	game.setSpFont({ name: "8x8blue",	 id: "FontGraph", pattern: FontPtnCutArray(128, 192, 8, 8) });
   
    //Game Task Setup
	//game.task.add(new GameTask_ClearDisp("cldisp"));
	game.task.add(new GameTask_Load("load"));
	game.task.add(new taskMainLoop("main"));
	//game.task.add(new GameTask_FPScount("fps"));
	//game.task.add(new GameTask_FlipDisp("fldisp"));
	game.task.add(new GameTask_Debug("debug"));
	//	game.task.add(new GameTask_Test2("fps"));
    //
    //document.getElementById("console").innerHTML = game.asset.check();
	//ad.volume = 0.5;
    //ad.play();
	//var t = game.task.read("main"); t.enable = false; t.visible = false;

	game.run();
}

function FontPtnCutArray(sx, sy, sw, sh){
	//sx:開始左端 sy:開始上端 sw:Font幅 sh:Font高さ
	var sp = [];

	for (i = 0; i < 7; i++) {
	    for (j = 0; j < 16; j++) {
	        ptn = {
	            x: sw * j + sx, 
	            y: sh * i + sy,
	            w: sw,
	            h: sh
	        };
	        sp.push(ptn);
	    }
	}

	return sp;
}