/**
 * @file:
 * Guntlet/Roguelike ActionGame (javascript/HTML)
 * Program entry point main_r()
 * BaseEnging: wGameCoreSystem (privateGameLibraly)
 */
/**
 * @description
 * mainroutine - file:include.js
 * main.html -> prepage_script -> main_r()
 */
// main
function main_r() {

	//resolution
	// VGA  640 * 480 (4:3) DCGA  640*400(16:10)
	// XGA  1024* 768 (4:3) 
	// HDTV 1280* 720(16:9) WXGA 1280*800(16:10) 
	// GDTV 1440*1080 (4:3)   
	// FHD  1920*1080(16:9)

	const VIEW_WIDTH  = 640;
	const VIEW_HEIGHT = 400;

	const OFFSET_X = 0;
	const OFFSET_Y = 0;

    const sysParam = {
		canvasId: "Layer0",
		//offscreen : sw, //offscreenCanvas Use Select "use" or etc / default use
		screen: [
	//  { canvasId: "Layer0", resolution: { w: 1920, h: 1280 } },
			{ resolution: { w: VIEW_WIDTH, h: VIEW_HEIGHT, x:OFFSET_X, y:OFFSET_Y } },//0:BGSurface / systemCanvas Resolution
			{ resolution: { w: VIEW_WIDTH, h: VIEW_HEIGHT, x:OFFSET_X, y:OFFSET_Y } },//1:SPSurface
        	{ resolution: { w: VIEW_WIDTH, h: VIEW_HEIGHT, x:OFFSET_X, y:OFFSET_Y } },//2:FGSurface/FSPSurface
        	{ resolution: { w: VIEW_WIDTH, h: VIEW_HEIGHT, x:OFFSET_X, y:OFFSET_Y } },//3:BUI
        	{ resolution: { w: VIEW_WIDTH, h: VIEW_HEIGHT, x:OFFSET_X, y:OFFSET_Y } },//4:UI
        	{ resolution: { w: VIEW_WIDTH, h: VIEW_HEIGHT, x:OFFSET_X, y:OFFSET_Y } },//5:EFFECT
        	{ resolution: { w: VIEW_WIDTH, h: VIEW_HEIGHT, x:OFFSET_X, y:OFFSET_Y } } //6:MSG
		]
	}

	const game = new GameCore( sysParam );

	//Game Asset Setup
	GameAssetSetup(game);

	//Game Task Setup
	game.task.add(new GameTask_Load("load"));
	game.task.add(new taskMainLoop("main"));
	game.task.add(new GameTask_Debug("debug"));
	game.task.add(new GameTask_Device("device"));

	//game.screen[0].setBackgroundcolor("red");
	game.run();
}

