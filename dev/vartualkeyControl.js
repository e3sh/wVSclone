//inputKeyboardとvartualKeyControlを束ねて
//従来のinputKeyboardと差し替えて使用する為のクラス。
//
function keyEntryManager(inpMouse, inpKey, inpVkey) {

    var inm = inpMouse;
    var ink = inpKey;
    var inv = inpVkey;

    var keymap = [];

    this.check = function () {

        inv.check(inm.check_last());//mouseからvkeyコードを取得（inv内部情報更新)
        keymap = inv.marge(ink.check());//inkとinvのコードを合流させる

        return keymap;
    }

    this.state = function () {

        st = "";

        for (var i in keymap) {
            st += "[" + i + "]" + ((keymap[i]) ? "*" : ".");
        }

        return st;
    }
}

// マウス入力でキー入力の代わりをする。
//　vartualKeyboard簡易版function
// あらかじめ決めた範囲をクリックで
// 特定キーコードを返す。

function vartualKeyControl(){

	var key_state = [];

	var checkmap = [];

	this.enable = true; //falseの場合は、margeでvkeyを反映しない。

	this.lockstate = false; //trueでキー押しっぱなし。

	this.init = function (postokeylist) {
	    // 0, 1, 2, 3, 4
	    // [x ,y ,width, height, returnkeycode[] ],
	    // returnkeycode = -1 keylock
	    // 単一ボタン同時押しが出来るように
	    // returnkeycodeは複数設定できるようにする。
	    //(マルチタップ対応した場合はまた別途検討
	    // まあチェックエリア重ねれば同時押しになるけど。

	    checkmap = [];
	    for (var i in postokeylist) {

	        var w = postokeylist[i];
	        var d = {};

	        d.x = w[0]; //left
	        d.y = w[1]; //top
	        d.w = w[2]; //widrh
	        d.h = w[3]; //height
	        d.keycode = w[4]; //return keycode array

	        checkmap.push(d);
	    }

	}

	this.check = function (mouse_state) {

	    if (!this.lockstate) key_state = [];

	    if (mouse_state.button != 0) {
	        for (var i in checkmap) {
	            var c = checkmap[i];

	            for (var j in c.keycode) {

	                key_state[c.keycode[j]] = false;
	            }
	        }
	        return key_state; //ボタン押下で無い場合はすべてのキー上げ
	    }

	    for (var i in checkmap) {
	        var c = checkmap[i];

	        if ((mouse_state.x >= c.x) && (mouse_state.y >= c.y)
                && (mouse_state.x <= c.x + c.w) && (mouse_state.y <= c.y + c.h)) {
	            for (var j in c.keycode) {

	                key_state[c.keycode[j]] = true;
	            }
	        } else {
                /*
	            for (var j in c.keycode) {

	                key_state[c.keycode[j]] = false;
	            }
                */
	        }
	    }
	    return key_state;
	}

	this.shift = function( st ){
        
        this.lockstate = st;
	}

	this.marge = function (hardkeystate) {

	    if (!this.enable) return hardkeystate;

	    var nextstate = [];

	    for (var i in hardkeystate) {
	        nextstate[i] = hardkeystate[i];
	    }

	    for (var i in key_state) {
	        if (key_state[i]) {
	            nextstate[i] = key_state[i];
	        } else {
	            if (!Boolean(hardkeystate[i])) {
	                if (!hardkeystate[i]) nextstate[i] = key_state[i];
	            }
	        }
	    }
	    return nextstate;
	}

	this.draw = function (scrn) {

	    for (var i in checkmap) {
	        var c = checkmap[i];

	        var w = {};
	        w.x = c.x;
	        w.y = c.y;
	        w.w = c.w;
	        w.h = c.h;
	        w.draw = function (device) {

	            device.beginPath();

	            device.strokeStyle = "white";
	            device.lineWidth = 1;
	            device.rect(this.x, this.y, this.w, this.h);
	            device.stroke();
	        }

	        scrn.putFunc(w);

	        var s = ""
	        for (var j in c.keycode) {

	            //s += String.fromCharCode(c.keycode[j]) + "[" + c.keycode[j] + "]";
	            s += "[" + c.keycode[j] + "]" + ((key_state[c.keycode[j]]) ? "On" : ".");
	        }
	        scrn.print(s, c.x, c.y);
	    }
	}
}









