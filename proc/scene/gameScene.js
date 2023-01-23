//gameScene
//ゲーム本体部分のループや画面推移を管理する予定
//タイトルなどは別シーンとして管理すればいいかも
//（デバッグ表示やカーソル表示、FPS表示などのゲーム部分と
//別になる部分と分離して管理しやすくするのが目的。
//
function gameScene(state){
//dev deviceControlClass 

    //宣言部
    var dev = state.System.dev;

	var work = dev.graphics[1];//1
    var work2 = dev.graphics[0];//0
    var work3 = dev.graphics[3];//3
    var forgroundBG = dev.graphics[2];//2

	work2.backgroundcolor = "black";

	this.init = game_init;
	this.reset = game_reset;
	this.step = game_step;
	this.draw = game_draw;

	this.score = 0;

	var obCtrl;// = new gObjectControl(dev.graphics1, dev);
	var mapsc;//  = new mapSceControl();

	var escore;

	//var scr_cnt = 0;
	var dead_cnt = 0;

	var tex_bg = [];
	var mapChip = [];
	var bgData = [];

	//var ldflg = false;

	var bg_scroll = true;
	var scroll_x = 0;
	var scroll_y = 0;
	var scrollsw = 0;

	//var scenechange = false;

	var enemy_combo = 0;
	var item_combo = 0;
	//var ec_draw_count = 0;

	//var sndcf = false;

	var mapdisp = false;
	var lampf = false;

	//var mapv = false;

	var fdrawcnt = 0;


	//縮小マップ枠
	var SubmapframeDraw = {}
	SubmapframeDraw.draw = function (device) {
	    device.beginPath();
	    device.fillStyle = "rgba(0,0,0,0.3)";
	    device.fillRect(dev.layout.map_x, dev.layout.map_y, 150, 150);
	    /*
		device.beginPath();
	    device.strokeStyle = "rgba(0,0,255,0.5)";
	    device.rect(dev.layout.map_x, dev.layout.map_y, 150, 150);
	    device.stroke();
		*/
	}

	//一番下の行消す(clipすんのがいいかも
	var ButtomlineBackgroundDraw = {}
	ButtomlineBackgroundDraw.draw = function (device) {
	    device.beginPath();
	    device.fillStyle = "rgba(0,0,0,0.5)";
	    device.fillRect(0, 480 - 36, 640 - 13 * 13, 36);
	}
    //hpbar
	var HpbarDraw = { hp: 0, mhp: 0, br: true }
	HpbarDraw.draw = function (device) {
	    device.beginPath();
	    device.fillStyle = (this.br) ? "skyblue" : "limegreen";
	    device.lineWidth = 1;
	    device.fillRect(dev.layout.hp_x + 1, dev.layout.hp_y + 1, (this.hp/this.mhp)*100, 14);
	    device.stroke();

	    device.beginPath();
	    device.strokeStyle = "white"; 
	    device.lineWidth = 1;
	    device.rect(dev.layout.hp_x, dev.layout.hp_y, 102, 15);
	    device.stroke();
	}
	//縮小マップ表示
	var SubmapDraw = { mcp : mapChip, draw :
		 function (device) {
			for (var i = 0, loopend = this.mcp.length; i < loopend; i++) {
				var mc = this.mcp[i];
				if (mc.lookf){
					//if ((mc.visible) && ((mc.type == 11) || (mc.type == 12))) {
					if (mc.visible) {
						var c = ["dimgray", "steelblue", "orange"];

						device.beginPath();
						//device.strokeStyle = (mc.type == 12) ? "orange" : "blue";
						device.strokeStyle = c[mc.type -10];
						device.lineWidth = 1;
						device.rect(dev.layout.map_x + mc.x / 20, dev.layout.map_y + mc.y / 20, 2, 2);
						device.stroke();
					}
				}
			}
		}
	}
	//forgroundBG.putFunc(cl);//submapは[2]に表示、点は[3]に表示に変更

	mapdisp = true;




	//処理部

	function game_init(){

		obCtrl = new gObjectControl(work, state);
		mapsc = new mapSceControl();

		mapsc.init();

		state.Result.load();

		//state.Result.highscore = 0;
		state.Result.score = 0;
		state.Game.item = obCtrl.item;
		state.Result.combo = obCtrl.combo;

		scenechange = false;
	}

	function game_reset(contflg) {
	    //ゲーム画面の描画を開始(Flip/Drawを自動で実行　各フレームで)
		dev.graphics[0].setInterval(1);//BG
		dev.graphics[1].setInterval(1);//SPRITE
		dev.graphics[2].setInterval(1);//FG
		
	    work3.clear();

	    if (!Boolean(contflg)) { contflg = false; }
	    scenechange = false;

	    if (state.Game.cold) {//タイトル画面から始めた場合

	        obCtrl.reset(false);
	        mapsc.init();

	        if (contflg) {//Continue
	            dead_cnt = 2 - state.Game.player.zanki;

	            obCtrl.item = state.Game.item;
	            obCtrl.itemstack = state.Game.itemstack;

	            //state.Game.nowstage = state.Config.startstage;

	            //state.Game.player.maxhp = 10;
	            //state.Game.player.hp = state.Game.player.maxhp;
	        } else {//InitialStart
	            dead_cnt = 0;
	            state.Game.nowstage = state.Config.startstage;

	            state.Game.player.maxhp = 100;
	            state.Game.player.hp = state.Game.player.maxhp;

	            state.Game.player.weapon = 0; //wand
	        }
	        state.Game.player.barrier = false;//バリア中オンにする

	        mapsc.change(state.Game.nowstage);
	        mapsc.reset(); //初期マップ展開

	        bg_scroll = true;
	        scroll_x = 0;
	        scroll_y = 0;
	        scrollsw = 0;

	        dev.sound.change(0);
	        dev.sound.play();
	    }

	    ec_draw_count = 0;

	    if ((contflg = true) && (!state.Game.cold)) {//result画面から戻ってきた場合
	        //stage推移
	        w = mapsc.stage;
	        w++;
	        //if ( w > 5 ) w = 1;//ステージ最終面だった場合最初に戻る。エンディングがある場合は変更
	        mapsc.change(w);
	        mapsc.stage = w;
	        state.Game.nowstage = w;
	        var wsc = obCtrl.score;
	        obCtrl.reset(false); //continueflag無しでリセットするとスコアも消されてしまうため、事前に取っておく
	        obCtrl.score = wsc;
	        mapsc.reset(); //初期マップ展開 今回はこれでいいと思われる

	        //mapsc.start(true); //マップ初期配置のものを展開する。

	        scroll_y = 0;
	        scrollsw = 0;
	    }

	    //tex_bg = dev.images[mapsc.bgImage()];
	    tex_bg = dev.game.asset.image[mapsc.bgImage()].img;

		mapChip = mapsc.mapChip();
	    bgData = mapsc.bgPtn();

		SubmapDraw.mcp = mapChip; 
	    //work2.clear("darkgreen");

	    //work2.reset();

	    escore = new gs_score_effect(obCtrl.score);
	    ehighscore = new gs_score_effect(state.Result.highscore);

	    sndcf = true;

		lampf = state.Config.lamp_use ? true : false;
	    mapdisp = state.Config.map_use ? false : true;
	    mapv = false;
	   //debug code-- 2023/01/07
		//lampf = true ;
	    //mapdisp = false;
		//^^^^^
	}

	function game_step() {
		dev.gs.commit();

	    if (!dev.sound.running()) {
	        if (mapsc.flame < 7200) {
	            dev.sound.change(1);

	        } else {
	            dev.sound.change(3);

	        }
	        dev.sound.play();
	    }

		if (mapsc.flame == 7100) {
	        dev.sound.change(2);
	        dev.sound.play();

	        //dev.sound.next(3);

	        sndcf = false;
	    }

	    //ゲームの進行
	    if (obCtrl.interrapt) {
	        if (obCtrl.SIGNAL == 1) {
	            mapsc.enable = false;
	            mapsc.counter_runnning = false;

	            dev.sound.volume(0.0);
	        }

	        if (obCtrl.SIGNAL == 6055) {//boss戦に入ったのでマップシナリオカウント停止
	            if (scroll_y == 0) bg_scroll = false;
	            mapsc.enable = true;
	            mapsc.counter_runnning = false;
	        }

	        if (obCtrl.SIGNAL == 835) {//リザルト画面要求(面クリアー処理予定

	            obCtrl.score += Math.floor((7200 - mapsc.flame) / 6);

	                state.Result.score = obCtrl.score;
	                state.Game.item = obCtrl.item;
	                state.Game.itemstack = obCtrl.itemstack;
	                state.Game.player.zanki = 2 - dead_cnt;
	                state.Result.combo = obCtrl.combo;
	                state.Result.combomax = obCtrl.combomax;
	                state.Result.obCount = obCtrl.obCount;
	                state.Result.total = obCtrl.total;
	                state.Result.hidan = obCtrl.hidan;

	                state.Game.cold = false;

	                obCtrl.interrapt = false;
	                obCtrl.SIGNAL = 0;

	                obCtrl.draw(work2);

	                scenechange = true;

	                dev.sound.change(4);
	                dev.sound.play();

	                return 5; //result
	        }

	        if (obCtrl.SIGNAL == 4649) {//リスターとシグナルが来た(自機が死んで3.0sec位あと）
	            dead_cnt++;
	            if (dead_cnt < 3) {
	                if (state.Config.itemreset) {
	                    obCtrl.item = []; //取得アイテムカウント消す(パワーアップだけでもよいがとりあえず）
	                    obCtrl.itemstack = [];
	                }
	                obCtrl.combo = [];
	                //state.Game.player.maxhp = 10;//ゲームオーバーまで体力上昇分を保留する。2012/04/04
	                state.Game.player.hp = state.Game.player.maxhp;

	                obCtrl.restart();

	                mapsc.counterReset();

	                sndcf = false;
	            } else {

	                state.Result.score = obCtrl.score; ;
	                state.Game.item = obCtrl.item;
	                state.Game.itemstack = obCtrl.itemstack;
	                state.Game.player.zanki = 2 - dead_cnt;
                    state.Result.combo = obCtrl.combo;
                    state.Result.combomax = obCtrl.combomax;
                    state.Result.obCount = obCtrl.obCount;
                    state.Result.total = obCtrl.total;
                    state.Result.hidan = obCtrl.hidan;

                    obCtrl.draw(work2);

                    scenechange = true;

                    if (Boolean(localStorage)) { //ローカルストレージ使えたらハイスコア記録しとく
                        localStorage.setItem("highscore", new String(state.Result.highscore));
                    }

                    dev.sound.change(6);
                    dev.sound.play();

	                return 3; //gover
	            }
	        }
	    } else {
	        bg_scroll = true;
	        mapsc.enable = true;
	        mapsc.counter_runnning = true;
	        //			demo_mode = false;
	    }

	    //item
	    for (i in obCtrl.item) {
		//	
			/*
			switch(i){
				case 15://wand
		            if (obCtrl.item[15] > 0) {
		                obCtrl.item[15] = 0;
	    	            state.Game.player.weapon = 0;
	        	        //dev.sound.effect(9); //cursor音
	            	}
					break;
				case 16://sword
		            if (obCtrl.item[16] > 0) {
		                obCtrl.item[16] = 0;
	    	            state.Game.player.weapon = 1;
	        	        //dev.sound.effect(9); //cursor音
	            	}
					break;
				case 17://axe
		            if (obCtrl.item[17] > 0) {
		                obCtrl.item[17] = 0;
	    	            state.Game.player.weapon = 2;
	        	        //dev.sound.effect(9); //cursor音
	            	}
					break;
				case 18://boom
		            if (obCtrl.item[18] > 0) {
		                obCtrl.item[18] = 0;
	    	            state.Game.player.weapon = 4;
	        	        //dev.sound.effect(9); //cursor音
	            	}
					break;
				case 19://spare
	            	if (obCtrl.item[19] > 0) {
	               		obCtrl.item[19] = 0;
	                	state.Game.player.weapon = 3;
	                	//dev.sound.effect(9); //cursor音
	            	}
					break;
				case 21://extend
					if (obCtrl.item[21] > 0) {
	                	obCtrl.item[21] = 0;
	                	dead_cnt--;
	                	dev.sound.effect(11); //get音
					}
					break;
				case 26://lamp
		            if (obCtrl.item[26] > 0) {
		                obCtrl.item[26] = 0;
	    	            lampf = true;
	        	        //dev.sound.effect(9); //cursor音
	            	}
					break;
				case 27://map
		            if (obCtrl.item[27] > 0) {
		                obCtrl.item[27] = 0;
	    	            mapdisp = false;
	        	        //dev.sound.effect(9); //cursor音
	        	    }
					break;
				default:
					break;
			}
		}
		*/
			if (i == 21) {//extend
	            if (obCtrl.item[21] > 0) {
	                obCtrl.item[21] = 0;
	                dead_cnt--;
	                dev.sound.effect(11); //get音
	            }
	        }
	        if (i == 26) {//lamp
	            if (obCtrl.item[26] > 0) {
	                obCtrl.item[26] = 0;
	                lampf = true;
	                //dev.sound.effect(9); //cursor音
	            }
	        }
	        if (i == 27) {//map
	            if (obCtrl.item[27] > 0) {
	                obCtrl.item[27] = 0;
	                mapdisp = false;
	                //dev.sound.effect(9); //cursor音
	            }
	        }
	        //weapons
	        if (i == 15) {//wand
	            if (obCtrl.item[15] > 0) {
					if (state.Game.player.weapon == 0){
						
					}
		            obCtrl.item[15] = 0;
	                state.Game.player.weapon = 0;
	                //dev.sound.effect(9); //cursor音
	            }
	        }
	        if (i == 16) {//sword
	            if (obCtrl.item[16] > 0) {
					if (state.Game.player.weapon == 1){

					}
					obCtrl.item[16] = 0;
	                state.Game.player.weapon = 1;
	                //dev.sound.effect(9); //cursor音
	            }
	        }
	        if (i == 17) {//axe
	            if (obCtrl.item[17] > 0) {
					if (state.Game.player.weapon == 2){

					}
		            obCtrl.item[17] = 0;
	                state.Game.player.weapon = 2;
	                //dev.sound.effect(9); //cursor音
	            }
	        }
	        if (i == 19) {//spare
	            if (obCtrl.item[19] > 0) {
					if (state.Game.player.weapon == 3){

					}
					obCtrl.item[19] = 0;
	                state.Game.player.weapon = 3;
	                //dev.sound.effect(9); //cursor音
	            }
	        }
	        if (i == 18) {//boom
	            if (obCtrl.item[18] > 0) {
					if (state.Game.player.weapon == 4){

					}
		            obCtrl.item[18] = 0;
	                state.Game.player.weapon = 4;
	                //dev.sound.effect(9); //cursor音
	            }
	        }

	    }
        //

	    var w = 0;
	    var w2 = 1;
        for (i in obCtrl.combo){
            if (i == 2) w = obCtrl.combo[i];
            if (i == 4) w2 = obCtrl.combo[i];
        }
        if (enemy_combo != w) {
            enemy_combo = w;

            if (enemy_combo >= 2) {
                ec_draw_count = 60;
            }
        }   

        if (item_combo != w2) {
            item_combo = w2;
        } 

	    if (!obCtrl.interrapt) {
	        obCtrl.move(mapsc);
	        mapsc.step(obCtrl);
	    } else {
	        if (obCtrl.SIGNAL != 1) {
	            obCtrl.move(mapsc);
	            mapsc.step(obCtrl);
	        } else {
	            //var mstate = dev.mouse_state.check_last();
	            var kstate = dev.key_state.check();

	            var zkey = false;
	            if (Boolean(kstate[90])) {
	                if (kstate[90]) {//↓
	                    zkey = true;
	                }
	            }
	            if (Boolean(kstate[32])) {
	                if (kstate[32]) {//↓
	                    zkey = true;
	                }
	            }

	            var qkey = false;
	            if (Boolean(kstate[81])) {
	                if (kstate[81]) {//↓
	                    qkey = true;
	                    delete(kstate[81]);// = false;//押しっぱなし検出する為、予防
	                }
	            }

	            if (qkey) {
	                state.Game.item = obCtrl.item;
	                state.Game.itemstack = obCtrl.itemstack;
	                state.Game.player.zanki = 2 - dead_cnt;

	                if (state.Game.save() == 0) {
	                    //alert("ゲーム中断セーブ実施しました。\nタイトルに戻ります。");

	                    dev.sound.volume(1.0);
	                    dev.sound.change(9);
	                    dev.sound.play();

                        
	                    return 2;
	                } else {
	                    alert("ローカルストレージが使えません。\n中断セーブ出来なかったので、\nゲーム継続します。");

	                    zkey = true;
	                }
	            }

	            if (zkey) {
	                obCtrl.interrapt = false;
	                obCtrl.SIGNAL = 0;

	                dev.sound.volume(1.0);
	            }
	            //if (mstate.button == 1) obCtrl.interrapt = false;
	        }
	    }

	    if (bg_scroll) scroll_y++;
	    if (scroll_y > 480) {
	        scroll_y = 0;
	        scrollsw = 1 - scrollsw;
	    }

	    if (state.Result.highscore < obCtrl.score) state.Result.highscore = obCtrl.score;

	    return 0;
	}

	function game_draw() {
    /*
	this.BackSurfaceDraw();
	obCtrl.draw();
	this.FrontSurfaceDraw();
	return;
    */
	    //	   work2.putImageTransform(tex_bg, 0, scroll_y - (480 * (1 - scrollsw)), 1, 0, 0, -1);

	    //scenechange = true;
        
	    if ((scroll_x != dev.gs.world_x) || (scroll_y != dev.gs.world_y)) {

	        //scenechange = false;

	        scroll_x = dev.gs.world_x;
	        scroll_y = dev.gs.world_y;
		}else{
			//debug
			//forgroundBG.putchr("scenechange", 100, 100);
		}
	    
        //scenechange = false;
		//if (!scenechange) {
		function BGDraw() {
	            for (var i in mapChip) {
	                var mc = mapChip[i];

	                if (dev.gs.in_stage_range(mc.x, mc.y, mc.w, mc.h)) {
	                    mc.view = true;//視界に入っている（当たり判定有効扱いの為のフラグ）
	                    var w = dev.gs.worldtoView(mc.x, mc.y);

	                    if (mc.visible) {//表示するマップチップ（当たり判定用で表示しないものもあるため）
							mc.lookf = true;　//画面内に入ったことがあるフラグ
	                        var wfg = false;
							if (mc.type == 11) wfg = true; //Forground表示のパターン(壁)
	                        //if (Boolean(tex_bg[mc.no])) {
	                        if (Boolean(bgData[mc.no])) {
	                            if (wfg) {
									var shiftx = 0;
									var shifty = -24;
									shiftx = Math.trunc((w.x - dev.gs.viewwidth/2) /24);
									shifty = Math.trunc((w.y - dev.gs.viewheight/2) /24);
									/*
									forgroundBG.putPattern(
										tex_bg, bgData[mc.no], 
										w.x + shiftx/2,
										w.y + shifty/2,
										mc.w,// + Math.abs(shiftx)+1, 
										mc.h // + Math.abs(shifty)+1
									);
									*/	
										forgroundBG.putPattern(
										tex_bg, bgData[mc.no], 
										w.x + shiftx,// - Math.abs(shiftx)/2,
										w.y + shifty,// - Math.abs(shifty)/2,
										mc.w,// + Math.abs(shiftx)/2, 
										mc.h //+ Math.abs(shifty)/2
									);
									//work2.putPattern(tex_bg, bgData[mc.no], w.x, w.y, mc.w, mc.h);
								} else {
									work2.putPattern(
										tex_bg, bgData[mc.no], 
										w.x, 
										w.y, 
										mc.w, mc.h
									);
								}
	                            //work2.putchr(Number(mc.no).toString(), w.x, w.y);
	                        } else {
	                            var cl = {}
	                            cl.x = w.x;
	                            cl.y = w.y;
	                            cl.w = mc.w;
	                            cl.h = mc.h;

	                            cl.draw = function (device) {
	                                device.beginPath();

	                                device.strokeStyle = "green";
	                                device.lineWidth = 1;
	                                device.rect(this.x, this.y, this.w, this.h);
	                                device.stroke();
	                            }

	                            work2.putFunc(cl);
	                            //work2.putchr(Number(mc.no).toString(), w.x, w.y);
	                        }
	                    }
	                    
						//壁の当たり判定有無確認用のデバックコード
                        if (state.Config.debug){
	                    	if (mc.c) {
	                        	var cl = {}
	                        	cl.x = w.x;
	                        	cl.y = w.y;
	                        	cl.w = mc.w;
	                        	cl.h = mc.h;

	                        	cl.draw = function (device) {
	                            	device.beginPath();

	                            	device.strokeStyle = "green";
	                            	device.lineWidth = 3;
	                            	device.rect(this.x, this.y, this.w, this.h);
	                            	device.stroke();
	                        	}

	                        	work2.putFunc(cl);
								forgroundBG.putFunc(cl);
	                    	}
	                    	//work2.putchr((mc.type).toString(16), w.x, w.y);
						}
	                } else {
	                    mc.view = false;
	                }
	            }

	            //縮小マップ枠
                /*
	            var cl = {}
	            cl.draw = function (device) {
	                device.beginPath();
	                device.fillStyle = "rgba(0,0,0,0.3)";
	                device.fillRect(dev.layout.map_x, dev.layout.map_y, 150, 150);
	            }
                */
                if (!mapdisp || lampf) {
					forgroundBG.putFunc(SubmapframeDraw);
					if (!mapdisp) work3.putFunc(SubmapDraw);//mapdispはfalseで表示(今となってはなぜかわからん/そのうち修正)
					obCtrl.drawPoint(work3, lampf);
				}
				//if (!mapdisp) work3.putFunc(SubmapDraw);
				//obCtrl.drawPoint(forgroundBG, lampf); //Forground[2]へ表示
	            //if (lampf) obCtrl.drawPoint(work3, lampf); //g[3]へ表示

	            //一番下の行消す(clipすんのがいいかも
                /*
	            var cl = {}
	            cl.draw = function (device) {
	                device.beginPath();
	                device.fillStyle = "rgba(0,0,0,0.5)";
	                device.fillRect(0, 480 - 36, 640 - 13* 13, 36);
	            }
                */
	            forgroundBG.putFunc(ButtomlineBackgroundDraw);
        }
		
		function BGShadowDraw() {
			for (var i in mapChip) {
				var mc = mapChip[i];

				if (dev.gs.in_stage_range(mc.x, mc.y, mc.w, mc.h)) {
					mc.view = true;//視界に入っている（当たり判定有効扱いの為のフラグ）
					var w = dev.gs.worldtoView(mc.x, mc.y);

					if (mc.visible) {//表示するマップチップ（当たり判定用で表示しないものもあるため）
						if (mc.type == 11) {//Forground表示のパターン(壁)に影をつける

							var shiftx = 0;
							var shifty = -24;
							shiftx = Math.trunc((w.x - dev.gs.viewwidth/2) /24) + 4;
							shifty = Math.trunc((w.y - dev.gs.viewheight/2) /24) + 4;

							var cl = {}
							cl.x = w.x - shiftx;
							cl.y = w.y - shifty;
							cl.w = mc.w;
							cl.h = mc.h;

							cl.draw = function (device) {
								device.beginPath();

								device.fillStyle = "rgba(0,0,0,0.6)"//"blue";
								//device.lineWidth = 1;
								device.fillRect(this.x, this.y, this.w, this.h);
							}
							work2.putFunc(cl);
							//work2.putchr(Number(mc.no).toString(), w.x, w.y);
						}
					}
				}
			}
		}
		
		BGDraw();
		BGShadowDraw(); 
        //==この↑は背景描画
		obCtrl.drawShadow(work2);//objectのshadowを背景面に反映
	    obCtrl.draw(work);
//	    obCtrl.drawPoint(work);

	    //==　ここから文字表示画面（出来るだけ書き換えを少なくする）
	    //プライオリティ最前面の画面追加したので
	    var scdispview = false;
        
	    fdrawcnt++;
	    if ((fdrawcnt % 6) == 0) {
	        fdrawcnt = 0;
	        scdispview = true;
	    }
        
	    var scdispview = true;//debug

	    if (scdispview) {

	        var wtxt = [];

	        work3.fill(dev.layout.hiscore_x + 12 * 6, dev.layout.hiscore_y, 12 * 7, 32); // , "darkblue");

	        wt = ehighscore.read(state.Result.highscore);
	        //work3.putchr("Hi-Sc:" + wt, dev.layout.hiscore_x, dev.layout.hiscore_y);
			work3.putchr("Hi-Sc:" + wt, dev.layout.hiscore_x, dev.layout.hiscore_y);

	        wt = escore.read(obCtrl.score);
	        //work3.putchr("Score:" + wt, dev.layout.score_x, dev.layout.score_y);
	        work3.putchr("Score:" + wt, dev.layout.score_x, dev.layout.score_y);

	        //残機表示
	        var zc = 2 - dead_cnt;

	        if (zc < 3) {
	            for (var i = 0; i < 2 - dead_cnt; i++) {
	                work3.put("Mayura1", dev.layout.zanki_x + i * 32, dev.layout.zanki_y);
	            }
	        } else {
	            work3.put("Mayura1", dev.layout.zanki_x, dev.layout.zanki_y);
	            work3.putchr8("x" + zc, dev.layout.zanki_x + 16, dev.layout.zanki_y);
	        }

			//document.getElementById("manual_1").innerHTML += ".";

	        //ball表示
	        if (Boolean(obCtrl.item[20])) {
	            var n = obCtrl.item[20];
	            if (n <= 8) {
	                //n = 16;

	                for (var i = 0; i < n; i++) {
	                    work3.put("Ball1",
                        dev.layout.zanki_x + i * 20 + 288, dev.layout.zanki_y - 8);
	                }
	            } else {
	                work3.put("Ball1",
                    dev.layout.zanki_x + 288, dev.layout.zanki_y - 8);

	                work3.putchr8("x" + n, dev.layout.zanki_x + 288 + 10, dev.layout.zanki_y - 12);
	            }
	        }

	        //取得アイテム表示
	        if (Boolean(obCtrl.itemstack)) {

	            var wchr = { 20: "Ball1", 23: "BallB1", 24: "BallS1", 25: "BallL1" }
	            var witem = [];

	            for (var i in obCtrl.itemstack) {
	                var w = obCtrl.itemstack[i];
	                witem.push(w);
	            }

	            work3.putchr8("[X]", dev.layout.zanki_x + 132 - 16, dev.layout.zanki_y - 16);
	            n = witem.length;

	            if (n >= 18) n = 18;
	            //if (n >= 7) n = 7;

	            for (var i = 0; i < n; i++) {

	                if (i == 0) {
	                    work3.put(wchr[witem[witem.length - 1 - i]],
                        dev.layout.zanki_x + i * 20 + 132, dev.layout.zanki_y);
	                    //640 - (12 * 12), 479 - 32 + 5);
	                } else {
	                    work3.put(wchr[witem[witem.length - 1 - i]],
                        dev.layout.zanki_x + i * 20 + 136, dev.layout.zanki_y + 8);
	                }
	            }
	        }

	        n = 0;
	        if (Boolean(obCtrl.item[22])) {
	            n = obCtrl.item[22];
	        }
	        if (n > 0) work3.put("Key", dev.layout.zanki_x + 64, dev.layout.zanki_y);

	        var wweapon = ["Wand", "Knife", "Axe", "Boom", "Spear"];

	        if (!Boolean(state.Game.player.weapon)) state.Game.player.weapon = 0;

	        work3.putchr8("[Z]", dev.layout.zanki_x + 96 - 16, dev.layout.zanki_y - 16);
	        work3.put(wweapon[state.Game.player.weapon], dev.layout.zanki_x + 96, dev.layout.zanki_y);

	        work3.putchr("Stage " + mapsc.stage, dev.layout.stage_x, dev.layout.stage_y);

	        work3.putchr("Time:" + Math.floor((7200 - mapsc.flame) / 6), dev.layout.time_x, dev.layout.time_y);

	        //work3.putchr8("ITEM", dev.layout.hp_x , dev.layout.hp_y - 40);

	        var w_hp = (state.Game.player.hp > 0) ? state.Game.player.hp : 0;

	        HpbarDraw.hp = w_hp; 
            HpbarDraw.mhp = state.Game.player.maxhp;
            HpbarDraw.br = state.Game.player.barrier;
	        work3.putFunc(HpbarDraw);
           
            var wst = "HP:" + w_hp + "/" + state.Game.player.maxhp;

            if (state.Game.player.barrier) {
                wst = "HP:" + w_hp +"/SHIELD";       
			}
	        work3.putchr8(wst, dev.layout.hp_x + 8, dev.layout.hp_y + 4);
	    }

        if (obCtrl.interrapt){
			if (obCtrl.SIGNAL == 1) {
            	work3.putchr(" == PAUSE ==", 320 - 50, 200);
            	work3.putchr("Push <Z>key or [Space] ", 320 - 100, 220);
            	work3.putchr(" Return game.", 320 - 50, 240);
            	work3.putchr("Push <Q>key /", 320 - 100, 260);
            	work3.putchr("Save and Quit.", 320 - 50, 280); 
        	} else {
            	work3.fill(320 - 100, 200, 12 * 24, 20 * 5);
        	}
		}
            //work.putchr(dev.sound.info() + "." + dev.sound.running(), 320 - 50, 260);

        //debug　true　の場合以下表示
        if (state.Config.debug) {
            var wtxt = [];

	        wtxt.push("o:" + obCtrl.cnt() + "/" + obCtrl.num() + "/" + obCtrl.nonmove);
	        wtxt.push("f:" + mapsc.flame);

	        if (obCtrl.interrapt) {
	            wtxt.push("interrapt:" + obCtrl.SIGNAL);
	        } else {
	            wtxt.push("running:" + obCtrl.SIGNAL);
	        }

	        for (i in obCtrl.item) {
	            wtxt.push("item[" + i + "]:" + obCtrl.item[i]);
	        }

			var n1 = 0;
	        for (i in obCtrl.total) {
	            if (i == 2) n1 = obCtrl.total[i];
	        }

	        var n2 = 1;
	        for (i in obCtrl.obCount) {
	            if (i == 2) n2 = obCtrl.obCount[i];
	        }

	        wtxt.push("wx,wy:" + Math.floor(dev.gs.world_x) + "," + Math.floor(dev.gs.world_y));
	        wtxt.push("play:" + Math.floor(dev.sound.info()) + "." + dev.sound.running() );

	        for (var s in wtxt) {
	            work.putchr8(wtxt[s], dev.layout.status_x, dev.layout.status_y + 8 * s);
	        }
	    }

	    if (scdispview) {
//	        work3.clear();
	        //	        work3.fill(480, 0, 5, 480, "blue");
	    //    work3.fill(0, 480-48, 640, 48);//, "darkblue");
	        //work3.draw();
	        //work3.reset();
	    }

		if (!mapdisp){ mapv = true; }
	    //mapdisp = false;
		/*
	    if (mapv) {

	        //work3.fill(dev.layout.map_x, dev.layout.map_y, 150, 150);
	        //work3.fill(dev.layout.map_x, dev.layout.map_y, 150, 150);

	        var cl = {};

	        cl.mcp = mapChip;

	        cl.draw = function (device) {

	            for (var i = 0, loopend = this.mcp.length; i < loopend; i++) {
                	var mc = this.mcp[i];
					if (mc.lookf){
	                	//if ((mc.visible) && ((mc.type == 11) || (mc.type == 12))) {
	                	if (mc.visible) {
							var c = ["dimgray", "steelblue", "orange"];

							device.beginPath();
	                    	//device.strokeStyle = (mc.type == 12) ? "orange" : "blue";
	                    	device.strokeStyle = c[mc.type -10];
							device.lineWidth = 1;
	                    	device.rect(dev.layout.map_x + mc.x / 20, dev.layout.map_y + mc.y / 20, 2, 2);
	                    	device.stroke();
	                	}
					}
	            }
	        }
	        work3.putFunc(cl);
	        //forgroundBG.putFunc(cl);//submapは[2]に表示、点は[3]に表示に変更

	        mapdisp = true;
	    } 
		*/          
	}
}

function gs_score_effect( sc ){

    var wscore = sc;

    this.read = function (score) {

        if (score <= wscore) {
            wscore = score;
        } else {

            var num = Math.ceil((score - wscore) / 5);

            wscore += num;
        }

        var sc = wscore;

        var wd = [];
        var wt = "";

        for (i = 0; i < 7; i++) {
            var num = sc % 10;
            wd[7 - i] = num;
            sc = (sc - num) / 10;
        }

        for (i in wd) {
            wt = wt + "" + wd[i];
        }

        return wt;
    }
}

