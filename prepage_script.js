    window.addEventListener("load",()=>{
    //function autorun(){
        const canvas = document.getElementById("Layer0");
        const ctx = canvas.getContext("2d");
        canvas.width = 640;
        canvas.height = 400;

        ctx.fillStyle = "black";
        ctx.fillRect(0 ,0 ,canvas.width ,canvas.height);

        const titleLogo = new Image();
        titleLogo.src = "content/asset/pict/TitleLogoTemp.png";

        ctx.drawImage(titleLogo
            ,320   -titleLogo.width/2
            ,128+50-titleLogo.height/2
        );
        //406*68

        const nodever = document.getElementById("node-version").innerText;
        const chomever = document.getElementById("node-version").innerText;
        const electronver = document.getElementById("electron-version").innerText;

        //console.log(nodever + "," + chomever + "," + electronver);

        if (!Boolean(nodever)) {
            document.getElementById("memo").style.display = "none";
            console.log("execute web browser.")
        } else {
            console.log("execute electron.\n" +
                " node.js," + nodever + "\n" +
                " Chromium," + chomever + "\n" +
                " Electron," + electronver);
            page_start();
        }
    },{ once: true });

    document.getElementById("btn").addEventListener("click",page_start,{ once: true });

    function page_start(){
        document.getElementById("btn").style.display = "none";
        document.getElementById("memo").style.display = "none";
        main_r();
    }

