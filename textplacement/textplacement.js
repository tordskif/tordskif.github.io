//@ts-check
function setup() {
    let input = document.getElementById("text");
    let doneBtn = document.getElementById("inputDone");
    let questionText = document.getElementById("questionText");
    let dragoptions = document.getElementById("dragOptions");

    doneBtn.addEventListener("click", transferToOutput);

    function transferToOutput() {
        let inputValue = input.value;
        let arr = inputValue.split("|");
        console.log(arr);
        if (arr.length % 2 === 0) {
            console.log("error, odd number of separators");
            return;
        }
        let sections = [];
        for (let i = 0; i < arr.length; i++) {
            if (i % 2 === 1) {
                sections.push(arr[i]);
            }
        }
        console.log(sections);
        let elementid = 0;
        for (let element of sections) { //need to delete dragthings before creating new ones
            let newDragSelection = document.createElement("div");
            newDragSelection.innerHTML = element;
            newDragSelection.className = "drag";
            newDragSelection.id = elementid;
            dragoptions.appendChild(newDragSelection);
            elementid++;
        }
        //below return text with parsed areas
        for(let i = 0; i < arr.length; i++) {
            if(i % 2 === 0) {      
                questionText.innerHTML += arr[i];
            } else {
                questionText.innerHTML += "<div class='insertfield'></div>" //give insertfields id according to location, this will then be the same as the id of the drag options. Then randomize the order of the dragoptions
            }
        }
        //questionText.innerHTML = inputValue;
    }

    dragoptions.addEventListener("click", moveElement);
    let divFocus = undefined;
    function moveElement(e) {
        let div = e.path[0];
        if (div.className !== "drag") {
            return;
        }
        if (divFocus !== undefined) {
            divFocus.style.opacity = "1";
        }
        if (div === divFocus) {
            divFocus = undefined;
            return;
        }
        divFocus = div;
        divFocus.style.opacity = "0.5";
        console.log(div);
    }
}