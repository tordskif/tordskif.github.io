/* Hardcosing isnt fun, i think i will instead try to optimize the lookahead function, make it take into account enemy positions too etc.
maybe try to make enemys best choice the worst 
to make all that easier, maybe there is a better way so search how many are in a row., or better ways to determine score

Have one function that claculates score of a given boardstate(negative for how good opponent is doing, positive for how good it is doing)
go through 5-9 turns and calculate the score of all the board states
Go backwards, picking the highest score outcome when it is its turn, and the lowest score outcome when opponents turn.
Will then end up with the result which minimizes the opponens score while maximizing its score
*/

function setup() {
    let gameState = 0;
    let gameBoard = [
        [], //collum 1
        [], //collum 2 etc...
        [],
        [],
        [],
        [],
        []
    ];
    let divBoard = [
        [], //collum 1
        [], //collum 2 etc...
        [],
        [],
        [],
        [],
        []
    ];

    window.ondragstart = function () { return false; }

    let currentTurn = "red";

    let main = document.getElementById("main");

    function generateBoard() {
        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < 6; j++) {
                let newTile = document.createElement("div");
                newTile.className = "tile";
                newTile.id = i + " " + j;
                let xloc = i * 90 + 20;
                let yloc = j * 90 + 20;
                newTile.style.left = xloc + "px";
                newTile.style.top = yloc + "px";
                main.appendChild(newTile);
                divBoard[i][j] = newTile;
                //push in array
            }
        }
    }
    main.addEventListener("click", clickOnColumn);

    function sleep(milliseconds) {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > milliseconds) {
                break;
            }
        }
    }

    function clickOnColumn(e) {
        if (gameState === 1) {
            return;
        }
        let column = e.path[0].id.split(" ")[0];
        if (column === "main") {
            return;
        }
        if (gameBoard[column].length < 6) {
            if (gameState === 2) {
                return;
            }
            placeTile(currentTurn, column);
            if (gameState === 1) {
                return;
            }
            gameState = 2;
            setTimeout(AIPick, 10);
            setTimeout(function () {
                if (gameState !== 1) { gameState = 0 };
            }, 1500);
        }
    }

    function placeTile(color, column) {
        if (gameBoard[column].length < 6) {
            gameBoard[column].push(color);
            checkForWins();
            if (currentTurn === "red") {
                currentTurn = "yellow";
            } else {
                currentTurn = "red";
            }
            update();
        }
    }

    function update() {
        for (let i = 0; i < 7; i++) {
            for (let j = 5; j >= 0; j--) {
                divBoard[i][5 - j].style.backgroundColor = gameBoard[i][j];
            }
        }
    }

    function checkForWins() { //only need to check for currentturns
        for (let i = 0; i < 7; i++) {
            for (let j = 5; j >= 0; j--) {
                if (gameBoard[i][j] === currentTurn) { // have found one piece
                    if (gameBoard[i + 3] !== undefined && gameBoard[i + 1][j] === currentTurn) { //have found a second one to the right
                        if (gameBoard[i + 2][j] === currentTurn && gameBoard[i + 3][j] === currentTurn) {
                            gameState = 1;
                            divBoard[i][5 - j].style.filter = "hue-rotate(-60deg)";
                            divBoard[i + 1][5 - j].style.filter = "hue-rotate(-60deg)";
                            divBoard[i + 2][5 - j].style.filter = "hue-rotate(-60deg)";
                            divBoard[i + 3][5 - j].style.filter = "hue-rotate(-60deg)";
                            return;
                        }
                    }
                    if (gameBoard[i + 3] !== undefined && gameBoard[i + 1][j + 1] === currentTurn) { //have found a second one to the right
                        if (gameBoard[i + 2][j + 2] === currentTurn && gameBoard[i + 3][j + 3] === currentTurn) {
                            gameState = 1;
                            divBoard[i][5 - j].style.filter = "hue-rotate(-60deg)";
                            divBoard[i + 1][5 - j - 1].style.filter = "hue-rotate(-60deg)";
                            divBoard[i + 2][5 - j - 2].style.filter = "hue-rotate(-60deg)";
                            divBoard[i + 3][5 - j - 3].style.filter = "hue-rotate(-60deg)";
                            return;
                        }
                    }
                    if (gameBoard[i][j + 1] === currentTurn) { //have found a second one to the right
                        if (gameBoard[i][j + 2] === currentTurn && gameBoard[i][j + 3] === currentTurn) {
                            gameState = 1;
                            divBoard[i][5 - j].style.filter = "hue-rotate(-60deg)";
                            divBoard[i][5 - j - 1].style.filter = "hue-rotate(-60deg)";
                            divBoard[i][5 - j - 2].style.filter = "hue-rotate(-60deg)";
                            divBoard[i][5 - j - 3].style.filter = "hue-rotate(-60deg)";
                            return;
                        }
                    }
                    if (gameBoard[i + 3] !== undefined && gameBoard[i + 1][j - 1] === currentTurn) { //have found a second one to the right
                        if (gameBoard[i + 2][j - 2] === currentTurn && gameBoard[i + 3][j - 3] === currentTurn) {
                            gameState = 1;
                            divBoard[i][5 - j].style.filter = "hue-rotate(-60deg)";
                            divBoard[i + 1][5 - j + 1].style.filter = "hue-rotate(-60deg)";
                            divBoard[i + 2][5 - j + 2].style.filter = "hue-rotate(-60deg)";
                            divBoard[i + 3][5 - j + 3].style.filter = "hue-rotate(-60deg)";
                            return;
                        }
                    }
                }
            }
        }
    }
    function clone(existingArray) {
        var newObj = (existingArray instanceof Array) ? [] : {};
        for (i in existingArray) {
            if (i == 'clone') continue;
            if (existingArray[i] && typeof existingArray[i] == "object") {
                newObj[i] = clone(existingArray[i]);
            } else {
                newObj[i] = existingArray[i]
            }
        }
        return newObj;
    }

    function AIPick() { //kan prøve å få den til å maksimere antall brikker på rad, bør jo heller ta å gjøre slik at en gjør det vørste motstander movet så dårlig så mulig da
        let score = []; //felt 0 har scoren til om en plaserer på plass 0 etc.
        for (let i = 0; i < 7; i++) {
            score[i] = [];
            let calcState1 = clone(gameBoard); //sjekke om hvis en blir plasert her, gir en motstanderen vinn, da blir det minus mye
            let calcTurn = "yellow";
            if (calcState1[i].length < 6 && checkForWinsSimulation(calcState1) !== "ended") {
                calcState1[i].push(calcTurn);
            }
            for (let j = 0; j < 7; j++) { //eliminate boardstates with more than 6 in any column
                score[i][j] = [];
                calcTurn = "red";
                let calcState2 = clone(calcState1);
                if (calcState2[j].length < 6 && checkForWinsSimulation(calcState2) !== "ended") {
                    calcState2[j].push(calcTurn);
                }
                for (let k = 0; k < 7; k++) {
                    score[i][j][k] = [];
                    calcTurn = "yellow";
                    let calcState3 = clone(calcState2);
                    if (calcState3[k].length < 6 && checkForWinsSimulation(calcState3) !== "ended") {
                        calcState3[k].push(calcTurn);
                    }
                    for (let l = 0; l < 7; l++) {
                        score[i][j][k][l] = [];
                        calcTurn = "red";
                        let calcState4 = clone(calcState3);
                        if (calcState4[l].length < 6 && checkForWinsSimulation(calcState4) !== "ended") {
                            calcState4[l].push(calcTurn); //prolly need to check each state if it already lost, and then not continue with it
                        }
                        for (let m = 0; m < 7; m++) {
                            score[i][j][k][l][m] = 0;
                            calcTurn = "yellow";
                            let calcState5 = clone(calcState4);
                            if (calcState5[m].length < 6 && checkForWinsSimulation(calcState5) !== "ended") {
                                calcState5[m].push(calcTurn);
                            }
                            score[i][j][k][l][m] = calculateScore(calcState5);
                        }
                    }
                }
            }
        }
        let scoreclon = clone(score);
        console.log(scoreclon);
        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < 7; j++) {
                for (let k = 0; k < 7; k++) {
                    for (let l = 0; l < 7; l++) {
                        score[i][j][k][l] = Math.max.apply(Math, score[i][j][k][l]);
                    }
                }
            }
        }
        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < 7; j++) {
                for (let k = 0; k < 7; k++) {
                    score[i][j][k] = Math.min.apply(Math, score[i][j][k]);
                }
            }
        }
        //let scoreclone = clone(score);
        //console.log(scoreclone);
        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < 7; j++) {
                score[i][j] = Math.max.apply(Math, score[i][j]);
            }
        }
        //let scoreclone1 = clone(score);
        //console.log(scoreclone1);
        for (let i = 0; i < 7; i++) {
            score[i] = Math.min.apply(Math, score[i]);
        }
        for (let i = 0; i < 7; i++) {
            let placement = score.indexOf(Math.max.apply(Math, score)); //if there are multiple with same value, maybe do a random choice between them
            if (gameBoard[placement].length < 6) {
                placeTile(currentTurn, placement);
                break;
            }
            score[placement] = -1000000000;
        }
        console.log(score);
    }

    function calculateScore(board) { //board is a boardstate array;
        let score = 0;
        for (let b = 5; b >= 0; b--) {
            /* need a better method for checking if there are in line, the current way only works forwards, partly backwards, and the tile searching from needs to be first or last, cant be middle
            if i manage to make this method better, then program will perform much better 
            */

            /*
            What was a problem(maybe not anymore, added return when finding 4 in a row(prolly actually is)) was that it continued to score boards that had previously lost, meaning it thought something was a good outcome when it already lost 2 turns ago 
             */
            for (let a = 0; a < 7; a++) {
                if (board[a][b] === "yellow") { //have found yellow piece
                    for (let i = 1; i < 4; i++) { //denne måten å gjøre det dekker flere cases, om det er bake eller froan focustilen, minker mengden hardcoding, bør også gjøre dette for 3 på rad med og uten hull
                        if (board[a - 4 + i] !== undefined && board[a - 1 + i] !== undefined && board[a - 1 + i][b] === "yellow" && board[a - 2 + i][b] === "yellow" && board[a - 3 + i][b] === "yellow" && board[a - 4 + i][b] === "yellow") {
                            score += 500000; //when pnly using thismethod to find scores, minmaxing removes both the high and the low scores, and all ends up being 0
                            break; //need to break out of i-loop to not cause multiple score incrementations, or do i? 
                        }
                    }
                    for (let i = 1; i < 4; i++) {
                        if (board[a - 4 + i] !== undefined && board[a - 1 + i] !== undefined && board[a - 1 + i][b - 1 + i] === "yellow" && board[a - 2 + i][b - 2 + i] === "yellow" && board[a - 3 + i][b - 3 + i] === "yellow" && board[a - 4 + i][b - 4 + i] === "yellow") {
                            score += 500000;
                            break;
                        }
                    }
                    for (let i = 1; i < 4; i++) {
                        if (board[a][b - 1 + i] === "yellow" && board[a][b - 2 + i] === "yellow" && board[a][b - 3 + i] === "yellow" && board[a][b - 4 + i] === "yellow") {
                            score += 500000;
                            break;
                        }
                    }
                    for (let i = 1; i < 4; i++) {
                        if (board[a - 4 + i] !== undefined && board[a - 1 + i] !== undefined && board[a - 1 + i][b + 1 - i] === "yellow" && board[a - 2 + i][b + 2 - i] === "yellow" && board[a - 3 + i][b + 3 - i] === "yellow" && board[a - 4 + i][b + 4 - i] === "yellow") {
                            score += 500000;
                            break;
                        }
                    }
                    //start checking for only 3 at a time, with empty space somewhere in between, empety in loc 1
                    for (let i = 1; i < 4; i++) {
                        if (board[a - 4 + i] !== undefined && board[a - 1 + i] !== undefined && board[a - 1 + i][b] === undefined && board[a - 2 + i][b] === "yellow" && board[a - 3 + i][b] === "yellow" && board[a - 4 + i][b] === "yellow") {
                            score += 100;
                            break;
                        }
                    }
                    for (let i = 1; i < 4; i++) {
                        if (board[a - 4 + i] !== undefined && board[a - 1 + i] !== undefined && board[a - 1 + i][b - 1 + i] === undefined && board[a - 2 + i][b - 2 + i] === "yellow" && board[a - 3 + i][b - 3 + i] === "yellow" && board[a - 4 + i][b - 4 + i] === "yellow") {
                            score += 100;
                            break;
                        }
                    }
                    for (let i = 1; i < 4; i++) {
                        if (board[a][b - 1 + i] === undefined && board[a][b - 2 + i] === "yellow" && board[a][b - 3 + i] === "yellow" && board[a][b - 4 + i] === "yellow" && b - 1 + i !== 6) {
                            score += 100;
                            break;
                        }
                    }
                    for (let i = 1; i < 4; i++) {
                        if (board[a - 4 + i] !== undefined && board[a - 1 + i] !== undefined && board[a - 1 + i][b + 1 - i] === undefined && board[a - 2 + i][b + 2 - i] === "yellow" && board[a - 3 + i][b + 3 - i] === "yellow" && board[a - 4 + i][b + 4 - i] === "yellow") {
                            score += 100;
                            break;
                        }
                    }
                    //empety in loc 2
                    for (let i = 1; i < 4; i++) {
                        if (board[a - 4 + i] !== undefined && board[a - 1 + i] !== undefined && board[a - 1 + i][b] === "yellow" && board[a - 2 + i][b] === undefined && board[a - 3 + i][b] === "yellow" && board[a - 4 + i][b] === "yellow") {
                            score += 100;
                            break;
                        }
                    }
                    for (let i = 1; i < 4; i++) {
                        if (board[a - 4 + i] !== undefined && board[a - 1 + i] !== undefined && board[a - 1 + i][b - 1 + i] === "yellow" && board[a - 2 + i][b - 2 + i] === undefined && board[a - 3 + i][b - 3 + i] === "yellow" && board[a - 4 + i][b - 4 + i] === "yellow") {
                            score += 100;
                            break;
                        }
                    }
                    for (let i = 1; i < 4; i++) {
                        if (board[a][b - 1 + i] === "yellow" && board[a][b - 2 + i] === undefined && board[a][b - 3 + i] === "yellow" && board[a][b - 4 + i] === "yellow") {
                            score += 100;
                            break;
                        }
                    }
                    for (let i = 1; i < 4; i++) {
                        if (board[a - 4 + i] !== undefined && board[a - 1 + i] !== undefined && board[a - 1 + i][b + 1 - i] === "yellow" && board[a - 2 + i][b + 2 - i] === undefined && board[a - 3 + i][b + 3 - i] === "yellow" && board[a - 4 + i][b + 4 - i] === "yellow") {
                            score += 100;
                            break;
                        }
                    }
                    //loc 3
                    for (let i = 1; i < 4; i++) {
                        if (board[a - 4 + i] !== undefined && board[a - 1 + i] !== undefined && board[a - 1 + i][b] === "yellow" && board[a - 2 + i][b] === "yellow" && board[a - 3 + i][b] === undefined && board[a - 4 + i][b] === "yellow") {
                            score += 100;
                            break;
                        }
                    }
                    for (let i = 1; i < 4; i++) {
                        if (board[a - 4 + i] !== undefined && board[a - 1 + i] !== undefined && board[a - 1 + i][b - 1 + i] === "yellow" && board[a - 2 + i][b - 2 + i] === "yellow" && board[a - 3 + i][b - 3 + i] === undefined && board[a - 4 + i][b - 4 + i] === "yellow") {
                            score += 100;
                            break;
                        }
                    }
                    for (let i = 1; i < 4; i++) {
                        if (board[a][b - 1 + i] === "yellow" && board[a][b - 2 + i] === "yellow" && board[a][b - 3 + i] === undefined && board[a][b - 4 + i] === "yellow") {
                            score += 100;
                            break;
                        }
                    }
                    for (let i = 1; i < 4; i++) {
                        if (board[a - 4 + i] !== undefined && board[a - 1 + i] !== undefined && board[a - 1 + i][b + 1 - i] === "yellow" && board[a - 2 + i][b + 2 - i] === "yellow" && board[a - 3 + i][b + 3 - i] === undefined && board[a - 4 + i][b + 4 - i] === "yellow") {
                            score += 100;
                            break;
                        }
                    }
                    //loc 4
                    for (let i = 1; i < 4; i++) {
                        if (board[a - 4 + i] !== undefined && board[a - 1 + i] !== undefined && board[a - 1 + i][b] === "yellow" && board[a - 2 + i][b] === "yellow" && board[a - 3 + i][b] === "yellow" && board[a - 4 + i][b] === undefined) {
                            score += 100;
                            break;
                        }
                    }
                    for (let i = 1; i < 4; i++) {
                        if (board[a - 4 + i] !== undefined && board[a - 1 + i] !== undefined && board[a - 1 + i][b - 1 + i] === "yellow" && board[a - 2 + i][b - 2 + i] === "yellow" && board[a - 3 + i][b - 3 + i] === "yellow" && board[a - 4 + i][b - 4 + i] === undefined) {
                            score += 100;
                            break;
                        }
                    }
                    for (let i = 1; i < 4; i++) {
                        if (board[a][b - 1 + i] === "yellow" && board[a][b - 2 + i] === "yellow" && board[a][b - 3 + i] === "yellow" && board[a][b - 4 + i] === undefined && b - 4 + i !== -1) {
                            score += 100;
                            break;
                        }
                    }
                    for (let i = 1; i < 4; i++) {
                        if (board[a - 4 + i] !== undefined && board[a - 1 + i] !== undefined && board[a - 1 + i][b + 1 - i] === "yellow" && board[a - 2 + i][b + 2 - i] === "yellow" && board[a - 3 + i][b + 3 - i] === "yellow" && board[a - 4 + i][b + 4 - i] === undefined) {
                            score += 100;
                            break;
                        }
                    }
                    //incentivice yellow to make 2 in a row

                    if ((board[a + 1] !== undefined && board[a + 1][b] === "yellow") || (board[a - 1] !== undefined && board[a - 1][b] === "yellow")) {
                        score += 1;
                    }


                    if ((board[a + 1] !== undefined && board[a + 1][b + 1] === "yellow") || (board[a - 1] !== undefined && board[a - 1][b - 1] === "yellow")) {
                        score += 1;
                    }


                    if (board[a][b + 1] === "yellow") {
                        score += 1;
                    }

                    if ((board[a + 1] !== undefined && board[a + 1][b - 1] === "yellow") || (board[a - 1] !== undefined && board[a - 1][b + 1] === "yellow")) {
                        score += 1;
                    }
                }
                //do for red pieces with negative score
                if (board[a][b] === "red") { //have found red piece
                    for (let i = 1; i < 4; i++) { //denne måten å gjøre det dekker flere cases, om det er bake eller froan focustilen, minker mengden hardcoding, bør også gjøre dette for 3 på rad med og uten hull
                        if (board[a - 4 + i] !== undefined && board[a - 1 + i] !== undefined && board[a - 1 + i][b] === "red" && board[a - 2 + i][b] === "red" && board[a - 3 + i][b] === "red" && board[a - 4 + i][b] === "red") {
                            score -= 100000; //when pnly using thismethod to find scores, minmaxing removes both the high and the low scores, and all ends up being 0
                            break; //need to break out of i-loop to not cause multiple score incrementations, or do i? 
                        }
                    }
                    for (let i = 1; i < 4; i++) {
                        if (board[a - 4 + i] !== undefined && board[a - 1 + i] !== undefined && board[a - 1 + i][b - 1 + i] === "red" && board[a - 2 + i][b - 2 + i] === "red" && board[a - 3 + i][b - 3 + i] === "red" && board[a - 4 + i][b - 4 + i] === "red") {
                            score -= 100000;
                            break;
                        }
                    }
                    for (let i = 1; i < 4; i++) {
                        if (board[a][b - 1 + i] === "red" && board[a][b - 2 + i] === "red" && board[a][b - 3 + i] === "red" && board[a][b - 4 + i] === "red") {
                            score -= 100000;
                            break;
                        }
                    }
                    for (let i = 1; i < 4; i++) {
                        if (board[a - 4 + i] !== undefined && board[a - 1 + i] !== undefined && board[a - 1 + i][b + 1 - i] === "red" && board[a - 2 + i][b + 2 - i] === "red" && board[a - 3 + i][b + 3 - i] === "red" && board[a - 4 + i][b + 4 - i] === "red") {
                            score -= 100000;
                            break;
                        }
                    }
                    //start checking for only 3 at a time, with empty space somewhere in between, empety in loc 1
                    for (let i = 1; i < 4; i++) {
                        if (board[a - 4 + i] !== undefined && board[a - 1 + i] !== undefined && board[a - 1 + i][b] === undefined && board[a - 2 + i][b] === "red" && board[a - 3 + i][b] === "red" && board[a - 4 + i][b] === "red") {
                            score -= 200;
                            break;
                        }
                    }
                    for (let i = 1; i < 4; i++) {
                        if (board[a - 4 + i] !== undefined && board[a - 1 + i] !== undefined && board[a - 1 + i][b - 1 + i] === undefined && board[a - 2 + i][b - 2 + i] === "red" && board[a - 3 + i][b - 3 + i] === "red" && board[a - 4 + i][b - 4 + i] === "red") {
                            score -= 200;
                            break;
                        }
                    }
                    for (let i = 1; i < 4; i++) {
                        if (board[a][b - 1 + i] === undefined && board[a][b - 2 + i] === "red" && board[a][b - 3 + i] === "red" && board[a][b - 4 + i] === "red") {
                            score -= 200;
                            break;
                        }
                    }
                    for (let i = 1; i < 4; i++) {
                        if (board[a - 4 + i] !== undefined && board[a - 1 + i] !== undefined && board[a - 1 + i][b + 1 - i] === undefined && board[a - 2 + i][b + 2 - i] === "red" && board[a - 3 + i][b + 3 - i] === "red" && board[a - 4 + i][b + 4 - i] === "red" && b + 1 - i !== -1) {
                            score -= 200;
                            break;
                        }
                    }
                    //empety in loc 2
                    for (let i = 1; i < 4; i++) {
                        if (board[a - 4 + i] !== undefined && board[a - 1 + i] !== undefined && board[a - 1 + i][b] === "red" && board[a - 2 + i][b] === undefined && board[a - 3 + i][b] === "red" && board[a - 4 + i][b] === "red") {
                            score -= 200;
                            break;
                        }
                    }
                    for (let i = 1; i < 4; i++) {
                        if (board[a - 4 + i] !== undefined && board[a - 1 + i] !== undefined && board[a - 1 + i][b - 1 + i] === "red" && board[a - 2 + i][b - 2 + i] === undefined && board[a - 3 + i][b - 3 + i] === "red" && board[a - 4 + i][b - 4 + i] === "red") {
                            score -= 200;
                            break;
                        }
                    }
                    for (let i = 1; i < 4; i++) {
                        if (board[a][b - 1 + i] === "red" && board[a][b - 2 + i] === undefined && board[a][b - 3 + i] === "red" && board[a][b - 4 + i] === "red") {
                            score -= 200;
                            break;
                        }
                    }
                    for (let i = 1; i < 4; i++) {
                        if (board[a - 4 + i] !== undefined && board[a - 1 + i] !== undefined && board[a - 1 + i][b + 1 - i] === "red" && board[a - 2 + i][b + 2 - i] === undefined && board[a - 3 + i][b + 3 - i] === "red" && board[a - 4 + i][b + 4 - i] === "red") {
                            score -= 200;
                            break;
                        }
                    }
                    //loc 3
                    for (let i = 1; i < 4; i++) {
                        if (board[a - 4 + i] !== undefined && board[a - 1 + i] !== undefined && board[a - 1 + i][b] === "red" && board[a - 2 + i][b] === "red" && board[a - 3 + i][b] === undefined && board[a - 4 + i][b] === "red") {
                            score -= 200;
                            break;
                        }
                    }
                    for (let i = 1; i < 4; i++) {
                        if (board[a - 4 + i] !== undefined && board[a - 1 + i] !== undefined && board[a - 1 + i][b - 1 + i] === "red" && board[a - 2 + i][b - 2 + i] === "red" && board[a - 3 + i][b - 3 + i] === undefined && board[a - 4 + i][b - 4 + i] === "red") {
                            score -= 200;
                            break;
                        }
                    }
                    for (let i = 1; i < 4; i++) {
                        if (board[a][b - 1 + i] === "red" && board[a][b - 2 + i] === "red" && board[a][b - 3 + i] === undefined && board[a][b - 4 + i] === "red") {
                            score -= 200;
                            break;
                        }
                    }
                    for (let i = 1; i < 4; i++) {
                        if (board[a - 4 + i] !== undefined && board[a - 1 + i] !== undefined && board[a - 1 + i][b + 1 - i] === "red" && board[a - 2 + i][b + 2 - i] === "red" && board[a - 3 + i][b + 3 - i] === undefined && board[a - 4 + i][b + 4 - i] === "red") {
                            score -= 200;
                            break;
                        }
                    }
                    //loc 4
                    for (let i = 1; i < 4; i++) {
                        if (board[a - 4 + i] !== undefined && board[a - 1 + i] !== undefined && board[a - 1 + i][b] === "red" && board[a - 2 + i][b] === "red" && board[a - 3 + i][b] === "red" && board[a - 4 + i][b] === undefined) {
                            score -= 200;
                            break;
                        }
                    }
                    for (let i = 1; i < 4; i++) {
                        if (board[a - 4 + i] !== undefined && board[a - 1 + i] !== undefined && board[a - 1 + i][b - 1 + i] === "red" && board[a - 2 + i][b - 2 + i] === "red" && board[a - 3 + i][b - 3 + i] === "red" && board[a - 4 + i][b - 4 + i] === undefined) {
                            score -= 200;
                            break;
                        }
                    }
                    for (let i = 1; i < 4; i++) {
                        if (board[a][b - 1 + i] === "red" && board[a][b - 2 + i] === "red" && board[a][b - 3 + i] === "red" && board[a][b - 4 + i] === undefined && b - 4 + i !== -1) {
                            score -= 200;
                            break;
                        }
                    }
                    for (let i = 1; i < 4; i++) {
                        if (board[a - 4 + i] !== undefined && board[a - 1 + i] !== undefined && board[a - 1 + i][b + 1 - i] === "red" && board[a - 2 + i][b + 2 - i] === "red" && board[a - 3 + i][b + 3 - i] === "red" && board[a - 4 + i][b + 4 - i] === undefined) {
                            score -= 200;
                            break;
                        }
                    }
                    //two in a row
                    if ((board[a + 1] !== undefined && board[a + 1][b] === "red") || (board[a - 1] !== undefined && board[a - 1][b] === "red")) {
                        score -= 1;
                    }


                    if ((board[a + 1] !== undefined && board[a + 1][b + 1] === "red") || (board[a - 1] !== undefined && board[a - 1][b - 1] === "red")) {
                        score -= 1;
                    }

                    if (board[a][b + 1] === "red") {
                        score -= 1;
                    }

                    if ((board[a + 1] !== undefined && board[a + 1][b - 1] === "red") || (board[a - 1] !== undefined && board[a - 1][b + 1] === "red")) {
                        score -= 1;
                    }
                }
            }
        }
        return score;
    }


    function checkForWinsSimulation(board) { //only need to check for currentturns
        for (let i = 0; i < 7; i++) {
            for (let j = 5; j >= 0; j--) {
                if (board[i][j] === "red") { // have found one piece
                    if (board[i + 3] !== undefined && board[i + 1][j] === "red") { //have found a second one to the right
                        if (board[i + 2][j] === "red" && board[i + 3][j] === "red") {
                            return "ended";
                        }
                    }
                    if (board[i + 3] !== undefined && board[i + 1][j + 1] === "red") { //have found a second one to the right
                        if (board[i + 2][j + 2] === "red" && board[i + 3][j + 3] === "red") {
                            return "ended";
                        }
                    }
                    if (board[i][j + 1] === "red") { //have found a second one to the right
                        if (board[i][j + 2] === "red" && board[i][j + 3] === "red") {
                            return "ended";
                        }
                    }
                    if (board[i + 3] !== undefined && board[i + 1][j - 1] === "red") { //have found a second one to the right
                        if (board[i + 2][j - 2] === "red" && board[i + 3][j - 3] === "red") {
                            return "ended";
                        }
                    }
                }
            }
        }
        for (let i = 0; i < 7; i++) {
            for (let j = 5; j >= 0; j--) {
                if (board[i][j] === "yellow") { // have found one piece
                    if (board[i + 3] !== undefined && board[i + 1][j] === "yellow") { //have found a second one to the right
                        if (board[i + 2][j] === "yellow" && board[i + 3][j] === "yellow") {
                            return "ended";
                        }
                    }
                    if (board[i + 3] !== undefined && board[i + 1][j + 1] === "yellow") { //have found a second one to the right
                        if (board[i + 2][j + 2] === "yellow" && board[i + 3][j + 3] === "yellow") {
                            return "ended";
                        }
                    }
                    if (board[i][j + 1] === "yellow") { //have found a second one to the right
                        if (board[i][j + 2] === "yellow" && board[i][j + 3] === "yellow") {
                            return "ended";
                        }
                    }
                    if (board[i + 3] !== undefined && board[i + 1][j - 1] === "yellow") { //have found a second one to the right
                        if (board[i + 2][j - 2] === "yellow" && board[i + 3][j - 3] === "yellow") {
                            return "ended";
                        }
                    }
                }
            }
        }
    }


    generateBoard();

    let testboard = [
        ["yellow", "red", "yellow", "yellow"], //collum 1
        ["red", "yellow", "red"], //collum 2 etc...
        ["yellow", "red"],
        ["red"],
        [],
        [],
        []
    ];
    //console.log(calculateScore(testboard));

}


