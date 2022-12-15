function setup() {
    let main = document.getElementById("main");
    let inputs = Array.from(document.getElementsByClassName("input"));
    let button = document.getElementById("beregn");
    let tabellDiv = document.getElementById("tabelldiv");
    button.addEventListener("click", hentInput);

    let tabell = [];

    function hentInput() {
        let newArr = [];
        for(let e of inputs) {
            newArr.push(e.valueAsNumber || 0);
        }
        tabell.push(newArr);
        printTable();
        console.log(tabell);
    }
    function printTable() {
        tabellDiv.innerHTML = "<tr><td>Ukenr</td><td>Ant</td><td>Barn</td><td>Ungdom</td><td>Voksne</td></tr>";
        for(let i = 0; i < tabell.length; i++) {
            //i = 3
            let newTr = document.createElement("tr");
            tabellDiv.appendChild(newTr);
            for(let j = 0; j < tabell[i].length; j++) {
                //j = 2
                let newTd = document.createElement("td");
                newTr.appendChild(newTd);
                newTd.innerHTML = tabell[i][j];
            }
        }
    }
}