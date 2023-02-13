//**************************************************************
//soundControl
//サウンド
//
//**************************************************************

function soundControl() {
    //alert("old rev sound control include.");

    //dummy
    var dev_ready = false;

    var mute = true;//false;

    this.mute = mute;

    var ext = ".mp3";
    if ((new Audio()).canPlayType("audio/ogg")=="probably"){ext=".ogg";}
    //if ((new Audio()).canPlayType("audio/mp3")=="probably"){ext=".mp3";}
    

    var sd = [
"00round_start",
"01main",
"02warnning",
"03hurry_up",
"04round_clear",
"05miss",
"06gameover",
"07swing",
"08bow",
"09select",
"10use",
"11hit",
"12damage",
"13bomb"
];

    var snd = [];
    var s_pos = [];
    var s_stat = [];

    for (var i in sd) {
        snd[i] = new Audio("sound/" + sd[i] + ext);

        snd[i].pos = 0;


        snd[i].addEventListener("timeupdate", function (e) {

            this.pos = (pla.currentTime / pla.duration) * 100;

            /*
            if (this.pos > 99) {
                if (nextplnum != -1) {

                    soundchange(nextplnum);
                    soundplay(nextplnum);

                    nextplnum = -1;
                }
            }
            */
        });

        //s_stat[i] = false;

        snd[i].stat = false;

        snd[i].addEventListener("loadeddata", function (e) {

            this.stat = true;

        });
/*
        snd[i].addEventListener("load", function (e) {

            this.stat = true;
        });
*/
        snd[i].addEventListener("ended", function (e) {

            if (nextplnum != -1) {

                soundchange(nextplnum);
                soundplay(nextplnum);

                nextplnum = -1;

            }
            //this.stat = true;
        });


    }

    this.loadCheck = function () {

        var c = 0;

        for (var i in snd) {

            if (snd[i].stat) c++;
            //snd[i].volume = 0.1;
        }

        dev_ready = (c >= snd.length);

        return (dev_ready) ? "Ready" :  ext + ":"  + c;
    }

    var plnum = 0;
    var nextplnum = -1;
    var nextloopf = false;

    var pla = new Audio("sound/" + sd[0] + ext);

    //pla.pause();

    this.change = soundchange;

    function soundchange(soundname, loopf) {

        if (!dev_ready) return;


        pla.pause();
        pla.currentTime = 0;//firefox?のみこれで前の音が出てしまう。pause効いてない？
        
        if (Boolean(sd[soundname])) {
            //alert("sound/" + sd[soundname] + ext);
            //pla.src = "sound/" + sd[soundname] + ext;

            pla = snd[soundname];
            
            //snd[soundname].loop = loopf;

            //pla.volume = 1.0;
            if (mute) {
                snd[soundname].volume = 0;
                snd[soundname].muted = true;
            } else {
                snd[soundname].volume = 1.0;
                snd[soundname].muted = false;
            }
            //pla.currentTime = 0;

            plnum = soundname;
        }

    }

    this.play = soundplay;

    function soundplay() {

        if (!dev_ready) return;

        if (pla.ended) pla.currentTime = 0;

        pla.play();

        nextplnum = -1;

    }

    this.effect = effectplay;

    function effectplay(num) {

        if (!dev_ready) return;

        if (Boolean(sd[num])) {

            snd[num].currentTime = 0;
            snd[num].play();
        }
    }

    /*
    pla.addEventListener("timeupdate", function (e) {

    plpar = (pla.currentTime / pla.duration) * 100;



    });
    */

    this.next = function (soundname, loopf) {

        if (Boolean(sd[soundname])) {
            nextplnum = soundname;
            nextloopf = loopf;
        }


    }

    this.info = function () {

        //return plpar;
        //return s_pos[plnum];
        return snd[plnum].pos;
    }

    this.running = function () 
    {
        if (!dev_ready) return;
        //return (snd[plnum].pos < 99);//oggだとこれでうまくいったりいかなかったり・・
        return (!snd[plnum].ended);

    }

    this.restart = function () {

        if (!dev_ready) return;

        pla.currentTime = 0;

    }

    this.volume = function (vol) {
        //Volume 0.0- max1.0
        if (!dev_ready) return;

        if (mute) vol = 0.0;

        for (var i in snd) {
            snd[i].volume = vol;
        }

        //snd[plnum].volume = vol;
    }

}












