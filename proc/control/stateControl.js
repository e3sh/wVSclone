//StateControl
//状態のまとめクラス
//はじめに：
//色々とシステムの状態などが拡散してきたのでまとめてStateとして扱うことを考える。
//最初は本来Sceneで扱ってきたが、他（たとえばmapSce等）でもConfigの
//内容を参照したりする場合に引数として渡すと関連付けがどうなってるのか
//わからなくなってきたのでまとめてみる事（State集約）を考えることとする。
//持つべき状態：
//現在あつかっているConfig,Resultとあとあと必要となるだろうSystem,Gameなどであろう。
//
function stateControl(){

    //設定パラメータ
	this.Config = new stateConfig();

	//スコアなど（コンボとかはここ）
	this.Result = new stateResult();

	//デバイスパラメータやサウンド状況等(Devも）
	this.System = new stateSystem();

	//進行状態やプレイヤーステータス等(アイテムはここ）
	this.Game = new stateGame();

}
/*
var stateControl = {

	Config : new stateConfig(),

	Result : new stateResult(),

	System : new stateSystem(),

	Game : new stateGame()

}
*/