function setup() {
    let btnKmNaut = document.getElementById("km2naut");
    let btnNautKm = document.getElementById("naut2km");
    let km = document.getElementById("kminp");
    let naut = document.getElementById("nautinp");

    btnKmNaut.addEventListener("click", beregnKmNaut);
    btnNautKm.addEventListener("click", beregnNautKm);
    km.addEventListener("keydown", beregnKmNaut);
    naut.addEventListener("keydown", beregnNautKm);

    function beregnKmNaut(e) {
        if (e.type === "click" || e.keyCode === 13) {
            let nautcalc = km.valueAsNumber / 1.852;
            naut.value = nautcalc.toFixed(2);
        }
    }
    function beregnNautKm(e) {
        if (e.type === "click" || e.keyCode === 13) {
            let kmcalc = naut.valueAsNumber * 1.852;
            km.value = kmcalc.toFixed(2);
        }
    }
}