function setup() {
    let fuggel = document.getElementById("bird");
    setInterval(flytt, 50);
    let top = 255;
    let fart = 10;
    let soylepos = 650;
    const PXperMS = 15;
    let poeng = 0;
    let poenggot = false;
    let divpoeng = document.getElementById("poeng");
    let melding = "Du har vunnet!"

    /*
         regner ut hvor mye søylene flytter seg på 80ms:
         900px på 3000ms
         50 * 900/3000 = 15 = PXperMS
    */

    addEventListener("keydown", giFart);

    function flytt() {
        top = top - fart;
        fuggel.style.top = top + "px";
        fart = fart - 5;
        if (top > 510) {
            fart = 0;
            top = 520;
        }
        if (top < 0) {
            fart = 0;
            top = 0;
        }

        /*if (top > 400) {
            fart = fart*-0.8;
            top = 400;
        }
        */
        soylepos = soylepos - PXperMS;
        if (soylepos <= -250) {
            soylepos = 650;
            poenggot = false;
        }
        // oppdaterer posisjon til søyler

        if (soylepos < 320 && soylepos > 200) {
            if (top < 140 || top > 300) {
                poeng = 0;
            } else {
                if (poenggot === false) {
                    poeng++;
                    poenggot = true;
                }
            }
        } else {
            divpoeng.innerHTML = String(poeng);
        }

        fuggel.style.transform = "rotate(" + -fart + "deg)";

        if(poeng >= 6) {
            divpoeng.innerHTML = melding;
        }
    }

    function giFart(e) {
        var keyCode = e.keyCode;
        if (keyCode == 32) {
            fart = 30;
        }
    }
}
