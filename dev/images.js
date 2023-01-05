//loadingImages function
//イメージ読み込みまとめクラス
function loadingImages() {

    var list = [
    "cha",
    "aschr",
    "bg1",
    "bg2",
    "bg3"
    ];

    var img = [];

    this.img = img;

    for (var i in list) {
        img[list[i]] = new Image();
        img[list[i]].src = "pict/" + list[i] + ".png";

        img[list[i]].ready = false;

        img[list[i]].onload = function (e) {
            this.ready = true;
        }
    }

    this.readyStateCheck = function () {

        var rs = [];

        for (var i in list) {
            rs[list[i]] = img[list[i]].ready;
        }

        return rs;
    }
}