function setup() {
    let divRamme = document.getElementById("ramme");
    for (let i = 1; i < 13; i++) {
        let div = document.createElement("div");
        div.className = "noe";

    }

    function tegnKalender(divMonth, year, month) {
        let monthNames = ["Januar", "Februar", "Mars", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Desember"];
        let maanedsNavn = monthNames[month - 1];
        let d = document.createElement("div");
        d.className = "maaned";
        d.innerHTML = maanedsNavn;
        divMonth.appendChild(d);
        let dagNavn = ["Ma", "Ti", "On", "To", "Fr", "Lø", "Sø"];
        d = document.createElement("div");
        d.className = "ukedager";
        for(let dn of dagNavn) {
            let dd = document.createElement("div");
            dd.innerHTML = dn;
            d.appendChild(dd);
        }
    }
}