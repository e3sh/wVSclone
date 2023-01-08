// main
function main_r() {

    //ロード順が確定しなくてエラーになるから、ここでプロトタイプ宣言してます。
    gObjectClass.prototype.sc_move = ocl_scMove;
    //

    var sysParam = [
	//    { canvasId: "Layer0", resolution: { w: 1920, h: 1280 } },
		{ canvasId: "Layer0", resolution: { w: 640, h: 480 } },
		{ canvasId: "Layer1", resolution: { w: 640, h: 480 } },
        { canvasId: "Layer2", resolution: { w: 640, h: 480 } },
        { canvasId: "Layer3", resolution: { w: 640, h: 480 } }
    ]

	var game = new GameCore( sysParam );

    //Game Asset Setup

	game.asset.imageLoad( "FontGraph","pict/aschr.png" );
	game.asset.imageLoad( "SPGraph","pict/cha.png" );

	//var ad = game.asset.soundLoad("jump", "sound/jump");

    //Game Device Setup

    var sp8 = [];

	for (i = 0; i < 7; i++) {
	    for (j = 0; j < 16; j++) {
	        ptn = {
	            x: 8 * j, 
	            y: 8 * i + 128,
	            w: 8,
	            h: 8
	        };
	        sp8.push(ptn);
	    }
	}
	game.setSpFont( { name: "8x8white", id: "FontGraph", pattern: sp8 } );
   
    //Game Task Setup
	game.task.add(new GameTask_ClearDisp("cldisp"));
	game.task.add(new taskMainLoop("main"));
	game.task.add(new GameTask_FPScount("fps"));
	game.task.add(new GameTask_FlipDisp("fldisp"));
	game.task.add(new GameTask_Debug("debug"));
//	game.task.add(new GameTask_Test2("fps"));
    //
    //document.getElementById("console").innerHTML = game.asset.check();
//ad.volume = 0.5;
    //ad.play();

	game.run();
}