/* 
                    if (board[a + 3] !== undefined && board[a + 1][b] === "yellow" && board[a + 2][b] === "yellow" && board[a + 3][b] === "yellow") {
                        score += 1000; //when pnly using thismethod to find scores, minmaxing removes both the high and the low scores, and all ends up being 0
                        //return;
                    }
                    if (board[a + 3] !== undefined && board[a + 1][b + 1] === "yellow" && board[a + 2][b + 2] === "yellow" && board[a + 3][b + 3] === "yellow") {
                        score += 1000;
                        //return;
                    }
                    if (board[a][b + 1] === "yellow" && board[a][b + 2] === "yellow" && board[a][b + 3] === "yellow") {
                        score += 1000;
                        //return;
                    }
                    if (board[a + 3] !== undefined && board[a + 1][b - 1] === "yellow" && board[a + 2][b - 2] === "yellow" && board[a + 3][b - 3] === "yellow") {
                        score += 1000;
                        //return;
                    }
                }
                if (board[a][b] === "red") { //have found red piece
                    if (board[a + 3] !== undefined && board[a + 1][b] === "red" && board[a + 2][b] === "red" && board[a + 3][b] === "red") {
                        score -= 10000;
                        //return;
                    }
                    if (board[a + 3] !== undefined && board[a + 1][b + 1] === "red" && board[a + 2][b + 2] === "red" && board[a + 3][b + 3] === "red") {
                        score -= 10000;
                        //return;
                    }
                    if (board[a][b + 1] === "red" && board[a][b + 2] === "red" && board[a][b + 3] === "red") {
                        score -= 10000;
                        //return;
                    }
                    if (board[a + 3] !== undefined && board[a + 1][b - 1] === "red" && board[a + 2][b - 2] === "red" && board[a + 3][b - 3] === "red") {
                        score -= 10000;
                        //return;
                    }
                } */

