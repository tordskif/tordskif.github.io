// @ts-check

function setup() {
    let divMain = document.querySelector("#main");
    let btnBeregn = document.querySelector("#beregn");
    let inpForbruk = document.querySelector("#forbruk");
    let inpTank = document.querySelector("#tank");
    let divOutput = document.querySelector("#output");

    btnBeregn.addEventListener("click", beregn);
    function beregn() {
        // @ts-ignore
        let tank = Number(inpTank.value);
        // @ts-ignore
        let forbruk = Number(inpForbruk.value);
        console.log(forbruk);
        let output = (tank / forbruk).toFixed(2);
        divOutput.innerHTML = "Du vil komme " + output + " mil på denne tanken";


    }
    document.addEventListener("keydown", toggle);

    function toggle(e) {
        if (e.keyCode === 84) {
            toggleCount++;
            if (toggleCount === 4) {
                toggleCount = 1;
            }
            if (toggleCount === 1) {
                inpForbruk.focus();
            }
            if (toggleCount === 2) {
                inpTank.focus();
            }
            if (toggleCount === 3) {
                btnBeregn.focus();
            }
        }
    }
    divMain.addEventListener("click", selectElement);

    let toggleCount = 0;

    function selectElement(e) {
        let div = e.path[0].className;
        if (div === "") {
            return;
        }
        toggleCount = div;
    }
    setInterval(rotate, 20);

    let count = 0;

    function rotate() {
        count++;
        divMain.style.transform = "rotate(" + count + "deg)";
    }
}