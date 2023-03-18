// touchPadControl 
//**************************************************************
function inputTouchPad(canvas_id) {

    var pos = [];

    var cvs1 = document.getElementById(canvas_id);
    var cvs = document;

    this.o_Left = cvs1.offsetLeft;
    this.o_Top = cvs1.offsetTop;

    var viewf = false;

    //iPodTouch用(マルチポイントタッチ)
    cvs.ontouchmove = function (event) {
        event.preventDefault();
        touchposget(event);
        viewf = true;
    }

    cvs.ontouchstart = function (event) {
        event.preventDefault();
        touchposget(event);

        viewf = true;
        now_button = 0;
    }

    cvs.ontouchend = function (event) {
        event.preventDefault();
        touchposget(event);
        
        viewf = false;
        now_button = -1
    }

    function touchposget(event) {

        pos = [];

        if (event.touches.length > 0) {
            for (var i = 0; i < event.touches.length; i++) {
                var t = event.touches[i];

                pos[i] = {};

                pos[i].x = t.pageX;
                pos[i].y = t.pageY;
            }
        }
    }

    this.check = function () {
        var state = {};

        state.pos = pos;
        return state;
    }

    this.check_last = function () {
        var state = {};

        state.pos = pos;
        return state;
    }

    this.draw = function (context) {

        if (!viewf) return;

        var st = this.check_last();

        var s = "p " + pos.length + "/";

        for (var j = 0; j <= pos.length -1 ; j++) {
            if (st.button[j]) {
                s = s + "b" + j + " ";
                
                var cl = {};
                cl.x = pos[j].x;
                cl.y = pos[j].y;
                cl.r = 30;
                cl.draw = function(device){
                    var context = device;

                    context.beginPath();
                    context.arc(this.x, this.y, this.r, 0, 2 * Math.PI, true);
                    context.fillStyle = "orange";
                    context.fill();
                }
                context.putFunc(cl);
            }
        }
        //context.fillStyle = "green";
        context.print(s, 12, 16);
        // 移動した座標を取得
    }
}
