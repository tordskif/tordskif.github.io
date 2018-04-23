function setup() {
    let list = document.querySelectorAll(".partiinput");
    let arr = Array.from(list);
    let btnKalk = document.getElementById("kalkuler");
    let main = document.getElementById("main");
    let output = document.getElementById("output");
    let soylediv = document.getElementById("soylediv");
    let borgsoyle = document.getElementById("borgsoyle");
    let rgsoyle = document.getElementById("rgsoyle");
    let andresoyle = document.getElementById("andresoyle");

    btnKalk.addEventListener("click", calculate);
    main.addEventListener("input", calculate);

    function calculate(e) {
        if(e.target.value) {
            if(e.target.value < 0) {
                e.target.value = "0";
            }
            if(e.target.value > 100) {
                e.target.value = "100";
            }
        }
        let borg = 0;
        let rg = 0;
        let andre = 0;
        for(let e of arr) {
            /*kunne brukt if-setning for hver blokk, men slik som dette unngår du å må legge til
            nye if-setninger om en legger til flere blokker */
            eval(e.dataset.blokk + "+=" + e.valueAsNumber + " || 0");
        }
        let sum = borg + rg + andre;
        if(sum <= 100 && sum >= 0) {
            output.innerHTML = "Rødgrønn: " + rg + ", Borgerlig: " + borg + ", Andre: " + andre;
            tegnsoyler(borg, rg, andre);
        } else {
            output.innerHTML = "Summen kan ikke overstige 100";
        }
    }

    function tegnsoyler(borg, rg, andre) {
        borgsoyle.style.height = borg*3 + "px";
        rgsoyle.style.height = rg*3 + "px";
        andresoyle.style.height = andre*3 + "px";

    }
}