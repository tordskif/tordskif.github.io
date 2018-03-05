class Rom {
    constructor(id, romnavn, royk, senger, pris, vasket) {
        this.id = id;
        this.romnavn = romnavn;
        this.royk = royk;
        this.senger = senger;
        this.pris = pris;
        this.vasket = vasket;
    }
    vask() {
        this.vasket = true;
    }
}
function setup() {
    let inpRom = document.getElementById("romnavn");
    let inpRoyk = document.getElementById("royking");
    let inpSenger = document.getElementById("senger");
    let inpPris = document.getElementById("pris");
    let inpVasket = document.getElementById("vasket");
    let btnLeggtil = document.getElementById("leggtil");
    let btnVis = document.getElementById("vis");
    let divRomliste = document.getElementById("romliste");

    btnLeggtil.addEventListener("click", leggTilRom);
    let romListe = [];
    let romId = 0;
    /*
    Tror ikke det er nødvendig å ta med Id her, ettersom plasseringen av rommet i
    arrayen(indexen) er en unik identifikasjon for hvert rom.
    Tar den med i tilfelle den kan være nyttig.
    Kanskje om en har fem rom, og fjerner det tredje fra arrayen, vil rom 5 fortsatt ha
    id-en 4, mens indexen til rommet vil ha forandret seg til 3. Her kan id-en være nyttig å ha.
    */

    function leggTilRom() {
        let rom = inpRom.value;
        let royk = inpRoyk.checked;
        let senger = inpSenger.valueAsNumber;
        let pris = inpPris.valueAsNumber;
        let vasket = inpVasket.checked;
        if (rom && senger && pris) { //sjekker om disse har fått verdier, vil ikke legge til et rom uten f.eks. romnavn
            let newRom = new Rom(romId, rom, royk, senger, pris, vasket);
            romId++;
            romListe.push(newRom);
        }
    }

    btnVis.addEventListener("click", visRom);

    function visRom() {
        divRomliste.innerHTML = "<ul>";
        for (let i = 0; i < romListe.length; i++) {
            divRomliste.innerHTML += "<li id=" + romListe[i].id + ">" + romListe[i].romnavn + "</li>";
        } //her kom id-en til nytte
    }
    divRomliste.addEventListener("click", vaskRom);

    function vaskRom(e) {
        let clicked = e.path[0].id;
        for (let i = 0; i < romListe.length; i++) {
            if (clicked === String(romListe[i].id)) {
                romListe[i].vask();
            }
        }
        console.log(romListe);
    }
}