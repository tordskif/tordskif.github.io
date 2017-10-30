function setup() {
    inputNum = document.getElementById("input");
    output = document.getElementById("output");
    inputNum.addEventListener("keyup", calc);
    inputNum.addEventListener("click", calc);

    function calc() {
        let digits = "";
        let num = inputNum.value;
        for (; num >= 1;) {
            if (num / 2 === Math.ceil(num / 2)) {
                //is even
                digits = "0" + digits;
                num = num / 2;
            } else {
                //is odd
                digits = "1" + digits;
                num = (num - 1) / 2;
            }
        }
        output.innerHTML = digits;
    }
}


function lesTall(s, base) {
    let sum = 0;
    for (let i = 0; i < s.length; i++) {
        let c = s.charCodeAt(i) - 48;
        if (c > 9) {
            c = s.charCodeAt(i) - 55;
        }
        sum *= base;
        sum += c;
    }
    console.log(sum);
}
