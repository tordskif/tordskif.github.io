
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

    let divBoard = [
        [], //collum 1
        [], //collum 2 etc...
        [],
        [],
        [],
        [],
        []
    ];

    numberFields = []

    window.ondragstart = function () { return false; }

    let currentTurn = 1; //1 is red, 2 is yellow

    let main = document.getElementById("main");
    let turnText = document.getElementById("turn");
    turnText.innerHTML = "Your turn"

    //Regexes used to determine if a certain board state is a win/loss
    let redwintest = /1(\d{7}1){3}|1(\d{6}1){3}|1(\d{5}1){3}|1111/
    let yellowwintest = /2(\d{7}2){3}|2(\d{6}2){3}|2(\d{5}2){3}|2222/

    //Want it to be similar to the above, but instead needing only 3 in a row, with a 0 on either side. Look for following patterns:
    /**
     * (1\d{7}){3}0  Right up, zero on top right
     * 0(\d{7}1){3}  Right down, zero on bottom left
     * (1\d{6}){3}0  Horizontal, zero on right
     * 0(\d{6}1){3}  Horizontal, zero on left
     * (1\d{5}){3}0  Left up, zero on bot right
     * 0(\d{5}1){3}  Left down, zero on top left
     * 1110          Vertical, 0 on top
     * 0111          Vertical, 0 on bottom (never happens)
     * 
     * //Also need the ones where the empty spot is in the middle somewhere, like 1\d{5}1\d{5}0\d{5}1
     * (1\d{7}){2}0\d{7}1  Right up, zero top middle
     * 1\d{7}0(\d{7}1){2}  Right down, zero bot middle
     * (1\d{6}){2}0\d{6}1  Horizontal, zero on right
     * 1\d{6}0(\d{6}1){2}   Horizontal, zero on left
     * (1\d{5}){2}0\d{5}1  Left up, zero on bot right
     * 1\d{5}0(\d{5}1){2} Left down, zero on top left
     * 1101          Vertical, 0 on top middle (never happens)
     * 1011          Vertical, 0 on bottom middle (never happens)
     */
    /*
    let redthreetest = /(1\d{7}){3}0|0(\d{7}1){3}|(1\d{6}){3}0|0(\d{6}1){3}|(1\d{5}){3}0|0(\d{5}1){3}|1110|(1\d{7}){2}0\d{7}1|1\d{7}0(\d{7}1){2}|(1\d{6}){2}0\d{6}1|1\d{6}0(\d{6}1){2}|(1\d{5}){2}0\d{5}1|1\d{5}0(\d{5}1){2}/g
    let yellowthreetest = /(2\d{7}){3}0|0(\d{7}2){3}|(2\d{6}){3}0|0(\d{6}2){3}|(2\d{5}){3}0|0(\d{5}2){3}|2220|(2\d{7}){2}0\d{7}2|2\d{7}0(\d{7}2){2}|(2\d{6}){2}0\d{6}2|2\d{6}0(\d{6}2){2}|(2\d{5}){2}0\d{5}2|2\d{5}0(\d{5}2){2}/g
    */

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
            let newNumberField = document.createElement("div");
                newNumberField.className = "numberField";
                newNumberField.id = i;
                let xloc = i * 90 + 20;
                let yloc = 560;
                newNumberField.style.left = xloc + "px";
                newNumberField.style.top = yloc + "px";
                main.appendChild(newNumberField);
                numberFields[i] = newNumberField;
                newNumberField.innerHTML = "0"
        }
    }
    main.addEventListener("click", clickOnColumn);
    main.addEventListener("touch", clickOnColumn);

    //Function to actually make a move. gameBoard is current board, column is which column to do the move, and turn is which player is making this move
    function insert(gameBoard, column, turn) {
        let s = gameBoard.split("3");
        if (s[column][5] != "0") { //This means the collumn is full, cant do placement. Return false
            return false
        }
        s[column] = s[column].replace("0", turn);
        return s.join("3");
    }

    //The top section displaying the scores. record is a global variable stored in localstorage.
    let recordDiv = document.getElementById("record");
    recordDiv.innerHTML = "Red: " + record.split(",")[0] + ", Yellow: " + record.split(",")[1];

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
            turnText.innerHTML = "Opponent is thinking..."

            setTimeout(AIPick, 10);
            setTimeout(function () {
                if (gameState !== 1) { gameState = 0; turnText.innerHTML = "Your turn" };
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
    }

    //Update visuals and gamestate after a player has won
    function checkForWins() { //only need to check for currentturns
        if (redwintest.test(gameBoard)) { //kan finne ut hva regexen fant, kan fikse det senere for å highligte 4påraden
            gameState = 1;
            turnText.innerHTML = "You won! Refresh to play again!"
            record = record.split(",")
            record[0] = parseFloat(record[0]) + 1;
            recordDiv.innerHTML = "Red: " + record[0] + ", Yellow: " + record[1];
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
                        if (length === 19) {
                            divBoard[i][j].style.filter = "hue-rotate(-60deg)";
                            divBoard[i + 1][j + 1].style.filter = "hue-rotate(-60deg)";
                            divBoard[i + 2][j + 2].style.filter = "hue-rotate(-60deg)";
                            divBoard[i + 3][j + 3].style.filter = "hue-rotate(-60deg)";
                        }
                        if (length === 22) {
                            divBoard[i][j].style.filter = "hue-rotate(-60deg)";
                            divBoard[i + 1][j].style.filter = "hue-rotate(-60deg)";
                            divBoard[i + 2][j].style.filter = "hue-rotate(-60deg)";
                            divBoard[i + 3][j].style.filter = "hue-rotate(-60deg)";
                        }
                        if (length === 25) {
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
            turnText.innerHTML = "Opponent won. Refresh to try again"
            record = record.split(",")
            record[1] = parseFloat(record[1]) + 1;
            recordDiv.innerHTML = "Red: " + record[0] + ", Yellow: " + record[1];
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
                        if (length === 19) {
                            divBoard[i][j].style.filter = "hue-rotate(-60deg)";
                            divBoard[i + 1][j + 1].style.filter = "hue-rotate(-60deg)";
                            divBoard[i + 2][j + 2].style.filter = "hue-rotate(-60deg)";
                            divBoard[i + 3][j + 3].style.filter = "hue-rotate(-60deg)";
                        }
                        if (length === 22) {
                            divBoard[i][j].style.filter = "hue-rotate(-60deg)";
                            divBoard[i + 1][j].style.filter = "hue-rotate(-60deg)";
                            divBoard[i + 2][j].style.filter = "hue-rotate(-60deg)";
                            divBoard[i + 3][j].style.filter = "hue-rotate(-60deg)";
                        }
                        if (length === 25) {
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


    //If yellow can win with move i, return i. Else, return false
    function lookForWin(gameBoard) {
        for (let i = 0; i < 7; i++) {
            newBoard = insert(gameBoard, i, 2)
            if(yellowwintest.test(newBoard)) {
                return i
            }
        }
        return false
    }

    //Takes in a gameBoard and currentTurn, uses recusion to evaluate best move one move down
    function EvaluateBoard(gameBoard, turn, alpha, beta, recursionDepth = 0) {
        //Base cases
        //If red has won, give board a bad value
        if (redwintest.test(gameBoard)) {
            return -1
        }
        //If yellow has won, give board a good value
        if (yellowwintest.test(gameBoard)) {
            return 1
        }
        //If we meet a set max recursion depth, just return 0 
        if (recursionDepth >= 7) {
            //Return some heuristic score, make new file with these changes
            //Heuristic can be number of winning moves for yellow, minus number of winning moves for red, regardless of whoose turn it is..
            //Or like, number of moves yellow can make which end in a loss for yellow, vs number of moves red can make which end in a loss for red...
            //Or some measure of number of moves which does NOT lose instantly, for each player...
            //Will need to have a sort of 2 steps deep logic to do this..., but should be ok to do. Reduce main max recursion depth to compensate
            return deepEvaluation(gameBoard)
        }
        let nextTurn;
        if (turn === 1) {
            nextTurn = 2
        }
        if (turn === 2) {
            nextTurn = 1
        }
        //For each of the seven possible moves, generate that board, and pass it into this function recursively
        //Minimax with alpha-beta pruning

        //First if maximizing player:
        let value = 0
        let moveList = []
        if (turn === 2) {
            value = Number.NEGATIVE_INFINITY
            moveList = [0, 0, 0, 0, 0, 0, 0]
            for (let i = 0; i < 7; i++) {
                let boardEval = -2
                let newBoard = insert(gameBoard, i, turn)
                if (newBoard === false) { //If column is full, disincentivize. Also stops recusion early, should speed up
                    moveList[i] = -2
                } else {
                    boardEval = EvaluateBoard(newBoard, nextTurn, alpha, beta, recursionDepth + 1)
                    moveList[i] = boardEval
                    value = Math.max(boardEval, value)
                    if (value >= beta) {
                        break
                    }
                    alpha = Math.max(alpha, value)
                }
            }
        }
        //If minimixing player
        if (turn === 1) {
            value = Number.POSITIVE_INFINITY
            moveList = [0, 0, 0, 0, 0, 0, 0]
            for (let i = 0; i < 7; i++) {
                let boardEval = 2
                let newBoard = insert(gameBoard, i, turn)

                if (newBoard === false) { //If column is full, disincentivize. Also stops recusion early, should speed up
                    moveList[i] = 2
                } else {
                    boardEval = EvaluateBoard(newBoard, nextTurn, alpha, beta, recursionDepth + 1)
                    moveList[i] = boardEval
                    value = Math.min(boardEval, value)
                    if (value <= alpha) { //Only do pruning on legal moves
                        break
                    }
                    beta = Math.min(beta, value)
                }
            }
        }
        //Now we have a list of 7 numbers, the value of making each move. Need to send a value to show a value for this state

        //If it is the original function call, we want to return a move, not a score.
        if (recursionDepth === 0) {
            return moveList
        } else {
            //Do some averaging for moves here, take into account recusion depth
            let depthFactor = (1 - recursionDepth / 100)
            //Have different behaviour depending on depth. If they see that they have 100% lost in 8 moves, they dont need to give up hope
            //Player might not play perfectly.
            if (turn === 1) {
                let worstOutcome = 1
                let fullRows = 0
                let average = 0
                for (let i = 0; i < 7; i++) {
                    if (moveList[i] === 2) { //Dont count full columns as bad moves.. or maybe i should?
                        fullRows += 1
                        continue
                    }
                    average += moveList[i]
                    if (moveList[i] <= worstOutcome) {
                        worstOutcome = moveList[i]
                    }
                }
                if (fullRows === 7) {
                    return 0
                }
                if(Math.abs(worstOutcome) < 0.1 && recursionDepth >= 3) { //Not critical, instead return average
                    return average/(7-fullRows)
                } 

                return worstOutcome * depthFactor //Include the depth factor, makes it live longest before losing
            }

            if (turn === 2) {
                let worstOutcome = -1
                let fullRows = 0
                let average = 0
                for (let i = 0; i < 7; i++) {
                    if(moveList[i] === -2) { //Means the row is full
                        fullRows += 1
                        continue
                    }
                    average += moveList[i]
                    if (moveList[i] >= worstOutcome) {
                        worstOutcome = moveList[i]
                    }
                }
                if(fullRows === 7) { //This means there are no legal moves, drawn position, return 0
                    return 0
                }
                if(Math.abs(worstOutcome) < 0.1 && recursionDepth >= 3) { //Not critical, instead return average
                    //Returning average is not really that smart. Say there is one forced move. Then the worst outcome is prolly around 0, but average is around 6/7
                    //Because 6 possibilites are winning... really cant rely on this... Maybe if depth > 3 as well, so that its not too obvious?
                    return average/(7-fullRows)
                    //Maybe also check that average is not too large? Really dont want it to change the behaviour TOO much, just nudge in the right direction if it really doesnt know...
                } 
                return worstOutcome * depthFactor 
            }
        }
    }

    function AIPick() {
        //First look for depth 1 wins, silly to wait so long for these:
        let isWin = lookForWin(gameBoard)
        let placementList = [0,0,0,0,0,0,0]
        if(isWin !== false) { //Means isWin is the index which wins
            placeTile(isWin)
            placementList[isWin] = 1 //Kinda have to cheat with the calculations here, since its only one layer deep
        } else {
            //Else, do the usual stuff
            placementList = EvaluateBoard(gameBoard, 2, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY)
            //This returns a 7 element list, chose the highest one which is possible to do
            //placementList = placementList.map((e, index) => e + ((3 - Math.abs(3 - index)) / 1000))
            //console.log(placementList)
            let index = placementList.indexOf(Math.max.apply(Math, placementList))
            placeTile(index)
        }
        
        //Instead of logging the placementList, show it on screen:
        for (let i = 0; i < numberFields.length; i++) {
            numberFields[i].innerHTML = Math.round((placementList[i] + Number.EPSILON)*100)/100;
        }
    }

    function deepEvaluation(gameBoard) {
        let redCount = findRedThreeInARow(gameBoard)
        let yellowCount = findYellowThreeInARow(gameBoard)
        let difference = yellowCount-redCount
        return difference/10000
    }
    // Need some better heuristic, which gives more neuanced evaluation to different types of boards. Currently its way too much 0, meaning it doesnt really know the difference between moves, and then suddenly its in a losing position....
    // Maybe instead simply count the number of red/yellow 3 in a rows, which can be completed in a 4rth spot, and base heuristic on this?
    //Create regex for this.
    //Here is how to count number of matches for a regex:
    //https://stackoverflow.com/questions/1072765/count-number-of-matches-of-a-regex-in-javascript

    function findRedThreeInARow(gameBoard) {
        let count = 0
        //Do each regex separately, to catch potential overlaps
        //There can still be potential overlaps, if there are two of the same type... but to be honest, we only care about the first one of these most of the time
        let regex
        regex = /(1\d{7}){3}0/g
        count += ((gameBoard || '').match(regex) || []).length
        regex = /0(\d{7}1){3}/g
        count += ((gameBoard || '').match(regex) || []).length
        regex = /(1\d{6}){3}0/g
        count += ((gameBoard || '').match(regex) || []).length
        regex = /0(\d{6}1){3}/g
        count += ((gameBoard || '').match(regex) || []).length
        regex = /(1\d{5}){3}0/g
        count += ((gameBoard || '').match(regex) || []).length
        regex = /0(\d{5}1){3}/g
        count += ((gameBoard || '').match(regex) || []).length
        regex = /1110/g
        count += ((gameBoard || '').match(regex) || []).length
        regex = /(1\d{7}){2}0\d{7}1/g
        count += ((gameBoard || '').match(regex) || []).length
        regex = /1\d{7}0(\d{7}1){2}/g
        count += ((gameBoard || '').match(regex) || []).length
        regex = /(1\d{6}){2}0\d{6}1/g
        count += ((gameBoard || '').match(regex) || []).length
        regex = /1\d{6}0(\d{6}1){2}/g
        count += ((gameBoard || '').match(regex) || []).length
        regex = /(1\d{5}){2}0\d{5}1/g
        count += ((gameBoard || '').match(regex) || []).length
        regex = /1\d{5}0(\d{5}1){2}/g
        return count
    }

    function findYellowThreeInARow(gameBoard) {
        let count = 0
        //Do each regex separately, to catch potential overlaps
        let regex
        regex = /(2\d{7}){3}0/g
        count += ((gameBoard || '').match(regex) || []).length
        regex = /0(\d{7}2){3}/g
        count += ((gameBoard || '').match(regex) || []).length
        regex = /(2\d{6}){3}0/g
        count += ((gameBoard || '').match(regex) || []).length
        regex = /0(\d{6}2){3}/g
        count += ((gameBoard || '').match(regex) || []).length
        regex = /(2\d{5}){3}0/g
        count += ((gameBoard || '').match(regex) || []).length
        regex = /0(\d{5}2){3}/g
        count += ((gameBoard || '').match(regex) || []).length
        regex = /2220/g
        count += ((gameBoard || '').match(regex) || []).length
        regex = /(2\d{7}){2}0\d{7}2/g
        count += ((gameBoard || '').match(regex) || []).length
        regex = /2\d{7}0(\d{7}2){2}/g
        count += ((gameBoard || '').match(regex) || []).length
        regex = /(2\d{6}){2}0\d{6}2/g
        count += ((gameBoard || '').match(regex) || []).length
        regex = /2\d{6}0(\d{6}2){2}/g
        count += ((gameBoard || '').match(regex) || []).length
        regex = /(2\d{5}){2}0\d{5}2/g
        count += ((gameBoard || '').match(regex) || []).length
        regex = /2\d{5}0(\d{5}2){2}/g
        return count
    }

    generateBoard();
}



// 122212322111231121213211212320000031121103212221 weird board where wrong tiles were colored
// but regex says this doesnt win
// Something is off in the coloring algorithm, it gives the same results when running the code on this result:
// 122212322111231121213211212321000031121103212221
// It gives a string of length 25, which should be a diagonal one?
// OH THINK ITS BECAUSE IT MAKES 5 IN A ROW. WHICH MEANS THE REGEX CATCHES THE WHOLE PART, NOT JUST THE 
// 1231121213211212321000031 this is the substring it finds
// Oh it isnt just a horisontal one, its also a diagonal one of length 5, need to somehow limit the regex to just find exactly 4 segments
// Think i fixed it

//One thing to fix, it doesnt understand the concept of "Forcing" you to make the final few moves. Even if they place a spot so that any
//move you make gives them a win, they still dont evaluate that as a win
//Can maybe add a check to the "insert" function. If the spot trying to be filled is full, return some value which signifies that you cant place ther
//Maybe +/-1 depending on which player is trying to do that move? Need to think about what makes sense there..
//If its maximizing player, return -1, as its a move they will never consider
//If its minimizing player, return 1, as its a move they will never consider
//With these added, it considers that forcing red to have to play on a filled column is a win...
//Maybe 2 is not the right value to chose...

//Maybe dont always have to do depth first at depth 9, its a bit silly waiting so long for an instant win?
//Maybe do depth 3 search only looking for wins first? Have to be a bit careful here though, maybe depth 1 search is fine here?