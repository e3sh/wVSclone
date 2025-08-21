function GameAssetSetup(game){

	ImageAssetSetup(game);
	SoundAssetSetup(game);
	SpfontSetup(game);
}

function ImageAssetSetup(game){
	const asset_path_sys = "system/asset/";
	const asset_path_cts = "content/asset/";

	game.asset.imageLoad( "FontGraph",asset_path_cts + "pict/aschr.png" );
	game.asset.imageLoad( "SPGraph"	, asset_path_cts + "pict/cha.png" );
	game.asset.imageLoad( "bg1"		, asset_path_cts + "pict/bg1.png" );
	game.asset.imageLoad( "bg2"		, asset_path_cts + "pict/bg2.png" );
	game.asset.imageLoad( "bg3"		, asset_path_cts + "pict/bg3.png" );
	game.asset.imageLoad( "KanjiHw"	, asset_path_sys + "k12x8_jisx0201c.png" );
	game.asset.imageLoad( "KanjiFw"	, asset_path_sys + "k12x8_jisx0208c.png" );

	game.asset.imageLoad( "_equip"  ,asset_path_cts + "pict/icon-1_1.png" );
	game.asset.imageLoad( "_item"   ,asset_path_cts + "pict/icon-1_2.png" );
	game.asset.imageLoad( "_icon"   ,asset_path_cts + "pict/icon-3_1.png" );
	game.asset.imageLoad( "_itype"  ,asset_path_cts + "pict/icon-3_2.png" );
	game.asset.imageLoad( "_irare"  ,asset_path_cts + "pict/icon-3_3.png" );

	game.asset.imageLoad( "TitleLogo",asset_path_cts + "pict/TitleLogoTemp.png" );
}

function SoundAssetSetup(game){
	const asset_path_cts = "content/asset/";

	game.asset.soundLoad( "00round_start", asset_path_cts + "sound/00round_start");  
	game.asset.soundLoad( "01main",		asset_path_cts +    "sound/01main" 		);
	game.asset.soundLoad( "02warnning",	asset_path_cts + 	"sound/02warnning"	);
	game.asset.soundLoad( "03hurry_up",	asset_path_cts + 	"sound/03hurry_up"	);
	game.asset.soundLoad( "04round_clear",asset_path_cts + 	"sound/04round_clear");
	game.asset.soundLoad( "05miss",		asset_path_cts + 	"sound/05miss"		);
	game.asset.soundLoad( "06gameover",	asset_path_cts + 	"sound/06gameover"	);
	game.asset.soundLoad( "07swing",	asset_path_cts + 	"sound/07swing"		);
	game.asset.soundLoad( "08bow",		asset_path_cts + 	"sound/08bow"		);
	game.asset.soundLoad( "09select",	asset_path_cts + 	"sound/09select"	);
	game.asset.soundLoad( "10use",		asset_path_cts + 	"sound/10use"		);
	game.asset.soundLoad( "11hit",		asset_path_cts + 	"sound/11hit"		);
	game.asset.soundLoad( "12damage",	asset_path_cts + 	"sound/12damage"	);
	game.asset.soundLoad( "13bomb",		asset_path_cts + 	"sound/13bomb"		);
	game.asset.soundLoad( "14powup",	asset_path_cts + 	"sound/14powup"		);
	game.asset.soundLoad( "15fanfare",	asset_path_cts + 	"sound/15fanfarre"  );
	game.asset.soundLoad( "16battle",	asset_path_cts + 	"sound/16maou_game_battle16");
	game.asset.soundLoad( "17jump",		asset_path_cts + 	"sound/17jump"		);
}

function SpfontSetup(game){

    //Game Device Setup
	game.setSpFont({ name: "stfont",   id: "FontGraph", pattern: FontPtnCutArray(  0,   0,12,16) });
	game.setSpFont({ name: "8x8white", id: "FontGraph", pattern: FontPtnCutArray(  0, 128, 8, 8) });
	game.setSpFont({ name: "8x8red",   id: "FontGraph", pattern: FontPtnCutArray(128, 128, 8, 8) });
	game.setSpFont({ name: "8x8green", id: "FontGraph", pattern: FontPtnCutArray(  0, 192, 8, 8) });
	game.setSpFont({ name: "8x8blue",  id: "FontGraph", pattern: FontPtnCutArray(128, 192, 8, 8) });
	game.setSpFont({ name: "6x8",	   id: "KanjiHw"  , pattern: FontPtnCutArray(  0,  16, 6, 8) });

	return;

	/**
	 * 
	 * @param {number} sx 
	 * @param {number} sy 
	 * @param {number} sw 
	 * @param {number} sh 
	 * @returns {FontPtnArray} SpFontPatternArray
	 * @description
	 * スプライトフォントのパターンを、指定された開始位置とサイズで<br>\
	 * 切り出すための配列を生成します。<br>\
	 * これにより、ビットマップフォントの文字パターンを定義できます。
	 */
	function FontPtnCutArray(sx, sy, sw, sh){
		//sx:開始左端 sy:開始上端 sw:Font幅 sh:Font高さ
		let sp = [];

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
}
