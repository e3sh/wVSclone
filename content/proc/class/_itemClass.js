//itemClass　
class itemClass {
    constructor(ID, itemTable) {

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
        const  id = ID;
        let name, graph, type;
        let param = [];
        let unk_name, info;

        this.getitem =()=>{};
        this.equip   =()=>{};
        this.useitem =()=>{};
        this.exrare  =()=>{};
        this.inspect =()=>{};

        this.enable = true; //false = item dispose;

        let sce = new itemScenario();
    }
}