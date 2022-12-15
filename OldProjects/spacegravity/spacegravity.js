class planet {
    constructor(x, y, vx, vy, div, r, mass) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.div = div;
        this.mass = mass;
        this.fx = 0;
        this.fy = 0;
    }
}

function setup() {
    let playField = document.getElementById("playfield");
    let inpVx = document.getElementById("vx");
    let inpMass = document.getElementById("mass");
    playField.addEventListener("click", deploy);

    let planets = [];

    setInterval(gameEngine, 20);

    /*
    Sånn det fungerer nå, forandres posisjonen til hver planet etterhvert, det gjør at kalkulasjonene er forskjellige
    etter hvilke planet det blir kalkulert for først. Heller kalkuler alle posisjonene planetene vil ha neste tick, så
    til slutt faktisk forandre posisjonen

    Try to make them follow newtons law of gravity and newtons 2. law
    */

    function gameEngine() {
        for (let p of planets) {
            for (let i of planets) {
                if (i === p) {
                    continue;
                }
                let distX = i.x - p.x;
                let distY = i.y - p.y;
                let dist = Math.sqrt(distX * distX + distY * distY);
                let f = (p.mass * i.mass*40) / (dist * Math.abs(dist));
                p.fx += distX/dist * f;
                p.fy += distY/dist * f;
            }
        }
        for (let p of planets) {
            p.vx += p.fx / p.mass;
            p.vy += p.fy / p.mass;
            p.fx = 0;
            p.fy = 0;
            p.x += p.vx;
            p.y += p.vy;
            p.div.style.left = p.x + "px";
            p.div.style.top = p.y + "px";
        }
    }

    function deploy(e) {
        console.log(e.pageX, e.pageY);
        let newPlanetDiv = document.createElement("div");
        newPlanetDiv.className = "planet";
        playField.appendChild(newPlanetDiv);
        newPlanetDiv.style.left = e.pageX - 15 + "px";
        newPlanetDiv.style.top = e.pageY - 15 + "px";
        let newPlanet = new planet(e.pageX - 15, e.pageY - 15, inpVx.valueAsNumber, 0, newPlanetDiv, 15, inpMass.valueAsNumber);
        planets.push(newPlanet);
        console.log(planets);
    }
}