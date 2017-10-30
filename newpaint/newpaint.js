function setup() {
    let canvas = document.getElementById("tegning");
    let ctx = canvas.getContext("2d");
    let valg = "rektangel";
    let counter = 0;

    canvas.addEventListener("mousemove", go);
    canvas.addEventListener("click", go);

    let rekt = document.getElementById("rektangel");
    rekt.addEventListener("click", changebrush);
    let tri = document.getElementById("trekant");
    tri.addEventListener("click", changebrush);
    let cir = document.getElementById("sirkel");
    cir.addEventListener("click", changebrush);
    let visk = document.getElementById("visk");
    visk.addEventListener("click", changebrush);

    document.getElementById("size").value = 20;

    function go(e) {
        counter++;
        if(e.altKey) {
            counter = -1000000;
        }
        let strokesize = document.getElementById("size").value;
        let color = document.getElementById("color").value;
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
                ctx.beginPath();
                ctx.moveTo(e.layerX - strokesize / 2, e.layerY + (strokesize / 2) * Math.tan(Math.PI / 6));
                ctx.lineTo((e.layerX + strokesize / 2), e.layerY + (strokesize / 2) * Math.tan(Math.PI / 6));
                ctx.lineTo(e.layerX, e.layerY - strokesize * Math.sin(Math.PI / 3) + (strokesize / 2) * Math.tan(Math.PI / 6));
                ctx.closePath();
                ctx.fillStyle = color;
                ctx.fill();
            }
        }
        if(counter > 250) {
            console.log("hallo");
            img.style.visibility = "visible";
        }
    }
    function changebrush(e) {
        valg = e.path[0].id;
        let all = document.getElementsByClassName("option");
        for (var i = 0; i < all.length; i++) {
          all[i].style.backgroundColor = "white";
        }
        e.path[0].style.backgroundColor = "#EAEA88";
    }
}