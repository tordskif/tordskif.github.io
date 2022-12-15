function setup() {
    let main = document.getElementById("main");
    let klubbeDiv = document.getElementById("klubbe");
    let ballDiv = document.getElementById("ball");

    let k = 0.01; //fjærkonstant
    let s = 100; //energisvinn med støt

    let cursor = {
        x: 250,
        y: 100
    }
    let klubbe = {
        vx: 0,
        vy: 0,
        x: 300,
        y: 200,
        r: 20,
        m: 1
    }

    let ball = {
        vx: 20,
        vy: 0,
        x: 200,
        y: 100,
        r: 20,
        m: 1
    }

    main.addEventListener("mousemove", cursormove);

    //holder kontroll på hvor musen er
    function cursormove(e) {
        cursor.x = e.pageX - this.offsetLeft;
        cursor.y = e.pageY - this.offsetTop;
    }

    setInterval(gameEngine, 30);
    //faster interval makes game look smoother

    //hovedloop
    function gameEngine() {
        //move ball around
        let xdist = klubbe.x - cursor.x + klubbe.r;
        let ydist = klubbe.y - cursor.y + klubbe.r;

        klubbe.vy += -ydist * k;
        klubbe.vx += -xdist * k;

        klubbe.x += klubbe.vx;
        klubbe.y += klubbe.vy;

        ball.x += ball.vx;
        ball.y += ball.vy;

        klubbe.vx *= 0.98;
        klubbe.vy *= 0.98;
        ball.vx *= 0.98;
        ball.vy *= 0.98;

        //klubbe vegg check
        if (klubbe.x > 800 - 2 * klubbe.r) {
            klubbe.x = 800 - 2 * klubbe.r;
            klubbe.vx = -klubbe.vx;
            klubbe.vy *= 0.97;
        }
        if (klubbe.x < 0) {
            klubbe.x = 0;
            klubbe.vx = -klubbe.vx;
            klubbe.vy *= 0.97;
        }
        if (klubbe.y > 500 - 2 * klubbe.r) {
            klubbe.y = 500 - 2 * klubbe.r;
            klubbe.vy = -klubbe.vy;
            klubbe.vx *= 0.97;
        }
        if (klubbe.y < 0) {
            klubbe.y = 0;
            klubbe.vy = -klubbe.vy;
            klubbe.vx *= 0.97;
        }
        //ball vegg check
        if (ball.x > 800 - 2 * ball.r) {
            ball.x = 800 - 2 * ball.r;
            ball.vx = -ball.vx;
            ball.vy *= 0.97;
        }
        if (ball.x < 0) {
            ball.x = 0;
            ball.vx = -ball.vx;
            ball.vy *= 0.97;
        }
        if (ball.y > 500 - 2 * ball.r) {
            ball.y = 500 - 2 * ball.r;
            ball.vy = -ball.vy;
            ball.vx *= 0.97;
        }
        if (ball.y < 0) {
            ball.y = 0;
            ball.vy = -ball.vy;
            ball.vx *= 0.97;
        }

        klubbeDiv.style.left = klubbe.x + "px";
        klubbeDiv.style.top = klubbe.y + "px";
        ballDiv.style.left = ball.x + "px";
        ballDiv.style.top = ball.y + "px";

        //collision check
        let collisionX = (klubbe.x + klubbe.r) - (ball.x + ball.r);
        let collisionY = (klubbe.y + klubbe.r) - (ball.y + ball.r);
        if (Math.sqrt(collisionX * collisionX + collisionY * collisionY) <= (klubbe.r + ball.r)) {
            //støt

            //energi før:
            let Ef = (ball.m * pyt(ball.vx, ball.vy) * pyt(ball.vx, ball.vy) + klubbe.m * pyt(klubbe.vx, klubbe.vy) * pyt(klubbe.vx, klubbe.vy)) / 2;
            let E = Ef * s;
            //p1 har samme retning som r, som er [collisionX, collisionY];
            //f etter variabel betyr verdi før støt
            let p1f = {
                x: ball.x * ball.m,
                y: ball.y * ball.m
            }
            let p2f = {
                x: klubbe.x * klubbe.m,
                y: klubbe.y * klubbe.m
            }
            let sp = {
                x: p1f.x + p2f.x,
                y: p1f.y + p2f.y
            }
            //A foran en variabel betyr lengden av den;
            let m = ball.m;
            let n = klubbe.m;

            //prøvde å simplifya: https://quickmath.com/webMathematica3/quickmath/algebra/simplify/basic.jsp#c=simplify_stepssimplify&v1=%2528a%2520c%2520m_1%2520%2B%2520b%2520d%2520m_1%2520%2B%2520sqrt%2528-a%25B2%2520c%25B2%2520m_1%2520m_2%2520-%2520a%25B2%2520d%25B2%2520m_1%25B2%2520-%2520a%25B2%2520d%25B2%2520m_1%2520m_2%2520%2B%25202a%2520b%2520c%2520d%2520m_1%25B2%2520-%2520b%25B2%2520c%25B2%2520m_1%25B2%2520-%2520b%25B2%2520c%25B2%2520m_1%2520m_2%2520-%2520b%25B2%2520d%25B2%2520m_1%2520m_2%2529%2529%2520%2F%2520%2528a%25B2%2520m_1%2520%2B%2520a%25B2%2520m_2%2520%2B%2520b%25B2%2520m_1%2520%2B%2520b%25B2%2520m_2%2529
            //det e det som ska vær verdien for k som ska scala r vektoren
            //r har koordinatene [a,b], og summen av bevegelsesmengdane har koordinatene [c,d]
            //m1 e massen te ballen, m2 e massen te klubbå (tror eg)
            //får se om eg gidde å skriva det inn her
            //https://www.emathhelp.net/calculators/algebra-2/simplify-calculator/?i=%28a+c+m+%2B+b+d+m+%2B+sqrt+%28-a_2+c_2+m+n+-+a_2+d_2+m_2+-+a_2+d_2+m+n+%2B+2a+b+c+d+m_2+-+b_2+c_2+m_2+-+b_2+c_2+m+n+-+b_2+d_2+m+n%29%29+%2F+%28a_2+m+%2B+a_2+n+%2B+b_2+m+%2B+b_2+n%29
            let a = collisionX;
            let b = collisionY;
            let c = sp.x;
            let d = sp.y;

            let k = ((a * c * m + b * d * m + Math.sqrt(Math.abs(2 * E * a * a * m * m * n + 2 * E * a * a * m * n * n + 2 * E * b * b * m * m * n + 2 * E * b * b * m * n * n - a * a * c * c * m * n - a * a * d * d * m * m - a * a * d * d * m * n + 2 * a * b * c * d * m * m - b * b * c * c * m * m - b * b * c * c * m * n - b * b * d * d * m * n))) / (a * a * m + a * a * n + b * b * m + b * b * n));

            console.log(k);
            p1 = {
                x: collisionX * k,
                y: collisionY * k
            }
            p2 = {
                x: sp.x - p1.x,
                y: sp.y - p1.y
            }
            ball.vx = p1.x / ball.m;
            ball.vy = p1.y / ball.m;
            klubbe.vx = p2.x / klubbe.m;
            klubbe.vy = p2.y / klubbe.m;

        }
    }
    function pyt(a, b) {
        return Math.sqrt(a * a + b * b);
    }
    //hei
}