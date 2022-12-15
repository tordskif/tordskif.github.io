class Ting {
    constructor(navn, masse, volum) {
        this.navn = navn;
        this.masse = masse;
        this.volum = volum;
    }
    // beregner tettheten til denne tingen
    tetthet() {
        return this.masse / this.volum;
    }
}
class SalgbarTing extends Ting {
    constructor(navn, masse, volum, kilopris) {
        // må lage den vanlige tingen først
        super(navn, masse, volum);
        this.kilopris = kilopris;
        this.solgt = false;  // vi har ikke solgt den ennå
    }
    // hva koster denne tingen
    pris() {
        return this.masse * this.kilopris;
    }
    // selg tingen
    selg() {
        this.solgt = true;
    }
}

let tingeneMine = [];
function setup() {
    // nå kan vi lage instanser av klassene
    // husk at klassedefinsjonene bare er en oppskrift
    // vi må lage forekomster (variable) av klassen
    // skriver ut tettheten
    //a.pris()  // feil - ting har ikke pris
    // ok
    // ok
    // vi kan sjekke hvilken klasse en ting er med følgende kode
    // vi kan også legge ting inn i en Array
    console.log(tingeneMine);

    let btnBeregn = document.getElementById("button");
    btnBeregn.addEventListener("click", go);
    let inpNavn = document.getElementById("navn");
    let inpMasse = document.getElementById("masse");
    let inpVolum = document.getElementById("volum");
    let inpPris = document.getElementById("pris");

    function go() {
        let navn = inpNavn.value;
        let masse = inpMasse.valueAsNumber;
        let volum = inpVolum.valueAsNumber;
        let pris = inpPris.valueAsNumber;
        if (navn && masse && volum && pris) {
            let newObj = new SalgbarTing(navn, masse, volum, pris);
            tingeneMine.push(newObj);
            //console.log(tingeneMine, tingeneMine[0].tetthet());
            //Sletter verdien i inputfeltene, lite sannsynelig en vil legge til samme gjenstand to ganger
            inpNavn.value = "";
            inpMasse.value = "";
            inpVolum.value = "";
            inpPris.value = "";
        }
    }
}

let a = new SalgbarTing("Gråstein", 2.3, 0.9, 2000);
let b = new SalgbarTing("Sølvklump", 7, 1.1, 1450);

tingeneMine.push(a);
tingeneMine.push(b);

function selgTing(array) {
    let tjent = 0;
    for(let i = 0; i < array.length; i++) {
        let t = array[i];
        if(!t.solgt && t.kilopris) {
            t.solgt = true;
            varepris = t.kilopris*t.masse;
            tjent += varepris;
        }
    }
    return tjent;
}