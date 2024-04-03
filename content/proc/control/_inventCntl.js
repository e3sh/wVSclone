//inventryControl
function inventryControl(){
    //2023/01/25新規
    //Itemの運用について
    //当初はItemをキャラまたは敵キャラが取得した時点でitemObject生成して運用しようかと考えたが、
    //そうすると強化後ドロップしてしまったりするItemのステータスが継承されないという状態となる。
    //ゲーム仕様によるからどっちでもいいが、
    //Stage生成時にすべてのアイテムを生成して、CharactorObjectのItemに最初から持たせておけば
    //使いかけや強化途中のアイテムも継続できるようになる。
    //
    //現時点ではこれを実装すると本体書き換えも相当となるので
    //(本システムの最初の時点がシューティングだったので)
    //ゲームの方針がまとまるまで仮状態。

    //inventryControl
    //setupItem return -> o
    let itemTable = itemTable();

    let itemList = [];

    this.createItem = function(ID){

        let item = new itemClass(ID, itemTable);

        this.itemlist.add(item);
        return item;
    }

    this.desposeItem = function(item){
        //item.delete();
    }

    this.list = function(){
        for (i of itemList){

        }
    }

    this.count = function(){
        return itemList.length;

    }

}