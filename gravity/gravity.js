class sprite {
    constructor(x, y, vx, vy, div) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.div = div;
    }

    flytt() {
        this.x += this.vx;
        this.y += this.vy;
        this.div.style.left = this.x + "px";
        this.div.style.top = this.y + "px";
    }
}
//kan lage subclass av sprite for fallball, kan ha en die() funksjon

class record {
    constructor(name, time, d) {
        this.name = name;
        this.time = time;
        this.d = d;
    }
}

//teller bevegelse av sprites som en form for animasjon?


function setup() {
    /*
     strikk greier:
     F = kx, der k er variabel konstant, kanskje variabel i UI, x er avstand, og F er kraft, f er ma
     ma = kx => a = (kx)/m og g = a, der g er variabel
    */
    let area = document.getElementById("playarea");
    let kuleDiv = document.getElementById("kule");
    let inputs = document.getElementById("inputs");
    let kval = document.getElementById("kval");
    let gval = document.getElementById("gval");
    let kslide = document.getElementById("kslide");
    let gslide = document.getElementById("gslide");
    let playerName = document.getElementById("playername");
    let box = document.getElementById("box");
    let btnStart = document.getElementById("startbutton");
    let startmenu = document.getElementById("startmenu");
    let countDown = document.getElementById("countdown");
    let tryAgainDiv = document.getElementById("tryagain");
    let message = document.getElementById("message");
    let leaderBoard = document.getElementById("leaderboard");
    let leaderBoardVerdi = document.getElementById("verdi");
    inputs.addEventListener("input", inputChange);

    let g; //gravitasjonskonstant
    let k; //fjærkonstant
    let d; //difficulty

    let kule = new sprite(0, 0, 0, 0, kuleDiv);

    let cursor = {
        x: 0,
        y: 0
    }

    btnStart.addEventListener("click", start);

    let timer;
    let currentPlayer;

    let records = [];

    let gameGoing = false;
    let countDownGoing = false;

    //spillet starter
    function start() {
        box.style.visibility = "visible";
        startmenu.style.visibility = "hidden";
        currentPlayer = playerName.value;
        if (!currentPlayer) {
            currentPlayer = "Anonym";
        }
        kule.x = 400;
        kule.y = 300;
        kule.vx = 0;
        kule.vy = 0;
        kuleDiv.style.left = kule.x + "px";
        kuleDiv.style.top = kule.y + "px";
        countDown.innerHTML = "3";
        setTimeout(function () {
            countDown.innerHTML = "2";
        }, 1000);
        setTimeout(function () {
            countDown.innerHTML = "1";
        }, 2000);
        setTimeout(function () {
            gameGoing = true;
            countDown.innerHTML = "GO!";
            //begynner å telle her
            timer = setInterval(surviveCount, 100);
        }, 3000);
        setTimeout(function () {
            countDown.style.opacity = 0.2;
            countDownGoing = true;
        }, 4500);
    }

    tryAgainDiv.addEventListener("click", tryAgain);

    //spillet er ferdig, gjør klar til å starte på nytt
    function finish() {
        countDown.style.opacity = 1;
        tryAgainDiv.style.visibility = "visible";
        message.innerHTML = "Klikk for å prøve igjen!";
        //prøve å store records i localstorage
        let newRecord = new record(currentPlayer, (surviveTime / 10).toFixed(1), d + 1);
        records.push(newRecord);
        //sorterer bare på tid, kunne sortert på vansklighet også, og derreter tid(om flere har samme vansklighet)
        records.sort(compare);
        console.log(records.sort(compare));
        leaderBoardVerdi.innerHTML = "";
        for (let r of records) {
            let nameDiv = document.createElement("div");
            nameDiv.innerHTML = r.name;
            let timeDiv = document.createElement("div");
            timeDiv.innerHTML = r.time;
            let diffDiv = document.createElement("div");
            diffDiv.innerHTML = r.d;
            leaderBoardVerdi.appendChild(nameDiv);
            leaderBoardVerdi.appendChild(timeDiv);
            leaderBoardVerdi.appendChild(diffDiv);
        }
    }

    //leaderboard sortering
    function compare(a, b) {
        if (a.time < b.time) {
            return 1;
        }
        if (a.time > b.time) {
            return -1;
        }
        return 0;
    }

    //knapp for å starte på nytt
    function tryAgain() {
        //redefinerer variabler slik at spillet kan startes på nytt
        surviveTime = 0;
        box.style.visibility = "hidden";
        startmenu.style.visibility = "visible";
        tryAgainDiv.style.visibility = "hidden";
        kuleDiv.style.opacity = 1;
        ballCount = 0;
        countDownGoing = false;
        manyBalls = [];
    }

    //teller hvor lenge en har overlevd
    let surviveTime = 0;
    function surviveCount() {
        surviveTime++;
        //viser tiden først etter 1.5sek, da er "go" borte
        if (countDownGoing) {
            countDown.innerHTML = (surviveTime / 10).toFixed(1);
        }
    }

    //aktiveres med kolisjon
    function die() {
        kuleDiv.style.opacity = 0;
        gameGoing = false;
        clearInterval(timer);
        countDown.innerHTML = (surviveTime / 10).toFixed(1);
        countDown.style.opacity = 0.2;
        setTimeout(finish, 1000);
    }

    //aktiveres når noen av start-inputene forandres
    function inputChange() {
        kval.innerHTML = kslide.value;
        k = kslide.valueAsNumber / 100;
        gval.innerHTML = gslide.value;
        g = gslide.valueAsNumber;
        dval.innerHTML = dslide.valueAsNumber + 1;
        d = dslide.valueAsNumber;
    }
    inputChange();

    area.addEventListener("mousemove", cursormove);

    //holder kontroll på hvor musen er
    function cursormove(e) {
        cursor.x = e.pageX - 152;
        cursor.y = e.pageY - 52;
    }

    setInterval(gameEngine, 40);

    let ballCount = 0;
    let manyBalls = [];

    //hovedloop
    function gameEngine() {
        //move ball around
        kule.vy += g;
        let xdist = kule.x - cursor.x + 10;
        let ydist = kule.y - cursor.y + 10;

        kule.vy += -ydist * k;
        kule.vx += -xdist * k;

        kule.flytt();

        kule.vx *= 0.98;
        kule.vy *= 0.98;

        if (kule.x > 800 - 20) {
            kule.x = 800 - 20;
            kule.vx = -kule.vx;
            kule.vy *= 0.97;
        }
        if (kule.x < 0) {
            kule.x = 0;
            kule.vx = -kule.vx;
            kule.vy *= 0.97;
        }
        if (kule.y > 500 - 20) {
            kule.y = 500 - 20;
            kule.vy = -kule.vy;
            kule.vx *= 0.97;
        }
        if (kule.y < 0) {
            kule.y = 0;
            kule.vy = -kule.vy;
            kule.vx *= 0.97;
        }

        //trenger å kjøre dette igjen etter kolisjonsberegningene, selv om style også forandres i flytt();
        kuleDiv.style.left = kule.x + "px";
        kuleDiv.style.top = kule.y + "px";

        //create balls to dodge

        //teller hvor ofte en ball skal komme
        if (gameGoing) {
            ballCount++;
        }
        if (ballCount >= 10 - d) {
            let newBall = document.createElement("div");
            //random posisjon fra 0 til 760;
            let x = Math.ceil(Math.random() * 760);
            //random fart fra -10 til +10;
            let vx = Math.ceil(Math.random() * 21) - 11;
            newBall.className = "ball";
            newBall.style.left = x + "px";
            newBall.style.top = "10px";
            box.appendChild(newBall);
            let ballSprite = new sprite(x, 10, vx, 0, newBall);
            manyBalls.push(ballSprite);
            ballCount = 0;
        }

        for (let b of manyBalls) {
            b.vy += g;
            b.flytt();
            //ballen har falt ned under skjermen, trenger bare å bruke shift(), fordi ballen som faller ut vil alltid være den første i arrayen
            if (b.y > 800) {
                b.div.remove();
                manyBalls.shift();
            }
            let collisionX = b.x - kule.x + 10;
            let collisionY = b.y - kule.y + 10;
            if (Math.sqrt(collisionX * collisionX + collisionY * collisionY) <= 30 && gameGoing) {
                die();
            }
        }
    }
}