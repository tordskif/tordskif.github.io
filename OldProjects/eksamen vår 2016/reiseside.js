function setup() {
    let divMain = document.getElementById("main");
    let divStPeter = document.getElementById("stPeter")
    let vid = document.getElementById("video");
    let question = document.getElementById("question");
    let divNYork = document.getElementById("nYork");
    let button = document.getElementById("button");
    divMain.addEventListener("click", clicked);

    let imgToggle = false;

    let vidPlaying = false;

    let questionToggle = false;

    let boxes = document.getElementsByClassName("checkbox");

    button.addEventListener("click", buttonClick);

    function clicked(e) {
        let div = e.path[0].id;
        if (imgToggle) {
            divStPeter.style.top = "25px";
            divStPeter.style.left = "25px";
            divStPeter.style.width = "550px";
            divStPeter.style.height = "300px";
            divStPeter.style.position = "absolute";
            imgToggle = false;
            return;
        }
        if (questionToggle && e.path[0].className !== "checkbox" && div !== "button") {
            question.style.visibility = "hidden";
            questionToggle = false;
            divNYork.style.top = "675px";
            divNYork.style.left = "25px";
            divNYork.style.width = "550px";
            divNYork.style.height = "300px";
            divNYork.style.position = "absolute";
            divNYork.style.zIndex = "1";
            return;
        }
        console.log(div);
        if (div === "main") {
            return;
        }
        if (div === "stPeter") {
            imgToggle = true;
            divStPeter.style.top = "5px";
            divStPeter.style.left = "5px";
            divStPeter.style.width = "1146px";
            divStPeter.style.height = "625px";
            divStPeter.style.position = "fixed";
        }
        if (div === "roma" || div === "video") {
            vid.style.visibility = "visible";
            if (!vidPlaying) {
                vid.play();
                vidPlaying = true;
            } else {
                vid.pause();
                vidPlaying = false;
            }
        }
        if (div === "nYork") {
            question.style.visibility = "visible";
            questionToggle = true;
            divNYork.style.top = "50px";
            divNYork.style.left = "200px";
            divNYork.style.width = "825px";
            divNYork.style.height = "450px";
            divNYork.style.position = "fixed";
            divNYork.style.zIndex = "3";
        }
        if(e.path[0].className === "checkbox") {
            for(let i = 0; i < boxes.length; i++) {
                boxes[i].checked = false;
            }
            e.path[0].checked = true;
        }
    }
    function buttonClick() {
        let inputChecked = false;
        for(let i = 0; i < boxes.length; i++) {
            if(boxes[i].checked) {
                inputChecked = true;
                break;
            }
        }
        if(!inputChecked) {
            alert("Du har ikke avkrysset noe");
            return;
        }
        if(boxes[1].checked) {
            alert("Du svarte rett, dette er faktisk en spaghet");
            return;
        } else {
            alert("Du svarte feil, du er dum");
            return;
        }
    }
}