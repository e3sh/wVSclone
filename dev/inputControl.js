//**************************************************************
//InputControl
//マウス入力でジョイスティックからの入力のように処理する。つもり
//**************************************************************

function inputControl( canvas_id ){
/*
	var canvas = document.createElement("canvas");
	canvas.width = 320;
	canvas.height = 320;
	var context = canvas.getContext("2d");

	context.font ="24px 'Arial'";
*/	
	var old_x;
	var old_y;

	var new_x;
	var new_y;

	var now_x = 0;
	var now_y = 0;

	var now_button;
	var button = -1;

	var now_wheel;
	var wheel = 0;

	var deg = "NaN";
	var dstns = 0;

	var pause_count = 0;

//	var cvs = document.getElementById( canvas_id);
	var cvs = document;

	this.o_Left = cvs.offsetLeft;
	this.o_Top = cvs.offsetTop;

	//mouseevent

	cvs.onmousemove = move;	
//	cvs.ontouchmove = move;
	function move(event) {
      // 移動した座標を取得
		x = event.clientX;
		y = event.clientY;

		if (!Boolean(old_x)) { old_x = x;}
		if (!Boolean(old_y)) { old_y = y;}

		now_x = x;
		now_y = y;

	}

	cvs.onmousedown = function (event) {

		now_button = event.button;

	}

    cvs.onmouseup = function (event) {

		now_button = -1

	}

    cvs.onmousewheel = function (event) {

		now_wheel = event.wheelDelta;
	
	}

	//firefox用ホイールコントロール
    cvs.addEventListener("DOMMouseScroll", wheelfx, false);
	function wheelfx(event) {

		now_wheel = event.detail;
	
	}
	
    //iPodTouch用　(現状ではマルチタップは無視するつくり）
	cvs.ontouchmove = function (event) {
	    event.preventDefault();

	    if (event.touches.length > 0) {
	        for (var i = 0; i < event.touches.length; i++) {
	            var t = event.touches[i];

	            // 移動した座標を取得
	            x = t.pageX;
	            y = t.pageY;
	        }
	    }

	    // 移動した座標を取得

	    if (!Boolean(old_x)) { old_x = x; }
	    if (!Boolean(old_y)) { old_y = y; }

	    now_x = x;
	    now_y = y;
	}

	cvs.ontouchstart = function (event) {
	    event.preventDefault();

        x = event.pageX;
        y = event.pageY;

	    now_button = 0;
	}

	cvs.ontouchend = function (event) {
	    event.preventDefault();

	    now_button = -1
	}

	this.check = function(){

		if (pause_count > 0){

			//入力抑止時間中は入力を無効にする。

			pause_count++;

			now_x = old_x;
			now_y = old_y;
			now_button = 0;
			wheel = 0;
		}

		old_x = new_x;
		old_y = new_y;

		new_x = now_x;
		new_y = now_y;
		
		button = now_button;
		if (now_button != 0) {now_button = -1;}
//		now_button = -1;
		wheel = now_wheel;
		now_wheel = 0;

		deg = target_r( old_x, old_y, new_x ,new_y );

		dstns = Math.sqrt(Math.pow(Math.abs(new_x - old_x), 2) + Math.pow(Math.abs(new_y - old_y), 2));

		if ((( old_x - new_x )==0 )&&(( old_y - new_y )==0 )) deg = "NaN";
		
		var state ={};
		
		state.x = now_x;
		state.y = now_y;
		state.button = button;
		state.wheel = wheel;
		state.deg = deg;
		state.distance = dstns;		
		
		return state;
	}

	this.check_last = function(){

		var state ={};
		
		state.x = now_x;
		state.y = now_y;
		state.button = button;
		state.wheel = wheel;
		state.deg = deg;
		state.distance = dstns;		
		
		return state;
	}

	this.input_pause = function( wait_time ){

		//入力抑止設定（check呼び出し回数分入力を抑止し、
		//ステータスを、ボタンを押してない状態で返す。

		if (wait_count > 30) wait_time = 30;
		if (wait_count < 0 ) wait_time = 0;

		pause_count = wait_time;
	}

	this.draw = function(){
		
		var cx = canvas.width;
		var cy = canvas.height;

		var tr = deg;

		context.fillStyle = "black";
		context.fillRect(0, 0, canvas.width, canvas.height);
		context.fillStyle = "white";
		context.fillRect(5, 5, canvas.width-10, canvas.height-10);
		
		context.fillStyle = "green";
		context.fillText( new_x + " " + new_y + " " + cx +" "+cy+" "+tr , 32, 32 );
		
		var b = "OOO";
		switch (button){
		case 0:
			b = "@OO"
			break;
		case 1:
			b = "O@O"
			break;
		case 2:
			b = "OO@"
			break;
		default:
			break;
		}
		

		context.fillText( "b:" + b + " w:" + wheel, 32, 232 );

		context.beginPath();
    	context.moveTo( cx/2, cy/2);
    	context.lineTo( (new_x - old_x) + cx/2, (new_y - old_y) + cy/2 );
    	context.strokeStyle = "black";
    	context.stroke();

        context.beginPath();
        context.arc( cx/2, cy/2 , 5, 0, 2*Math.PI ,true);
    	context.strokeStyle = "black";
    	context.stroke();

		r = Math.sqrt(Math.pow(Math.abs(new_x - old_x),2) + Math.pow(Math.abs(new_y - old_y),2));

		context.beginPath();
		context.arc( cx/2, cy/2 , r, 0, 2*Math.PI ,true);
		context.strokeStyle = "black";
		context.stroke();

		var hx = 0;
		var hy = 0;

		if ( tr != "NaN" ) {
			tr = ToRadian( tr - 90 );
			hx = Math.cos( tr )*50;
			hy = Math.sin( tr )*50;
		}

		context.beginPath();
		context.arc( cx/2 + hx , cy/2 + hy, 20, 0, 2*Math.PI ,true);
		context.fillStyle = "orange";
		context.fill();
		
		
		var wr = context.getImageData(0, 0, canvas.width, canvas.height);
		
//		dd = new Image();
//		dd.src = "cha.png";
//		dd = wr;
		
//		return dd;//イメージデータを返してみる

	}

	//以下は共通の関数で別のクラスの中に入れていてもいい。
	//
	
	//自分( x,y )から目標( tx, ty )の
	//	方向角度を調べる(上が角度0の0-359)
	function target_r( x ,y ,tx ,ty)
	{
		var r ;

		var wx = tx -x ;
		var wy = ty -y ;

		if ( wx == 0 )
		{
			if ( wy >= 0 ) r=180; else r=0;
		}else{
			r = ToDegree( Math.atan( wy / wx ) );

			if ( ( wx >= 0 ) && ( wy >= 0 ) ) r =  90+r ;
			if ( ( wx >= 0 ) && ( wy <  0 ) ) r =  90+r ;
			if ( ( wx <  0 ) && ( wy <  0 ) ) r = 270+r ;
			if ( ( wx <  0 ) && ( wy >= 0 ) ) r = 270+r ;
		}

		return r;
	}
	
	//角度からラジアンに変換
	//
	function ToRadian( d )
	{
    	return (d * (Math.PI / 180.0));
	}

	//ラジアンから角度に変換
	//
	function ToDegree( r )
	{
    	return (r * (180.0 / Math.PI));
	}
}
