function setup() {
    let tabell = {
        melk: [92, 6.6, 3, 9.6],
        egg: [80, 6.9, 5.5, 0.7],
        brod: [103, 3.5, 1, 19.6],
        smor: [36, 0.025, 4.1, 0.025],
        ost: [53, 4, 4.2, 0]
    }
    let btnBeregn = document.getElementById("beregn");
    let inputs = document.getElementsByTagName("input");
    let arrInputs = Array.from(inputs);
    let soylerDiv = document.getElementById("soyler");
    let soyleArr = Array.from(soylerDiv.children);
    let divOutput = document.getElementById("output");
    btnBeregn.addEventListener("click", beregn);

    function beregn() {
        let sumKcal = 0;
        let sumProt = 0;
        let sumFett = 0;
        let sumKarb = 0;
        let kcalArr = [];
        let highKcal = 0;
        for(let e of arrInputs) {
            let amount = e.value || 0;
            sumKcal += tabell[e.id][0] * amount;
            sumProt += tabell[e.id][1] * amount;
            sumFett += tabell[e.id][2] * amount;
            sumKarb += tabell[e.id][3] * amount;
            kcalArr.push(tabell[e.id][0] * amount);
            if(tabell[e.id][0] * amount > highKcal) {
                highKcal = tabell[e.id][0] * amount;
            }
        }
        //ved å bruke denne n i kalkulasjoner gjør det at den høyeste verdien alltid er 180px
        let n = 180*sumKcal/highKcal;
        for(let i = 0; i < soyleArr.length; i++) {
            let andel = kcalArr[i]/sumKcal;
            soyleArr[i].style.height = n*andel + "px";
            if(n*andel > 10) {
                soyleArr[i].innerHTML = arrInputs[i].id.charAt(0).toUpperCase() + arrInputs[i].id.slice(1);
            } else {
                soyleArr[i].innerHTML = "";
            }
        }
        divOutput.innerHTML = 
        `Proteiner: ${sumProt.toFixed(3)} <br>
        Fett: ${sumFett.toFixed(3)} <br>
        Karbohydrater: ${sumKarb.toFixed(3)} <br>
        Kcal: ${sumKcal.toFixed(3)} <br>`
    }
}