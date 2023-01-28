//=============================================================
// GameObjectClass の外部funtion
// ゲームオブジェクトクラスで一部長くなったので外に出した
//=============================================================
function ocl_scMove()
{
        var f = 0;

        if (this.status == 2) {//状態が衝突の場合

            switch (this.type) {//自身のタイプが...
                case 1: //自弾
                    //this.change_sce("effect_hit"); //弾が煙出さない場合は6 
                case 3: //敵弾
                    this.sound.effect(12); //hit音
                    //this.change_sce("effect_hit"); //弾が煙出さない場合は6
                    this.change_sce("effect_vanish"); //弾が煙出さない場合は6
                    //↑ここで弾を消しているので削除すると弾が消えなくなる。2023/01/20消してしまってbugったので記録。
                    break;
                case 2: //敵
                    this.display_size *= 2; //爆発を大きくする
                    this.change_sce(7);
                    this.sound.effect(8); //爆発音
                    //this.set_object_ex(20, this.x, this.y, 0, 39, this.damage.no + " ");
                    //if (this.chr == 14) {
                    //    var wc = 22
                    //var wc = (this.chr == 14) ? 22 : 35; //ボスは鍵を出すとりあえず。その他はCoinなど

                    //if (this.chr == 14) { //BOSSからBOSS
                    //    this.set_object_ex(22, this.x, this.y, Math.floor(Math.random() * 360), 36);//sce_boss_1();
                    //鍵はフィールドに設定してBOSSの座標に置くことで持たすように変更するのでここで出すようにしてたのは中止‗2023/01/28
                    //} else {
                        for (var i = 0, loopend = Math.floor(Math.random() * 3) + 1; i < loopend; i++) {
                            this.set_object_ex(35, this.x, this.y, Math.floor(Math.random() * 360), "item_movingstop");
                        }
                    //}
                    //敵が拾ったアイテムを落とす。
                    var itemf = false;
                    for (var i = 0, loopend = this.pick.length; i < loopend; i++) {
                        var num = this.pick[i];
                        this.set_object_ex(num, this.x, this.y, Math.floor(Math.random() * 360), "item_movingstop");
                        if (num != 35) itemf = true;//敵がCoin以外の何かを拾っていた場合true(宝箱を出すようにする）
                    }
                    //this.set_object_ex(wc, this.x, this.y, Math.floor(Math.random() * 360), 36);
                    //}
                    //ついでに宝箱を落としてみる。
                    if (itemf) this.set_object_ex(40, this.x, this.y, 0, "enemy_trbox");
                    //(宝箱は敵扱いなのでドロップしたアイテムは出現した箱に即時回収)
                    this.add_score(this.score);
                    break;
                case 4: //アイテム(敵がアイテムを取得する場合の事は考えていない。/<=拾うようにした）
                    if (Boolean(this.crash)) {
                        if (this.crash.pick_enable) {//
                            this.change_sce(6); //ただ消えるのみ
                            if (this.crash.type == 2) {
                                this.crash.pick.push(this.chr);
                            } else {
                                //                    this.add_score(this.score);
                                if ((this.chr != 21) && (this.chr != 22)) {//1up or Key
                                    this.sound.effect(9); //cursor音
                                }
                                this.get_item(this.chr);
                            }
                        }
                    }
                    break;
                default:
                    break;
            }
        }

        if (this.damageflag){
            this.damage.count = 15;
            //            this.set_object_ex(20, this.x, this.y, 0, 39, this.damage.no + " "); //damege表示
            var onst = this.gt.in_view_range(this.x - (this.hit_x / 2), this.y - (this.hit_y / 2), this.hit_x, this.hit_y);
            if (onst) {
                this.set_object_ex(6, this.x, this.y, this.vector, "effect_hit");
                //this.sound.effect(12); //hit音
            }
        }

        var wvec = this.vector;
        var wvx = this.vx;
        var wvy = this.vy;

        if (this.damage.count > 0) {
            this.damage.count--;
            this.vector = (this.damage.vector + 180) % 360;

            this.vset(this.damage.dist / 10);
        }

        if (this.status == 0) f = 1; //未使用ステータスの場合は削除

        // 移動処理
        if (this.mapCollision != true) {
            this.colcount = 0;

            this.old_x = this.x;
            this.old_y = this.y;

            this.x += this.vx;
            this.y += this.vy;

            this.vector = wvec;
            this.vx = wvx;
            this.vy = wvy;

        } else {

            //this.colcount++;

            //this.x = Math.floor(this.old_x / 80) * 80 + 32;
            //this.y = Math.floor(this.old_y / 80) * 80 + 32;
            //this.x = this.old_x;
            //this.y = this.old_y;

            if (this.colcount == 0) {

                this.x = this.old_x;
                this.y = this.old_y;

                switch (this.type) {//自身のタイプが...
                    case 1: //自弾
                    case 3: //敵弾
                        f = 1;
                        break;
                    default:
                    
                        if (this.mapColX) {
                            this.vx *= -1;

                            this.vector = 360 - this.vector;
                            //is.vector = 180 - this.vector;

                            if (this.vector < 0) this.vector = 180 + (180 + this.vector);
                        }

                        if (this.mapColY) {
                            this.vy *= -1;

                            //this.vector = 360 - this.vector;

                            this.vector = 180 + this.vector;

                            if (this.vector > 360) this.vector = 360 + 180 - this.vector;

                            this.vector = this.vector % 360;
                        }

                        if ((!this.mapColX) && (!this.mapColY)) {
                            this.vx *= -1;
                            this.vy *= -1;

                            //this.vx = 0;
                            //this.vy = 0;

                            this.vector = (this.vector + 180) % 360;
                        }
                        
                        break;
                }

            }
            this.colcount++;
            
            
            if (this.colcount > 30) {
                //this.x = this.old_x;
                //this.y = this.old_y;
                
                this.vector = this.target_r(this.startx, this.starty);
                this.vset(1);

                this.x += this.vx ;// * (this.colcount - 30);
                this.y += this.vy; //* (this.colcount - 30);


                //colcount--;
            }
            
            
        }

//        this.vector = wvec;
//        this.vx = wvx;
//        this.vy = wvy;

        //        if (this.x < 0 || this.x > this.scrn.cw) { f = 2; }
        //        if (this.y < 0 || this.y > this.scrn.ch) { f = 2; }
        if (this.x < 0 || this.x > this.gt.ww) { f = 2; }
        if (this.y < 0 || this.y > this.gt.wh) { f = 2; }

        if (f != 0) {
            if (f == 2) this.reset_combo(this.type);
            //            if ((this.type == 4) && (f == 2)) this.reset_combo(4); //アイテム逃がすとカウントリセット

            return -1; //0以外を返すと削除される。
        };

        
       if (this.colcount > 60) {
            //this.x = this.old_x;
            //this.y = this.old_y;
           if (Boolean(this.crash)) {
               //この場合は物に当たっているはず(味方同士とか）
               this.crash.mapCollision = false;
           } else {
               //this.x = this.startx;
               //this.y = this.starty;
               this.colcount =  Math.floor(Math.random() * 60)

               //this.colcount = 0;
           }
        }
        
        this.damageflag = false;

        return 0;
    }
