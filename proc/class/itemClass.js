//itemClass　//2023/01/25新規
function itemClass(ID, itemTable){

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
    var id, name, graph, type, getfunc, equipfunc, usefunc, exrarefunc, inspectfunc
    var param = [];
    var unk_name, info;

    this.getitem;
    this.equip;
    this.useitem;
    this.exrare;
    this.inspect;

    this.enable = true; //false = item dispose;

    var sce = new itemScenario();

    for (var i of itemTalble){
        if (i.ID == ID){

            name = i.name;
            graph = i.graph;
            type = i.type;
            if (i.getfunc){ this.getitem = sce.sc_get[i.getfunc]; }else( this.getitem = function(){} )
            if (i.equipfunc){ this.equip = sce.sc_get[i.equipfunc]; }else( this.equip = function(){} )
            if (i.usefunc){ this.useitem = sce.sc_get[i.usefunc]; }else( this.useitem = function(){} )
            if (i.exrarefunc){ this.exrare = sce.sc_get[i.exrarefunc]; }else( this.exrare = function(){} )
            if (i.inspectfunc){ this.inspect = sce.sc_get[i.inspectfunc]; }else( this.getitem = function(){} )
            param = i.param;
            unk_name = i.unk_name;
            info = i.info;

            param = i.param;

            break;
        }
    }

    return this;
}