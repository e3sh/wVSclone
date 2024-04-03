// gObjCmdDec
// ObjectControll  
// obj command Decode 2023/04/05 

function ObjCmdDecode(msg, sobj, obj, state, sce){
   /*
    let command = {
        "set_object",
        "set_object_ex",
        "get_target",
        "change_sce",
        "add_score",
        "get_item",
        "bomb",//敵の弾消滅
        "bomb2",//敵の弾を回収状態にする
        "bomb3",//画面内の敵一律hp-10の範囲攻撃
        "bomb4",//特定キャラクタタイプを消す(タイムオーバーの敵消滅処理)
        "collect",//無条件でアイテムを回収状態に(画面外含む)
        "collect2",//画面内のアイテムを回収状態にする
        "collect3",//自機半径100px以内のアイテムを回収状態にする
        "SIGNAL",
        "reset_combo",//combo管理していないので無効
        "search_target_item"//Key(指定アイテム)の有無や方向のチェック
    };
    */

    objc = state.obCtrl;
    mapsc = state.mapsc;
    dev = state.System.dev;

    let execute = true;    
    let wlog = true; 

    switch (msg.cmd){
        case "set_object":
            mapsc.add(
                sobj.x, sobj.y,
                sobj.vector,
                msg.src , null, null ,
                sobj
            );
            wlog = false; 
            break;
        case "set_object_ex":
            mapsc.add(
                msg.dst.x,
                msg.dst.y,
                msg.dst.vector,
                msg.src ,
                msg.dst.sce,
                msg.dst.id,
                sobj
            );
            wlog = false; 
            break;
        case "get_target":

            let wdist = 99999;
    
            sobj.target = null; //o; //{}; 見つからなかった場合
    
            for (let i in obj) {
                let wo = obj[i];
                if (wo.type != msg.src) continue;
    
                let d = wo.target_d(sobj.x, sobj.y);
                if (d < wdist) {
                    sobj.target = wo;
                    wdist = d;
                }
            }
            wlog = false; 
            break;
        case "change_sce":
            sobj.init = sce.init[msg.src];
            sobj.move = sce.move[msg.src];
            sobj.custom_draw = sce.draw[msg.src];
    
            sobj.init(null, sobj);
    
            wlog = false; 
            break;

        case "add_score":
            objc.score += msg.src;
            break;

        case "get_item":
            if (Boolean(objc.item[msg.src])) {
                objc.item[msg.src]++;
            } else {
                objc.item[msg.src] = 1;
            }

            objc.score += sobj.score;

            let x = sobj.x;
            let y = sobj.y;

            let wid = "Get Item." + msg.src;

            if (msg.src == 35) {
                wid = sobj.score + "pts.";
                dev.sound.effect(11); //get音
                mapsc.add(x, y, 0, 20, 39, wid); //43green
            }

            if (msg.src == 21) {
                wid = "Extend!";
                mapsc.add(x, y, 0, 20, 39, wid);
            }

            if (msg.src == 22) {
                wid = "GetKey!";
                dev.sound.effect(11); //get音
                mapsc.add(x, y, 0, 20, 39, wid);
            }

            if ((msg.src >= 15) && (msg.src <= 19)) {
                wid = "Weapon!";
                dev.sound.effect(11); //get音
                mapsc.add(x, y, 0, 20, 39, wid);
            }

            let f = false;
            if ((msg.src == 23) || (msg.src == 24) || (msg.src == 25)) {
                //dev.sound.effect(9); //cursor音
                f = true;
            }

            if (f) {
                let w = msg.src;
                objc.itemstack.push(w);
            }

            objc.messageconsole.write(objc.itemTable[msg.src] + ".GET");
            break;

        case "bomb":
            for (let i in obj) {
                if (obj[i].type == 3) {//敵の弾を消滅
    
                    obj[i].change_sce(7);
                }
            }
            break;

        case "bomb2":
            if (Boolean(objc.item[7])) { 
                if (objc.item[7] > 0) objc.item[7]--;
            }
            for (let i in obj) {
                let o = obj[i];
    
                if (o.type == 3) {//敵の弾を回収状態に
                    o.type = 4;
                    o.mp = 18;
                    o.score = 8;
                     //test用
                    if (o.chr != 7) {
                        let witem = [18, 22, 26, 27, 29, 30];
    
                        o.mp = witem[Math.floor(Math.random() * witem.length)];
                    }
                    o.change_sce(30);
                }
            }
            break;

        case "bomb3":
            if (Boolean(objc.item[7])) {
                if (objc.item[7] > 0) objc.item[7]--;
            }
            for (let i in obj) {
                //画面内にいる敵のみ
                let onst = sobj.gt.in_view_range(
                    obj[i].x - (obj[i].hit_x / 2),
                    obj[i].y - (obj[i].hit_y / 2), obj[i].hit_x, obj[i].hit_y);
    
                if (onst) {
                    if (obj[i].type == 2) {//敵には一律10のダメージ
                        obj[i].hp -= 10;
                        if (obj[i].hp <= 0) obj[i].status = 2;
                    }
    
                    if (obj[i].type == 3) {//敵の弾を消滅
    
                        obj[i].change_sce(7);
                    }
                }
            }
            objc.messageconsole.write("=BOMB=");
            break;

        case "bomb4":
            for (let i in obj) {

                if (obj[i].chr == msg.src) {
                    obj[i].status = 0; //接触でなく消滅させる
                    obj[i].hp = 0;//消えなかったりするのでhp=0してみる。
                }
            }
            break;

        case "collect":

            for (let i in obj) {
                let o = obj[i];
                if (o.type == 4) {//アイテムを回収モードに変更（上のほうに行ったときに）
                    if (!Boolean(o.collection_mode)) {
                        o.collection_mode = true;
                        o.change_sce(30);
                    }
                }
            }
            break;

        case "collect2":
            for (let i in obj) {
                //画面内にいるアイテムのみ　2023/1/12追加コマンド
                let onst = sobj.gt.in_view_range(
                    obj[i].x - (obj[i].hit_x / 2),
                    obj[i].y - (obj[i].hit_y / 2), obj[i].hit_x, obj[i].hit_y);
    
                if (onst) {
                    //アイテム回収モードにする
                    if (obj[i].type == 4) {//アイテム
                            obj[i].change_sce(30);
                    }
                }
            }
            objc.messageconsole.write("=COLLECT=");
            break;

        case "collect3":
            for (let i in obj) {
                //自機の半径n内にいるアイテムのみ　2023/1/12追加コマンド
                if (obj[i].type == 4){//アイテム
                    if ( sobj.target_d( obj[i].x, obj[i].y ) < 100){//半径
                            obj[i].change_sce(30);
                    }
                }
            }
            break;

        case "SIGNAL":
            if (objc.interrapt) {
                objc.interrapt = false;
                objc.SIGNAL = 0;
            } else {
                objc.interrapt = true;
                objc.SIGNAL = msg.src;

                if (msg.src == 0) objc.interrapt = false;
            }
            break;
     
        case "search_target_item":
            //稼働中objに対象のCHNOが存在するか？(KEYSEARCH用) 
            //無かったら、敵の持ち物をチェックする。
            //ない場合はkeyon=false;//自分の持ち物にある場合はこれでチェックしない。
            //戻り値はState.game.keyon,key_x,key_yに入れる。
            let onflag = false;
            let wx = 0;
            let wy = 0;

            for (let i in obj) {
                let wo = obj[i];
                if (wo.type == 2){//enemy
                    //wo.lighton = true;                
                    for (let j of wo.pick){
                        if (j == msg.src){
                            onflag = true;
                            wx = wo.x;
                            wy = wo.y;
                            wo.lighton = true;
                        }
                        if (onflag) break;
                    }
                    continue;
                }
                if (wo.type == 4){//item
                    //wo.lighton = true;
                    if (wo.chr == msg.src){
                        onflag = true;
                        wx = wo.x;
                        wy = wo.y;
                        wo.lighton = true;
                        break;
                    }    
                    continue;
                }
            }
            state.Game.keyon = onflag;
            state.Game.key_x = wx;
            state.Game.key_y = wy;

            wlog = false; 
            break;

        default:
            execute = false;
            wlog = false; 
            break;
    }
    
    let result = {exec: execute, log:wlog};

    return result;
}
