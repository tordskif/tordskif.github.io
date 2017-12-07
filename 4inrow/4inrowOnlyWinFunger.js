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
            }, 100);
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

    /* 
    function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
    } */

    function AIPick() { //kan prøve å få den til å maksimere antall brikker på rad, bør jo heller ta å gjøre slik at en gjør det vørste motstander movet så dårlig så mulig da
        let score = []; //felt 0 har scoren til om en plaserer på plass 0 etc.
        //[],[],[],[],[],[],[]
        for (let i = 0; i < 7; i++) { //im actually not telling the program that it cant have more than 6 in one row i believe(somewhere i think), because its scores doesnt say certain win when we can only place in one slot and it will win/lose
            if (typeof (score) === "number") {
                break;
            }
            let calcTurn = "yellow";
            let calcState1 = clone(gameBoard);
            if (calcState1[i].length < 6) {
                calcState1[i].push(calcTurn);
            }
            score[i] = calculateScore(calcState1, 8);
            if (score[i] === 0) {
                score[i] = [];
            }
            for (let j = 0; j < 7; j++) {
                if (typeof (score[i]) === "number") {
                    break;
                }
                let calcTurn = "red";
                let calcState2 = clone(calcState1);
                if (calcState2[j].length < 6) {
                    calcState2[j].push(calcTurn);
                }
                score[i][j] = calculateScore(calcState2, 7);
                if (score[i][j] === 0) {
                    score[i][j] = [];
                }
                for (let k = 0; k < 7; k++) {
                    if (typeof (score[i][j]) === "number") {
                        break;
                    }
                    let calcTurn = "yellow";
                    let calcState3 = clone(calcState2);
                    if (calcState3[k].length < 6) {
                        calcState3[k].push(calcTurn);
                    }
                    score[i][j][k] = calculateScore(calcState3, 6);
                    if (score[i][j][k] === 0) {
                        score[i][j][k] = [];
                    }
                    for (let l = 0; l < 7; l++) {
                        if (typeof (score[i][j][k]) === "number") {
                            break;
                        }
                        let calcTurn = "red";
                        let calcState4 = clone(calcState3);
                        if (calcState4[l].length < 6) {
                            calcState4[l].push(calcTurn);
                        }
                        score[i][j][k][l] = calculateScore(calcState4, 5);
                        if (score[i][j][k][l] === 0) {
                            score[i][j][k][l] = [];
                        }
                        for (let m = 0; m < 7; m++) {
                            if (typeof (score[i][j][k][l]) === "number") {
                                break;
                            }
                            let calcTurn = "yellow";
                            let calcState5 = clone(calcState4);
                            if (calcState5[m].length < 6) {
                                calcState5[m].push(calcTurn);
                            }
                            score[i][j][k][l][m] = calculateScore(calcState5, 4);

                            if (score[i][j][k][l][m] === 0) {
                                score[i][j][k][l][m] = [];
                            }
                            for (let n = 0; n < 7; n++) {
                                if (typeof (score[i][j][k][l][m]) === "number") {
                                    break;
                                }
                                let calcTurn = "red";
                                let calcState6 = clone(calcState5);
                                if (calcState6[n].length < 6) {
                                    calcState6[n].push(calcTurn);
                                }
                                score[i][j][k][l][m][n] = calculateScore(calcState6, 3);
                                for (let o = 0; 0 < 7; o++) {
                                    if (typeof (score[i][j][k][l][m][n]) === "number") {
                                        break;
                                    }
                                    let calcTurn = "yellow";
                                    let calcState7 = clone(calcState6);
                                    if (calcState7[o].length < 6) {
                                        calcState7[o].push(calcTurn);
                                    }
                                    score[i][j][k][l][m][n][o] = calculateScore(calcState7, 2);
                                    for(let p = 0; p < 7; p++) {
                                        if (typeof (score[i][j][k][l][m][n][o]) === "number") {
                                            break;
                                        }
                                        let calcTurn = "red";
                                        let calcState8 = clone(calcState7);
                                        if (calcState8[o].length < 6) {
                                            calcState8[o].push(calcTurn);
                                        }
                                        score[i][j][k][l][m][n][o] = calculateScore(calcState8, 1);
                                    }
                                }
                                //score[i][j][k][l][m][n][o] will now either be -1, 0 or 1;
                            }
                        }
                    }
                }
            }
        }
        for (let i = 0; i < 7; i++) {
            if (typeof (score[i]) === "number") {
                continue;
            }
            for (let j = 0; j < 7; j++) {
                if (typeof (score[i][j]) === "number") {
                    continue;
                }
                for (let k = 0; k < 7; k++) {
                    if (typeof (score[i][j][k]) === "number") {
                        continue;
                    }
                    for (let l = 0; l < 7; l++) {
                        if (typeof (score[i][j][k][l]) === "number") {
                            continue;
                        }
                        for (let m = 0; m < 7; m++) {
                            if (typeof (score[i][j][k][l][m]) === "number") {
                                continue;
                            }
                            for(let n = 0; n < 7; n++) {
                                if (typeof (score[i][j][k][l][m][n]) === "number") {
                                    continue;
                                } 
                                for(let o = 0; o < 7; o++) {
                                    if (typeof (score[i][j][k][l][m][n][o]) === "number") {
                                        continue;
                                    } 
                                    if (Math.min.apply(Math, score[i][j][k][l][m]) < 0) {
                                        score[i][j][k][l][m][n][o] = Math.min.apply(Math, score[i][j][k][l][m][n][o]);
                                    } else {
                                        score[i][j][k][l][m][n][o] = score[i][j][k][l][m][n][o].reduce((a, b) => a + b, 0) / 7;
                                    } //when i added this last turnlookahead, it only multiplied the calc speed from 1sec to 1.2sec or something, i can maybe add more, the current way of doing it seems efficient
                                }
                            }
                        }
                    }
                }
            }
        }
        for (let i = 0; i < 7; i++) {
            if (typeof (score[i]) === "number") {
                continue;
            }
            for (let j = 0; j < 7; j++) {
                if (typeof (score[i][j]) === "number") {
                    continue;
                }
                for (let k = 0; k < 7; k++) {
                    if (typeof (score[i][j][k]) === "number") {
                        continue;
                    }
                    for (let l = 0; l < 7; l++) {
                        if (typeof (score[i][j][k][l]) === "number") {
                            continue;
                        }
                        for (let m = 0; m < 7; m++) {
                            if (typeof (score[i][j][k][l][m]) === "number") {
                                continue;
                            }
                            for (let n = 0; n < 7; n++) {
                                if (typeof (score[i][j][k][l][m][n]) === "number") {
                                    continue;
                                }
                                score[i][j][k][l][m][n] = Math.max.apply(Math, score[i][j][k][l][m][n]);
                            }
                        }
                    }
                }
            }
        }
        //console.log(clone(score));
        for (let i = 0; i < 7; i++) {
            if (typeof (score[i]) === "number") {
                continue;
            }
            for (let j = 0; j < 7; j++) {
                if (typeof (score[i][j]) === "number") {
                    continue;
                }
                for (let k = 0; k < 7; k++) {
                    if (typeof (score[i][j][k]) === "number") {
                        continue;
                    }
                    for (let l = 0; l < 7; l++) {
                        if (typeof (score[i][j][k][l]) === "number") {
                            continue;
                        }
                        for (let m = 0; m < 7; m++) {
                            if (typeof (score[i][j][k][l][m]) === "number") {
                                continue;
                            }
                            if (Math.min.apply(Math, score[i][j][k][l][m]) < 0) {
                                score[i][j][k][l][m] = Math.min.apply(Math, score[i][j][k][l][m]);
                            } else {
                                score[i][j][k][l][m] = score[i][j][k][l][m].reduce((a, b) => a + b, 0) / 7;
                            }
                        }
                    }
                }
            }
        }
        for (let i = 0; i < 7; i++) {
            if (typeof (score[i]) === "number") {
                continue;
            }
            for (let j = 0; j < 7; j++) {
                if (typeof (score[i][j]) === "number") {
                    continue;
                }
                for (let k = 0; k < 7; k++) {
                    if (typeof (score[i][j][k]) === "number") {
                        continue;
                    }
                    for (let l = 0; l < 7; l++) {
                        if (typeof (score[i][j][k][l]) === "number") {
                            continue;
                        }
                        score[i][j][k][l] = Math.max.apply(Math, score[i][j][k][l]);
                    }
                }
            }
        }
        console.log(clone(score));
        for (let i = 0; i < 7; i++) {
            if (typeof (score[i]) === "number") {
                continue;
            }
            for (let j = 0; j < 7; j++) {
                if (typeof (score[i][j]) === "number") {
                    continue;
                }
                for (let k = 0; k < 7; k++) {
                    if (typeof (score[i][j][k]) === "number") {
                        continue;
                    }
                    if (Math.min.apply(Math, score[i][j][k]) < 0) {
                        score[i][j][k] = Math.min.apply(Math, score[i][j][k]);
                    } else {
                        score[i][j][k] = score[i][j][k].reduce((a, b) => a + b, 0) / 7;
                    }
                }
            }
        }
        //console.log(clone(score));
        for (let i = 0; i < 7; i++) {
            if (typeof (score[i]) === "number") {
                continue;
            }
            for (let j = 0; j < 7; j++) {
                if (typeof (score[i][j]) === "number") {
                    continue;
                }
                score[i][j] = Math.max.apply(Math, score[i][j]);
            }
        }
        //console.log(clone(score));
        for (let i = 0; i < 7; i++) {
            if (typeof (score[i]) === "number") {
                continue;
            }
            if (Math.min.apply(Math, score[i]) < 0) {
                score[i] = Math.min.apply(Math, score[i]);
            } else {
                score[i] = score[i].reduce((a, b) => a + b, 0) / 7;
            }
            //add a bit to incentivice going to middle in start, as that is generally good
            score[i] += (3 - Math.abs(3-i))/100000;
        }

        //console.log(clone(score));
        for (let i = 0; i < 7; i++) {
            console.log(score);
            let placement = score.indexOf(Math.max.apply(Math, score)); //if there are multiple with same value, maybe do a random choice between them
            if (gameBoard[placement].length < 6) {
                placeTile(currentTurn, placement);
                break;
            }
            score[placement] = -1000000000;
        }
        console.log(score);
    }

    function calculateScore(board, factor) { //board is a boardstate array
        for (let b = 5; b >= 0; b--) { //does 3 to 0 work?
            for (let a = 0; a < 7; a++) {
                if (board[a][b] === "yellow") { //have found yellow piece
                    if (board[a + 3] !== undefined && board[a + 3][b] === "yellow" && board[a + 2][b] === "yellow" && board[a + 1][b] === "yellow") {
                        return 1;
                    }
                    if (board[a + 3] !== undefined && board[a + 1][b + 1] === "yellow" && board[a + 2][b + 2] === "yellow" && board[a + 3][b + 3] === "yellow") {
                        return 1;
                    }
                    if (board[a][b + 1] === "yellow" && board[a][b + 2] === "yellow" && board[a][b + 3] === "yellow") {
                        return 1;
                    }
                    if (board[a + 3] !== undefined && board[a + 1][b - 1] === "yellow" && board[a + 2][b - 2] === "yellow" && board[a + 3][b - 3] === "yellow") {
                        return 1;
                    }
                }
                //do for red pieces with negative score
                if (board[a][b] === "red") { //have found red piece
                    if (board[a + 3] !== undefined && board[a + 1][b] === "red" && board[a + 2][b] === "red" && board[a + 3][b] === "red") {
                        return -1 * factor;
                    }
                    if (board[a + 3] !== undefined && board[a + 1][b + 1] === "red" && board[a + 2][b + 2] === "red" && board[a + 3][b + 3] === "red") {
                        return -1 * factor;
                    }
                    if (board[a][b + 1] === "red" && board[a][b + 2] === "red" && board[a][b + 3] === "red") {
                        return -1 * factor;
                    }
                    if (board[a + 3] !== undefined && board[a + 1][b - 1] === "red" && board[a + 2][b - 2] === "red" && board[a + 3][b - 3] === "red") {
                        return -1 * factor;
                    }
                }
            }
        }
        return 0;
    }


    /*function checkForWinsSimulation(board) { //only need to check for currentturns
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
    }*/


    generateBoard();

    let testboard = [
        [1, 1, "yellow", "yellow", "red", "yellow"], //collum 1
        [1, 1, "red", "red", "yellow"], //collum 2 etc...
        [1, 1, "red", "yellow"],
        [1, 1, "yellow"],
        [],
        [],
        []
    ];
    console.log(calculateScore(testboard, 1));

}