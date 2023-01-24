﻿//　キャラクター定義
//
//　最初はマップ定義にキャラクター定義を含もうと考えたが、
//　同様なキャラクターがでてくるのでキャラクターの性能を別ので設定
//　することとする。
//
//　キャラクター設定値
//	
//　mp　使用モーションパターン
//　hit　耐久力/弾の場合は攻撃力として扱う　
//	type （0:味方、1:自弾、2:敵機、3:敵弾、4:アイテム、5:只の絵）
// （当たり判定関係のパラメータ）
//　座標から中心位置への距離x,y
//　中心からの当たり判定の範囲x,y
//　[status　状態(0:未使用/廃棄済 1:通常 2:衝突 3:X軸枠外 4:Y軸枠外 5:廃棄処理中）
//　scenario0　出現時使用するシナリオ
//　scenario1　予備シナリオ
//　scenario2　衝突
//　scenario3　X軸枠外
//　scenario4　Y軸枠外
//　scenario5　終了処理
//　id 　 オブジェクトに個別IDを使用する場合に指定する。(アイテムの種類/ID等)2023/1/17時点で未使用
//　score　倒したときのスコア
//　フレームカウントは約60で1秒進む予定
//
function character(){

	const PLAYER = 98;
	const FRIEND = 0;
	const BULLET_P = 1;
	const ENEMY = 2;
	const BULLET_E = 3;
	const ITEM = 4;
	const ETC = 5;

	var ch = [
//	CHNO,mp,Hp,Type,cex,cey,sizx,sizy,s0,s1,s2,s3,s4,s5,id,sc
//自機
	[ 0, 1, 10, PLAYER	, 16, 16,  32,  32, 0, 0,24,15,15,24, 0, 0],//自機

//自弾
	[6, 26,  8, BULLET_P, 16, 16, 16, 16, "common_vset8", 13, 5, 5, 5, 5, 0, 0],//自弾
//誘爆用ダメージ（敵機のダメージ用）
	[11, 7,  8, BULLET_P, 16, 16, 32, 32, 18, 18, 5, 5, 5, 5, 0, 0],//誘爆用ダメージ（敵機のダメージ用）

//武器動作(Player用)
    //支援機(sword)
//	[10, 15, 10, 0, 16, 16, 16, 16, "friend_rotate", 21, 7, 15, 15, 7, 1, 0],
	[10, 42, 2, BULLET_P, 8, 24, 32, 32, "friend_rotate", 21, 7, 15, 15, 7, 1, 0],//支援機(sword)
	//支援機2(Spear)
	[36, 35, 2, BULLET_P, 8, 24, 48, 48, "friend_straight", 21, 7, 15, 15, 7, 1, 0],//支援機2(Spear)
	//支援機3(Boom)
	[37, 36, 1, BULLET_P, 8, 8, 16, 16, "friend_boom", 21, 7, 15, 15, 7, 1, 0],//支援機3(Boom)
	//支援機4(axe)
	[38, 40, 3, BULLET_P, 16, 8, 24, 24, "friend_rotate_full", 21, 7, 15, 15, 7, 1, 0],//支援機4(axe)
	//支援機5(wand)
//	[39, 38, 10, 0, 8, 8, 16, 16, "friend_rotate", 21, 7, 15, 15, 7, 1, 0],
	[39, 41, 1, BULLET_P, 8, 16, 24, 24, "friend_rotate", 21, 7, 15, 15, 7, 1, 0],//支援機5(wand)

//敵
    //通常
	[  1, 4, 8,	ENEMY	, 16, 16,  32,  32, 0, 0, 7, 5, 5, 7, 0, 10],
    //Boss_?
	[14, 4, 90, ENEMY	, 16, 16, 24, 24, 0, 0, 35, 5, 5, 35, 0, 50],
    //全方位弾ボス
    [30, 7, 1, BULLET_E, 16, 16, 32, 32, 33, 33, 5, 5, 5, 5, 0, 0],
	//timeover
	[33, 31, 70, ENEMY	, 16, 16, 24, 24, 0, 0, 35, 5, 5, 35, 0, 10],
	//enemy boss x
    [34, 4, 40, ENEMY	, 16, 16, 32, 32, 0, 0, 7, 5, 5, 7, 0, 30],

//敵弾
	[  2, 7, 1,	BULLET_E,  4,  4,   2,	2, 4, 4, 5, 5, 5, 5, 0, 0],
	[  3, 7, 2, BULLET_E,  8,  8,   6,	 6, 4, 4, 5, 5, 5, 5, 0, 0],
	[  4, 7, 4, ENEMY	,  8,  8,   6,	 6,14,14, 7, 5, 5, 7, 0,10],
	[  5, 7, 1, BULLET_E, 8, 8, 8, 8, 4, 4, 5, 5, 5, 5, 0, 0],
	//ランダム弾
	[12, 7, 1, BULLET_E, 4, 4, 2, 2, 18, 18, 5, 5, 5, 5, 0, 0],
	//敵誘導Laser用
   	[32, 7, 5, BULLET_E, 8, 8, 6, 6, 49, 49, 5, 5, 5, 5, 0, 0],

//武器動作(敵用)
	//(sword)
	[41, 42, 2, BULLET_E, 8, 24, 16, 16, "friend_rotate", 21, 7, 15, 15, 7, 1, 0],
	//(axe)
	[42, 40, 2, BULLET_E, 16, 8, 16, 16, "friend_rotate_full", 21, 7, 15, 15, 7, 1, 0],
	//(Boom)
	[43, 36, 1, BULLET_E, 8, 8, 16, 16, "friend_boom", 21, 7, 15, 15, 7, 1, 0],
	//(spear)
	[44, 35, 3, BULLET_E, 8, 24, 16, 16, "friend_straight", 21, 7, 15, 15, 7, 1, 0],
	//(wand)
	[45, 41, 1, BULLET_E, 8, 16, 16, 16, "friend_rotate", 21, 7, 15, 15, 7, 1, 0],

//アイテム
    //(powup)
	[  7,11, 1,	  ITEM, 16,  8,  32,  16, 4, 4,22, 5, 5, 5, 0,100],
	//Weapon
	[15, 38, 1, ITEM, 8, 8, 16, 16, 30, 30, 5, 5, 5, 5, 0, 0], //wand
	[16, 15, 1, ITEM, 16, 16, 32, 32, 30, 30, 5, 5, 5, 5, 0, 0], //sword
	[17, 37, 1, ITEM, 8, 8, 16, 16, 30, 30, 5, 5, 5, 5, 0, 0], //axe
	[18, 35, 1, ITEM, 16, 24, 16, 48, 30, 30, 5, 5, 5, 5, 0, 0], //spear
	[19, 36, 1, ITEM, 8, 8, 16, 16, 30, 30, 5, 5, 5, 5, 0, 0], //boom
	//Ball
	[20, 26, 1, ITEM, 8, 8, 16, 16, 30, 30, 5, 5, 5, 5, 0, 1],
	//1upItem
	[21, 1, 1, ITEM, 16, 16, 32, 32, 30, 30, 5, 5, 5, 5, 0, 100],
	//KeyItem
	[22, 27, 1, ITEM, 16, 16, 32, 32, 30, 30, 5, 5, 5, 5, 0, 10],
	//(B)
	[23, 28, 1, ITEM, 8, 8, 16, 16, 30, 30, 5, 5, 5, 5, 0, 8],
	//(S)
	[24, 29, 1, ITEM, 8, 8, 16, 16, 30, 30, 5, 5, 5, 5, 0, 8],
	//(L)
	[25, 30, 1, ITEM, 8, 8, 16, 16, 30, 30, 5, 5, 5, 5, 0, 8],
	//Lamp
	[26, 33, 1, ITEM, 12, 12, 24, 24, 30, 30, 5, 5, 5, 5, 0, 10],
	//Map
	[27, 34, 1, ITEM, 12, 12, 24, 24, 30, 30, 5, 5, 5, 5, 0, 10],
	//[o]コイン
	[35, 32, 1, ITEM, 8, 8, 16, 16, 30, 30, 5, 5, 5, 5, 0, 10],

	//宝箱
	[40, 39, 1, ENEMY, 16, 16, 16, 16, 30, 30, 5, 5, 5, 5, 0, 100],

	//Use Number 0-12,14-27,30,32-45,103
	//46-50 
	[46, 44, 1, BULLET_P, 24, 8, 48, 16, "common_vset8", 15, 5, 5, 5, 5, 0, 0],//arrow friend
	[47, 43, 1, BULLET_P,  8, 8, 16, 16, "friend_straight", 30, 5, 5, 5, 5, 0, 0],//bow enemy
	[48, 44, 1, BULLET_E, 24, 8, 48, 16, "common_vset8", 30, 5, 5, 5, 5, 0, 0],//arrow enemy
	[49, 43, 1, BULLET_E,  8, 8, 16, 16, "friend_straight", 30, 5, 5, 5, 5, 0, 0],//bow enemy
	[50, 43, 1, ITEM, 24, 8, 48, 16, 30, 30, 5, 5, 5, 5, 0, 100],//item bow
	

//以下ExtEventの処理用//今の運用では使用せずに運用できる為、ほぼ過去互換用
	[103, 8, 1, BULLET_E, 8, 8, 6, 6, 103, 103, 5, 5, 5, 5, 0, 0], //使用されている様子
//Dummy
	[  8,11, 1,	  ITEM, 16,  8,  32,  16, 4, 4,22, 5, 5, 5, 0,100],
	[  9,11, 1,	  ITEM, 16,  8,  32,  16, 4, 4,22, 5, 5, 5, 0,100],
    ];

//	CHNO,mp,Hp,Type,cex,cey,sizx,sizy,s0,s1,s2,s3,s4,s5,id,sc

	var chr_ptn = []; //　キャラパターン

	for (var j in ch){
		var w = ch[j];
    	
    		var ptn = {};
    	
    		ptn.mp = w[1];
    		ptn.hp = w[2];
    		ptn.type = w[3];
    		ptn.center_x = w[4];
    		ptn.center_y = w[5];
    		ptn.size_x = w[6];
    		ptn.size_y = w[7];
    		ptn.senario = [ w[8], w[9], w[10], w[11], w[12], w[13] ];
    		ptn.id = w[14];
    		ptn.score = w[15];
    		chr_ptn[ w[0] ] = ptn; 

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




	}
	return chr_ptn;
}
 