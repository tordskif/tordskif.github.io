function setup() {
    let main = document.getElementById("main");
    arr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];
    window.addEventListener("keydown", stop);

    let going = false;
    let interval;
    function stop() {
        if (going) {
            clearInterval(interval);
            going = false;
        } else {
            interval = setInterval(test, 350);
            going = true;
        }
    }
    function test() {
        let color = "";
        for (let i = 0; i < 6; i++) {
            color += arr[Math.floor(Math.random() * 16)];
        }
        main.style.backgroundColor = "#" + color;
    }
}