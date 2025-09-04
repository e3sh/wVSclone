// Motion Pattern
// スプライトアニメーションの指定
// 
// MP NO.(モーションパターン番号）
// Wait Flame Time（アニメーションの間）フレームで指定
// Loop step (loop end number)　最小は0（アニメーションさせない）
// Sp no.,Mirror,Radian
// アニメパターンは最大で10パターンまでで
//  Mirror and Radian -1 -> Object data
//   1:上下反転　2:左右反転
//  Mirror and Radian -1 -> Object data
//　オブジェクトの持つラジアン値を使用する。
//
/**
 * @typedef {object} MotionPattern
 * @property {number} wait アニメーション間隔(フレーム)
 * @property {pattern} pattern パターン配列 
 */
/** 
 * @returns {MotionPattern[]} motionPatternリスト 
 */
function motionPattern(){

	let mp = [];

	let no = 0;
	
	mp[no] = {};

	mp[no].wait = 0;
	//Boolean(mp[no].wait) = true = wait on;
	mp[no].pattern = [
	 ["Space", 0, 0 ]];
//===================================

	//mayura 右向き
	//=================================================
	no = 1;

	mp[no] = {};

	mp[no].wait = 18;
	mp[no].pattern = [
	["Mayura1", 0, 0],
	["Mayura2", 0, 0],
	["Mayura3", 0, 0],
	["Mayura4", 0, 0]
    ];

	//mayura 左向き
	//=================================================
	no = 2;

	mp[no] = {};

	mp[no].wait = 18;
	mp[no].pattern = [
	["Mayura1", 2, 0],
	["Mayura2", 2, 0],
	["Mayura3", 2, 0],
	["Mayura4", 2, 0]
    ];

	//*8 mayura 右後ろ向き 9 mayura 左後ろ向き
	//=================================================
	mp[8] = {wait:18, pattern:[["Mayura1r",0,0],["Mayura2r",0,0],["Mayura3r",0,0],["Mayura4r",0,0]]};
	mp[9] = {wait:18, pattern:[["Mayura1r",2,0],["Mayura2r",2,0],["Mayura3r",2,0],["Mayura4r",2,0]]};

	//Option
	//=================================================
    no = 3;

	mp[no] = {};

	mp[no].pattern = [
	["miniMay", 0, 0]
    ];
	//ENEMY右向き
	//=================================================
	no = 4;

	mp[no] = {};

	mp[no].wait = 18;
	mp[no].pattern = [
	["Unyuu1", 0, 0],
	["Unyuu2", 0, 0]
    ];

	//ENEMY左向き
	//=================================================
	no = 5;

	mp[no] = {};

	mp[no].wait = 18;
	mp[no].pattern = [
	["Unyuu1", 2, 0],
	["Unyuu2", 2, 0]
    ];
	
	//*13 EUnyuu  右後ろ向き 14 EUnyuu 左後ろ向き
	//=================================================
	mp[13] = {wait:18, pattern:[["Unyuu1r",0,0],["Unyuu2r",0,0]]};
	mp[14] = {wait:18, pattern:[["Unyuu1r",2,0],["Unyuu2r",2,0]]};

	//Unyuu右向き
	//=================================================
    no = 31;

	mp[no] = {};

	mp[no].pattern = [
	["Unyuu3", 0, 0]
    ];
	//Unyuu左向き
	//=================================================
    no = 6;

	mp[no] = {};

	mp[no].pattern = [
	["Unyuu3", 2, 0]
    ];
	//青弾
	//=================================================
	no = 7;

	mp[no] = {};

	mp[no].wait = 18;
	mp[no].pattern = [
     ["Fire1", 0, 0],
	 ["Fire2", 0, 0]];
	/*
	mp[no].wait = 10;
	mp[no].pattern = [
    ["Ball1", 0, 0],
    ["Ball2", 0, 0],
    ["Ball3", 0, 0],
    ["Ball2", 0, 0]
    ];
	*/
	//爆発
	//=================================================
	no = 12;

	mp[no] = {};

	mp[no].wait = 10;
	mp[no].pattern = [
    ["Down5", 0, 0],
    ["Down4", 0, 0],
    ["Down3", 0, 0],
    ["Down2", 0, 0],
    ["Down1", 0, 0],
    ["Down2", 0, 0],
    ["Down3", 0, 0],
    ["Down4", 0, 0],
    ["Down5", 0, 0]
    ];

	//爆発(Hit)
	//=================================================
	no = 11;

	mp[no] = {};

	mp[no].wait = 15;
	mp[no].pattern = [
    ["Zap1", 0, 0],
    ["Zap2", 0, 0],
    ["Zap3", 0, 0],
    ["Zap4", 0, 0]
    ];

	//Ball
	//=================================================
	no = 26;

	mp[no] = {};

	mp[no].wait = 10;
	mp[no].pattern = [
    ["Ball1", 0, 0],
    ["Ball2", 0, 0],
    ["Ball3", 0, 0],
    ["Ball2", 0, 0]
    ];

	//key
	//=================================================
	no = 27;

	mp[no] = {};

//	mp[no].wait = 20;
	mp[no].pattern = [
	["sKey", 0, 0]
    ];

	//B
	//=================================================
	no = 28;

	mp[no] = {};

	mp[no].wait = 10;
	mp[no].pattern = [
    ["BallB1", 0, 0],
    ["BallB2", 0, 0],
    ["BallB3", 0, 0],
    ["BallB2", 0, 0]
    ];

	//S
	//=================================================
	no = 29;

	mp[no] = {};

	mp[no].wait = 10;
	mp[no].pattern = [
    ["BallS1", 0, 0],
    ["BallS2", 0, 0],
    ["BallS3", 0, 0],
    ["BallS2", 0, 0]
    ];

	//L
	//=================================================
	no = 30;

	mp[no] = {};

	mp[no].wait = 10;
	mp[no].pattern = [
    ["BallL1", 0, 0],
    ["BallL2", 0, 0],
    ["BallL3", 0, 0],
    ["BallL2", 0, 0]
    ];

	//Coin
	//=================================================
	no = 32;

	mp[no] = {};

	mp[no].wait = 5;
	mp[no].pattern =
	[["Coin1", 0, 0]
	, ["Coin2", 0, 0]
	, ["Coin3", 0, 0]
	, ["Coin4", 0, 0]
	, ["Coin3", 2, 0]
	, ["Coin2", 2, 0]
	, ["Coin1", 2, 0]];

	//=================================================
	no = 15;//item

	mp[no] = {};

	mp[no].pattern = [
	["Knife", 0, 0]
    ];
	//=================================================
	no = 16;//item

	mp[no] = {};

	mp[no].pattern = [
	["Spear", 0, 0]
    ];
	//=================================================
	no = 17;//item

	mp[no] = {};

	mp[no].pattern = [
	["Boom", 0, 0]
    ];
	//=================================================
	no = 18;//item

	mp[no] = {};

	mp[no].pattern = [
	["Bow", 0, 0]
    ];

	//=================================================
	no = 33;

	mp[no] = {};

	mp[no].pattern = [
	["Lamp", 0, 0]
    ];
	//=================================================
	no = 34;

	mp[no] = {};

	mp[no].pattern = [
	["Map", 0, 0]
    ];
	//=================================================
	no = 35;

	mp[no] = {};

	mp[no].pattern = [
	["lance", -1, -1]
    ];
	//=================================================
	no = 36;

	mp[no] = {};

	mp[no].pattern = [
	["BoomR", -1, -1]
    ];

	//=================================================
	no = 37;//item

	mp[no] = {};

	mp[no].pattern = [
	["Axe", 0, 0]
    ];

	//=================================================
	no = 38;//item

	mp[no] = {};

	mp[no].pattern = [
	["Wand", 0, 0]
    ];

	//=================================================
	no = 39;

	mp[no] = {};

	mp[no].pattern = [
	["TrBox", 0, 0]
    ];

	//=================================================
	no = 40;

	mp[no] = {};

	mp[no].pattern = [
	["Baxe", -1, -1]
    ];

	//=================================================
	no = 41;

	mp[no] = {};

	mp[no].pattern = [
	["Rod", -1, -1]
    ];

	//=================================================
	no = 42;

	mp[no] = {};

	mp[no].pattern = [
	["Sword", -1, -1]
    ];

	//
	//=================================================
	no = 43;

	mp[no] = {};

	mp[no].pattern = [
	["LBow", -1, -1]
    ];

	//
	//=================================================
	no = 44;

	mp[no] = {};

	mp[no].pattern = [
	["Arrow", -1, -1]
    ];

	//InfoCursor
	//=================================================
	no = 45;

	mp[no] = {};

	mp[no].wait = 10;
	mp[no].pattern = [
    ["Cursor1", -1, -1],
    ["Cursor2", -1, -1],
    ["Cursor3", -1, -1],
    ["Cursor2", -1, -1]
	]
	//BarningFire
	//=================================================
	no = 46;

	mp[no] = {};

	mp[no].wait = 10;
	
	mp[no].pattern = [
		["Barn1", -1, -1],
		["Barn2", -1, -1],
		["Barn3", -1, -1]
		];
/*	
	mp[no].pattern = [
    ["Barn1", 1, 0],
    ["Barn1", 1, 2],
    ["Barn2", 1, 0],
    ["Barn2", 1, 2],
    ["Barn3", 1, 0],
    ["Barn3", 1, 2]
	];
*/
	//=================================================
	let itemname = [
	 {no:50, sp:"AmuletR"}
	,{no:51, sp:"AmuletG"}
	,{no:52, sp:"AmuletB"}
	,{no:53, sp:"CandleR"}
	,{no:54, sp:"CandleB"}
	,{no:55, sp:"RingR"} 
	,{no:56, sp:"RingB"}
	,{no:57, sp:"Mirror"}
	];

	for (let i in itemname){
		mp[itemname[i].no] = {pattern:[[itemname[i].sp,0,0]] }
	}
	//
//@@
	return mp;
}
//===================================
// *add 2025/09/04 
//===================================
/*
1 mayura 右向き 2 mayura 左向き
3 option?
4 Unyuu  右向き 5 Unyuu  左向き
6 BUnyuu 左向き
7 Bullet 
*8 mayura 右後ろ向き 9 mayura 左後ろ向き
10 (Reserb)
11 Hit 
12 Bomb
*13 Unyuu  右後ろ向き 14 Unyuu 左後ろ向き
15 Knife
16 Spear
17 Boom
18 Bow
19-25 (Reserb)
26 Ball 27 Key
28 (B 
29 (S 
30 (L 
31 Generator(BUnyuu 右向き)
32 Coin 
33 Lamp 
34 Map
35 Spear/Lance
36 Boom/BoomR
37 Axe
38 Wand
39 TrBox
40 Baxe
41 Rod
42 Sword
43 Bow/LBow
44 Arrow
45 Cursor
46 Barn
47-49 (Reserb)
50 AmuletR
51 AmuletG
52 AmuletB
53 CandleR
54 CandleB
55 RingR
56 RingB
57 Mirror
*/