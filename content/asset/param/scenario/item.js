// シナリオ
//　scenario processor version Javascript
//　各オブジェクトの行動を指定するリスト。

//アイテムの動作に関わるシナリオ
function sce_item_direct_homing() {
    //[s]自機に直接ホーミング(typeと絵を変更も）＜変更はbomb2処理で
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        //	    o.type = 4;
        //	    o.mp = 18;
        //	    o.score = 8;
        o.vector = 0;
        o.vset(16);
        o.display_size = 1.0;

        o.colcheck = true;

        o.jump = 0;
        o.jpvec = -5.0;
 
        o.shiftx = 0;
        o.shifty = 0;
   }

    this.move = function (scrn, o) {

        switch (o.frame) {
            case 1:
                o.get_target(98);
                break;
            case 3:
                o.get_target(98);
                o.vector = o.target_v();
            case 4:
                if (Boolean(this.target)) {
                    let d = o.target_d(o.target.x, o.target.y);
                    d = (d < 15) ? d + 1 : 16;
                    o.vset(d);
                }
            case 8:
                o.frame = 2;
                break;
            default:
                break;
        };
        if (o.mapCollision) o.change_sce("common_vset0");

        o.frame++;

        return o.sc_move();
    }
}

function sce_item_near_homing() {
    //得点アイテム用(近づくとホーミングしてくる用）
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        o.vset(0);
        o.get_target(98);
    }

    this.move = function (scrn, o) {

        if (!Boolean(this.target)) {
            o.get_target(98);
        }

        if (Boolean(this.target)) {
            let d = o.target_d(o.target.x, o.target.y);

            if (d < 40) {
                //            d = (d < 15) ? d + 1 : 16;
                o.vector = o.target_v();
                o.vset(4);
            }
        };

        return o.sc_move();
    }
}
/*backup
function sce_item_movingstop() {
    //死んでアイテム放出用（少し進んで止まる）
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        o.vset(1);
    }

    this.move = function (scrn, o) {

        if (o.frame > 100) o.vset(0);
        o.frame++;

        return o.sc_move();
    }
*/

    function sce_item_movingstop() {
        //死んでアイテム放出用（跳ねて進んで止まる）2024/04/08跳ねるようにverup 
        //-----------------------------------------------------------------------
        this.init = function (scrn, o) {
            o.vset(1);

            o.wmapc = false; //衝突連続状態
            o.colcnt = 0;  //衝突状態カウント
   
            o.colcheck = true;

            o.jump = 0;
            o.jpvec = -5.0;
     
            o.shiftx = 0;
            o.shifty = 0;
        }
    
        this.move = function (scrn, o) {
    
            if (o.frame > 60 && !o.wmapc){
                o.colcheck = true;
                //reset jump
                o.jump = 0;
                o.jpvec = 0;
         
                o.shiftx = 0;
                o.shifty = 0;

                o.change_sce("common_vset0");
            }else{
                if(!o.wmapc){
                    //set jump
                    o.wmapc = true;
    
                    o.jump = 1;
                    o.jpvec = -3;//-5.6 - 0.4 * o.vecfrm;;
                    o.colcheck = false;
                };
            }
            o.frame++;

            if (o.jump == 1 ) {
                o.shifty = o.shifty + o.jpvec;
                o.jpvec = o.jpvec + 0.4 * o.vecfrm;
                o.prioritySurface = true;
                if (o.shifty > 0){
                    o.jump = 0;
                    o.shifty = 0;
                    o.prioritySurface = false;
                    o.colcheck = true;
    
                    o.wmapc = false;

                   //o.change_sce("common_vset0");
                }            
                return o.sc_move();
            }
    
            if (o.mapCollision) {
                //o.colcnt++;
                if ((o.colcnt > 1)&&!o.wmapc) {//連続衝突するとジャンプして回避してみる
                    o.wmapc = true;
    
                    o.jump = 1;
                    o.jpvec = -3;//-5.6 - 0.4 * o.vecfrm;;
                    o.colcheck = false;
    
                    o.vector = Math.floor(Math.random() * 360);//適当な向きに飛ぶ
                    o.vset(1);
                } else { 
                    o.colcheck = true;
                    o.vset(1);
                }
            }else{
                //o.colcnt = 0;
            }

            return o.sc_move();
        }
    
}