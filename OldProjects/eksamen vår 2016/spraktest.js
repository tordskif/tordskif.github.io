//@ts-check
function setup() {
    let btnButton = document.getElementById("button");
    let divSprsml = document.getElementById("sprsml");
    let sctSpraak = document.getElementById("spraak");
    let sctOptions = document.getElementById("options");
    let divPoeng = document.getElementById("poeng");
    let spraak = [];

    let amerikansk = []
    //Her legger du spørsmål for amerikansk

    spraak.push(amerikansk);

    amerikansk.push("Hva er potet på amerikansk?;+Potato;Carrotes;Coal");
    amerikansk.push("Hva er hallo på amerikansk?;Heisann;HOY;+Hey");
    amerikansk.push("Hva er Tord på amerikansk?;Thor;+DROT;Thord;Naida");
    amerikansk.push("Hva er den ameriknaske nasjonalrett?;Sildasalaten nja;Pizza;Bullcarp;+Lammafrikaseee");

    //spraak[0][0].split(";");

    let index = 0;
    let score = 0;
    function visSprsml() {
        let question = spraak[sctSpraak.value][index].split(";");
        divSprsml.innerHTML = question[0];
        sctOptions.innerHTML = "";
        for (let i = 1; i < question.length; i++) {
            let newOption = document.createElement("option");
            if (question[i][0] === "+") {
                newOption.value = "1";
                question[i] = question[i].slice(1);
            } else {
                newOption.value = "0";
            }
            newOption.innerHTML = question[i];
            sctOptions.appendChild(newOption);
        }
        index++;
    }
    btnButton.addEventListener("click", sjekkSvar);

    let array = Array.from(document.querySelectorAll("div"));
    let list = document.querySelectorAll("div");
    console.log(array, list);

    function sjekkSvar() {
        if (sctOptions.value === "1") {
            score++;
        } else { //burde kanskje ha en option som er om du ikke har svart, ha første option som blank
            score--;
        }

        divPoeng.innerHTML = "Poeng: " + score;
        if (index >= spraak[sctSpraak.value].length) {
            //index = 0;
            divPoeng.style.fontSize = "26px";
            btnButton.style.visibility = "hidden";
            sctSpraak.style.visibility = "hidden";
            sctOptions.style.visibility = "hidden";
            divSprsml.style.visibility = "hidden";
            if(score >= 3) {
                divPoeng.innerHTML = "Du fikk " + score + " poeng, godt jobba!";
            } else {
                if(score >= 0) {
                    divPoeng.innerHTML = "Du fikk " + score + " poeng, du kan gjøre det bedre..."
                } else {
                    divPoeng.innerHTML = "Du er shit, du klarte bare " + score + " poeng, livet ditt er sannsynelig ikke verdt å leve, bare gå å drep deg selv!";
                }
            }
            return;
        }
        visSprsml();
    }
    visSprsml();
}