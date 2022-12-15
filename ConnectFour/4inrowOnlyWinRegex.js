
function setup() {
    //Localstorage to store scores
    if (localStorage.getItem("record") === null) {
        localStorage.setItem("record", "0,0");
    }
    let record = localStorage.getItem("record");
    //gameState whether game is running or not. 0 = running, 1 = finished, 2 = opponent is busy thinking
    let gameState = 0;

    //Starting game board. Each string of zeroes denotes empty tiles, 3 denotes a column break. We split on 3 when doing a move.
    //This procedure might be kinda slow, but it was to solve problems with mutability of arrays...
    let gameBoard = "000000300000030000003000000300000030000003000000";

    //If we implement a recursive solution, maybe we can do this in a cleaner way?

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

    //Regexes used to determine if a certain board state is a win/loss
    let redwintest = /1(\d{7,7}1){3,}|1(\d{6,6}1){3,}|1(\d{5,5}1){3,}|1111/
    let yellowwintest = /2(\d{7,7}2){3,}|2(\d{6,6}2){3,}|2(\d{5,5}2){3,}|2222/

    //Generating the 7x6 board of divs
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
            }
        }
    }
    main.addEventListener("click", clickOnColumn);
    main.addEventListener("touch", clickOnColumn);

    //Function to actually make a move. gameBoard is current board, column is which column to do the move, and turn is which player is making this move
    function insert(gameBoard, column, turn) {
        let s = gameBoard.split("3");
        s[column] = s[column].replace("0", turn);
        return s.join("3");
    }

    //The top section displaying the scores. record is a global variable stored in localstorage.
    let recordDiv = document.getElementById("record");
    recordDiv.innerHTML = "Red: " + record.split(",")[0] + " Yellow: " + record.split(",")[1];

    //Function detecting a clik 
    function clickOnColumn(e) {
        //If game is finished, do nothing.
        if (gameState === 1) {
            return;
        }
        //Decide what HTML element was clicked on
        let column = e.path[0].id.split(" ")[0];
        //If you didnt click on the board, do nothing
        if (column === "main") {
            return;
        }
        if (gameBoard.split("3")[column][5] === "0") {
            //If opponent is busy thinking, do nothing
            if (gameState === 2) {
                return;
            }
            //Perform placement
            placeTile(column);
            //If game is finished after your placement (means you won), return and do nothing
            if (gameState === 1) {
                return;
            }
            //Set gamestate to 2, signifying opponent is busy picking. Make AI pick, and wait for them to finish before setting state back.
            gameState = 2;
            setTimeout(AIPick, 10);
            setTimeout(function () {
                if (gameState !== 1) { gameState = 0 };
            }, 100);
        }
    }

    //perform placement
    function placeTile(column) {
        gameBoard = insert(gameBoard, column, currentTurn);
        checkForWins();
        if (currentTurn === 1) {
            currentTurn = 2;
        } else {
            currentTurn = 1;
        }
        update();
    }

    //Update visuals after placement
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
        console.log(gameBoard)
    }

    //Update visuals and gamestate after a player has won
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

    //This is the one that really needs a lot of work. Do this whole thing recursively instead.
    //Takes in a gameBoard and currentTurn, uses recusion to evaluate best move one move down
    function EvaluateBoard(gameBoard, turn, alpha, beta, recursionDepth = 0) {
        //Base cases
        //If red has won, give board a bad value
        if(redwintest.test(gameBoard)) {
            return -100/recursionDepth //Could divide these by recursion depth for them to prefer an earlier win
        }
        //If yellow has won, give board a good value
        if(yellowwintest.test(gameBoard)) {
            return 100*recursionDepth
        }
        if(recursionDepth >= 8) {
            return AverageEvaluateBoard(gameBoard, turn) //This will maximize the number of good moves for us, minus number of bad moves from opponent
        }
        let nextTurn;
        if(turn === 1) {
            nextTurn = 2
        }
        if(turn === 2) {
            nextTurn = 1
        }
        //For each of the seven possible moves, generate that board, and pass it into this function recursively
        //Do alpha beta split


        //First if maximizing player:
        let value = 0
        let moveList = []
        if(turn === 2) {
            value = Number.NEGATIVE_INFINITY
            for (let i = 0; i < 7; i++) {
                let newBoard = insert(gameBoard, i, turn)
                boardEval = EvaluateBoard(newBoard, nextTurn, alpha, beta, recursionDepth + 1)
                moveList.push(boardEval)
                value = Math.max(boardEval, value)
                if(value >= beta) {
                    break
                }
                alpha = Math.max(alpha, value)
            }
        }
        //If minimixing player
        if(turn === 1) {
            value = Number.POSITIVE_INFINITY
            for (let i = 0; i < 7; i++) {
                let newBoard = insert(gameBoard, i, turn)
                boardEval = EvaluateBoard(newBoard, nextTurn, alpha, beta, recursionDepth + 1)
                moveList.push(boardEval)
                value = Math.min(boardEval, value)
                if(value <= alpha) {
                    break
                }
                beta = Math.min(beta, value)
            }
        }
        //Now we have a list of 7 numbers, the value of making each move. If its reds turn, we chose the lowest one.
        //If its yellows, choose the highest.

        //If it is the original function call, we want to return a move, not a score.
        if(recursionDepth === 0) {
            return moveList
        } else {
            return value //if not at depth 0, just return the value
        }

    }

    function AIPick() {
        placementList = EvaluateBoard(gameBoard, 2, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY)
        //This returns a 7 element list, chose the highest one which is possible to do
        placementList = placementList.map((e,index) => e + ((3 - Math.abs(3 - index)) / 1000))
        console.log(placementList)
        //To check we're doing legal moves
        for (let i = 0; i < 7; i++) {
            let index = placementList.indexOf(Math.max.apply(Math, placementList))
            if (gameBoard.split("3")[index][5] === "0") {
                placeTile(index);
                break;
            }
            placementList[index] = Number.NEGATIVE_INFINITY;
        }
    }


    function AverageEvaluateBoard(gameBoard, turn) {
        let averageValue = 0 //Keep this running value, increase it for each good next move, decrease it for each bad next move
        for (let i = 0; i < 7; i++) {
            let newBoard = insert(gameBoard, i, turn)
            //If red has won, give board a bad value
            if(redwintest.test(newBoard)) {
                averageValue -= 1
            }
            //If yellow has won, give board a good value
            if(yellowwintest.test(newBoard)) {
                averageValue += 1
            }
        }
        return averageValue
    }


    generateBoard();

}