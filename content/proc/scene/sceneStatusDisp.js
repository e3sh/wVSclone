//Scene
//
function sceneStatusDisp(state) {

    var dev = state.System.dev;
    //宣言部
    var work = dev.graphics[3];
 
    //var keys = dev.key_state;

    this.init = scene_init;
    this.reset = scene_reset;
    this.step = scene_step;
    this.draw = scene_draw;

    this.reset_enable = true;

    var menuvf = false;
    var keywait = 10;

    var sel = 0;
    var inp = 1;
    var maxpage = 1;
    
    function list_draw(page, invt){//page, invtentry_mode = 持ち物表示
        if (page < 1) page = 1;

        var st = state.obCtrl.list(); 

        maxpage = Math.floor(st.length/200) + 1;
        //var s = "Tp,objX,objY,s,Mp / Num:" + st.length;

        if (page > maxpage) page = maxpage;

        sel = ((page-1)*200) + (sel%200);        
        if (sel > st.length) sel = st.length - 1;

        var s = "No:Type,view,hp,status,Mp,chr / Num:" + st.length
             + " PAGE:[" + page + "]/" + maxpage
             + ":SELECT:[" + sel + "] ";
             if (invt) {
                s = s + "Inventory";
            }else{
                s = s + "Propaty";
            };
        //type, inview, inworld, status,mp,chr
        var c = 0;

        work.reset();
        work.clear();

        work.putchr8(s, 0,0 );
        for (var i in st){

            if (i >= (page-1)*200){
                var s = st[(page-1)*200 + i%200];
                var x = Math.floor(c/50)*160;
                var y = (c%50)*8+8;
                //work.putchr8(s ,x ,y );
                if (invt) {
                    if (state.obCtrl.lookpick(work, i, x + 48+8, y)){
                        s = s.substring(0, 6);
                    }
                }
                if (i != sel){
                    work.putchr8(s ,x ,y );
                }else{
                    //work.putchr("["+st[(page-1)*200 + i%200]+"]",Math.floor(c/50)*160,(c%50)*8+8);
                    //work.putchr8c(s,x ,y ,2 );

                    bar = {}

                    bar.x = x;
                    bar.y = y;
                    bar.l = s.length;//st[(page-1)*200 + i%200].length;s.length;
            
                    bar.draw = function(device){
                        device.beginPath();
                        device.fillStyle = "navy";
                        device.lineWidth = 1;
                        device.fillRect(this.x, this.y, this.l*8, 8);
                        device.stroke();
            
                        device.beginPath();
                        device.strokeStyle = "white"; 
                        device.lineWidth = 1;
                        device.rect(this.x, this.y, this.l*8, 8);
                        device.stroke();
                    }
                    work.putFunc(bar);
                    work.putchr8c(s,x ,y ,2 );
                }
                c++;
                if (c>200) break;
            }
        }
        work.draw();
    }
    
    function obj_draw(num){

        const COL=49; 

        var c=0;

        work.reset();
        work.clear();

        var s = "== ObjectNo.[" + num +"] =="; 
        work.putchr8(s, 0,0 );

        var st = state.obCtrl.lookObj(num);
        for (var i in st){
            var s = String(st[i]);

            if (!s.includes("object") && !s.includes("function")){
                work.putchr8(String(st[i]).substring(0, 39),Math.floor(c/COL)*320,(c%COL)*8+8 );
                c++;
            }
            if (c>100) break;
        }

        state.obCtrl.lookObjv(work, num, 240, 80);

        if (state.obCtrl.lookpick(work, num, Math.floor(c/COL)*320+8, ((c+2)%COL)*8+16)){
            work.putchr8("pickitem/thisitem",Math.floor(c/COL)*320+8, ((c+1)%COL)*8+8 );
        };

        work.draw();
    }

    //処理部
    function scene_init() {
        //初期化処理
        sel = 0;
    }

    function scene_reset() {
        dev.graphics[0].setInterval(0);//BG　WORK2
		dev.graphics[1].setInterval(0);//SPRITE
		dev.graphics[2].setInterval(0);//FG
    
        work.setInterval(0);//UI

        ret_code = 0;

        list_draw(1);
    }

    function scene_step() {

        keywait--;
        if (keywait > 0) return 0;

        // input key section
        var kstate = dev.key_state.check();

        var zkey = false; //exit button
        if (Boolean(kstate[90])) {//[z]
            if (kstate[90]) zkey = true;
        }
	    if (Boolean(kstate[32])) {//[space]
	        if (kstate[32]) zkey = true;
        }

        var ckey = false; //dispalyclear
        if (Boolean(kstate[67])) {
            if (kstate[67]) {//ckey↓
                ckey = true;
            }
        }

        var vkey = false; //inventry_view
        if (Boolean(kstate[86])) {
            if (kstate[86]) {//vkey↓
                vkey = true;
            }
        }

        var numkey = false; //menu select num
        var arCOLkey = false; //list select 
        for (var i in kstate){
            if (Boolean(kstate[i])){
                numkey = ((i >= 48) && (i <= 57))? true: false; //Fullkey[0]-[9]
                arCOLkey = ((i >= 37) && (i <= 40))? true: false; //ArCOLkey
            }
        }

        if (zkey || ckey || vkey || numkey || arCOLkey) keywait = 8;

        // select key function section
        if (zkey) {
            work.reset();
            work.clear();
            work.draw();

            //dev.graphics[0].setInterval(1);//BG　WORK2
            //dev.graphics[1].setInterval(1);//SPRITE
            //dev.graphics[2].setInterval(1);//FG
            //work.setInterval(6);//UI

            return 6;//return scenePause
        }

        if (ckey) {
            for (var i=0; i<3; i++){
                dev.graphics[i].reset();
                dev.graphics[i].clear();
                dev.graphics[i].draw();
            }
            list_draw(inp, menuvf);
        }

        if (vkey) {
            menuvf = !menuvf;
            list_draw(inp, menuvf);
            //inv_draw(inp);
        }

        if (numkey) {
            inp = -1;
            for (var i in kstate){
                if (Boolean(kstate[i])){
                    inp = i-48;
                    break;
                }
            } 
            if (inp == 0) {obj_draw(sel)
            } else {  
                list_draw(inp, menuvf);
            }
        }

        if (arCOLkey) {
            var s = sel;
            for (var i in kstate){
                if (Boolean(kstate[i])){
                    s = s + ((i == 37)? -50 :0)//leftkey 
                    + ((i == 38)? -1 :0) //upkey
                    + ((i == 39)? +50 :0) //rightkey
                    + ((i == 40)? +1 :0);//downkey
                }
            }
            if (s < 0) s = 0;
            //if (s > maxpage) s = maxpage;

            sel = s;
            //obj_draw(sel);
            list_draw(inp, menuvf);

        }
        return 0;
        //進行
    }

    function scene_draw() {
        //work.reset();
    }
}
