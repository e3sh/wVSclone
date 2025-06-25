//stateResult
//スコアなど（現在はアイテムなども入ってるがここではない方が良さそう。コンボとかはここ）
function stateResult() {


    this.highscore = 0;
    this.score = 0;
    //this.item = obCtrl.item;
    //現在gameSceneでここに色々登録されている。

    let ret_code = 0;
    //ローカルストレージからのロード（今のところハイスコアのみ）
    this.load = function () {

        if (Boolean(localStorage)) {

            let f = false;

            if (Boolean(localStorage.getItem("highscore"))) {
                f = true;
                this.highscore = parseInt(localStorage.getItem("highscore"));
            }
            ret_code = f ? 0 : 1; //	        alert(f ? "gload" : "gnondata");
        } else {
            ret_code = 2; //	        alert("gnon localstorage");
        }
        //正常時:0 /異常時:any
        return ret_code;
    }

    //ローカルストレージへのセーブ
    this.save = function () {

        let ret_code = 0;

        if (Boolean(localStorage)) { //ローカルストレージ使えたらハイスコア記録しとく
            localStorage.setItem("highscore", new String(this.result.highscore));
        } else {
            ret_code = 2;
        }

        //正常時:0 /異常時:any
        return ret_code;
    }
}