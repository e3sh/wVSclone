//　キャラクター定義
//
//　同様なキャラクターがでてくるのでキャラクターの性能は個別に別で設定
//　することとする。
//
//　キャラクター設定値
//	
//  cn characterNo(配列番号)/JSONでセットする方式に変更する場合のindexKey
//　mp　使用モーションパターン
//　hit　耐久力/弾の場合は攻撃力として扱う　
//	type （0:味方、1:自弾、2:敵機、3:敵弾、4:アイテム、5:只の絵）
// （当たり判定関係のパラメータ）
//　座標から中心位置への距離x,y　左上開始とした場合
//　中心からの当たり判定の範囲x,y　表示サイズはspPatternで設定
//　[status　状態(0:未使用/廃棄済 1:通常 2:衝突 3:X軸枠外 4:Y軸枠外 5:廃棄処理中）
//　scenario0　出現時使用するシナリオ　/　使用はこれのみ。
//　2024/04/04 削除)id  オブジェクトに個別IDを使用する場合に指定する。(キャラ/アイテムの種類/ID等)
//　score　倒したときのスコア
//　comment Memo
//
function character(){

	const PLAYER = 98;
	const FRIEND = 0;
	const BULLET_P = 1;
	const ENEMY = 2;
	const BULLET_E = 3;
	const ITEM = 4;
	const ETC = 5;

	let ch = [
//	CHNO,mp,Hp,Type,cex,cey,sizx,sizy,s0,id,score,comment,shadow
//自機
	[ 0, 1, 10, PLAYER	, 16, 16, 24, 16, 0, 0,"Player"],

//自弾
	[6, 26,  8, BULLET_P, 16, 16, 16, 16, "common_vset6"			, 0,"pBullet1"],
	[7, 26,  8, BULLET_P, 10, 12, 10, 12, "pl_bullet_rotate_circle"	, 0,"pBullet2"],
	[11, 7,  8, BULLET_P, 16, 16, 32, 32, 18						, 0,"(Damege)"],

//武器動作(Player用)
	[10, 42, 2, BULLET_P, 8, 24, 32, 32, "friend_rotate"	, 0,"(sword)"],
	[36, 35, 2, BULLET_P, 8, 24, 48, 48, "friend_straight"	, 0,"(Spear)"],
	[37, 36, 1, BULLET_P, 8,  8, 16, 16, 20//pl_bullet_horming "friend_boom"		
	, 0,"(Boom)"],
	[38, 40, 3, BULLET_P, 16, 8, 24, 24, "friend_rotate_full",0,"(axe)"],
	[39, 41, 1, BULLET_P, 8, 16, 24, 24, "friend_rotate"	, 0,"(wand)"],

//敵
	[ 1, 4,  8,	ENEMY	, 16, 16, 24, 16, 0, 10,"Normal"],
	[14, 4, 90, ENEMY	, 16, 16, 24, 24, 0, 50,"Boss_?", true],
    [30, 7,  1, BULLET_E,  8,  8,  6,  6,33,  0,"AllrangeBoss"],
	[33,31,240, ENEMY	, 16, 16, 24, 24, 0, 10,"TimeOver"],
    [34, 4,120, ENEMY	, 16, 16, 32, 32, 0, 30,"Boss X", true],

//敵弾
	[ 2, 7, 1, BULLET_E	, 4, 4,  6,  6, 4,  0,"eBullet1"],
	[ 3, 7, 2, BULLET_E	, 4, 4,  6,  6, 4,  0,"eBullet2"],
	[ 4, 7, 4, ENEMY	, 4, 4,  6,  6,14, 10,"eBullet?"],
	[ 5, 7, 1, BULLET_E	, 4, 4,  6,  6, 4,  0,"eBullet3"],
	[ 8,46, 1, BULLET_E	, 4, 4,  6,  6, "en_bullet_homing", 0,"hormingBullet"],
	[12, 7, 1, BULLET_E	, 4, 4,  6,  6,18,  0,"RandamBullet"],
	[32, 7, 5, BULLET_E	, 8, 8, 16, 16,49,  0,"HormingLaser"],

//武器動作(敵用)
	[41, 42, 2, BULLET_E,  8, 24, 16, 16, "friend_rotate"		, 0,"(sword)"],
	[42, 40, 2, BULLET_E, 16,  8, 16, 16, "friend_rotate_full"	, 0,"(axe)"],
	[43, 36, 1, BULLET_E,  8,  8, 16, 16, "friend_boom"			, 0,"(Boom)"],
	[44, 35, 3, BULLET_E,  8, 24, 16, 16, "friend_straight"		, 0,"(spear)"],
	[45, 41, 1, BULLET_E,  8, 16, 16, 16, "friend_rotate"		, 0,"(wand)"],

//アイテム
	[15, 38, 1, ITEM	, 12, 12, 24, 24, 30,   0,"wand"	,true],
	[16, 15, 1, ITEM	, 12, 12, 24, 24, 30,   0,"sword"	,true],
	[17, 37, 1, ITEM	, 12, 12, 24, 24, 30,   0,"axe"		,true],
	[18, 16, 1, ITEM	, 12, 12, 24, 24, 30,   0,"spear"	,true],
	[19, 17, 1, ITEM	, 12, 12, 24, 24, 30,   0,"boom"	,true],
	[20, 26, 1, ITEM	,  8, 8,  16, 16, 30,   4,"Ball"],
	[21,  1, 1, ITEM	, 16, 16, 32, 32, 30, 100,"1upItem"	,true],
	[22, 27, 1, ITEM	,  8, 8,  16, 16, 30,  10,"KeyItem"	,true],
	[23, 28, 1, ITEM	,  8, 8,  16, 16, 30,   8,"(B)"],
	[24, 29, 1, ITEM	,  8, 8,  16, 16, 30,   8,"(S)"],
	[25, 30, 1, ITEM	,  8, 8,  16, 16, 30,   8,"(L)"],
	[26, 33, 1, ITEM	, 12, 12, 24, 24, 30,  10,"Lamp"	,true],
	[27, 34, 1, ITEM	, 12, 12, 24, 24, 30,  10,"Map"		,true],
	[35, 32, 1, ITEM	,  8, 8,  16, 16, 30,  10,"Coin"],
	[40, 39, 1, ENEMY	, 12, 12, 24, 24, 30, 100,"TresureBox"],

	//ch_ptn:map/ 0-12:use,13:free,14-27:use,28-29:free,30:use,31:free,32-50:use,51-99:free,100:use,101-102:free,103:use,
	//46-50 
	[46, 44, 1, BULLET_P,  8, 8, 16, 16, "common_vset8",  0,"arrow friend"],
	[47, 43, 1, BULLET_P,  8, 8, 16, 16, "friend_front",  0,"bow friend"],
	[48, 44, 1, BULLET_E,  8, 8, 16, 16, "common_vset8",  0,"arrow enemy"],
	[49, 43, 1, BULLET_E,  8, 8, 16, 16, "friend_front",  0,"bow enemy"],
	[50, 18, 1, ITEM	, 12, 12, 24, 24, 30,   0,"item bow",true],
	[51, 50, 1, ITEM	, 12, 12, 24, 24, 30, 100,"AmuletR" ,true],
	[52, 51, 1, ITEM	, 12, 12, 24, 24, 30, 100,"AmuletG" ,true],
	[53, 52, 1, ITEM	, 12, 12, 24, 24, 30, 100,"AmuletB" ,true],
	[54, 53, 1, ITEM	, 12, 12, 24, 24, 30, 100,"CandleR" ,true],
	[55, 54, 1, ITEM	, 12, 12, 24, 24, 30, 100,"CandleB" ,true],
	[56, 55, 1, ITEM	, 12, 12, 24, 24, 30, 100,"RingR"	,true],
	[57, 56, 1, ITEM	, 12, 12, 24, 24, 30, 100,"RingB"	,true],
	[58, 57, 1, ITEM	, 12, 12, 24, 24, 30, 100,"Mirror"	,true],

	//option chr_ptn(mp dummy)
	[99, 26, 1, ETC		, 8, 8, 16, 16, 30, 0,"Option"],
	//InformationCursor処理用
	[100, 45, 1, ETC	, 8, 8, 16, 16, "effect_informationCursor", 0,"InfoCursor"],

//以下ExtEventの処理用//今の運用では使用しない方法でも同様なことはできる為、過去互換用
	[103, 8, 1, BULLET_E, 8, 8, 6, 6, 103,  0,"5Way"],
//Dummy
	[  9,11, 1,	  ITEM, 16, 8, 32, 16,  4,100,"Dummy"]
    ];


	const typeText = ["FRIEND","BULLET_P","ENEMY","BULLET_E","ITEM","ETC"];//0-5
	typeText[98] = "PLAYER";

//	CHNO,mp,Hp,Type,cex,cey,sizx,sizy,s0,s1,s2,s3,s4,s5,id,sc
	let chr_ptn = []; //　キャラパターン

	for (let j in ch){
		let w = ch[j];
    	
		let ptn = {};
	
		ptn.cn = w[0];
		ptn.mp = w[1];
		ptn.hp = w[2];
		ptn.type = w[3];
		ptn.center_x = w[4];
		ptn.center_y = w[5];
		ptn.size_x = w[6];
		ptn.size_y = w[7];
		ptn.senario = [ w[8]],// w[9], w[10], w[11], w[12], w[13] ];//senario[0]以外は運用していない2023/02/12
		ptn.id = 0;//w[14];// 設置時に個別に指定する。
		ptn.score = w[9];
		ptn.comment =  typeText[w[3]] + " " + w[10];
		ptn.shadow = Boolean(w[11]);

		chr_ptn[ w[0] ] = ptn; 


	}
	return chr_ptn;

	//ch_ptn:map/ 0-12:use,13:free,14-27:use,28-29:free,30:use,31:free,32-58:use,59-99:free,100:use,101-102:free,103:use,
	/*
	function useCheck(){
		let f = true;
		let st = 0;
		let s = "ch_ptn:map/ ";
		let ws = "";
		for (let i =0; i<105; i++){
			if (Boolean(chr_ptn[i]) == f) {
				ws = st + "-" + i + ":" + ((f)?"use":"free");
			}else{
				s = s + ws + ",";
				f = f?false:true;
				st = i;
				ws = i + ":" + ((f)?"use":"free");
			}
		}
		return(s);
	}
	//console.log(useCheck());
	*/
}
function characterItemnameTable(){
	 
    const ItemnameTable = { //state.Database.chrItemtable
            //  (ITEMLIST) 
            0: "操作説明",
            1: "魔法陣説明",
            2: "扉説明",
            15: "杖", // MP38 Wand
            16: "剣", // MP15 Knife
            17: "戦斧", // MP37 Axe
            18: "槍", // MP35 Spear
            19: "ﾌﾞｰﾒﾗﾝ", // MP36 Boom
            20: "球", // MP26 Ball1-3
            21: "1UP", // MP 1 Mayura1-4
            22: "鍵", // MP27 Key
            23: "爆弾", // MP28 BallB1-3
            24: "ﾊﾞﾘｱ", // MP29 BallS1-3
            25: "回復", // MP30 BallL1-3
            26: "ﾗﾝﾌﾟ", // MP33 Lamp
            27: "地図", // MP34 Map
            35: "ｺｲﾝ", // MP32 Coin1-4
            40: "宝箱", // MP39 TrBox
            50: "弓矢", // MP43 Bow
            51: "AmuletR", // MP50 AmuletR
            52: "AmuletG", // MP51,AmuletG
            53: "AmuletB", // MP52,AmuletB
            54: "ﾛｳｿｸR", // MP53,CandleR
            55: "ﾛｳｿｸB", // MP54,CandleB
            56: "指輪R", // MP55,RingR
            57: "指輪B", // MP56,RingB
            58: "鏡" // MP57,Mirror
        };

	return ItemnameTable;
}



	//追加すべきパラメータに関する考察
	//キャラクタータイプに関してはファイルを分割することが出来るようにするか？
	//jsonで読み込んでもよいし、ただの配列から読み込んでもいいかもしれない。xmlhttpreqestの
	//利用をしてもいいかもしれない。（ただデバッグ時でもhttpdが前提になってしまうのもちょっと面倒）
	//
	//このファイルには基本パラメータだけで良いから別ファイルで
	//(キャラクターフォルダを作る）
	//まあ自機のパラメータっていってもそんなに種類要らないから
	//中に含めてしまってもいいか.
	//最終的には同じなので自分の管理しやすいようにしとけばいい。

	//自機に関しては各ステータスとequipやitemに関するパラメータが必要
	//いまはシナリオに直接だが、装備で色々代えてもいいかもしれない。

	//シナリオ関係では、シナリオ内で呼び出したシナリオで各変数を維持したまま（あまり初期化せず）
	//実行して状況によってシナリオを戻す方法も考えたい。
	//シナリオ切り替え方法でinitを実行せずにstepを切り替えるとするのがあっても良いのかも。
	//change_sce_non_initのコマンドを新設するor non_initializeパラメータのboolで決定するなどにする。

	//アイテムにはステータスと同じように効果各パラメータ
	//hp mhp mp mmp atk def matk mdef atkspeed movspeed (elmpropty, phsypropty)　id type など
	//id で持ってる状態を管理してアイテムデータは別にするべきか。(item_idとして）

	//typeはweapon/armor/shield/ring/scroll/potion/food/etc

	//敵の場合は各ステータスとドロップアイテム(特殊能力はシナリオででよい）まとまってから織り込めばいい。

	//敵味方の弾についてはサブ属性として色々付けとけばいい。貫通とか爆発とか

	//アイテムについては上記