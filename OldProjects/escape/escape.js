function setup() {
    let gameBoard = [
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        []
    ];
    let divBoard = [
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        []
    ];
    let main = document.getElementById("main");
    main.addEventListener("click", go);

    window.ondragstart = function () { return false; }

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

    function generateBoard() {
        for (let i = 0; i < 11; i++) {
            for (let j = 0; j < 11; j++) {
                let newTile = document.createElement("div");
                newTile.className = "tile";
                newTile.id = i + " " + j;
                let xloc = i * 45 + 20;
                let yloc = j * 45 + 20;
                newTile.style.left = xloc + "px";
                newTile.style.top = yloc + "px";
                main.appendChild(newTile);
                divBoard[i][j] = newTile;
                gameBoard[i][j] = -1;
            }
        }
    }
    generateBoard();

    let yellowX = 5;
    let yellowY = 5;

    divBoard[yellowX][yellowY].style.backgroundColor = "yellow";
    gameBoard[yellowX][yellowY] = -3;

    function go(e) {
        let div = e.path[0];
        if (div.className !== "tile") {
            console.log("hola");
            return;
        }
        let pos = div.id.split(" ");
        let x = parseFloat(pos[0]);
        let y = parseFloat(pos[1]);
        if (gameBoard[x][y] !== -1) {
            return;
        }
        gameBoard[x][y] = -2;
        divBoard[x][y].style.backgroundColor = "black";
        yellowMove();
    }

    function yellowMove() {
        let calcBoard = clone(gameBoard);
        //console.log(calcBoard);
        let a = findPath(calcBoard);
        console.log(a);
    }

    let maxMoves = 11;

    function check(cell, i) {
        if(cell === undefined){
            return;
        }
        if (cell === -1) {
            return cell = i + 1;
        }
        return cell;
    }

    function findPath(board) {
        board[yellowX][yellowY] = 0;
        for (let i = 0; i < maxMoves; i++) { //i is the movetaken to move to that space count
            for (let j = 0; j < 10; j++) {
                for (let l = 0; l < 10; l++) {
                    if (board[j][l] === i) {
                        board[j][l + 1] = check(board[j][l + 1], i);
                        board[j][l - 1] = check(board[j][l - 1], i);
                        if (board[j + 1] !== undefined) {
                            board[j + 1][l] = check(board[j + 1][l], i);
                        }
                        if (board[j - 1] !== undefined) {
                            board[j - 1][l] = check(board[j - 1][l], i);
                        }
                    }
                }
            }
        }
        return board;
        //console.log(divBoard[yellowX][yellowY].style.left, divBoard[yellowX + 1][yellowY].style.left);
    }
}