//Scene
//
function sceneStatusDisp(state) {

    let dev = state.System.dev;
    //宣言部
    let work = dev.graphics[3];
 
    //let keys = dev.key_state;

    this.init = scene_init;
    this.reset = scene_reset;
    this.step = scene_step;
    this.draw = scene_draw;

    this.reset_enable = true;

    let menuvf = false;
    let keywait = 10;

    let sel = 0;
    let inp = 1;
    let maxpage = 1;
    
    function list_draw(page, invt){//page, invtentry_mode = 持ち物表示
        if (page < 1) page = 1;

        let st = state.obCtrl.list(); 

        maxpage = Math.floor(st.length/200) + 1;
        //let s = "Tp,objX,objY,s,Mp / Num:" + st.length;

        if (page > maxpage) page = maxpage;

        sel = ((page-1)*200) + (sel%200);        
        if (sel > st.length) sel = st.length - 1;

        let s = "No:Type,view,hp,status,Mp,chr / Num:" + st.length
             + " PAGE:[" + page + "]/" + maxpage
             + ":SELECT:[" + sel + "] ";
             if (invt) {
                s = s + "Inventory";
            }else{
                s = s + "Propaty";
            };
        //type, inview, inworld, status,mp,chr
        let c = 0;

        work.reset();
        work.clear();

        work.putchr8(s, 0,0 );
        for (let i in st){

            if (i >= (page-1)*200){
                let s = st[(page-1)*200 + i%200];
                let x = Math.floor(c/50)*160;
                let y = (c%50)*8+8;
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

        let c=0;

        work.reset();
        work.clear();

        let s = "== ObjectNo.[" + num +"] =="; 
        work.putchr8(s, 0,0 );

        let st = state.obCtrl.lookObj(num);
        for (let i in st){
            let s = String(st[i]);

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
        let kstate = dev.key_state.check();

        let zkey = false; //exit button
        if (Boolean(kstate[90])) {//[z]
            if (kstate[90]) zkey = true;
        }
	    if (Boolean(kstate[32])) {//[space]
	        if (kstate[32]) zkey = true;
        }

        let ckey = false; //dispalyclear
        if (Boolean(kstate[67])) {
            if (kstate[67]) {//ckey↓
                ckey = true;
            }
        }

        let vkey = false; //inventry_view
        if (Boolean(kstate[86])) {
            if (kstate[86]) {//vkey↓
                vkey = true;
            }
        }

        let numkey = false; //menu select num
        let arrowkey = false; //list select 
        for (let i in kstate){
            if (Boolean(kstate[i])){
                numkey = ((i >= 48) && (i <= 57))? true: false; //Fullkey[0]-[9]
                arrowkey = ((i >= 37) && (i <= 40))? true: false; //Arrowkey
            }
        }

        if (zkey || ckey || vkey || numkey || arrowkey) keywait = 8;

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
            for (let i=0; i<3; i++){
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
            for (let i in kstate){
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

        if (arrowkey) {
            let s = sel;
            for (let i in kstate){
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
