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
function stateControl( g ){

    //設定パラメータ
	this.Config = new stateConfig( g );

	//スコアなど（コンボとかはここ）
	this.Result = new stateResult( g );

	//デバイスパラメータやサウンド状況等(Devも）
	this.System = new stateSystem( g );

	//進行状態やプレイヤーステータス等(アイテムはここ）
	this.Game = new stateGame( g );

	//2023/02/14:GameSceneから↓へ変更　この時点ではinitもresetもしていない。
	this.obCtrl = new gObjectControl(this.System.dev.graphics[1], this);
	this.mapsc = new mapSceControl();
}
/*
var stateControl = {

	Config : new stateConfig(),

	Result : new stateResult(),

	System : new stateSystem(),

	Game : new stateGame()

}
*/