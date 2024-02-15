﻿//　マップ初期配置、マップシナリオ　//ひな形　未使用
//
//　マップに配置するオブジェクトの座標や属性を設定する為のデータ。
//　
//　配置するタイミングと配置するオブジェクトのプロパティを設定する。
//　（タイミングはスタートからのフレームカウントで指定）
//
//　マップ設定値
//  
//　x,y　　座標　
//　r　　　角度（移動方向に使用するか表示に使用するかはイベントによる。
//　scenario　使用するシナリオ
//　chr No. 使用するキャラクター
//
//　フレームカウントは約60で1秒進む予定
//
//  特殊機能 
//　座標がマイナスの場合はフレームカウントのリセット（0に戻る）
//  フレームカウントがマイナスの場合は最初のみ実行
//
//
//　マップシナリオフォーマット仮設定
//　開始フレームカウント、オブジェクトの割り当て・・
function mapScenro(){

	var ms = 
//  開始フレーム,座標,,角度,シナリオ,キャラ
	[[ -1,240,608,  0,8,0 ],
	[  -1,208,608,  0,17,10],
	[  -1,272,608,  0,17,10],
	[  -1,240,240,  0,28,18],
	[  -1,320,320,  0,29,19],
	[  50,240,  0,180,11, 1],
	[ 100,440,140,225,10, 1],
	[ 100, 40,140,135, 9, 1],
	[ 120,440,140,225,10, 1],
	[ 120, 40,140,135, 9, 1],
	[ 140,440,140,225,10, 1],
	[ 140, 40,140,135, 9, 1],
	[ 160,440,140,225,10, 1],
	[ 160, 40,140,135, 9, 1],
	[ 180,440,140,225,10, 1],
	[ 180, 40,140,135, 9, 1],
	[ 250,140,000,180, 2, 1],
	[ 250,340,000,180, 3, 1],
	[ 280,140,000,180, 2, 1],
	[ 280,340,000,180, 3, 1],
	[ 310,140,000,180, 2, 1],
	[ 310,340,000,180, 3, 1],
	[ 340,140,000,180, 2, 1],
	[340, 340, 000, 180, 3, 1],
	[390, 464, 200, 0, "effect_warnning_mark", 1],
	[440, 479,200,270, 15, 1],
	[450, 16, 220, 0, "effect_warnning_mark", 1],
	[500,   1,220,90, 15, 1],
	[ 700,240,  0,180,23,14],
	[ 900,120,  0,180,19, 1],
	[ 900,360,  0,180,19, 1],
	[1120,480,  0,180,37, 2], //eventmessagetest
	[1500, 240, 40, 180, 34, 14], //回転ボス
	[1600, 480, 0, 180, 53, 2], //endmessage
	[1700, 480, 0, 180, 54, 2], //result画面要求
	[1800, -1, -1,180, 0, 4],
	[600000,-1,-1,  0, 0, 0]];
//
// フレームカウントでソートされていること。

	var map_sc = []; //　出現パターン

	for (var j in ms){
		var w = ms[j];
    	
    		var ptn = {};
    	
    		ptn.count = w[0];
    		ptn.x = w[1] * 0.875;
    		ptn.y = w[2] * 0.75; 
    		ptn.r = w[3];
    		ptn.sc = w[4];
    		ptn.ch = w[5];
    	
    		map_sc.push( ptn ); 
	}
return map_sc;

}

function mapBgImage() {

    var tex_bg = new Image();
    tex_bg.src = "pict/sky.jpg";

    return tex_bg;
}

function mapBgLayout() {

//    マップチップの座標リスト
//スクロール時のbg調整用
    //mapImageNo, world ltx, world lty

    var mc = [
    [0,0,0],
    [0,0,480],
    [0, 0, 960],
    ];

    var map_cp = []; //　マップチップ

    for (var j in mc) {
        var w = mc[j];

        var chip = {};

        chip.no = w[0];
        chip.x = w[1];
        chip.y = w[2];

        map_cp.push( chip );
    }
    return map_cp;
}

function mapInitial( flag ) {

    //マップの初期配置とマップチップの座標リストなど

//自機の発進処理もここに入れ込んでしまう方がスマートだと思われる。

    //flagはマップの初期化をするかどうか(trueでリスタート？）
}