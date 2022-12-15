/* Hardcosing isnt fun, i think i will instead try to optimize the lookahead function, make it take into account enemy positions too etc.
maybe try to make enemys best choice the worst 
to make all that easier, maybe there is a better way so search how many are in a row., or better ways to determine score

Have one function that claculates score of a given boardstate(negative for how good opponent is doing, positive for how good it is doing)
go through 5-9 turns and calculate the score of all the board states
Go backwards, picking the highest score outcome when it is its turn, and the lowest score outcome when opponents turn.
Will then end up with the result which minimizes the opponens score while maximizing its score
*/

function setup() {
    if (localStorage.getItem("record") === null) {
        localStorage.setItem("record", "0,0");
    }
    //localStorage.setItem("record", "0,0");
    let record = localStorage.getItem("record");
    let gameState = 0;
    let gameBoard = "000000300000030000003000000300000030000003000000";

    /**
     For å få bedre performance, tror jeg at jeg bør forandre boardstate til en string
     Da slipper jeg å bruke clone funksjonen for å lage nye boards
     tror kanskje det er det som gjør det treigt
     Må da forandre lit på regexen, ikke mye, men mass 0 på rad må bety en kollonne, ikke en rad
     For å sette inn noe i den 4 kollonna da, må en først komme forbi 3 3ere, også sette den nye brikken
     der den neste nullen er etter dette

     Have boardstate string a:

     arrayOfColums = a.split("3");
     columnToPushIn = arrayOfCoulums[columnToChoose-1]
     columnToPushIn[columnToPushIn.indexOf("0")] = currentTurn; //this will give the first place where 0 occurs
    //not sure if the above actually changes the string.. need to do some testing in column
    //maybe have to stitch together the string again, with the one spot changed... feels wrong tho

    lastly, use a = arrayOfColums.join("3"); to make a back to a string
    not sure if this will add a 3 first and/or last in the string, not sure if i need it there...

    Sikkert bruke string.replace(index,currentturn) //tror det er syntaksen

    str.replace(regexp|substr, newSubstr|function)
    A String that is to be replaced by newSubStr. It is treated as a verbatim string and is not interpreted as a regular expression. Only the first occurrence will be replaced.
    A function to be invoked to create the new substring to be used to replace the matches to the given regexp or substr. The arguments supplied to this function are described in the "Specifying a function as a parameter" section below.
    a = "hallo";
    a.replace("l","d") returns "hadlo" //doesnt ruin old string, can then say what new string is gonna be and dont ruin old string
    Can use this together with columnToPushIn[columnToPushIn.indexOf("0")] //actually dont need this

    s = a.split("3");
    s[2] = s[2].replace("0", "1");
    a = s.join("3");

    If a string is: a = "121220000"
    newstring = a.replace("0", currentturn) //currentturn = 2;
    newstring === "121222000" //i think this will work
    //yeah it does
     */
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

    let currentTurn = 1; //1 is red, 2 is yellow

    let main = document.getElementById("main");

    let redwintest = /1(\d{7,7}1){3,}|1(\d{6,6}1){3,}|1(\d{5,5}1){3,}|1111/
    let yellowwintest = /2(\d{7,7}2){3,}|2(\d{6,6}2){3,}|2(\d{5,5}2){3,}|2222/

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
    main.addEventListener("touch", clickOnColumn);

    function insert(string, column, turn) {
        let s = string.split("3");
        s[column] = s[column].replace("0", turn);
        return s.join("3");
    }

    let recordDiv = document.getElementById("record");
    recordDiv.innerHTML = "Red: " + record.split(",")[0] + " Yellow: " + record.split(",")[1];

    function clickOnColumn(e) {
        if (gameState === 1) {
            return;
        }
        let column = e.path[0].id.split(" ")[0];
        if (column === "main") {
            return;
        }
        if (gameBoard.split("3")[column][5] === "0") {
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
        gameBoard = insert(gameBoard, column, currentTurn);
        checkForWins();
        if (currentTurn === 1) {
            currentTurn = 2;
        } else {
            currentTurn = 1;
        }
        update();
    }

    function update() {
        let s = gameBoard.split("3");
        for (let i = 0; i < 7; i++) {
            for (let j = 5; j >= 0; j--) {
                if (s[i][j] === "1") {
                    divBoard[i][5 - j].style.backgroundColor = "red";
                }
                if (s[i][j] === "2") {
                    divBoard[i][5 - j].style.backgroundColor = "yellow";
                }
            }
        }
    }

    function checkForWins() { //only need to check for currentturns
        if (redwintest.test(gameBoard)) { //kan finne ut hva regexen fant, kan fikse det senere for å highligte 4påraden
            gameState = 1;
            record = record.split(",")
            record[0] = parseFloat(record[0]) + 1;
            recordDiv.innerHTML = "Red: " + record[0] + " Yellow: " + record[1];
            record = record[0] + "," + record[1];
            localStorage.setItem("record", record);
            let test = redwintest.exec(gameBoard);
            let index = test.index;
            let length = test[0].length;
            let count = 0;
            for (let i = 0; i < 7; i++) {
                for (let j = 5; j >= -1; j--) {
                    if (count === index) {
                        if (length === 4) {
                            divBoard[i][j].style.filter = "hue-rotate(-60deg)";
                            divBoard[i][j - 1].style.filter = "hue-rotate(-60deg)";
                            divBoard[i][j - 2].style.filter = "hue-rotate(-60deg)";
                            divBoard[i][j - 3].style.filter = "hue-rotate(-60deg)";
                        }
                        if(length === 19) {
                            divBoard[i][j].style.filter = "hue-rotate(-60deg)";
                            divBoard[i + 1][j + 1].style.filter = "hue-rotate(-60deg)";
                            divBoard[i + 2][j + 2].style.filter = "hue-rotate(-60deg)";
                            divBoard[i + 3][j + 3].style.filter = "hue-rotate(-60deg)";
                        }
                        if(length === 22) {
                            divBoard[i][j].style.filter = "hue-rotate(-60deg)";
                            divBoard[i + 1][j].style.filter = "hue-rotate(-60deg)";
                            divBoard[i + 2][j].style.filter = "hue-rotate(-60deg)";
                            divBoard[i + 3][j].style.filter = "hue-rotate(-60deg)";
                        }
                        if(length === 25) {
                            divBoard[i][j].style.filter = "hue-rotate(-60deg)";
                            divBoard[i + 1][j - 1].style.filter = "hue-rotate(-60deg)";
                            divBoard[i + 2][j - 2].style.filter = "hue-rotate(-60deg)";
                            divBoard[i + 3][j - 3].style.filter = "hue-rotate(-60deg)";
                        }
                        return;
                    }
                    count++;
                }
            }
        }
        if (yellowwintest.test(gameBoard)) {
            gameState = 1;
            record = record.split(",")
            record[1] = parseFloat(record[1]) + 1;
            recordDiv.innerHTML = "Red: " + record[0] + " Yellow: " + record[1];
            record = record[0] + "," + record[1];
            localStorage.setItem("record", record);
            let test = yellowwintest.exec(gameBoard);
            let index = test.index;
            let length = test[0].length;
            let count = 0;
            for (let i = 0; i < 7; i++) {
                for (let j = 5; j >= -1; j--) {
                    if (count === index) {
                        if (length === 4) {
                            divBoard[i][j].style.filter = "hue-rotate(-60deg)";
                            divBoard[i][j - 1].style.filter = "hue-rotate(-60deg)";
                            divBoard[i][j - 2].style.filter = "hue-rotate(-60deg)";
                            divBoard[i][j - 3].style.filter = "hue-rotate(-60deg)";
                        }
                        if(length === 19) {
                            divBoard[i][j].style.filter = "hue-rotate(-60deg)";
                            divBoard[i + 1][j + 1].style.filter = "hue-rotate(-60deg)";
                            divBoard[i + 2][j + 2].style.filter = "hue-rotate(-60deg)";
                            divBoard[i + 3][j + 3].style.filter = "hue-rotate(-60deg)";
                        }
                        if(length === 22) {
                            divBoard[i][j].style.filter = "hue-rotate(-60deg)";
                            divBoard[i + 1][j].style.filter = "hue-rotate(-60deg)";
                            divBoard[i + 2][j].style.filter = "hue-rotate(-60deg)";
                            divBoard[i + 3][j].style.filter = "hue-rotate(-60deg)";
                        }
                        if(length === 25) {
                            divBoard[i][j].style.filter = "hue-rotate(-60deg)";
                            divBoard[i + 1][j - 1].style.filter = "hue-rotate(-60deg)";
                            divBoard[i + 2][j - 2].style.filter = "hue-rotate(-60deg)";
                            divBoard[i + 3][j - 3].style.filter = "hue-rotate(-60deg)";
                        }
                        return;
                    }
                    count++;
                }
            }
        }
    }

    function AIPick() { //kan prøve å få den til å maksimere antall brikker på rad, bør jo heller ta å gjøre slik at en gjør det vørste motstander movet så dårlig så mulig da
        let score = []; //felt 0 har scoren til om en plaserer på plass 0 etc.
        for (let i = 0; i < 7; i++) { //im actually not telling the program that it cant have more than 6 in one row i believe(somewhere i think), because its scores doesnt say certain win when we can only place in one slot and it will win/lose(might be because the calculatescore function was flawed)
            if (typeof (score) === "number") {
                break;
            }
            let calcTurn = 2;
            let calcState1 = insert(gameBoard, i, calcTurn);
            score[i] = calculateScore(calcState1, 8);
            if (score[i] === 0) {
                score[i] = [];
            }
            for (let j = 0; j < 7; j++) {
                if (typeof (score[i]) === "number") {
                    break;
                }
                let calcTurn = 1;
                let calcState2 = insert(calcState1, j, calcTurn);
                score[i][j] = calculateScore(calcState2, 7);
                if (score[i][j] === 0) {
                    score[i][j] = [];
                }
                for (let k = 0; k < 7; k++) {
                    if (typeof (score[i][j]) === "number") {
                        break;
                    }
                    let calcTurn = 2;
                    let calcState3 = insert(calcState2, k, calcTurn);
                    score[i][j][k] = calculateScore(calcState3, 6);
                    if (score[i][j][k] === 0) {
                        score[i][j][k] = [];
                    }
                    for (let l = 0; l < 7; l++) {
                        if (typeof (score[i][j][k]) === "number") {
                            break;
                        }
                        let calcTurn = 1;
                        let calcState4 = insert(calcState3, l, calcTurn);
                        score[i][j][k][l] = calculateScore(calcState4, 5);
                        if (score[i][j][k][l] === 0) {
                            score[i][j][k][l] = [];
                        }
                        for (let m = 0; m < 7; m++) {
                            if (typeof (score[i][j][k][l]) === "number") {
                                break;
                            }
                            let calcTurn = 2;
                            let calcState5 = insert(calcState4, m, calcTurn);
                            score[i][j][k][l][m] = calculateScore(calcState5, 4);
                            if (score[i][j][k][l][m] === 0) {
                                score[i][j][k][l][m] = [];
                            }
                            for (let n = 0; n < 7; n++) {
                                if (typeof (score[i][j][k][l][m]) === "number") {
                                    break;
                                }
                                let calcTurn = 1;
                                let calcState6 = insert(calcState5, n, calcTurn);
                                score[i][j][k][l][m][n] = calculateScore(calcState6, 3);

                                /*if (score[i][j][k][l][m][n] === 0) {
                                    score[i][j][k][l][m][n] = []; //denne må jeg huske å ta med når jeg utvider
                                }*/
                                /*for (let o = 0; o < 7; o++) {
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
                                }*/
                            }
                        }
                    }
                }
            }
        }
        /*for (let i = 0; i < 7; i++) {
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
        }*/
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
            score[i] += (3 - Math.abs(3 - i)) / 100000;
        }
        for (let i = 0; i < 7; i++) {
            let placement = score.indexOf(Math.max.apply(Math, score)); //if there are multiple with same value, maybe do a random choice between them
            console.log(score);
            if (gameBoard.split("3")[placement][5] === "0") {
                placeTile(currentTurn, placement);
                break;
            }
            score[placement] = -1000000000;
        }
    }
    /*
    Here i can maybe use regular expression to look for patterns
    Try to stitch together each of the columns (best to use 0s and 1s), and have a 2 determining row end
    Look for a pattern where a 1 is followed by a 2 somewhere in the next 7,8 or 9 (skrå venstre, rett opp, skrå høyre), and then the 7,8 or 9 is also a 1.
    This has to be repeated 3(4?) times. If this is true, a match is found. Have the same test just for 0 instead.
    To find 4 in the same row, just look for 1111, and since lineshifts will have a 2, no more testing than that is needed
    /1(\d{7,7}1){3,}|1(\d{6,6}1){3,}|1(\d{5,5}1){3,}/gm //this does the basic thing, not sure if sizes are corrct, have not added the 2 to show lineshift
    How to use:
    let regtest = /1(\d{7,7}1){3,}|1(\d{6,6}1){3,}|1(\d{5,5}1){3,}/gm
    regtest.test("001000010001020100010020100100200") //something like this
    Will return true or false
    This method will prolly be WAY more efficient than the old one
    0 is empty space, 1 and 2 is red and yellow, 3 is lineshift
    */
    function calculateScore(board, factor) { //board is a boardstate array
        if (redwintest.test(board)) {
            return -1 * factor;
        }
        if (yellowwintest.test(board)) {
            return 1;
        }
        return 0;
    }


    generateBoard();

}