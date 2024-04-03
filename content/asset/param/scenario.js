// シナリオ
//　scenario processor version Javascript
//　各オブジェクトの行動を指定するリスト。
//
function scenario( gObjc) {

    let sc = {};

    let sc_init = [];
    let sc_draw = [];
    let sc_move = [];

    for (let i = 0; i <= 37; i++) {

        sc_init[i] = function (scrn, o) {
            o.vset(5);
        };

        //	    sc_draw[i] = function (scrn, o) {

        //	        scrn.putchr(o.hp + "", o.x, o.y);
        //	    }

        sc_move[i] = function (scrn, o) {
            return o.sc_move();
        }
    }

    // 自機の移動　====
    //-----------------------------------------------------------------------
    w = new sce_player( gObjc);

    sc_init[1] = w.init;
    sc_move[1] = w.move;
    sc_draw[1] = w.draw;

    //alias
    sc_init["player"] = w.init;
    sc_move["player"] = w.move;
    sc_draw["player"] = w.draw;

    //　敵移動　球打ったり　｜／｜移動したり　　
    //-----------------------------------------------------------------------
    w = new sce_enemy_move_n( 90, -90 );

    sc_init[2] = w.init;
    sc_move[2] = w.move;

    //alias
    sc_init["enemy_move_n_r"] = w.init;
    sc_move["enemy_move_n_r"] = w.move;

    //　敵移動　球打ったり　｜＼｜移動したり
    //-----------------------------------------------------------------------
    w = new sce_enemy_move_n(90, -90);

    sc_init[3] = w.init;
    sc_move[3] = w.move;

    //alias
    sc_init["enemy_move_n_l"] = w.init;
    sc_move["enemy_move_n_l"] = w.move;
    sc_draw["enemy_move_n_l"] = w.draw; //add 2023/01/28

    // START SET　移動開始で速さ2のベクトルを与える
    //-----------------------------------------------------------------------
    w = new sce_common_vset(4);

    sc_init[4] = w.init;
    sc_move[4] = w.move;

    //alias
    sc_init["common_vset4"] = w.init;
    sc_move["common_vset4"] = w.move;

    // No.5 empty
    //-----------------------------------------------------------------------

    //-----------------------------------------------------------------------
    // 爆発表示せずに消える
    //-----------------------------------------------------------------------
    w = new sce_effect_vanish();

    sc_init[6] = w.init;
    sc_move[6] = w.move;

    //alias
    sc_init["effect_vanish"] = w.init;
    sc_move["effect_vanish"] = w.move;

    //BOMB　表示を爆発にし１秒後に消える。
    //-----------------------------------------------------------------------
    w = new sce_effect_bomb();

    sc_init[7] = w.init;
    sc_move[7] = w.move;

    //alias
    sc_init["effect_bomb"] = w.init;
    sc_move["effect_bomb"] = w.move;

    //BOMB　移動停止させて、点滅させて　1.0秒後に消える
    //-----------------------------------------------------------------------
    w = new sce_effect_bomb_x();
  
    sc_init["effect_bomb_x"] = w.init;
    sc_move["effect_bomb_x"] = w.move;
    sc_draw["effect_bomb_x"] = w.draw;

    //BOMB　表示を爆発にし１秒後に消える。(誘爆用)
    //-----------------------------------------------------------------------
    w = new sce_effect_bombExp();
 
    //現在未使用(2024/03/14)
    sc_init["effect_bombEx"] = w.init;
    sc_move["effect_bombEx"] = w.move;
    sc_draw["effect_bombEx"] = w.draw;

    //　自機の発進の動き
    //-----------------------------------------------------------------------
    w = new sce_player_start();

    //現在未使用(2024/03/14)
    sc_init[8] = w.init;
    sc_move[8] = w.move;

    //alias
    sc_init["player_start"] = w.init;
    sc_move["player_start"] = w.move;

    //　右に回りながら移動する敵の動き、途中弾撃つ
    //-----------------------------------------------------------------------
    w = new sce_enemy_turn(-30);

    sc_init[9] = w.init;
    sc_move[9] = w.move;

    //alias
    sc_init["enemy_turn_r"] = w.init;
    sc_move["enemy_turn_r"] = w.move;
    sc_draw["enemy_turn_r"] = w.draw; //add 2023/01/28

    //　左に回りながら移動する敵の動き、途中弾撃つ
    //-----------------------------------------------------------------------
    w = new sce_enemy_turn(30);

    sc_init[10] = w.init;
    sc_move[10] = w.move;

    //alias
    sc_init["enemy_turn_l"] = w.init;
    sc_move["enemy_turn_l"] = w.move;

    //　まっすぐ下に降りて来ながらExevent1番実行した後、0.5秒後シナリオを9に変更
    //-----------------------------------------------------------------------
    w = new sce_enemy_change_s();

    sc_init[11] = w.init;
    sc_move[11] = w.move;

    //alias
    sc_init["enemy_change_s"] = w.init;
    sc_move["enemy_change_s"] = w.move;

    // START SET　高速弾（加速２をセット）
    //-----------------------------------------------------------------------
    w = new sce_common_vset(6);

    sc_init[12] = w.init;
    sc_move[12] = w.move;

    //alias
    sc_init["common_vset6"] = w.init;
    sc_move["common_vset6"] = w.move;

    //　上方向に加速8の移動をセット（自弾発射用）
    //-----------------------------------------------------------------------
    w = new sce_common_vset(16);

    sc_init[13] = w.init;
    sc_move[13] = w.move;

    //alias
    sc_init["common_vset16"] = w.init;
    sc_move["common_vset16"] = w.move;

    //　自機を目標にしてのホーミング移動(誘導弾）
    //-----------------------------------------------------------------------
    w = new sce_en_bullet_homing();

    sc_init[14] = w.init;
    sc_move[14] = w.move;

    //alias
    sc_init["en_bullet_homing"] = w.init;
    sc_move["en_bullet_homing"] = w.move;

    //移動しながら定期的に弾をばら撒いていく（その１）
    //-----------------------------------------------------------------------
    w = new sce_enemy_moveshot();

    sc_init[15] = w.init;
    sc_move[15] = w.move;

    //alias
    sc_init["enemy_moveshot_1"] = w.init;
    sc_move["enemy_moveshot_1"] = w.move;
    sc_draw["enemy_moveshot_1"] = w.draw; //add 2023/01/28

    //　味方（支援機）の動作(rotation)
    //-----------------------------------------------------------------------
    w = new sce_friend_rotate();

    sc_init[16] = w.init;
    sc_move[16] = w.move;

    //alias
    sc_init["friend_rotate"] = w.init;
    sc_move["friend_rotate"] = w.move;

    //　味方（支援機）の発進
    //-----------------------------------------------------------------------
    w = new sce_friend_start();

    sc_init[17] = w.init;
    sc_move[17] = w.move;

    //alias
    sc_init["friend_start"] = w.init;
    sc_move["friend_start"] = w.move;

    //　ランダムでのばら撒き弾(出現後ランダム左右50度に角度を変える。
    //-----------------------------------------------------------------------
    w = new sce_en_bullet_random();

    sc_init[18] = w.init;
    sc_move[18] = w.move;

    //alias
    sc_init["en_bullet_random"] = w.init;
    sc_move["en_bullet_random"] = w.move;

    // ランダム弾用母機
    //-----------------------------------------------------------------------
    w = new sce_enemy_randomshot() 

    sc_init[19] = w.init;
    sc_move[19] = w.move;

    //alias
    sc_init["sce_enemy_randomshot"] = w.init;
    sc_move["sce_enemy_randomshot"] = w.move;
    sc_draw["sce_enemy_randomshot"] = w.draw; //add 2023/01/28

    // 自機ホーミング弾
    //-----------------------------------------------------------------------
    w = new sce_pl_bullet_homing2();

    sc_init[20] = w.init;
    sc_move[20] = w.move;

    //alias
    sc_init["pl_bullet_homing"] = w.init;
    sc_move["pl_bullet_homing"] = w.move;

    //自機ホーミング弾Ver.2を使用(横からでてから前に飛ぶ）

    //支援機の動作２
    //-----------------------------------------------------------------------
    w = new sce_friend_sidearm();
    
    //現在未使用(2024/03/14)
    sc_init[21] = w.init;
    sc_move[21] = w.move;

    //alias
    sc_init["friend_sidearm"] = w.init;
    sc_move["friend_sidearm"] = w.move;

    // vset 0 
    //-----------------------------------------------------------------------
    w = new sce_common_vset(0);

    sc_init[22] = w.init;
    sc_move[22] = w.move;

    //alias
    sc_init["common_vset0"] = w.init;
    sc_move["common_vset0"] = w.move;
    
    // 5Way用母機
    //-----------------------------------------------------------------------
    w = new sce_boss_0();

    sc_init[23] = w.init;
    sc_move[23] = w.move;
    sc_draw[23] = w.draw;

    //alias
    sc_init["boss_0"] = w.init;
    sc_move["boss_0"] = w.move;
    sc_draw["boss_0"] = w.draw;

    // vset 2 
    //-----------------------------------------------------------------------
    w = new sce_common_vset(2);

    sc_init[24] = w.init;
    sc_move[24] = w.move;

    //alias
    sc_init["common_vset2"] = w.init;
    sc_move["common_vset2"] = w.move;

    // vset 8 
    //-----------------------------------------------------------------------
    w = new sce_common_vset(8);

    sc_init[25] = w.init;
    sc_move[25] = w.move;

    //alias
    sc_init["common_vset8"] = w.init;
    sc_move["common_vset8"] = w.move;

    // vset 10 
    //-----------------------------------------------------------------------
    w = new sce_common_vset(10);

    sc_init[26] = w.init;
    sc_move[26] = w.move;

    //alias
    sc_init["common_vset10"] = w.init;
    sc_move["common_vset10"] = w.move;

    // No.27 empty
    //-----------------------------------------------------------------------

    //看板の動き(縦）(だんだん消えていくパターン）
    //-----------------------------------------------------------------------
    w = new sce_effect_billboard( 0 );

    //現在未使用(2024/03/14)
    sc_init[28] = w.init;
    sc_move[28] = w.move;

    //alias
    sc_init["effect_billboard_v"] = w.init;
    sc_move["effect_billboard_v"] = w.move;

    //看板の動き(横））(だんだん消えていくパターン）
    //-----------------------------------------------------------------------
    w = new sce_effect_billboard(90);

    //現在未使用(2024/03/14)
    sc_init[29] = w.init;
    sc_move[29] = w.move;

    //alias
    sc_init["effect_billboard_h"] = w.init;
    sc_move["effect_billboard_h"] = w.move;

    //[s]自機に直接ホーミング(typeと絵を変更も）＜変更はbomb2処理で
    //-----------------------------------------------------------------------
    w = new sce_item_direct_homing();

    sc_init[30] = w.init;
    sc_move[30] = w.move;

    //alias
    sc_init["item_direct_homing"] = w.init;
    sc_move["item_direct_homing"] = w.move;

    // No.31-32 empty
    //-----------------------------------------------------------------------

    //減速加速する弾のパターン
    //-----------------------------------------------------------------------
    w = new sce_en_bullet_accel();

    sc_init[33] = w.init;
    sc_move[33] = w.move;

    //alias
    sc_init["en_bullet_accel"] = w.init;
    sc_move["en_bullet_accel"] = w.move;

    //　まっすぐ下に降りて来たあと、弾を撒き散らす。
    //-----------------------------------------------------------------------
    w = new sce_boss_1();

    sc_init[34] = w.init;
    sc_move[34] = w.move;
    sc_draw[34] = w.draw;

    //alias
    sc_init["boss_1"] = w.init;
    sc_move["boss_1"] = w.move;
    sc_draw["boss_1"] = w.draw;

    // No.35 empty
    //-----------------------------------------------------------------------

    //得点アイテム用(近づくとホーミングしてくる用）
    //-----------------------------------------------------------------------
    w = new sce_item_near_homing();

    sc_init[36] = w.init;
    sc_move[36] = w.move;

    //alias
    sc_init["item_near_homing"] = w.init;
    sc_move["item_near_homing"] = w.move;

    //メッセージ表示(warning)
    //-----------------------------------------------------------------------
    w = new sce_message_billboard( [
        "= Welcome to BOSS ROOM ==",
    	"LAIR OF THE BOSS ENEMY!",
	    //"HOURS 9AM TO 3PM BY APPOINTMENT ONLY",
		"THE BOSS IS *IN*!",
		//"= BEWARE OF THE BEAST!! ="
        ""],
        3);

    sc_init[37] = w.init;
    sc_move[37] = w.move;
    sc_draw[37] = w.draw;

    //alias
    sc_init["message_billboard_wm"] = w.init;
    sc_move["message_billboard_wm"] = w.move;
    sc_draw["message_billboard_wm"] = w.draw;

    //死んでアイテム放出用（少し進んで止まる）
    //-----------------------------------------------------------------------
    w = new  sce_item_movingstop();

    sc_init[38] = w.init;
    sc_move[38] = w.move;

    //alias
    sc_init["item_movingstop"] = w.init;
    sc_move["item_movingstop"] = w.move;

    //メッセージ表示(得点などの細かい奴用）39白/42赤/43緑/44青　用
    //-----------------------------------------------------------------------
    w = new sce_message_small(0);

    sc_init[39] = w.init;
    sc_move[39] = w.move;
    sc_draw[39] = w.draw;

    //alias
    sc_init["message_small_w"] = w.init;
    sc_move["message_small_w"] = w.move;
    sc_draw["message_small_w"] = w.draw;
    //------------------------------------
    w = new sce_message_small(1);

    sc_init[42] = w.init;
    sc_move[42] = w.move;
    sc_draw[42] = w.draw;

    //alias
    sc_init["message_small_r"] = w.init;
    sc_move["message_small_r"] = w.move;
    sc_draw["message_small_r"] = w.draw;
    //------------------------------------
    w = new sce_message_small(2);

    sc_init[43] = w.init;
    sc_move[43] = w.move;
    sc_draw[43] = w.draw;

    //alias
    sc_init["message_small_g"] = w.init;
    sc_move["message_small_g"] = w.move;
    sc_draw["message_small_g"] = w.draw;
    //------------------------------------
    w = new sce_message_small(3);

    sc_init[44] = w.init;
    sc_move[44] = w.move;
    sc_draw[44] = w.draw;

    //alias
    sc_init["message_small_b"] = w.init;
    sc_move["message_small_b"] = w.move;
    sc_draw["message_small_b"] = w.draw;

    //0番用シナリオ(打ち出しはob_exから）
    //-----------------------------------------------------------------------
    w = new sce_pl_bullet_subshot(8);

    sc_init[40] = w.init;
    sc_move[40] = w.move;

    //alias
    sc_init["pl_bullet_subshot_pl"] = w.init;
    sc_move["pl_bullet_subshot_pl"] = w.move;

    //0番用シナリオ その２　option用(打ち出しはob_exから）
    //-----------------------------------------------------------------------
    w = new sce_pl_bullet_subshot(1);

    sc_init[41] = w.init;
    sc_move[41] = w.move;

    //alias
    sc_init["pl_bullet_subshot_op"] = w.init;
    sc_move["pl_bullet_subshot_op"] = w.move;


    //その場で12f留まる弾（誘爆処理用）
    //-----------------------------------------------------------------------
    w = new sce_pl_bullet_subshot(0);

    sc_init["pl_bullet_subshot_zero"] = w.init;
    sc_move["pl_bullet_subshot_zero"] = w.move;


    //Laser頭
    //-----------------------------------------------------------------------
    w = new sce_pl_bullet_laser_head();

    sc_init[45] = w.init;
    sc_move[45] = w.move;

    //alias
    sc_init["pl_bullet_laser_head"] = w.init;
    sc_move["pl_bullet_laser_head"] = w.move;

    //Laser尻尾
    //-----------------------------------------------------------------------
    w = new sce_pl_bullet_laser_tail();

    sc_init[46] = w.init;
    sc_move[46] = w.move;

    //alias
    sc_init["pl_bullet_laser_tail"] = w.init;
    sc_move["pl_bullet_laser_tail"] = w.move;

    //Bomb演出テスト用　(赤）
    //-----------------------------------------------------------------------
    w = new sce_effect_bombcircle('rgba(255, 64, 64, 0.7)');

    sc_init[47] = w.init;
    sc_move[47] = w.move;
    sc_draw[47] = w.draw;

    //alias
    sc_init["effect_bombcircle_r"] = w.init;
    sc_move["effect_bombcircle_r"] = w.move;
    sc_draw["effect_bombcircle_r"] = w.draw;

    //Bomb演出テスト用2 (白)
    //-----------------------------------------------------------------------
    w = new sce_effect_bombcircle('rgba(255, 255, 255, 0.7)');

    sc_init[48] = w.init;
    sc_move[48] = w.move;
    sc_draw[48] = w.draw;

    //alias
    sc_init["effect_bombcircle_w"] = w.init;
    sc_move["effect_bombcircle_w"] = w.move;
    sc_draw["effect_bombcircle_w"] = w.draw;

    //敵用ホーミングレーザー
    //-----------------------------------------------------------------------
    w = new sce_en_bullet_hominglaser();

    sc_init[49] = w.init;
    sc_move[49] = w.move;

    //alias
    sc_init["en_bullet_hominglaser"] = w.init;
    sc_move["en_bullet_hominglaser"] = w.move;

    // HLaser用母機
    //-----------------------------------------------------------------------
    w = new sce_boss_2();

    sc_init[50] = w.init;
    sc_move[50] = w.move;
    sc_draw[50] = w.draw;

    //alias
    sc_init["boss_2"] = w.init;
    sc_move["boss_2"] = w.move;
    sc_draw["boss_2"] = w.draw;

    //予告レーザー
    //-----------------------------------------------------------------------
    w = new sce_en_bullet_infolaser();

    sc_init[51] = w.init;
    sc_move[51] = w.move;
    sc_draw[51] = w.draw;

    //alias
    sc_init["en_bullet_infolaser"] = w.init;
    sc_move["en_bullet_infolaser"] = w.move;
    sc_draw["en_bullet_infolaser"] = w.draw;

    //その場でぐるぐる回ってしばらくしたら目標に向かって飛んでいく
    //-----------------------------------------------------------------------
    w = new sce_en_bullet_turn();

    sc_init[52] = w.init;
    sc_move[52] = w.move;

    //alias
    sc_init["en_bullet_turn"] = w.init;
    sc_move["en_bullet_turn"] = w.move;

    //メッセージ表示(Mission Complite)
    //-----------------------------------------------------------------------
    w = new sce_message_billboard( [
        "Event Message Test",
    	"= Operation Manual. =",
    	"= Z/(X) Attack/Collect =",
    	"= X/(B) Use Item       =",
    	"= C/(A) Jump           =",
    	"========================",
    	"= ESC/START Pause/Quit ="
    
    ], 0);

    sc_init[53] = w.init;
    sc_move[53] = w.move;
    sc_draw[53] = w.draw;

    //alias
    sc_init["message_billboard_cp"] = w.init;
    sc_move["message_billboard_cp"] = w.move;
    sc_draw["message_billboard_cp"] = w.draw;

    //リザルト表示シグナル出力
    //-----------------------------------------------------------------------
    w = new sce_common_signal(835);

    sc_init[54] = w.init;
    sc_move[54] = w.move;

    //alias
    sc_init["common_signal_result"] = w.init;
    sc_move["common_signal_result"] = w.move;

    //Warnning 表示　<!>
    //-----------------------------------------------------------------------
    w = new sce_effect_warnning_mark();

    sc_init[55] = w.init;
    sc_move[55] = w.move;

    //alias
    sc_init["effect_warnning_mark"] = w.init;
    sc_move["effect_warnning_mark"] = w.move;

    //Laser尻尾(敵用）
    //-----------------------------------------------------------------------
    w = new sce_en_bullet_laser_tail();

    sc_init[56] = w.init;
    sc_move[56] = w.move;

    //alias
    sc_init["en_bullet_laser_tail"] = w.init;
    sc_move["en_bullet_laser_tail"] = w.move;

    //メッセージ表示(内容はidで指定　１秒(60フレーム)間
    //-----------------------------------------------------------------------
    w = new sce_message_normal(60);

    sc_init[57] = w.init;
    sc_move[57] = w.move;
    sc_draw[57] = w.draw;

    //alias
    sc_init["message_normal_60"] = w.init;
    sc_move["message_normal_60"] = w.move;
    sc_draw["message_normal_60"] = w.draw;

    //ボス戦開始のお知らせ。
    //-----------------------------------------------------------------------
    w = new sce_message_bosstriger();

    sc_init[58] = w.init;
    sc_move[58] = w.move;
 
    //alias
    sc_init["message_bosstriger"] = w.init;
    sc_move["message_bosstriger"] = w.move;
 
    // Tod追加分
    //-----------------------------------------------------------------------

    //Hit　表示を爆発に(hit)し１秒後に消える。
    //-----------------------------------------------------------------------
    w = new sce_effect_hit();

    //alias
    sc_init["effect_hit"] = w.init;
    sc_move["effect_hit"] = w.move;

    //barrier hit effect.
    w = new sce_effect_hit_shield();

    //alias
    sc_init["effect_hit_shield"] = w.init;
    sc_move["effect_hit_shield"] = w.move;
    sc_draw["effect_hit_shield"] = w.draw;

    //敵の動き。
    //--------------------------------
    w = new sce_enemy_move_std();

    sc_init["enemy_move_std"] = w.init;
    sc_move["enemy_move_std"] = w.move;

    //--------------------------------
    //w = new sce_enemy_move_std2(1, 1240);//240
    w = new sce_enemy_move_std2(20, 240);//240
    //turn_interval,target_distance
    sc_init["enemy_move_std2"] = w.init;
    sc_move["enemy_move_std2"] = w.move;
    sc_draw["enemy_move_std2"] = w.draw;//add.2023/1/14

    //--------------------------------
    
    w = new sce_enemy_move_gen_grow();//add.2023/1/27

    sc_init["enemy_move_gen_grow"] = w.init;
    sc_move["enemy_move_gen_grow"] = w.move;

    //--------------------------------

    //w = new sce_enemy_generator(0, 50, "enemy_move_std2", 1280 );
    w = new sce_enemy_generator(120, 5, "enemy_move_std2", 300 );
    //interval, grow_num, scenario, target_distance
    sc_init["enemy_generator"] = w.init;
    sc_move["enemy_generator"] = w.move;
    sc_draw["enemy_generator"] = w.draw;//add.2024/3/26

    //--------------------------------
    w = new sce_enemy_trbox();

    sc_init["enemy_trbox"] = w.init;
    sc_move["enemy_trbox"] = w.move;
 
    //--------------------------------
     w = new sce_enemy_trbox_mimic();

    sc_init["enemy_mimic"] = w.init;
    sc_move["enemy_mimic"] = w.move;
 
    //-----------------------------------------------------------------------
    w = new sce_enemy_timeover()

    sc_init["enemy_timeover"] = w.init;
    sc_move["enemy_timeover"] = w.move;
    sc_draw["enemy_timeover"] = w.draw;//add.2024/3/26

    // Dd追加分
    //-----------------------------------------------------------------------

    // Vs追加分
    //-----------------------------------------------------------------------
    
    w = new sce_enemy_move_std2(1, 1240);//240
    //turn_interval,target_distance
    sc_init["enemy_move_vst"] = w.init;
    sc_move["enemy_move_vst"] = w.move;
    sc_draw["enemy_move_vst"] = w.draw;//add.2023/1/14

    //--------------------------------
    w = new sce_enemy_generator(0, 50, "enemy_move_vst", 1280 );
    //interval, grow_num, scenario, target_distance
    sc_init["enemy_generator_vst"] = w.init;
    sc_move["enemy_generator_vst"] = w.move;
    sc_draw["enemy_generator_vst"] = w.draw;//add.2024/3/26
    
    //支援機動作　まっすぐのパターン
    //-----------------------------------------------------------------------
    w = new sce_friend_straight();

    sc_init["friend_straight"] = w.init;
    sc_move["friend_straight"] = w.move;
 
    //支援機動作　ブーメランのパターン
    //-----------------------------------------------------------------------
    w = new sce_friend_boom();

    sc_init["friend_boom"] = w.init;
    sc_move["friend_boom"] = w.move;

    //支援機動作　回転２
    //-----------------------------------------------------------------------
    w = new sce_friend_rotate_full();

    sc_init["friend_rotate_full"] = w.init;
    sc_move["friend_rotate_full"] = w.move;

    //支援機動作　停滞
    //-----------------------------------------------------------------------
    w = new sce_friend_front();

    sc_init["friend_front"] = w.init;
    sc_move["friend_front"] = w.move;

    // wVSc追加分
    //-----------------------------------------------------------------------
    w = new sce_effect_informationCursor();

    sc_init["effect_informationCursor"] = w.init;
    sc_move["effect_informationCursor"] = w.move;
    sc_draw["effect_informationCursor"] = w.draw;
    //-----------------------------------------------------------------------
    w = new sce_friend_option(0);

    sc_init["sce_friend_option_0"] = w.init;
    sc_move["sce_friend_option_0"] = w.move;
    sc_draw["sce_friend_option_0"] = w.draw;
    //-----------------------------------------------------------------------
    w = new sce_friend_option(1);

    sc_init["sce_friend_option_1"] = w.init;
    sc_move["sce_friend_option_1"] = w.move;
    sc_draw["sce_friend_option_1"] = w.draw;
    //-----------------------------------------------------------------------
    w = new sce_friend_option(2);

    sc_init["sce_friend_option_2"] = w.init;
    sc_move["sce_friend_option_2"] = w.move;
    sc_draw["sce_friend_option_2"] = w.draw;
    //-----------------------------------------------------------------------
    w = new sce_friend_option(3);

    sc_init["sce_friend_option_3"] = w.init;
    sc_move["sce_friend_option_3"] = w.move;
    sc_draw["sce_friend_option_3"] = w.draw;
    //-----------------------------------------------------------------------
    w = new sce_pl_bullet_rotate_circle();

    sc_init["pl_bullet_rotate_circle"] = w.init;
    sc_move["pl_bullet_rotate_circle"] = w.move;

    //=============================================================================
    //ExEvent処理用シナリオ
    //-----------------------------------------------------------------------
    w = new sce_exev_3way();

    sc_init[100] = w.init;
    sc_move[100] = w.move;

    //alias
    sc_init["exev_3way"] = w.init;
    sc_move["exev_3way"] = w.move;

    //-----------------------------------------------------------------------
    w = new sce_exev_5way_nallow();

    sc_init[102] = w.init;
    sc_move[102] = w.move;

    //alias
    sc_init["exev_5way_nallow"] = w.init;
    sc_move["exev_5way_nallow"] = w.move;

    //-----------------------------------------------------------------------
    w = new sce_exev_5way_normal();

    sc_init[103] = w.init;
    sc_move[103] = w.move;

    //alias
    sc_init["exev_5way_normal"] = w.init;
    sc_move["exev_5way_normal"] = w.move;

    //-----------------------------------------------------------------------
    w = new sce_exev_5expansion();

    sc_init[104] = w.init;
    sc_move[104] = w.move;

    //alias
    sc_init["exev_5expansion"] = w.init;
    sc_move["exev_5expansion"] = w.move;

    //-----------------------------------------------------------------------
    w = new sce_exev_3way_exp();

    sc_init[104] = w.init;
    sc_move[104] = w.move;

    //alias
    sc_init["exev_3way_exp"] = w.init;
    sc_move["exev_3way_exp"] = w.move;

    //-----------------------------------------------------------------------
    w = new sce_message_signal("warning");

    //alias
    sc_init["signal_warning"] = w.init;
    sc_move["signal_warning"] = w.move;

    // No.106- empty
    //-----------------------------------------------------------------------




    //=============================================================================

    sc.init = sc_init;
    sc.draw = sc_draw;
    sc.move = sc_move;

    return sc;
}
