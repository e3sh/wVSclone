//**************************************************************
//InputKeyboard
//キーボード入力。
//**************************************************************

function inputKeyboard() {

    var keymap = [];

// 特殊キー処理については別途検討。通常キーコードを返すのみ。

	//var now_key = "NaN";

    /*

    //keypressだと同時キー入力が処理できないので使わない
    window.onkeypress = function(event){

    //now_key = event.keyCode; // + String.fromCharCode(event.keyCode);

    }
    */
    //windowsフォーカスが外れるとキー入力リセットさせとく
    window.onblur = function () {

        keymap = [];
    }

    window.onkeydown = function (event) {

        keymap[event.keyCode] = true;

        //now_key = event.keyCode; // + String.fromCharCode(event.keyCode);

    }


	window.onkeyup = function(event){

	    keymap[event.keyCode] = false;

		//now_key = "NaN" + event.keyCode;

	}

    //key同時入力対応(戻り値は↑のように押されてたらtrue
	this.check = function () {

	    //return now_key;
	    return keymap;
	}

    //入力状態確認用
	this.state = function () {

	    st = "";

	    for (var i in keymap) {

	        st += "[" + i + "]" + ((keymap[i])?"*":".");

	    }

	    return st;

	}

}


