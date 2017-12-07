/* 
@startuml

title While Loop - Activity Diagram 


start

while (Hungry?)  is (Yes)
  :Eat Hot Wings;
  :Drink Homebrew;
endwhile (No)

:Go To Sleep;

stop

@enduml
 */

function setup() {
    let main = document.getElementById("main");
    let julemann = document.getElementById("julemann");

    let sledeX = 200;
    let sledeY = 100;

    setInterval(bevegSlede, 20);

    function bevegSlede() {
        sledeX -= 8;
        julemann.style.left = sledeX + "px";

        if (sledeX <= -300) {
            sledeX = 1500;
        }
        for (let present of manyPresents) {
            if (parseFloat(present.style.top) <= 580) {
                present.style.top = parseFloat(present.style.top) + 1 + "px";
            } else {
                present.style.opacity -= 0.002;
                if(present.style.opacity <= 0) {
                    manyPresents.splice(manyPresents.indexOf(present), 1);
                }
            }
        }
    }

    julemann.addEventListener("click", dropPresent);

    let manyPresents = [];

    function dropPresent() {
        let newPresent = document.createElement("div");
        newPresent.className = "present";
        newPresent.style.left = sledeX + 40 + "px";
        newPresent.style.top = sledeY + 40 + "px";
        newPresent.style.opacity = 1;
        main.appendChild(newPresent);
        manyPresents.push(newPresent);

    }
}