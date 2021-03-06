function setup() {
    let canvas = document.getElementById("tegning");
    let ctx = canvas.getContext("2d");
    let valg = "rektangel";
    let counter = 0;

    let preview = document.getElementById("preview");
    let pwctx = preview.getContext("2d");

    canvas.addEventListener("mousemove", go);
    canvas.addEventListener("click", go);

    let rotateSlider = document.getElementById("rota");
    rotateSlider.addEventListener("input", inputchange);
    let polygon = document.getElementById("polygon");
    polygon.addEventListener("input", inputchange);
    let color = document.getElementById("color");
    color.addEventListener("input", inputchange);
    let size = document.getElementById("size");
    size.addEventListener("input", inputchange);
    function inputchange() {
        if (polygon.value < 3) {
            polygon.value = 3;
        }
        document.getElementById("slidervalue").innerHTML = rotateSlider.value;
        pwctx.clearRect(0, 0, 200, 200);
        let strokesize = document.getElementById("size").value;
        let color = document.getElementById("color").value;
        let rota = (rotateSlider.value - 90) * Math.PI / 180;
        if (valg === "rektangel") {
            pwctx.fillStyle = color;
            pwctx.fillRect(100 - strokesize / 2, 100 - strokesize / 2, strokesize, strokesize);
        }
        if (valg === "sirkel") {
            pwctx.beginPath();
            pwctx.arc(100, 100, Math.ceil(strokesize / 2), 0, 2 * Math.PI, false);
            pwctx.fillStyle = color;
            pwctx.fill();
        }
        if (valg === "trekant") {
            //for any polygon instead:
            if (polygon.value < 50) {
                pwctx.beginPath();
                pwctx.moveTo(100 + strokesize * Math.cos(Math.PI * 0 + rota) / 2, 100 + strokesize * Math.sin(Math.PI * 0 + rota) / 2);
                for (i = 1; i < polygon.value; i++) {
                    pwctx.lineTo(100 + strokesize * Math.cos(Math.PI * 2 * i / polygon.value + rota) / 2, 100 + strokesize * Math.sin(Math.PI * 2 * i / polygon.value + rota) / 2);
                }
                pwctx.closePath();
                pwctx.fillStyle = color;
                pwctx.fill();
            } else {
                pwctx.beginPath();
                pwctx.arc(100, 100, Math.ceil(strokesize / 2), 0, 2 * Math.PI, false);
                pwctx.fillStyle = color;
                pwctx.fill();
            }
        }
    }

    let rekt = document.getElementById("rektangel");
    rekt.addEventListener("click", changebrush);
    let tri = document.getElementById("trekant");
    tri.addEventListener("click", changebrush);
    let cir = document.getElementById("sirkel");
    cir.addEventListener("click", changebrush);
    let visk = document.getElementById("visk");
    visk.addEventListener("click", changebrush);

    function go(e) {
        counter++;
        if (e.altKey) {
            counter = -1000000;
        }
        let strokesize = size.value;
        let color = document.getElementById("color").value;
        let rota = (rotateSlider.value - 90) * Math.PI / 180;
        if (e.buttons === 1 || e.type === "click") {
            if (valg === "rektangel") {
                ctx.fillStyle = color;
                ctx.fillRect(e.layerX - strokesize / 2, e.layerY - strokesize / 2, strokesize, strokesize);
            }
            if (valg === "visk") {
                ctx.clearRect(e.layerX - strokesize / 2, e.layerY - strokesize / 2, strokesize, strokesize);
            }
            if (valg === "sirkel") {
                ctx.beginPath();
                ctx.arc(e.layerX, e.layerY, Math.ceil(strokesize / 2), 0, 2 * Math.PI, false);
                ctx.fillStyle = color;
                ctx.fill();
            }
            if (valg === "trekant") {
                //for any polygon instead:
                if (polygon.value < 50) {
                    ctx.beginPath();
                    ctx.moveTo(e.layerX + strokesize * Math.cos(Math.PI * 0 + rota) / 2, e.layerY + strokesize * Math.sin(Math.PI * 0 + rota) / 2);
                    for (i = 1; i < polygon.value; i++) {
                        ctx.lineTo(e.layerX + strokesize * Math.cos(Math.PI * 2 * i / polygon.value + rota) / 2, e.layerY + strokesize * Math.sin(Math.PI * 2 * i / polygon.value + rota) / 2);
                    }
                    ctx.closePath();
                    ctx.fillStyle = color;
                    ctx.fill();
                } else {
                    ctx.beginPath();
                    ctx.arc(e.layerX, e.layerY, Math.ceil(strokesize / 2), 0, 2 * Math.PI, false);
                    ctx.fillStyle = color;
                    ctx.fill();
                }
            }
        }
        if (counter > 250) {
            img.style.visibility = "visible";
        }
    }
    function changebrush(e) {
        valg = e.path[0].id;
        let all = document.getElementsByClassName("option");
        for (var i = 0; i < all.length; i++) {
            all[i].style.backgroundColor = "white";
        }
        if (valg === "polygon") {
            valg = e.path[1].id;
            e.path[1].style.backgroundColor = "#EAEA88";
        } else {
            e.path[0].style.backgroundColor = "#EAEA88";
        }
        inputchange();
    }
    inputchange();
}