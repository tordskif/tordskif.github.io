class sprite {
    constructor(x, y, vx, vy, r, div) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.r = r;
        this.div = div;
    }

    flytt() {
        this.x += this.vx;
        this.y += this.vy;
        this.div.style.left = this.x + "px";
        this.div.style.top = this.y + "px";
    }
}

class fallball extends sprite {
    /*constructor(x, y, vx, vy, r, div) {
        // må lage den vanlige tingen først
        super(x, y, vx, vy, r, div);
    }*/
    //eller trenger jeg å gjøre det?, ser ut som det funker når fallball ikke skal ha noen nye egenskaper
    ballDie() {
        this.div.remove();
    }
}
//kan lage subclass av sprite for fallball, kan ha en die() funksjon
//om jeg skal ha powerup for å få flere baller, kan egentlig alle sprites ha ballDie() funksjonen

class record {
    constructor(name, time, d) {
        this.name = name;
        this.time = time;
        this.d = d;
    }
}

//teller bevegelse av sprites som en form for animasjon?

/*
 Ideas: Mer variasjon, gi ballene ulik størrelse, farge etc. Gi en liten startfart nedover slik at g = 0
 fortsatt får ballene til å gå nedover
 Powerups? (invurnability, extra life/shield, multiball(have 3(or get 2 more) balls at once trying to survive, as long as any survive you're in the game))
 More balls as game progresses


 Preset options, for example 0 gravity, 1 pull, 8 diff
 */


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

    let kule = new sprite(0, 0, 0, 0, 10, kuleDiv);

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
            currentPlayer = "Anonymus";
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
        if (Number(a.time) < Number(b.time)) {
            return 1;
        }
        if (Number(a.time) > Number(b.time)) {
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
        for (let b of manyBalls) {
            b.div.remove();
        }
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
        g = gslide.valueAsNumber / 2;
        dval.innerHTML = dslide.valueAsNumber + 1;
        d = dslide.valueAsNumber;
    }
    inputChange();

    area.addEventListener("mousemove", cursormove);

    //holder kontroll på hvor musen er
    function cursormove(e) {
        //152 og 52 er avstanden til boksen fra kanten + 2px border
        cursor.x = e.pageX - 152;
        cursor.y = e.pageY - 52;
    }

    setInterval(gameEngine, 30);
    //faster interval makes game look smoother

    let ballCount = 0;
    let manyBalls = [];

    //hovedloop
    function gameEngine() {
        //move ball around
        kule.vy += g;
        let xdist = kule.x - cursor.x + kule.r;
        let ydist = kule.y - cursor.y + kule.r;

        kule.vy += -ydist * k;
        kule.vx += -xdist * k;

        kule.flytt();

        kule.vx *= 0.98;
        kule.vy *= 0.98;

        if (kule.x > 800 - 2 * kule.r) {
            kule.x = 800 - 2 * kule.r;
            kule.vx = -kule.vx;
            kule.vy *= 0.97;
        }
        if (kule.x < 0) {
            kule.x = 0;
            kule.vx = -kule.vx;
            kule.vy *= 0.97;
        }
        if (kule.y > 500 - 2 * kule.r) {
            kule.y = 500 - 2 * kule.r;
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
        let colorArr = "123456789abcdef".split("");
        if (gameGoing) {
            ballCount++;
        }
        if (ballCount >= 10 - d) {
            let newBall = document.createElement("div");
            //random posisjon fra 0 til 760;
            let x = Math.ceil(Math.random() * 760);
            //random fart fra -5 til +5;
            let vx = Math.ceil(Math.random() * 11) - 6;
            //random yfart fra 1 til 5
            let vy = Math.ceil(Math.random() * 5);
            //random radius fra 10 til 30;
            let r = Math.ceil(Math.random() * 21) + 9;
            //vil ikke ha for lyse farger, så ganger bare med 12, slik at de ikke blander seg med bakgrunnen
            let color = colorArr[Math.floor(Math.random() * 12)] + colorArr[Math.floor(Math.random() * 12)] + colorArr[Math.floor(Math.random() * 12)];
            newBall.className = "ball";
            newBall.style.left = x + "px";
            newBall.style.top = "0px";
            newBall.style.width = r * 2 + "px";
            newBall.style.height = r * 2 + "px";
            newBall.style.backgroundColor = "#" + color;
            box.appendChild(newBall);
            //y = -2r makes it so that sprites spawn out of border
            let ballSprite = new fallball(x, -2 * r, vx, vy, r, newBall);
            manyBalls.push(ballSprite);
            ballCount = 0;
        }

        for (let b of manyBalls) {
            b.vy += g;
            b.flytt();
            if (b.y > 800 || b.x < -200 || b.x > 800) {
                b.ballDie();
                manyBalls.splice(manyBalls.indexOf(b), 1);
            }
            let collisionX = (b.x + b.r) - (kule.x + kule.r);
            let collisionY = (b.y + b.r) - (kule.y + kule.r);
            if (Math.sqrt(collisionX * collisionX + collisionY * collisionY) <= (b.r + kule.r) && gameGoing) {
                die();
            }
        }
    }
}