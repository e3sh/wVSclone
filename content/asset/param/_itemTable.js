//　アイテム定義　//2023/01/25新規
//
//　アイテム設定値
//	
//　ID  ：  (任意の重複しない名称・数値)拾うアイテムの場合はcharactorでIDに設定する。0はID無として使用するので無し。
//　name    :表示名
//  graph   :looks   :spname(グラフィックス/Infoにつけてもいい)
//	type    :   1:EQUIPMENT，2:ITEM，3:EXRARE，4:POINT/　装備品・物品・特殊品・スコア
//  get     :   function or (bool)false /get時の拡張function　あれば実行するようにする。 
//  equip   :   function or (bool)false /装備可能の場合、装備時実行する。
//　use     :   function or (bool)false /使用可能の場合、使用時実行する。
//　exrare  :   function or (bool)false /特殊機能・効果(使い方未定・未実装・別機能にするかも)
//　inspect :   function or (bool)false /鑑定可能の場合・鑑定時実行(？未実装・別機能にするかも)
//　param(0):   アイテムにより使い方を変える各種パラメータ(functionは同じで数値が異なるアイテムなど)
//　param(1):   -   回復量や攻撃力
//　param(2):   -   使用回数や性能
//　param(3-5): -   (処理による)
//　unk_name:   unknownName    未鑑定時の表示名 空白時または無しの場合は表示名と同じにする？(処理による）
//　info    :   information    説明文
//
// Sorcerianの星式のようにパラメータ強化式とするほうが楽かも(equipで該当項目強化/useで一時強化.回復)ITEMの場合
// Function種類(ADD_S_I,ADD_S_V,MUL_S_I,LD_S_Imidiate,SUM_S_V) CMD TARGET VALUE ARRAYNUMBER
//              0,1,2,3,4,5,6,7,8,9,10
//  const sn = ["LV", "HP", "MP", "STR", "DEX", "AGI", "VIT", "INT", "MND", "LAK", "ETC"];

function itemTable(){

    const EQUIPMENT = 1, ITEM = 2, EXRARE = 3, POINT = 4;

	let it = [
//	ID, name, graph, type, get, equip, use, exrare, inspect, p0, p1, p2, p3, p4, p5, unk_name, info

	[ 1, "Ball", "Ball1",ITEM, 
        false, false, false, false, false,
        0, 0, 0, 0, 0, 0,
        "unknownBall",
        "EnergyBall"],
    [ 2, "Sword", "Knife",EQUIPMENT, 
        false, false, false, false, false,
        0, 0, 0, 0, 0, 0,
        "unknownSword","剣"],
    [ 3, "Key", "Key",EXRARE, 
        false, false, false, false, false,
        0, 0, 0, 0, 0, 0,
        "unknownKey", "鍵"],
    [ 4, "Coin", "Coin1",POINT, 
        false, false, false, false, false,
        10, 0, 0, 0, 0, 0,
        "Coin", "コイン"],
    [ 99999,"Dummy", "Dummy",POINT,
        false, false, false, false, false,
        0, 0, 0, 0, 0, 0, "Dummy", "Dummy"],
    ]

    const item = {
        ID:"builtin_FFFF"
        ,name: "itemname"
        ,graph: "spdataname"//icon
        ,motionPatten: -1//number"mp"
        ,type:1|2|4|8|16//flag_bit EQUIP USEBLE EXRARE INSPECT ETC
        //{equip:false, useble:false, exrare:false, inspect:false, etc:false}
        ,get:   function(stat){} //getした時の処理とか
        ,equip: function(stat){} //装備デキル場合ハ動作用Function
        ,use:   function(stat){} //使用デキル場合
        ,exrare:function(stat){} //特殊効果
        ,inspect:function(stat){} //鑑定するのは固定機能でフラグ変更だけなのでclass標準で？またはStatus表示とか
        ,option:function(stat){}
        ,param:[0,0] //functionで使用するパラメ－タ用数値
        ,index:0
        ,scroe:0
        ,unknown:false
        ,unk_name:"未鑑定名",unk_graph:"", text:"HELPTEXT", info:"簡単な説明か性能表示" 
    }

    let item_list = [];

	for (let j in it){
		let w = it[j];
    	
    		let ptn = {};
    	
    		ptn.ID = w[0];
    		ptn.name = w[1];
    		ptn.graph = w[2];
    		ptn.type = w[3];
    		ptn.get = w[4];
    		ptn.equip = w[5];
    		ptn.use = w[6];
            ptn.exrare = w[7];
            ptn.inspect = w[8];
    		ptn.param = [ w[9], w[10], w[11], w[12], w[13], w[14] ];
    		ptn.id = w[15];
    		ptn.score = w[16];
    		item_list.add(ptn); 
	}

    return item_list; 
}