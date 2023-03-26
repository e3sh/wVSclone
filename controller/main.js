// main
function main_r(sw) {

	//resolution
	//const VIEW_WIDTH  = 1024;
	//const VIEW_HEIGHT = 640;
	const VIEW_WIDTH  = 640;
	const VIEW_HEIGHT = 400;//16:10

    var sysParam = {
		canvasId: "Layer0",
		offscreen : sw, //offscreenCanvas Use Select "use" or etc / default use
		screen: [
	//  { canvasId: "Layer0", resolution: { w: 1920, h: 1280 } },
		{ resolution: { w: VIEW_WIDTH, h: VIEW_HEIGHT, x:0, y:0 } },//BGSurface / systemCanvas Resolution
		{ resolution: { w: VIEW_WIDTH, h: VIEW_HEIGHT, x:0, y:0 } },//SPSurface
        { resolution: { w: VIEW_WIDTH, h: VIEW_HEIGHT, x:0, y:0 } },//FGSurface
        { resolution: { w: VIEW_WIDTH, h: VIEW_HEIGHT, x:0, y:0 } },//UISurface
        { resolution: { w: VIEW_WIDTH, h: VIEW_HEIGHT, x:0, y:0 } } //Effect
    //    { resolution: { w: 640, h: 400, x:192, y:120 } },//UISurface
    //    { resolution: { w: 640, h: 400, x:192, y:120 } } //Effect
		]
	}

	var game = new GameCore( sysParam );

    //Game Asset Setup
	game.asset.imageLoad( "FontGraph","pict/aschr.png" );
	game.asset.imageLoad( "SPGraph"	,"pict/cha.png" );
	game.asset.imageLoad( "bg1"		,"pict/bg1.png" );
	game.asset.imageLoad( "bg2"		,"pict/bg2.png" );
	game.asset.imageLoad( "bg3"		,"pict/bg3.png" );

	game.asset.soundLoad( "00round_start",	"sound/00round_start");  
	game.asset.soundLoad( "01main",			"sound/01main" 		);
	game.asset.soundLoad( "02warnning",		"sound/02warnning"	);
	game.asset.soundLoad( "03hurry_up",		"sound/03hurry_up"	);
	game.asset.soundLoad( "04round_clear",	"sound/04round_clear");
	game.asset.soundLoad( "05miss",			"sound/05miss"		);
	game.asset.soundLoad( "06gameover",		"sound/06gameover"	);
	game.asset.soundLoad( "07swing",		"sound/07swing"		);
	game.asset.soundLoad( "08bow",			"sound/08bow"		);
	game.asset.soundLoad( "09select",		"sound/09select"	);
	game.asset.soundLoad( "10use",			"sound/10use"		);
	game.asset.soundLoad( "11hit",			"sound/11hit"		);
	game.asset.soundLoad( "12damage",		"sound/12damage"	);
	game.asset.soundLoad( "13bomb",			"sound/13bomb"		);

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
	game.task.add(new GameTask_Device("device"));
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