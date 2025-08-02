//gameObjectの分割分UtilityMethodを分離
//記入2025/06/25コメント追加

function gObjectUtility(state) {
    
    const dev = state.System.dev;

    this.item = state.obCtrl.item;
    this.itemstack = state.obCtrl.itemstack;

    const ch_ptn = state.Database.chrPattern;//character();
    const motion_ptn = state.Database.motionPattern;//motionPattern();

    const msglog = new textbufferControl(25);
    const msgview = new textbufferControl(26);
    const msgcnsl = new textbufferControl(21);

    this.messagelog = msglog;
    this.messageview = msgview;
    this.messageconsole = msgcnsl;

    const tutcnsl = new textbufferControl(5);
    this.tutorialconsole = tutcnsl;
    const tutComment = tutorialCommentTable();//return comment [[],[],[]];
    //this.tutTable = tutCheck;
    let tutDtime = 0;
    this.tutorialDisplayTime = tutDtime;

    let tutoDone = [];
    this.tutorialDone = tutoDone;

    let tutCheck = (num) =>{
        let h = "> ";        
        if (Boolean(tutComment[num])){
            if (!Boolean(tutoDone[num])){
                for (let m of tutComment[num]){
                    this.tutorialconsole.write(h + m);
                    h = "  ";
                }
                this.tutorialDisplayTime = state.System.time() + 10000;//10s
                tutoDone[num] = true;//説明済みFlag 
            }else {
                //objc.tutorialconsole.write("> " + itemtable[num] + "is done.");
                //if (num < 15) this.item[num] = 2;//説明済み
            }
        }
    }
    this.tutTable = tutCheck;

    function textbufferControl(num = 20){

        const LINE = num + 1;
        const WIDTH = 40;
    
        let buffer = [];
    
        this.read = function(){
    
            return buffer;
        }
    
        this.write = function(str){
    
            if (str.length > WIDTH) str = str.substring(0,WIDTH);
    
            buffer.push(str);
    
            let bfw = [];
            for (let i in buffer){
                if (i > (buffer.length-LINE)){
                    bfw.push(buffer[i]);
                }
            }
            buffer = bfw;
        }

        this.clear = function(){
            buffer =[];
        }
    }

    const PLAYER   = state.Constant.objtype.PLAYER; 
    const FRIEND   = state.Constant.objtype.FRIEND; 
    const BULLET_P = state.Constant.objtype.BULLET_P;
    const ENEMY    = state.Constant.objtype.ENEMY; 
    const BULLET_E = state.Constant.objtype.BULLET_E;
	const ITEM     = state.Constant.objtype.ITEM; 
    const ETC      = state.Constant.objtype.ETC;

    const MOB      = state.Constant.objtype.MOB;

    const FLOOR    = state.Constant.objtype.FLOOR; 
    const WALL     = state.Constant.objtype.WALL; 
    const DOOR     = state.Constant.objtype.DOOR;
    const CEIL     = state.Constant.objtype.CEIL; 
    const CIRCLE   = state.Constant.objtype.CIRCLE;
	const STONEB   = state.Constant.objtype.STONEB; 

    this.list = function(){

        let st = [];
        const obj = state.obCtrl.objList;

        for (let j=0; j < obj.length; j++){
            let n = "   "+String(j);
            st[j] =  n.substring(n.length-3) +".No.Object";
        }

        // type ,x ,y ,status, mp
        for (let i in obj) {
            let o = obj[i];
            let inv = o.gt.in_view(o.x, o.y)?"v":"-"; 
            //let inw = o.gt.in_world(o.x, o.y)?"wo":"w-";
            //let s = "" + o.type + "," + Math.trunc(o.x) + "," + Math.trunc(o.y) + ","  + o.status + "," + o.mp;
            //type, inview, hp, status,mp,chr
            let n = "   "+String(i);
            //let s = n.substring(n.length-3) + ":" + o.type + "," + inv + "," + o.hp + ","  + o.status + "," + o.mp + "," + o.chr;
            let s = n.substring(n.length-3) + inv + ch_ptn[o.chr].comment + "," + o.hp + "," + o.status;

            st[i] = s;
            //st.push(s);
        }        
        return st;
    }

    this.list_inview = function(){

        let st = [];
        const obj = state.obCtrl.objList;

        let t = "DISPLAY SPRITE OBJECTS/";
        st.push(t);

        // type ,x ,y ,status, mp
        for (let i in obj) {
            let o = obj[i];
            if (o.normal_draw_enable || o.custom_draw_enable){
                if (o.gt.in_view(o.x, o.y)){
                    let n = "   "+String(i);
                    //let s = n.substring(n.length-3) + ":" + o.type + "," + ch_ptn[o.chr].comment + "," + o.hp + ","  + o.status + "," + o.mp + ",";
                    let s = n.substring(n.length-3) + ":" + ch_ptn[o.chr].comment;

                    st.push(s);
                } 
            }
        }        
        return st;
    }

    this.lookObj = function(num){

        let st = [];
        const obj = state.obCtrl.objList;

        if (obj[num] instanceof Object){

            let o = Object.entries(obj[num]);

            o.forEach(function(element){
                let w = String(element).split(",");
                //let w = element.split(",");
                //st.push(element);
                let s = w[0];
                if (s.length < 13){
                    s = s + " ".repeat(13);
                    s = s.substring(0, 13);
                }
                let s2 = w[1];
                /*
                for (let i = 2; i < w.length; i++){
                    s2 = s2 + w[i];
                }
                */
                st.push("."+ s + ":" + s2);
            });
            st.push("");
            st.push("Object.entries end.");
        } else{
            st.push("No.Object");
        }
        st.push("");
        st.push("Return [1-9] Key.");

        return st;
    }

    this.lookObjv = function(scrn, num, x, y){

        let result = false;
        const obj = state.obCtrl.objList;

        if (obj[num] instanceof Object){

            let o = obj[num];

            if (o.visible){
                mtnptn_put(scrn, 
                    x, y, o.mp,
                    o.mp_cnt_anm, 
                    o.vector, 
                    o.alpha,
                    o.display_size
                );
                result = true;

                if (!o.normal_draw_enable){
                    scrn.putchr8("[DUMMY]", x-28, y+16);
                }
            }
        }

        return result;
    }

    this.player_objv = function(scrn){

        const obj = state.obCtrl.objList;
        let rc = {x:0, y:0};

        for (let o of obj) {
            if (o instanceof Object){
            if (Boolean(o.type)){
            if (o.type == PLAYER){
                cntl_draw(scrn, o);
                rc = o.gt.worldtoView(o.x, o.y);
                break;
            } }
        }}
        return rc;
    }

    this.lookpick = function(scrn, num, x, y){

        let result = false;
        const obj = state.obCtrl.objList;

        if (obj[num] instanceof Object){
            /*
            let spname = [];
            spname[15] = "Wand";
            spname[16] = "Knife";
            spname[17] = "Axe";
            spname[18] = "Spear";
            spname[19] = "Boom";
            spname[20] = "Ball1";
            spname[21] = "miniMay";
            spname[22] = "sKey";
            spname[23] = "BallB1";
            spname[24] = "BallS1";
            spname[25] = "BallL1";
            spname[26] = "Lamp";
            spname[27] = "Map";
            spname[35] = "Coin1";
            spname[50] = "Bow";            
            */
            let o = obj[num];

            if (o.type == ENEMY){
                if (o.pick.length > 0){
                    for (let i of o.pick){
                        //scrn.put(spname[i], x, y);
                        mtnptn_put(scrn, x, y, ch_ptn[i].mp);
                        x = x + 16;
                    }
                    result = true;
                } 
            }
            if (o.type == ITEM){
                mtnptn_put(scrn, x, y, o.mp);//, mpcnt, r, alpha, size){
                //scrn.put(spname[o.chr], x, y);
                result = true;
            }
        }
        return result;
    }

    this.keyitem_view_draw = function(device, mode = false){

        this.item = state.obCtrl.item;

        const helptext = {51:"INT", 52:"MND", 53:"VIT", 56:"STR", 57:"DEX"};

        let xpos = dev.layout.keyitem.x;
        let ypos = dev.layout.keyitem.y;
        for (let i=51; i<59; i++){
            //this.item[i] = 2; // DEBUG fullItemTest
            if (Boolean(this.item[i])){
                if (this.item[i] > 0) {
                    device.put(
                        motion_ptn[ch_ptn[i].mp].pattern[0][0]
                        , xpos, ypos);
                    if (this.item[i] > 1){
                        device.kprint("+" + (this.item[i]-1),xpos, ypos+6);
                    }

                    if (mode){
                        if (Boolean(helptext[i]))
                            device.kprint(helptext[i],xpos-12, ypos-16);
                    }
                    //device.kprint(motion_ptn[[ch_ptn[i].mp]].pattern[0],12,ypos);

                    //device.kprint("ch-mp:" + ch_ptn[i].mp,12,ypos);
                    //device.kprint("mp:" + motion_ptn[ch_ptn[i].mp].pattern[0][0],12,ypos+8);
                    xpos += 22;
                }
            }
        }
        this.keyitem_enhance_check();
    }

    this.keyitem_reset = function(){

        this.item = state.obCtrl.item;

        for (let i=51; i<59; i++){
            this.item[i] = 0;
        }
    }

    this.keyitem_enhance_check = function(){

        this.item = state.obCtrl.item;

        for (let i=51; i<59; i++){
            if (!Boolean(this.item[i])){this.item[i] = 0;}
        }

        state.Game.player.enh.INT = (this.item[51] > 0)?this.item[51]: 0;//AmuletR
        state.Game.player.enh.MND = (this.item[52] > 0)?this.item[52]: 0;//AmuletG
        state.Game.player.enh.VIT = (this.item[53] > 0)?this.item[53]: 0;//AmuletB

        state.Game.player.enh.STR = (this.item[56] > 0)?this.item[56]: 0;//RingR
        state.Game.player.enh.DEX = (this.item[57] > 0)?this.item[57]: 0;//RingB

        this.ceilshadow = (this.item[55] > 0)?"rgba( 0,64,64,0.2)"://CandleB:      
            ((this.item[54] > 0)?"rgba(48,48, 0,0.4)":"rgba(4,4,4,0.8)");//CandleR:None

        state.Game.spec_check();
    }
    
    this.dict_Ch_Sp = function(ch){
        return motion_ptn[ch_ptn[ch].mp].pattern[0][0];
    }

    //draw functions
    function cntl_draw(scrn, o) {
        //表示
        if (Boolean(motion_ptn[o.mp].wait)) {
            o.mp_cnt_frm++;
            if (o.mp_cnt_frm > motion_ptn[o.mp].wait / 2) {
                o.mp_cnt_anm++;
                o.mp_cnt_frm = 0;
                if (o.mp_cnt_anm >= motion_ptn[o.mp].pattern.length) o.mp_cnt_anm = 0;
            }
        }

        let w = o.gt.worldtoView(o.x, o.y);

        mtnptn_put(scrn, 
            w.x + o.shiftx,
            w.y + o.shifty, 
            o.mp, o.mp_cnt_anm, 
            o.vector, o.alpha, o.display_size
        );
    }
 
    function mtnptn_put(scrn, x, y, mp, mpcnt, r, alpha, size){
        //mtnptn_put(scrn, x, y, mp,[mpcnt],[r],[alpha],[size])
        if (!Boolean(mpcnt)) mpcnt = 0;
        if (!Boolean(r)) r = 0;
        if (!Boolean(alpha)) alpha = 0;
        if (!Boolean(size)) size = 0;
        
        let ptn;
        try {
            ptn = motion_ptn[mp].pattern[mpcnt][0];
        }
        catch (e) {
            mpcnt = 0;
            ptn = motion_ptn[mp].pattern[mpcnt][0];
        }

        let wvh = motion_ptn[mp].pattern[mpcnt][1];
        let wr = motion_ptn[mp].pattern[mpcnt][2];

        if ((wvh == -1) && (wr == -1)) {
            wvh = 0;
            wr = r;
        };

        scrn.put(ptn, x, y, wvh, wr, alpha, size);
        //scrn.putchr("mp:"+ o.mp, w.x, w.y);
    }
}

