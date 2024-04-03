//**************************************************************
//soundControl
//サウンド
//
//**************************************************************

function soundCntl( asset ) {
    //alert("old rev sound control include.");

    //dummy
    let dev_ready = false;

    let mute = false;
    let master_volume = 0.5;
  
    this.mute = mute;
    this.mastervolume = master_volume;

    let ext = ".mp3";
    if ((new Audio()).canPlayType("audio/ogg")=="probably"){ext=".ogg";}
    //if ((new Audio()).canPlayType("audio/mp3")=="probably"){ext=".mp3";}
    

    let sd = [
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
        "13bomb",
        "14powup",
        "15fanfare",
        "16battle"
        ,"17jump"
    ];

    let snd = [];
    //let s_pos = [];
    //let s_stat = [];

    for (let i in sd) {
        //snd[i] = new Audio("sound/" + sd[i] + ext);
        snd[i]  = asset[sd[i]].sound;//asset割り当て
        snd[i].pos = 0;
        snd[i].addEventListener("timeupdate", function (e) {
            this.pos = (pla.currentTime / pla.duration) * 100;
        });

        snd[i].stat = false;
        snd[i].addEventListener("loadeddata", function (e) {
            this.stat = true;
        });

        snd[i].addEventListener("ended", function (e) {
           if (nextplnum != -1) {
                soundchange(nextplnum);
                soundplay(nextplnum);

                nextplnum = -1;
            }
        });
    }

    this.loadCheck = function () {

        let c = 0;
        for (let i in snd) {

            if (snd[i].stat) c++;
            //snd[i].volume = 0.1;
        }
        dev_ready = (c >= snd.length);

        return (dev_ready) ? "Ready" :  ext + ":"  + c;
    }

    let plnum = 0;
    let nextplnum = -1;
    let nextloopf = false;

    let pla = new Audio();

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
                snd[soundname].volume = this.mastervolume;
                snd[soundname].muted = false;
            }
            //pla.currentTime = 0;

            plnum = soundname;
        }
    }

    //audioの長さを取得（単位は？）
    this.duration = duration;
    function duration(soundname){
        return snd[soundname].duration;
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

        vol = (vol > this.mastervolume)?this.mastervolume: vol;
        for (let i in snd) {
            snd[i].volume = vol;
        }
        //snd[plnum].volume = vol;
    }
}
