function setup() {
    let button = document.getElementById("button");
    button.addEventListener("click", go);

    let fra = document.getElementById("fra");
    let til = document.getElementById("til");
    let antall = document.getElementById("antall");
    let leiebil = document.getElementById("leiebil");
    let out = document.getElementById("out");

    let priser = {
        "OSL": { "SVG": 399, "BGO": 410, "HAU": 180 },
        "SVG": { "BGO": 50, "HAU": 10},
        "BGO": { "HAU": 5}
    };

    function go() {
        let pris = 0;
        
        if(priser[fra.value] && priser[fra.value][til.value]) {
            pris += priser[fra.value][til.value] * antall.value;
        } else {
            pris += priser[til.value][fra.value] * antall.value;
        }

        if (leiebil.checked) {
            pris += 500;
        }
        out.innerHTML = `Din flight fra ${fra.value} til ${til.value} koster ${pris}`;
    }
}