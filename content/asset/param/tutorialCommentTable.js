function tutorialCommentTable(){
//tutorialTextTable　since2024/03/26
//tutorial no(text no)
//1玉　2B　3S　4L　5Coin 6Key 7_1UP 8Lamp 9map 10+ 11A 12B 13X 14Y

	let t =[];

	//基本操作
	t[0] = ["「操作」: 移動:キーボード WASD/矢印 (GAMEPAD) ⑩レバー"
		,"Z ⑬ 攻撃/回収 X ⑫ アイテム使用 C ⑪ ジャンプ"
		,"ESC(START) PAUSE(一時停止)/ F:フルスクリーン "
	//	,"ゲームの目的:時間内に鍵を入手して扉へ向かいステージクリアする"
		]; //triger player.js
	//施設の説明
	t[1] = ["「魔法陣」：出現地点の部屋にあり、接触時レベルアップチェック"
		,"部屋には一般の敵は入れない。(時間切れ時の敵は除く)"
		]; //triger player.js

	t[2] = ["「扉」:⑥鍵があれば次のステージに行ける"]; //triger player.js

	//ゲームについて
	t[3] = ["「TIME」:TIMEが0になるまでにステージクリアしていないと"
		,"地形に影響されずに追跡してくる敵が発生する"
		];//triger GameScene.js

	t[4] = ["「武器の強化」:手持ちの強さをベースに強化される"
		,"(相互加算ではなく強化された同武器を後から入手しても +1 )"
		,"強化状態は敵に拾われてしまうとリセットされる"
		];//triger player.js

	t[5] = ["「レベルアップ」:経験値が一定以上でレベルアップし"
		,"アイテムの効果を強化できる。効果はプレイ中は継続する。"
		]; //triger player.js

	t[6] = ["「ボス」:５の倍数ステージでは、ボスが鍵を持っている"
		];//triger GameScene.js

	t[7] = ["「スピードアップ」:①の数に応じて自機の速度が向上"
		]; //triger player.js

	t[8] = ["「オプション」:①が10個毎にオプションが1つ付く"
		,"10個以下になると消滅(最大4つ)"
		]; //triger player.js

	t[9] = ["「LOADGAME」:ステージの最初から開始される"
		]; //triger player.js


	//triger gObjClass.js get_item();
	//武器の説明
	t[15] = ["「武器:杖」:操作:Z ⑬ 攻撃 ①-消費"
		,"シールド使用の移動速度ペナルティなし"
		,"装備時に同武器入手で①+7"
		];

	t[16] = ["「武器:剣」:操作:Z ⑬ アイテム回収 ①-消費"
		,"攻撃は自動で発生/移動方向前方に90度の扇状攻撃"
		,"装備時に同武器入手で強化(攻撃速度/範囲の向上)"
		];

	t[17] = ["「武器:斧」:操作:Z ⑬ アイテム回収 ①-消費"
		,"攻撃は自動で発生/自機を中心に360度の範囲攻撃"
		,"装備時に同武器入手で強化(攻撃速度/範囲の向上)"
		];
		
	t[18] = ["「武器:槍」:操作:Z ⑬ アイテム回収 ①-消費"
		,"攻撃は自動で発生/移動方向前方攻撃"
		,"装備時に同武器入手で強化(攻撃速度/範囲の向上)"
		];

	t[19] = ["「武器:ブーメラン」:操作:Z ⑬ 攻撃"
		,"オプションの攻撃は自動で発生/移動方向に遠隔攻撃"
		,"装備時に同武器入手で強化(オプションの攻撃速度)"
		];

	t[50] = ["「武器:弓」:操作:Z ⑬ アイテム回収 ①-消費"
		,"攻撃は自動で発生/移動方向に遠隔攻撃(自機3way)"
		,"装備時に同武器入手で強化(攻撃速度)"
		];

	//アイテムの説明
	t[20] = ["アイテム:①」:パワーアップアイテム"
		,"取得でスピードアップ及びオプション追加"
		,"アイテム回収や攻撃で消費する。EXP+4"
		];

	t[21] = ["「アイテム:⑦自機」:1UPアイテム。自機+1。EXP+100"
		];

	t[22] = ["「アイテム:⑥鍵」:扉に入り次のステージへ行ける。EXP+10"
		];

	t[23] = ["「アイテム:②爆弾」:使用で範囲内の敵に一律のダメージを与える"
		,"レベルアップでダメージ強化。入手時EXP+8"
		];

	t[24] = ["「アイテム:③シールド」:使用で一定時間内、敵の攻撃を無効に出来る"
		,"レベルアップで効果時間延長。入手時EXP+8"
		];

	t[25] = ["「アイテム:④ライフ」:使用で一定値のHPの回復とHP最大値+1"
		,"レベルアップで回復量増加。入手時EXP+8"
		];

	t[26] = ["「アイテム:⑧ランプ」:敵の位置と鍵の場所を表示"
		,"ステージ毎に入手。入手時EXP+10"
		];

	t[27] = ["「アイテム:⑨地図」:ステージの地図を表示"
		,"ステージ毎に入手。入手時EXP+10"
		];

	t[35] = ["「アイテム:⑤コイン」:ポイントアイテム。EXP+10"];

	//t[40] = ["「アイテム:宝箱」:アイテムを持っていた敵がドロップ。EXP+100"
	//	];

	return t;
}
