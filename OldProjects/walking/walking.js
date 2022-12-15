function setup() {
    let boks = document.getElementById("boks");
    setInterval(go, 200);
    let x = 900;
    let y = 350;
    let count = 0;

    function go() {
        count++;
        if(count%2 === 1) {
            x -= 20;
        } else {
            x += 20;
        }
        if(count >= 41) {
            x -=40;
            boks.style.left = x;
        }
        boks.style.left = x + "px";
    }
}