function setup() {
    let divBilde = document.getElementById("bilde");
    let divAlternativer = document.getElementById("alternativer");
    let btnSjekk = document.getElementById("sjekk");
    let divTilbakemelding = document.getElementById("tilbakemelding");
    let divAnimasjon = document.getElementById("animasjon");
    let animTekst = document.getElementById("animtekst");
    let animBilde = document.getElementById("animbilde");
    btnSjekk.addEventListener("click", sjekkSvar);
    let bilder = ["../mediafiler/images/image4.png", "../mediafiler/images/image1.png", "../mediafiler/images/image7.png", "../mediafiler/images/image3.png", "../mediafiler/images/image2.png"];

    let svar = ["Tut kraftig med bilhornet slik at syklistene danner en rekke.?Vent med å kjøre forbi til det blir fri sikt fremover.Gass på slik at du rekker å passere før svingen",
        "?Den passerende bilisten setter andre trafikanter i unøding fare, det er lang kø.Har du kommet litt forbi den bilen du passerer er det bare å svinge inn foran.Den passerte bilen burde ha holdt mindre avstand til bilen foran, det er ikke så glatt",
        "?Når du skal svinge av en vei er det viktig å blinke og sjekke blindsonen.Det er viktig å holde høy hastighet når du kjører forbi.Begge bilførere har ansvar i en forbikjøring",
        "?Når veimerking som sperrelinje og skilter gir motsatte signaler gjelder  det strengeste signalet.Du kan selv velge hva som gjelder for deg.Sperrelinjer er kun ment for lastebiler",
        "Hvis det er plass mellom to biler er det bare å kjøre på.Når man skal kjøre forbi viser man det ved å kjøre nært bilen foran.?Krysse sperrelinjer er brudd på trafikkreglene"
    ];
    /*
    For å kunne legge til nye spørsmål her, legger en til adressen til det nye bildet bakerst i bildearrayen,
    or legger til de nye alternativene bakerst i alternativarrayen, separtert med et punktum.
    Spørsmålstegn før alternativet betyr det er riktig (Siden ikke mer var oppgitt, antar jeg bare at ett av alt. er riktige)
    Om en alltid legger til nye bilder og alternativer bakerst, 
    vil de ha den samme indeksen og systemet vil fortsette å fungere.
    I tillegg er programmet laget helt fleksibelt, slik at det kan være mer(eller mindre) enn 3 alternativer,
    og så mange eller så få spørsmål du skulle ønske
    */
    let oppbrukteSvar = [] //denne skal fylles opp med svarene etterhvert som de besvares;
    let startSize = bilder.length;
    let poeng = 0;
    let rettSvar;
    let brukerSvar = []; //skal lagre hvilke svar brukeren gir
    let rettSvarArr = []; //skal lagre hvilke svar som var rett

    function nesteSpr() {
        if (bilder.length === 0) {
            avslutt();
            return;
        }
        let randNum = Math.floor(Math.random() * bilder.length);
        divBilde.style.backgroundImage = "url('" + bilder[randNum] + "')";
        bilder.splice(randNum, 1);
        let svarAlt = svar[randNum].split(".");
        svar.splice(randNum, 1);
        //Kunne ha laget en "backup" av arrayene som blir splicet, men oppgaven sa at "Et spørsmål skal ikke komme igjen", så da er ikke det nøvendig
        divAlternativer.innerHTML = "";
        for (let i = 0; i < svarAlt.length; i++) { //finne hvilket av alternativene som er rett
            if (svarAlt[i][0] === "?") {
                rettSvar = i;
                rettSvarArr.push(i);
                svarAlt[i] = svarAlt[i].substr(1);
            }
            let newLi = document.createElement("li");
            divAlternativer.appendChild(newLi);
            let newInp = document.createElement("input");
            newInp.type = "radio";
            newInp.name = "option";
            newInp.value = i;
            newLi.appendChild(newInp);
            newLi.innerHTML += svarAlt[i];
        }
        oppbrukteSvar.push(svarAlt);
    }

    function sjekkSvar() {
        let options = Array.from(document.getElementsByName("option"));
        for (let e of options) {
            if (Number(e.value) === rettSvar) {
                if (e.checked) {
                    poeng += 2;
                } else {
                    poeng--;
                }
            }
            if (e.checked) {
                brukerSvar[startSize - bilder.length - 1] = Number(e.value);
            }
        }
        nesteSpr();
    }
    function avslutt() {
        divBilde.style.display = "none";
        divAlternativer.style.display = "none";
        btnSjekk.style.display = "none";
        divTilbakemelding.innerHTML = "Du fikk " + poeng + " poeng!";
        console.log(rettSvarArr, brukerSvar);
        for(let i = 0; i < oppbrukteSvar.length; i++) {
            let newUl = document.createElement("ul");
            divTilbakemelding.appendChild(newUl);
            for(let j = 0; j < oppbrukteSvar[i].length; j++) {
                let newLi = document.createElement("li");
                newUl.appendChild(newLi);
                newLi.innerHTML = oppbrukteSvar[i][j];
                if(brukerSvar[i] === j) {
                    newLi.style.backgroundColor = "red";
                }
                if(rettSvarArr[i] === j) {
                    newLi.style.backgroundColor = "yellow";
                    if(brukerSvar[i] === j) {
                        newLi.style.backgroundColor = "lightgreen";
                    }
                }
                //Grønn: ditt rett svar, gul: hva som er det riktige svaret, rød: ditt feil svar
            }
        }
    }

    //hva som skal skje med en gang siden lastes, animasjon etc.
    //har splittet opp animasjonen, gjort litt her og litt i css.
    animTekst.innerHTML = "Du vil nå se en animasjon om hvordan undersøkelsen vil foregå";
    let audio = new Audio("../mediafiler/Sound.mp3");
    audio.play();
    let animTimer = setInterval(animTick, 200);
    let timer = 0;
    function animTick() {
        timer += 1;
        if(timer === 12) {
            animTekst.innerHTML = "Du vil få et bilde og tre svaralternativer";
            animBilde.style.backgroundImage = "url('../mediafiler/animasjon/bilde1.png')";
        }
        if(timer === 28) {
            animTekst.innerHTML = 'Velg det alternativet du tror er riktig, og trykk "Sjekk"';
        }
        if(timer === 48) {
            animBilde.style.backgroundImage = "url('../mediafiler/animasjon/bilde3.png')";
        }
        if(timer === 56) {
            animTekst.innerHTML = "Til slutt vil du få en oversikt over resultatene";
            animBilde.style.backgroundImage = "url('../mediafiler/animasjon/bilde4.png')";
        }
        if(timer === 75) {
            clearInterval(animTimer);
        }
    }
    setTimeout(function() {
        divAnimasjon.style.display = "none";
        btnSjekk.style.display = "block";
        nesteSpr();
    }, 15000); //dette er hvor lenge animasjonen varer, etter dette skal det første sprøsmålet vises
}