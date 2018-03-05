function setup() {
    let navigation = document.getElementById("navigation");
    let kalender = document.getElementById("kalender");
    let spanYear = document.getElementById("year");
    let spanMonth = document.getElementById("month");

    let divUkedager = document.getElementById("ukedager");
    let divDatoer = document.getElementById("datoer");

    let minDato = {
        year: 2018,
        month: 2,
        day: 1
    }

    let months = ["Januar", "Februar", "Mars", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Desember"];

    navigation.addEventListener("click", btnClick);
    function btnClick(e) {
        let command = e.toElement.getAttribute("data-command");
        if (!command) {
            return;
        }
        eval("minDato." + command);
        if (minDato.month === 13) {
            minDato.month = 1;
            minDato.year++;
        }
        if (minDato.month === 0) {
            minDato.month = 12;
            minDato.year--;
        }
        visMonth(minDato);
    }

    let mLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    let dagNavn = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];
    function lagUkedager() {
        for (let d of dagNavn) {
            let kort = d.substr(0, 2);
            let div = document.createElement("div");
            div.className = "ukedag";
            div.innerHTML = kort;
            divUkedager.appendChild(div);
        }
    }
    let datoArray = [];
    function lagDatoer() {
        for (let i = 1; i <= 42; i++) {
            let div = document.createElement("div");
            div.className = "dato";
            div.innerHTML = String(i);
            divDatoer.appendChild(div);
            datoArray.push(div);
        }
    }

    function visMonth(dato) {
        console.log(dato);
        let d = new Date(`${dato.year}/${dato.month}/1`);
        let start = (d.getDay() + 6) % 7;

        spanYear.innerHTML = String(dato.year);
        spanMonth.innerHTML = months[dato.month - 1];
        let lengde = mLength[dato.month - 1];
        for (let d of datoArray) {
            d.classList.add("hidden");
        }
        if(dato.year%4 === 0 && dato.month === 2) {
            lengde += 1;
        }
        for (let d = 0; d < lengde; d++) {
            let div = datoArray[d + start];
            div.classList.remove("hidden");
            div.innerHTML = String(d + 1);
        }
    }
    lagUkedager();
    lagDatoer();
    visMonth(minDato);
}