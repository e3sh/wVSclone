function spdata(){
	
	var sp = [
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
