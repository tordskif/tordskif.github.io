function setup() {
    let kart = document.getElementById("kart");
    let modal = document.getElementById('myModal');
    let span = document.getElementsByClassName("close")[0];
    let vid = document.getElementById("vid");

    kart.addEventListener("click", mapClick);

    function distance(ax, ay, bx, by) {
        let dist = Math.sqrt((ax - bx) * (ax - bx) + (ay - by) * (ay - by));
        return dist;
    }

    function mapClick(e) {
        let x = e.layerX;
        let y = e.layerY;

        //avstand fra klikk til halden(310, 450) må være innenfor en radius på 60px;
        if(distance(310, 450, x, y) < 60) {
            console.log("halden");
            modal.style.display = "block";
            vid.innerHTML = "<video id='currentvid' width='620px'><source src='haldenmbilder.mp4' type='video/mp4'></video>";
            let vidplaying = document.getElementById("currentvid");
            vidplaying.play();
        }

        //avstand fra klikk til fredrikstad(135, 380) må være innenfor en radius på 60px;
        if(distance(135, 380, x, y) < 60) {
            console.log("fredrikstad");
            modal.style.display = "block";
            vid.innerHTML = "<video id='currentvid' width='620px'><source src='fredrikstad.mp4' type='video/mp4'></video>";
            let vidplaying = document.getElementById("currentvid");
            vidplaying.play();
        }
    }
    span.onclick = function() {
        modal.style.display = "none";
    }
    window.onclick = function(event) {
        console.log(event.target);
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }    
}