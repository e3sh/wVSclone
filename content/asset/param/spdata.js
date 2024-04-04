function spdata(){
	
	let sp = [
	// SP PATTERN DATA",,,,
	// SP NO.","X","Y","ADDX","ADDY"

	["Mayura1", 0, 0, 32, 32],
	["Mayura2", 32, 0, 32, 32],
	["Mayura3", 64, 0, 32, 32],
	["Mayura4", 96, 0, 32, 32],
	["Unyuu1", 128, 0, 32, 32],
	["Unyuu2", 160, 0, 32, 32],
	["Unyuu3", 192, 0, 32, 32],
//	["Fire1", 0, 32, 32, 32],
//	["Fire2", 32, 32, 32, 32],
	["Fire1",  0, 32, 16, 16],
	["Fire2", 16, 32, 16, 16],
	["Down1", 0, 64, 32, 32],
	["Down2", 32, 64, 32, 32],
	["Down3", 64, 64, 32, 32],
	["Down4", 96, 64, 32, 32],
	["Down5", 128, 64, 32, 32],
	["Zap1", 0, 96, 32, 32],
	["Zap2", 32, 96, 32, 32],
	["Zap3", 64, 96, 32, 32],
	["Zap4", 96, 96, 32, 32],
	["Ball1", 128, 48, 16, 16],
	["Ball2", 144, 48, 16, 16],
	["Ball3", 160, 48, 16, 16],
	["BallB1", 176, 48, 16, 16],
	["BallB2", 192, 48, 16, 16],
	["BallB3", 208, 48, 16, 16],
	["BallS1", 176, 64, 16, 16],
	["BallS2", 192, 64, 16, 16],
	["BallS3", 208, 64, 16, 16],
	["BallL1", 176, 80, 16, 16],
	["BallL2", 192, 80, 16, 16],
	["BallL3", 208, 80, 16, 16],
	["Key",     64, 32, 32, 32],
	["sKey",    48, 32, 16, 16],
	["miniMay", 32, 32, 16, 16],
//	["Door",  96, 32, 32, 32],
	["TrBox",  96, 32, 32, 32],
	["Space", 224, 0, 32, 32],
    ["Coin1", 160, 96, 16, 16],
	["Coin2", 176, 96, 16, 16],
	["Coin3", 192,  96, 16, 16],
	["Coin4", 208,  96, 16, 16],
	["Knife", 32, 192, 32, 32],//128, 96, 32, 32],
	["Spear", 96, 192, 32, 32],
	["Boom", 128, 192, 32, 32],
	["Bow", 160, 192, 32, 32],
	["Lamp", 224, 0, 24, 24],
	["Map", 224, 24, 24, 24],
	["lance", 224, 48, 16, 48],
	["BoomR", 224, 96, 16, 16],
	["Axe", 64, 192, 32, 32],// 176, 112, 16, 16],
	["Wand", 0, 192, 32, 32],//160, 112, 16, 16],
	["Sword",240, 48, 16, 48],
	["Rod", 240, 192, 16, 32],//,240, 96, 16, 32],
	["Baxe",192, 112, 32, 16],
	["LBow",128, 32, 48, 16],
	["Arrow",224,112, 16, 16],
	["Cursor1",176, 32, 16, 16],
	["Cursor2",192, 32, 16, 16],
	["Cursor3",208, 32, 16, 16],
	["Barn1", 0, 48, 16, 16],
	["Barn2",16, 48, 16, 16],
	["Barn3",32, 48, 16, 16],
	["cursorx",64,128, 16, 16],

	["Dummy",112,32,15,15]];

	let sp_ptn = []; // スプライトパターン

	for (let j in sp){
		let w = sp[j];
    	let ptn = { pict: "SPGraph",
			x: w[1], y: w[2], w: w[3], h: w[4]
		};
    	sp_ptn[ w[0] ] = ptn; 
	}

	setBG("_equip", 16, 10, 24, 24); //_equip_0-159
	setBG("_item" , 16, 17, 24, 24); // _item_0-271
	setBG("_icon" , 16, 17, 24, 24); // _icon_0-271
	setBG("_itype", 16,  1, 24, 24); //_itype_0- 15
	setBG("_irear", 16, 17, 24, 24); //_irear_0-271

	let ptn = { pict: "TitleLogo",x: 0, y: 0, w: 406, h: 68 };
	sp_ptn["TitleLogo"] = ptn; 
	
	
	//sp_ptn["Wand"]  = sp_ptn["_equip_26"];//24
	//sp_ptn["Rod"]  = sp_ptn["_equip_26"];

	sp_ptn["Knife"] = sp_ptn[ "_equip_6"];//4
	//sp_ptn["Sword"]  = sp_ptn["_equip_6"];
	
	sp_ptn["Axe"]   = sp_ptn["_equip_24"];//22
	//sp_ptn["Baxe"]  = sp_ptn["_equip_24"];
	
	sp_ptn["Bow"]   = sp_ptn["_equip_39"];//36
	//sp_ptn["LBow"]  = sp_ptn["_equip_39"];
	
	//sp_ptn["Spear"] = sp_ptn["_equip_18"];//16
	//sp_ptn["lance"]  = sp_ptn["_equip_19"];
	
	//sp_ptn["Boom"]  = sp_ptn["_equip_61"];//34
	//sp_ptn["BoomR"] = sp_ptn["_equip_61"];//34
	

	//sp_ptn["TrBox"] = sp_ptn["_item_42"];

	//sp_ptn["Key"]   = sp_ptn["_item_61"];//60
	//sp_ptn["sKey"]  = sp_ptn["_item_61"];

	//sp_ptn["cursorx"]  = sp_ptn["_icon_19"];

	sp_ptn["AmuletR"]   = sp_ptn["_equip_118"];//6,7 112+6
	sp_ptn["AmuletG"]   = sp_ptn["_equip_117"];//5,7 112+5
	sp_ptn["AmuletB"]   = sp_ptn["_equip_119"];//7,7 112+7
	sp_ptn["RingR"]		= sp_ptn["_equip_127"];//15,7 112+15
	sp_ptn["RingB"]		= sp_ptn["_equip_126"];//14,7 112+14
	sp_ptn["CandleR"]   = sp_ptn["_item_76"];//12,4 64+12
	sp_ptn["CandleB"]   = sp_ptn["_item_77"];//13,4 64+13
	sp_ptn["Mirror"]	= sp_ptn["_item_59"];//11,3 48+11

	return sp_ptn;

	//
	function setBG(assetname, col, row ,w ,h){
		let c = 0;
    	for (let i = 0; i < row; i++) {
        	for (let j = 0; j < col; j++) {
				let ptn = { pict: assetname,
				x: j*w, y: i*h, w: w, h: h
				};
				sp_ptn[ assetname + "_" + c ] = ptn; 
				c++;
			}	
		}	
	}
}
// BG Patten map 
function bgdata(){

	let sp = [ 
	// SP NO.","X","Y","ADDX","ADDY"
		[0, 128 - 96, 128 - 128, 95, 95], //0,32,0 床96,96
		[1, 224 - 96, 128 - 128, 95, 95], //1,128,0 壁96，96
		[2, 128 - 96, 128 - 128, 31, 31], //2, 32,0 床32，32　
		[3, 224 - 96, 128 - 128, 31, 31], //3,128,0 壁7　
		[4, 256 - 96, 128 - 128, 31, 31], //4,160,0 壁8 
		[5, 288 - 96, 128 - 128, 31, 31], //5,192,0 壁9
		[6, 224 - 96, 160 - 128, 31, 31], //6,128,32 壁4
		[7, 288 - 96, 160 - 128, 31, 31], //7,192,32 壁6
		[8, 224 - 96, 192 - 128, 31, 31], //8,128,64 壁1
		[9, 256 - 96, 192 - 128, 31, 31], //9,160,64 壁2
		[10, 288 - 96, 192 - 128, 31, 31], //10,192,64 壁3
		[11, 256 - 96, 160 - 128, 31, 31], //11,160,32 壁5
		[12,  0, 64, 32, 32], //12, 0,64 床(壁際)
		[13,  0,  0, 32, 32], //13, 0, 0 Door  32，32
		[14,  0, 32, 32, 32], //14, 0,32 魔法陣 32，32
		[15,  0, 96, 32, 32], //15, 0,96 石板   32，32
		["Door",     0,  0, 32, 32], //13, 0, 0 Door  32，32
		["Portal",   0, 32, 32, 32], //14, 0,32 魔法陣 32，32
		["StoneB",   0, 96, 32, 32], //15, 0,96 石板   32，32
		["OpDoor",  32, 96, 32, 32], //--, 0,32 解放扉　  32，96
		["LPortal", 64, 96, 32, 32], //--, 0,96 点灯魔法陣64，96
	];

	let bg_ptn = []; // BGパターン

	for (let j in sp) {
		let w = sp[j];

		let ptn = {};

		ptn.x = w[1];
		ptn.y = w[2];
		ptn.w = w[3];
		ptn.h = w[4];

		bg_ptn[w[0]] = ptn;
	}

	return bg_ptn;
}