/* if (board[a][b] === "yellow") { // have found one piece //trying to just check for wins instead of all this, see how that works out
                    if ((board[a + 3] !== undefined && board[a + 3][b] !== "red" && board[a + 2] !== undefined && board[a + 2][b] !== "red" && board[a + 1] !== undefined && board[a + 1][b] !== "red") || (board[a - 3] !== undefined && board[a - 3][b] !== "red" && board[a - 2] !== undefined && board[a - 2][b] !== "red" && board[a - 1] !== undefined && board[a - 1][b] !== "red")) { //check that the 3 tiles to the right of a or left of a are clear
                        let count = 0;
                        if (board[a + 1] !== undefined && board[a + 1][b] === "yellow") {
                            count++;
                        }
                        if (board[a + 2] !== undefined && board[a + 2][b] === "yellow") {
                            count++;
                        }
                        if (board[a + 3] !== undefined && board[a + 3][b] === "yellow") {
                            count++;
                        }
                        score += Math.pow(50, count);
                    }
                    if ((board[a + 3] !== undefined && board[a + 3][b + 3] !== "red" && board[a + 2] !== undefined && board[a + 2][b + 2] !== "red" && board[a + 1] !== undefined && board[a + 1][b + 1] !== "red") || (board[a - 3] !== undefined && board[a - 3][b - 3] !== "red" && board[a - 2] !== undefined && board[a - 2][b - 2] !== "red" && board[a - 1] !== undefined && board[a - 1][b - 1] !== "red")) { //have found a second one to the right
                        let count = 0;
                        if (board[a + 1] !== undefined && board[a + 1][b + 1] === "yellow") {
                            count++;
                        }
                        if (board[a + 2] !== undefined && board[a + 2][b + 2] === "yellow") {
                            count++;
                        }
                        if (board[a + 3] !== undefined && board[a + 3][b + 3] === "yellow") {
                            count++;
                        }
                        score += Math.pow(50, count);
                    }
                    if (board[a][b + 3] !== undefined && board[a][b + 3] !== "red" && board[a][b + 2] !== undefined && board[a][b + 2] !== "red" && board[a][b + 1] !== undefined && board[a][b + 1] !== "red") { //have found a second one to the right
                        let count = 0;
                        if (board[a + 1] !== undefined && board[a][b + 1] === "yellow") {
                            count++;
                        }
                        if (board[a + 2] !== undefined && board[a][b + 2] === "yellow") {
                            count++;
                        }
                        if (board[a + 3] !== undefined && board[a][b + 3] === "yellow") { //gir ikke poeng bakover, det må jeg fikse for at det funker skikkelig
                            count++;
                        }
                        score += Math.pow(50, count);
                    }
                    if ((board[a + 3] !== undefined && board[a + 3][b - 3] !== undefined && board[a + 3][b - 3] !== "red" && board[a + 2] !== undefined && board[a + 2][b - 2] !== undefined && board[a + 2][b - 2] !== "red" && board[a + 1] !== undefined && board[a + 1][b - 1] !== undefined && board[a + 1][b - 1] !== "red") || (board[a - 3] !== undefined && board[a - 3][b + 3] !== "red" && board[a - 2] !== undefined && board[a - 2][b + 2] !== undefined && board[a - 2][b + 2] !== "red" && board[a - 1] !== undefined && board[a - 1][b + 1] !== undefined && board[a - 1][b + 1] !== "red")) { //have found a second one to the right
                        let count = 0;
                        if (board[a + 1] !== undefined && board[a + 1][b - 1] === "yellow") {
                            count++;
                        }
                        if (board[a + 2] !== undefined && board[a + 2][b - 2] === "yellow") {
                            count++;
                        }
                        if (board[a + 3] !== undefined && board[a + 3][b - 3] === "yellow") {
                            count++;
                        }
                        score += Math.pow(50, count);
                    } //need to take into account enemy(red) states to, and give negative points for how many they have in row
                }
                if (board[a][b] === "red") { // have found one piece
                    if ((board[a + 3] !== undefined && board[a + 3][b] !== "yellow" && board[a + 2] !== undefined && board[a + 2][b] !== "yellow" && board[a + 1] !== undefined && board[a + 1][b] !== "yellow") || (board[a - 3] !== undefined && board[a - 3][b] !== "yellow" && board[a - 2] !== undefined && board[a - 2][b] !== "yellow" && board[a - 1] !== undefined && board[a - 1][b] !== "yellow")) { //check that the 3 tiles to the right of a or left of a are clear
                        let count = 0;
                        if (board[a + 1] !== undefined && board[a + 1][b] === "red") {
                            count++;
                        }
                        if (board[a + 2] !== undefined && board[a + 2][b] === "red") {
                            count++;
                        }
                        if (board[a + 3] !== undefined && board[a + 3][b] === "red") {
                            count++;
                        }
                        score -= Math.pow(100, count);
                    }
                    if ((board[a + 3] !== undefined && board[a + 3][b + 3] !== "yellow" && board[a + 2] !== undefined && board[a + 2][b + 2] !== "yellow" && board[a + 1] !== undefined && board[a + 1][b + 1] !== "yellow") || (board[a - 3] !== undefined && board[a - 3][b - 3] !== "yellow" && board[a - 2] !== undefined && board[a - 2][b - 2] !== "yellow" && board[a - 1] !== undefined && board[a - 1][b - 1] !== "yellow")) { //have found a second one to the right
                        let count = 0;
                        if (board[a + 1] !== undefined && board[a + 1][b + 1] === "red") {
                            count++;
                        }
                        if (board[a + 2] !== undefined && board[a + 2][b + 2] === "red") {
                            count++;
                        }
                        if (board[a + 3] !== undefined && board[a + 3][b + 3] === "red") {
                            count++;
                        }
                        score -= Math.pow(100, count);
                    }
                    if (board[a][b + 3] !== undefined && board[a][b + 3] !== "yellow" && board[a][b + 2] !== undefined && board[a][b + 2] !== "yellow" && board[a][b + 1] !== undefined && board[a][b + 1] !== "yellow") { //have found a second one to the right
                        let count = 0;
                        if (board[a + 1] !== undefined && board[a][b + 1] === "red") {
                            count++;
                        }
                        if (board[a + 2] !== undefined && board[a][b + 2] === "red") {
                            count++;
                        }
                        if (board[a + 3] !== undefined && board[a][b + 3] === "red") {
                            count++;
                        }
                        score -= Math.pow(100, count);
                    }
                    if ((board[a + 3] !== undefined && board[a + 3][b - 3] !== undefined && board[a + 3][b - 3] !== "yellow" && board[a + 2] !== undefined && board[a + 2][b - 2] !== undefined && board[a + 2][b - 2] !== "yellow" && board[a + 1] !== undefined && board[a + 1][b - 1] !== undefined && board[a + 1][b - 1] !== "yellow") || (board[a - 3] !== undefined && board[a - 3][b + 3] !== "yellow" && board[a - 2] !== undefined && board[a - 2][b + 2] !== undefined && board[a - 2][b + 2] !== "yellow" && board[a - 1] !== undefined && board[a - 1][b + 1] !== undefined && board[a - 1][b + 1] !== "yellow")) { //have found a second one to the right
                        let count = 0;
                        if (board[a + 1] !== undefined && board[a + 1][b - 1] === "red") {
                            count++;
                        }
                        if (board[a + 2] !== undefined && board[a + 2][b - 2] === "red") {
                            count++;
                        }
                        if (board[a + 3] !== undefined && board[a + 3][b - 3] === "red") {
                            count++;
                        }
                        score -= Math.pow(100, count);
                    } //need to take into account enemy(red) states to, and give negative points for how many they have in row
                } */