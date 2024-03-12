// シナリオ
//　scenario processor version Javascript
//　各オブジェクトの行動を指定するリスト。
//

// 友軍機オプション動作用シナリオ(2024/03/04－)
function sce_friend_option(mode) {

    /*
        mode 0: option1 o.parent = master
        mode 1: option2 o.parent.parent
        mode 2: option3 o.parent.parent.parent
        mode 3: option4 o.parent.parent.parent.parent
    */

    let op = {
        ptr: 0,
        x: Array(10),
        y: Array(10),
        r: Array(10)
    }

    const wpn = {
        0:{ch:6,sce:"common_vset8"},//wand
        1:{ch:10,sce:"friend_rotate"},//sword
        2:{ch:38,sce:"friend_rotate_full"},//axe
        3:{ch:37,sce:"friend_boom"},//boom
        4:{ch:36,sce:"friend_straight"},//spear
        5:{ch:46,sce:"common_vset10"} //arrow
    }
   
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        o.type = 5; //　その他
        o.frame = 0;

        o.autotrig = 10;//AutoWeapon wait counter
        o.autoshot = 0;//Autowapon trig ok:0 ng:1

        o.normal_draw_enable = false;
        o.custom_draw_enable = true;

        o.old_x = o.x;
        o.old_y = o.y;

        //o.before_weapon = o.gameState.player.weapon;

        o.repro = false;//nextoption

        o.spec = {LV:0};

        //o.spec.LV = 0;//o.gameState.player.level;

        op.ptr = 0;
        op.x.fill(o.x);
        op.y.fill(o.y);
        op.r.fill(0);
    }

    this.draw = damage_gr1;

    this.move = function (scrn, o) {

        //親がいなくなったら消滅
        if (!Boolean(o.parent)) o.status = 0;//return 1; 
        if (o.parent.status == 0) o.status = 0;//return 1;　

        o.frame+= o.vecfrm;

        let p = o.parent;

        o.autotrig-= o.vecfrm;
        if (o.autotrig <= 0) {
            o.autoshot = 0;
            o.autotrig = 5;
        }

        //AutoWeapon
        if ((o.autoshot == 0) && (o.gameState.player.weapon !=0 )) {
//          if (o.gameState.player.weapon !=0 ) {
            o.autoshot = 1;
            //o.sound.effect(7); //スイング音
            let wdelay = ((o.gameState.player.level >3 )? 3 : o.gameState.player.level)*4;
            // lv.0 20 0.3s /lv.1 16 0.25s /lv.2 12 0.2s /lv.3 08 0.12s(Max)
            o.autotrig = 20 -wdelay;//20 0.3s
            if (o.gameState.player.weapon == 3) o.autotrig = 240 /(o.gameState.player.level + 1);//Boom

            o.set_object_ex(wpn[o.gameState.player.weapon].ch,
                o.x, o.y, o.vector, 
                wpn[o.gameState.player.weapon].sce
            );
        }
        
        //if (Boolean(o.gameState.player.item)){
        //if (Boolean(o.gameState.player.item[20])){    
            if ((o.item[20] >= (mode+2)*10) && !o.repro){
                if (mode < 3){
                    o.set_object_ex(0, o.x, o.y, o.vector, "sce_friend_option_" + (mode + 1));
                    o.repro = true;
                }
            }

            if (o.item[20] < (mode+1)*10) return 1; //
        //    }
        //}
        // 移動処理
        if ((p.x == p.old_x)&&(p.y == p.old_y)){
        
        }else{
            op.x[op.ptr] = p.x;
            op.y[op.ptr] = p.y + p.shifty;
            op.r[op.ptr] = p.vector;
            op.ptr++;
            op.ptr = op.ptr % op.x.length; 
        }
        o.old_x = o.x;
        o.old_y = o.y;

        o.x = op.x[op.ptr];
        o.y = op.y[op.ptr];
        o.vector = op.r[op.ptr];        

        f = 0;
        if (o.status == 0) f = 1; //未使用ステータスの場合は削除

        return f;
    }

    //===以下表示用=============================================================================

    function damage_gr1(scrn, o) {

        for (let i=0; i < op.x.length; i++){
            let w = o.gt.worldtoView(
                o.x, o.y
            /*
                op.x[(op.ptr + i) % op.x.length],
                op.y[(op.ptr + i) % op.x.length]
            */
            );
            
            scrn.putFunc( {   x: w.x ,y: w.y ,r: 6 - o.frame%6/2,
                draw: function (device) {
                device.beginPath();
                device.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
                device.fillStyle = "white";
                device.fill();
            }
            } );
            
            /*
            if (i < op.x.length) {
                if (((i-1) % 10) == 0){
                    scrn.fill(w.x-8, w.y-8,16,16,"red");
                }else{
                    scrn.fill(w.x, w.y, 2, 2,"white");
                }
            }else{
                scrn.fill(w.x, w.y, 2, 2,"gray");
            }
            */
        }
    }
}
