function setup() {
    let canvas = document.getElementById("tegning");
    let ctx = canvas.getContext("2d");

    let x = 0;
    let y = 0;
    let vx = 2;
    let vy = 2;

    setInterval(go, 20);

    function go() {
        ctx.clearRect(0, 0, 500, 500);
        ctx.beginPath();
        ctx.arc(50 + x, 50 + y, 30, 0, Math.PI * 2, true);
        ctx.arc(50 + x, 50 + y, 25, 0, Math.PI * 2, true);
        ctx.fill('evenodd');

        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 5;
        ctx.moveTo(50 + x, 80 + y);
        ctx.lineTo(50 + x, 180 + y);
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 5;
        ctx.moveTo(50 + x, 120 + y);
        ctx.lineTo(0 + x, 80 + y);
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 5;
        ctx.moveTo(50 + x, 120 + y);
        ctx.lineTo(100 + x, 80 + y);
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 5;
        ctx.moveTo(50 + x, 175 + y);
        ctx.lineTo(80 + x, 260 + y);
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 5;
        ctx.moveTo(50 + x, 175 + y);
        ctx.lineTo(20 + x, 260 + y);
        ctx.stroke();

        if (x > 400) {
            vx = -(Math.ceil(Math.random() * 4) + 1)
        }
        if (x < 0) {
            vx = (Math.ceil(Math.random() * 4) + 1)
        }
        if (y > 240) {
            vy = -(Math.ceil(Math.random() * 4) + 1)
        }
        if (y < -20) {
            vy = (Math.ceil(Math.random() * 4) + 1)
        }

        x += vx;
        y += vy;
    }
}


/* hus med tak
    ctx.rotate((Math.PI / 180) * 45);

    ctx.fillStyle = "rgb(200, 0, 0)";
    ctx.fillRect(200, -80, 150, 150);

    ctx.rotate((Math.PI / 180) * -45);
    ctx.clearRect(90, 190, 300, 200);

    ctx.fillStyle = "rgb(0, 0, 200)";
    ctx.fillRect(110, 190, 176, 150);

    ctx.fillStyle = "rgb(80, 50, 0)";
    ctx.fillRect(178, 270, 40, 70);

    ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
    ctx.fillRect(123, 220, 40, 40);

    ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
    ctx.fillRect(178, 220, 40, 40);

    ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
    ctx.fillRect(233, 220, 40, 40);*/