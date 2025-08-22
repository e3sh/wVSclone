//StateControl
//状態のまとめクラス
function stateControl( g ){

	//定数値
	this.Constant = new ConstantData();

    //設定パラメータ
	this.Config = new stateConfig( g );

	//スコアなど
	this.Result = new stateResult( g );

	//デバイスパラメータやサウンド状況等(Devも）
	this.System = new stateSystem( g );

	//進行状態やプレイヤーステータス等(保持アイテムはここ）
	this.Game = new stateGame( g );

	this.Database = {
		chrPattern: character(),
		motionPattern: motionPattern(),
		chrItemtable: characterItemnameTable()

		//Condsantで持ってる
		//objtype:{PLAYER:98, FRIEND:0, BULLET_P:1, ENEMY:2, BULLET_E:3, ITEM:4, ETC:5}

		//ObCtrlで持ってる(生成時obCtrlが必要な為)
		//scenario:

		//mapscで持ってる
		//map=mapsc
	};

	this.Utility = {
		//export
	}

	//2025/08/22 obCtrl new引数変更 
	//2025/06/25:obCtrl宣言はstate.Databaseを参照するのでするので後ろで実行
	//2023/02/14:GameSceneから↓へ変更　この時点ではresetしていない。
	this.obCtrl = new gObjectControl(this);
	//↑第一引数にscreenを入れているのは移動時の画面サイズ取得の為なので適したscreenを指定する	

	this.mapsc = new mapSceControl();

	//gObj内機能の切り出しなのでobCtrlを参照する。obCtrl宣言後に生成すること
	this.obUtil = new gObjectUtility(this);

	//sceneControlでのタスクセット/scene渡りでの継続処理用(実験要素)
}
