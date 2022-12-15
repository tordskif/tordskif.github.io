function setup() {
    let btnKjop = document.getElementById("kjop");
    let inpSokk = document.getElementById("sokk");
    let inpBukse = document.getElementById("bukse");
    let inpLue = document.getElementById("lue");
    let modal = document.getElementById('myModal');
    let modalText = document.getElementById("modal-text");
    let extra = document.getElementById("extra");
    prisListe = {
        sokk: 49,
        bukse: 249,
        lue: 1472
    }

    btnKjop.addEventListener("click", kjop);

    function kjop() {
        let sum = 0;
        sum += (inpSokk.valueAsNumber || 0) * prisListe.sokk;
        sum += (inpBukse.valueAsNumber || 0) * prisListe.bukse;
        sum += (inpLue.valueAsNumber || 0) * prisListe.lue;
        modal.style.display = "block";
        if (sum >= 1000) {
            modalText.innerHTML = "Summen av varene dine er: " + sum + " NOK, fordi du kjøper for over 1000 NOK, kan du kjøpe en vare for halv pris <br> <button type='button' id='bekreft'>Bekreft kjøp</button>";
            extra.style.visibility = "visible";
            let bekreft = document.getElementById("bekreft");
            bekreft.addEventListener("click", buy);
        } else {
            modalText.innerHTML = "Summen av varene dine er: " + sum + " NOK <br> <button type='button' id='bekreft'>Bekreft kjøp</button>";
            extra.style.visibility = "hidden";
            let bekreft = document.getElementById("bekreft");
            bekreft.addEventListener("click", buy);
        }
    }
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
    function buy() {
        console.log("done");
        //beregn her total pris av varer + evt. ekstravare. Redirect user til annen side
    }
}