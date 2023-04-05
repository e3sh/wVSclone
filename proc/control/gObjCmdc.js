// gObjCmdDec
// ObjectControll  
// obj command Decode 2023/04/05

function ObjCmdDecode(msg, sobj, obj, state, sce){
   /*
    var command = {
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
                var wo = obj[i];
                if (wo.type != msg.src) continue;
    
                var d = wo.target_d(sobj.x, sobj.y);
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

            if (msg.src == 35) {
                var wid = sobj.score + "pts.";
                dev.sound.effect(11); //get音
                mapsc.add(x, y, 0, 20, 39, wid); //43green
            }

            if (msg.src == 21) {
                var wid = "Extend!";
                mapsc.add(x, y, 0, 20, 39, wid);
            }

            if (msg.src == 22) {
                var wid = "GetKey!";
                dev.sound.effect(11); //get音
                mapsc.add(x, y, 0, 20, 39, wid);
            }

            if ((msg.src >= 15) && (msg.src <= 19)) {
                var wid = "Weapon!";
                dev.sound.effect(11); //get音
                mapsc.add(x, y, 0, 20, 39, wid);
            }

            var f = false;
            if ((msg.src == 23) || (msg.src == 24) || (msg.src == 25)) {
                //dev.sound.effect(9); //cursor音
                f = true;
            }

            if (f) {
                var w = msg.src;
                objc.itemstack.push(w);
            }

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
                        var witem = [18, 22, 26, 27, 29, 30];
    
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
                var onst = sobj.gt.in_view_range(
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
            var onflag = false;
            var wx = 0;
            var wy = 0;

            for (var i in obj) {
                var wo = obj[i];
                if (wo.type == 2){//enemy
                    //wo.lighton = true;                
                    for (var j of wo.pick){
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
    
    var result = {exec: execute, log:wlog};

    return result;
}

   /*
    var command = {
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
   /*
Filter
                   msgview.write("." + "=".repeat(cmdcnt/5) + cmdlog );
                    if ((cmdlog != "search_target_item")&&
                       (cmdlog != "get_target")&&
                       (cmdlog != "change_sce")&&
                       (cmdlog != "set_object")&&
                       (cmdlog != "set_object_ex")
                       )
                    {
                        msglog.write("." + cmdlog);
                    }
                    cmdlog = ms.cmd;
                    cmdcnt = 0;


ObjCmdec
CommandDecord

objc

o

mapsc




   */
/*
    var command = {
        "set_object":function (o, src, dst) {
            //		set_sce( o.x,  o.y , o.vector , src );
            map_sc.add(o.x, o.y, o.vector, src , null, null ,o);
        },
        "set_object_ex":function (o, src, dst) {
            // dst.x dst.y dst.vector src dst.sce
            //		set_sce( o.x,  o.y , o.vector , src, dst );
            map_sc.add(dst.x, dst.y, dst.vector, src, dst.sce, dst.id, o);
        },
        "get_target":function (o, src, dst) {
            var wdist = 99999;
        
            o.target = null; //o; //{}; 見つからなかった場合
        
            for (var i in obj) {
                var wo = obj[i];
                if (wo.type != src) continue;
        
                var d = wo.target_d(o.x, o.y);
                if (d < wdist) {
                    o.target = wo;
                    wdist = d;
                }
            }
        },
        "change_sce":function (o, src, dst) {
            //バグの温床になる危険を秘めています。要注意。
            o.init = sce.init[src];
            o.move = sce.move[src];
            o.custom_draw = sce.draw[src];
        
            o.init(scrn, o);
        },        
        "add_score":function (o, src, dst) {
            this.score += src;
        },
        "get_item":function (o, src, dst) {
            if (Boolean(item_[src])) {
                item_[src]++;
            } else {
                item_[src] = 1;
            }
            var c_rate = 1;
    
            this.score += o.score * c_rate;
    
            if (src == 35) {
                if (stockcount == 0) stockcount = 8;
                stockscore += o.score;
                stockrate++;
                //if (stockrate < this.chain_cnt) { stockrate = this.chain_cnt }
    
                stockdisp_x = o.x;
                stockdisp_y = o.y;
    
                //var wid = (o.score * c_rate) + "pts.";
                //dev.sound.effect(11); //get音
                //map_sc.add(o.x, o.y, 0, 20, 39, wid); //43green
            }
            if (src == 21) {
                var wid = "Extend!";
                map_sc.add(o.x, o.y, 0, 20, 39, wid);
            }
            if (src == 22) {
                var wid = "GetKey!";
                dev.sound.effect(11); //get音
                map_sc.add(o.x, o.y, 0, 20, 39, wid);
            }
            if ((src >= 15) && (src <= 19)) {
                var wid = "Weapon!";
                dev.sound.effect(11); //get音
                map_sc.add(o.x, o.y, 0, 20, 39, wid);
            }
            var f = false;
            if ((src == 23) || (src == 24) || (src == 25)) {
                //dev.sound.effect(9); //cursor音
                f = true;
            }
    
            if (f) {
                var w = src;
                itemstack_.push(w);
            }
        },
        "bomb":function (o, src, dst) {
            for (i in obj) {
                if (obj[i].type == 3) {//敵の弾を消滅
                    obj[i].change_sce(7);
                }
            }
        },
        "bomb2":function (o, src, dst) {
    
            for (i in obj) {
                o = obj[i];
        
                if (o.type == 3) {//敵の弾を回収状態に
                    o.type = 4;
                    o.mp = 18;
                    o.score = 8;
                    //test用
                    if (o.chr != 7) {
                        var witem = [18, 22, 26, 27, 29, 30];
        
                        o.mp = witem[Math.floor(Math.random() * witem.length)];
                    }
        
                    o.change_sce(30);
                }
            }
            if (Boolean(this.item[7])) { //PowerUpを減らす。
    
                if (this.item[7] > 0) this.item[7]--;
            }
        },
        "bomb3":function (o, src, dst) {
    
            for (i in obj) {
                //画面内にいる敵のみ
                var onst = o.gt.in_view_range(
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
            if (Boolean(this.item[7])) { //PowerUpを減らす。
    
                if (this.item[7] > 0) this.item[7]--;
            }
        },
        "bomb4":function (o, src, dst) {
    
            for (i in obj) {
                if (obj[i].chr == src) {
                    obj[i].status = 0; //接触でなく消滅させる
                    obj[i].hp = 0;//消えなかったりするのでhp=0してみる。
                }
            }
        },
        "collect":function (o, src, dst) {
    
            for (i in obj) {
                o = obj[i];
                if (o.type == 4) {//アイテムを回収モードに変更（上のほうに行ったときに）
                    if (!Boolean(o.collection_mode)) {
                        o.collection_mode = true;
                        o.change_sce(30);
                    }
                }
            }
        },
        "collect2":function (o, src, dst) {
    
            for (i in obj) {
                //画面内にいるアイテムのみ　2023/1/12追加コマンド
                var onst = o.gt.in_view_range(
                    obj[i].x - (obj[i].hit_x / 2),
                    obj[i].y - (obj[i].hit_y / 2), obj[i].hit_x, obj[i].hit_y);
        
                if (onst) {
                    //アイテム回収モードにする
                    if (obj[i].type == 4) {//アイテム
                            obj[i].change_sce(30);
                    }
                }
            }
        },
        "collect3":function (o, src, dst) {
            for (i in obj) {
                //自機の半径n内にいるアイテムのみ　2023/1/12追加コマンド
                if (obj[i].type == 4){//アイテム
                    if ( o.target_d( obj[i].x, obj[i].y ) < 100){//半径
                            obj[i].change_sce(30);
                    }
                }
                
            }
        },
        "SIGNAL":function (o, src, dst) {
            if (this.interrapt) {
                this.interrapt = false;
                this.SIGNAL = 0;
            } else {
                this.interrapt = true;
                this.SIGNAL = src;
    
                if (src == 0) this.interrapt = false;
            }
        },    
        "reset_combo":function (o, src, dst) {
            for (var cb in this.combo) {
                if (src == cb) {
                    this.combo[cb] = 0;
                }
            }
        },
        "search_target_item":function (o, src, dst) {
            //稼働中objに対象のCHNOが存在するか？(KEYSEARCH用) 
            //無かったら、敵の持ち物をチェックする。
            //ない場合はkeyon=false;//自分の持ち物にある場合はこれでチェックしない。
            //戻り値はState.game.keyon,key_x,key_yに入れる。
            var onflag = false;
            var wx = 0;
            var wy = 0;
        
            for (var i in obj) {
                var wo = obj[i];
                if (wo.type == 2){//enemy
                    //wo.lighton = true;                
                    for (var j of wo.pick){
                        if (j == src){
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
                    if (wo.chr == src){
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
        }
    
    };
    
    */