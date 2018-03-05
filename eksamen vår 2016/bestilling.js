function setup() {
    let main = document.getElementById("main");
    let inpBy = document.getElementById("byer");
    let inpHotell = document.getElementById("hotell");
    let btnBestill = document.getElementById("button");
    let inpEnkel = document.getElementById("enkel");
    let inpDobbel = document.getElementById("dobbel");



    let byer = [];

    let peter = [];
    let amster = []; //array skal inneholde de ulike hotellene som er i byene
    let nYork = [];
    let roma = [];

    byer.push(peter);
    byer.push(amster);
    byer.push(nYork);
    byer.push(roma);

    nYork.push("Hotell1");
    nYork.push("Hotell2");
    nYork.push("Hotellas");
    nYork.push("Hotell3");

    inpBy.addEventListener("input", update);

    function update() {
        let byvalgt = inpBy.value;
        if(byvalgt === "") {
            return;
        }
        inpHotell.innerHTML = "<option value = ''>Velg Hotell...</option>";
        for(let i = 0; i < byer[byvalgt].length; i++) {
            let byOption = document.createElement("option");
            byOption.innerHTML = byer[byvalgt][i];
            byOption.id.value = "234";
            inpHotell.appendChild(byOption);
            console.log(byOption);
        }
        console.log(byvalgt);

    }
    btnBestill.addEventListener("click", bestill);

    function bestill() {
        console.log(inpHotell);
        //ha en prisliste på en eller annen måte koblet til hotellnavnet
    }
}