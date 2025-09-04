// gObjCmdDec
// ObjectControll obj command Decode 2023/04/05- 
/**
 * @param {string} msg ObjCommand 
 * @param {gObjectClass} sobj gObjectClassインスタンス
 * @param {gObjectControl} obj gObjectControlインスタンス
 * @param {stateControl} state g.state
 * @param {scenario} sce scenarioインスタンス
 * @returns {{boolean, boolean}} resultflag{command_execute, addlog_execute}
 * @description
 * `gObjectClass`から発行されたコマンドメッセージをデコードし、<br>\
 * 対応する処理をオブジェクトコントロール（`objc`）に対して実行します。<br>\
 * オブジェクト間の連携を担うハブ機能です。
 */

function ObjCmdDecode(msg, sobj, obj, state, sce){

    const PLAYER   = state.Constant.objtype.PLAYER; 
    const FRIEND   = state.Constant.objtype.FRIEND; 
    const BULLET_P = state.Constant.objtype.BULLET_P;
    const ENEMY    = state.Constant.objtype.ENEMY; 
    const BULLET_E = state.Constant.objtype.BULLET_E;
	const ITEM     = state.Constant.objtype.ITEM; 
    const ETC      = state.Constant.objtype.ETC;

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
        "search_target_item"//Key(指定アイテム)の有無や方向のチェック
    };
    */

    const objc = state.obCtrl;
    const mapsc = state.mapsc;
    const dev = state.System.dev;

    let execute = true;    
    let wlog = true; 

    switch (msg.cmd){
        case "set_object":
            mapsc.add(
                sobj.x, sobj.y + sobj.shifty ,
                sobj.vector,
                msg.src , 0, 0,
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

            if (msg.src > 14){ //説明文を出す処理では処理しない。(0-14説明用)
            
                objc.score += sobj.score;

                let x = sobj.x;
                let y = sobj.y;

                let wid = "Get Item." + msg.src;

                if (msg.src == state.Constant.item.COIN) {
                    wid = sobj.score + "pts.";
                    dev.sound.effect(state.Constant.sound.GET); //get音
                    mapsc.add(x, y, 0, 20, 39, wid); //43green
                }

                if (msg.src == state.Constant.item.EXTEND) {
                    wid = "Extend!";
                    mapsc.add(x, y, 0, 20, 39, wid);
                }

                if (msg.src == state.Constant.item.KEY) {
                    wid = "GetKey!";
                    dev.sound.effect(state.Constant.sound.GET); //get音
                    mapsc.add(x, y, 0, 20, 39, wid);
                }

                if (state.Constant.item.WEAPONS.includes(msg.src)){
                    // ((msg.src >= 15) && (msg.src <= 19)) || (msg.src==50)){
                    state.Game.player.stack.push({ch:msg.src, id:msg.dst});
                    wid = "Weapon!"; 
                    dev.sound.effect(state.Constant.sound.GET); //get音
                    mapsc.add(x, y, 0, 20, 39, wid);
                }

                let f = false;
                //if ((msg.src == state.Constant.item.BOMB) || (msg.src == state.Constant.item.SHIELD) ||(msg.src == state.Constant.item.LIFEUP)) {
                if (state.Constant.item.USEBLE.includes(msg.src)){
                    //dev.sound.effect(9); //cursor音
                    f = true;
                }

                if (f) { //useble items
                    let w = msg.src;
                    if (Boolean(state.Game.armlock)){
                        objc.itemstack.unshift(w);
                    }else{
                        objc.itemstack.push(w);
                    }
                }
            
                state.obUtil.messageconsole.write(objc.itemTable[msg.src] + ".GET");
                state.obUtil.keyitem_enhance_check();
            }
            state.obUtil.tutTable(msg.src);
            /*
            if (Boolean(objc.tutTable[msg.src])){
            for (let m of objc.tutTable[msg.src]){
                objc.tutorialconsole.write(m);
            }
            objc.tutorialconsole.write("---");
            }
            */
            break;

        case "bomb":
            for (let i in obj) {
                if (obj[i].type == BULLET_E) {//敵の弾を消滅
    
                    obj[i].change_sce(7);
                }
            }
            break;

        case "bomb2":
            /*
            for (let i in obj) {
                let o = obj[i];
    
                if (o.type == BULLET_E) {//敵の弾を回収状態に
                    o.type = ITEM;
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
            */
            break;

        case "bomb3":
            //msg.src : add attack power
            let atrpwr = isNaN(msg.src)? 0: msg.src;

            for (let i in obj) {
                //画面内にいる敵のみ
                let onst = sobj.gt.in_view_range(
                    obj[i].x - (obj[i].hit_x / 2),
                    obj[i].y - (obj[i].hit_y / 2), obj[i].hit_x, obj[i].hit_y);
    
                if (onst) {
                    if (obj[i].type == ENEMY) {//敵には一律10のダメージ
                        obj[i].hp -= (10 + atrpwr);
                        if (obj[i].hp <= 0) obj[i].status = 2;
                    }
    
                    if (obj[i].type == BULLET_E) {//敵の弾を消滅
    
                        obj[i].change_sce(7);
                    }
                }
            }
            state.obUtil.messageconsole.write("=BOMB=");
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
                if (o.type == ITEM) {//アイテムを回収モードに変更（上のほうに行ったときに）
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
                    if (obj[i].type == ITEM) {//アイテム
                            obj[i].change_sce(30);
                    }
                }
            }
            state.obUtil.messageconsole.write("=COLLECT=");
            break;

        case "collect3":
            for (let i in obj) {
                //自機の半径n内にいるアイテムのみ　2023/1/12追加コマンド
                if (obj[i].type == ITEM){//アイテム
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
                if (wo.type == ENEMY){//enemy
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
                if (wo.type == ITEM){//item
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
 