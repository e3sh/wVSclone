//StateControl
//状態のまとめクラス
function stateControl( g ){

    //設定パラメータ
	this.Config = new stateConfig( g );

	//スコアなど（コンボとかはここ）
	this.Result = new stateResult( g );

	//デバイスパラメータやサウンド状況等(Devも）
	this.System = new stateSystem( g );

	//進行状態やプレイヤーステータス等(保持アイテムはここ）
	this.Game = new stateGame( g );

	//2023/02/14:GameSceneから↓へ変更　この時点ではresetしていない。
	this.obCtrl = new gObjectControl(this.System.dev.graphics[1], this);
	//↑第一引数にscreenを入れているのは移動時の画面サイズ取得の為なので適したscreenを指定する	

	this.mapsc = new mapSceControl();

	this.Utility = {
		//export
	}

	this.Database = {
		//obCtrlが持ってる
		//scenario
		//chr_ptn
		//motion_ptn　→　sp_ptn

		//mapscで持ってる
		//map=mapsc
		
		//未作成
		//itemList
		//paramator
	}


}
