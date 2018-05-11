function setup() {
    let btnSjekk = document.getElementById("sjekk");
    let divBilder = document.getElementById("bilder");
    let divTekster = document.getElementById("tekster");
    let images = Array.from(divBilder.children);
    let tekster = Array.from(divTekster.children);
    let divTilbakemelding = document.querySelector("#tilbakemelding");
    btnSjekk.addEventListener("click", sjekkSvar);
    divBilder.addEventListener("click", markerBilde);
    divTekster.addEventListener("click", markerTekst);

    function sjekkSvar() {
        let poeng = 0;
        for (let i = 0; i < answerArr.length; i++) {
            if (answerArr[i] === i) {
                poeng++;
            }
        }
        if (poeng === 0) {
            divTilbakemelding.innerHTML = "Du klarte ingen riktige...";
        } else {
            if (poeng === 3) {
                divTilbakemelding.innerHTML = "Du klarte alle 3!";
            } else {
                divTilbakemelding.innerHTML = "Du klarte " + poeng + " riktige!";
            }
        }
    }

    //når tekstene blir hentet ut er de ordnet i rekkefølgen de står i, ikke etter hvilke verdi svar dataen er
    //Må derfor sortere de etter dataset verdien svar, slik at de blir posiosjonert rett når de flytter på seg
    tekster.sort(compare);

    function compare(a, b) {
        if (Number(a.dataset["svar"]) > Number(b.dataset["svar"])) {
            return 1;
        }
        if (Number(a.dataset["svar"]) < Number(b.dataset["svar"])) {
            return -1;
        }
        return 0;
    }

    let selectedBilde;
    let selectedTekst;
    //i ansewArr vil indexen være bildeDataen, og innholdet tekstDataen. På den måten kan en bare sjekke
    //hvor mange av tallene som er på lik plass som verdien sin.
    let answerArr = [];

    function markerBilde(e) {
        if(!e.target.dataset["svar"]) { //om en ikke trykker på noe som har data-svar verdi(for eksempel mellom bildene) skal programmet ikke gjøre noe.
            return;
        }
        e.target.style.opacity = 0.5; //for å gi en liten indikator på at trykket gjaldt
        setTimeout(function () {
            e.target.style.opacity = 1;
        }, 500);
        selectedBilde = Number(e.target.dataset["svar"]);
        if (selectedBilde !== undefined && selectedTekst !== undefined) { //sjekker om begge disse verdiene er definert
            tekster[selectedTekst].style.left = selectedBilde * 480 + 50 + "px";
            tekster[selectedTekst].style.top = "340px";
            if (answerArr[selectedBilde] !== undefined && answerArr[selectedBilde] !== selectedTekst) { //hvis det allerede er en tekst på dette svarstedet, må det flyttes tilbake
                tekster[answerArr[selectedBilde]].style.top = "400px";
                tekster[answerArr[selectedBilde]].style.left = tekster[answerArr[selectedBilde]].dataset["start"] * 480 + 50 + "px";
            }
            //må fjerne teksten fra det gamle stedet det var
            answerArr[answerArr.indexOf(selectedTekst)] = undefined;
            answerArr[selectedBilde] = selectedTekst;
            selectedBilde = undefined;
            selectedTekst = undefined;
        }
    }
    function markerTekst(e) {
        e.target.style.opacity = 0.5; //for å gi en liten indikator på at trykket gjaldt
        setTimeout(function () {
            e.target.style.opacity = 1;
        }, 500);
        selectedTekst = Number(e.target.dataset["svar"]);
        if (selectedBilde !== undefined && selectedTekst !== undefined) { //sjekker om begge disse verdiene er definert
            tekster[selectedTekst].style.left = selectedBilde * 480 + 50 + "px";
            tekster[selectedTekst].style.top = "340px";
            if (answerArr[selectedBilde] !== undefined && answerArr[selectedBilde] !== selectedTekst) { //hvis det allerede er en tekst på dette svarstedet, må det flyttes tilbake
                tekster[answerArr[selectedBilde]].style.top = "400px";
                tekster[answerArr[selectedBilde]].style.left = tekster[answerArr[selectedBilde]].dataset["start"] * 480 + 50 + "px";
            }
            //må fjerne teksten fra det gamle stedet det var
            answerArr[answerArr.indexOf(selectedTekst)] = undefined;
            answerArr[selectedBilde] = selectedTekst;
            selectedBilde = undefined;
            selectedTekst = undefined;
        }
    }
    //Ble veldig mye til slutt, men tror det skal fungere riktig nå. Alt med rett posisjonering osv var litt vanskelig å få til,
    //og problemer med to på samme bilde etc.   
}