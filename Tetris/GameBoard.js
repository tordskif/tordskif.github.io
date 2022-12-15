import Piece from "./Piece.js"
import Tile from "./Tile.js"

//Gameboard is a n x m matrix of tiles, all which start empty. Methods to insert currently used piece and move it
//Has a list of possible pieces to be offered. Use seeded rng to select these

export default class GameBoard {
    constructor(length, height, matrix = undefined, isSlowedDown = false) {
        this.height = height
        this.length = length
        //Initialize whole board with empty tiles
        if (matrix === undefined) {
            let e = new Tile(false, "grey")
            let matrix = []
            for (let i = 0; i < height; i++) {
                matrix[i] = []
                for (let j = 0; j < length; j++) {
                    matrix[i][j] = e
                }
            }
            this.matrix = matrix
        } else {
            this.matrix = matrix
        }
        this.isSlowedDown = isSlowedDown //to change appearance if game is slowed down
    }

    //Returns a matrix with piece pivot inserted in spot (n,m), without modifying this.matrix
    insert(piece, n, m) {
        let cloneMatrix = JSON.parse(JSON.stringify(this.matrix))
        //Still need to check for edge cases, legalty, not overwriting other pieces etc.
        for (let i = 0; i < piece.height; i++) {
            for (let j = 0; j < piece.length; j++) {
                if (!(n + (i - piece.pivot[0]) < 0 || n + (i - piece.pivot[0]) >= this.height || m + (j - piece.pivot[1]) < 0 || m + (j - piece.pivot[1]) >= this.length)) {
                    if (piece.matrix[i][j].isSolid) {
                        cloneMatrix[n + (i - piece.pivot[0])][m + (j - piece.pivot[1])] = piece.matrix[i][j]
                    }
                }
            }
        }
        let newGameBoard = new GameBoard(this.length, this.height, cloneMatrix, this.isSlowedDown)
        return newGameBoard
    }

    insertShadow(piece, n, m) {
        let index = this.getShadowLocation(piece, n, m)
        let clone = piece.clone()
        clone.makeShadow()
        let newBoard = this.insert(clone, index, m)
        return newBoard
    }

    getShadowLocation(piece, n, m) {
        while(true) {
            if(!this.checkIfLegal(piece, n + 1, m)) { //It it isnt legal, at n + 1, return the insertion at m, else increment
                return n
            }
            n += 1
        }
    }

    //Checks if moving piece to (n,m) is legal. Illegal things include going off screen, or going through other pieces
    checkIfLegal(piece, n, m) {
        for (let i = 0; i < piece.height; i++) {
            for (let j = 0; j < piece.length; j++) {
                //First need to check if its outside boundary
                if (n + (i - piece.pivot[0]) >= this.height || m + (j - piece.pivot[1]) < 0 || m + (j - piece.pivot[1]) >= this.length) {
                    //Removed: n + (i - piece.pivot[0]) < 0 || 
                    if (piece.matrix[i][j].isSolid) {
                        return false
                    }
                } else {
                    //Check if both are solid, then this isnt legal
                    if(n + (i - piece.pivot[0]) < 0) {
                        continue
                    }
                    if (this.matrix[n + (i - piece.pivot[0])][m + (j - piece.pivot[1])].isSolid && piece.matrix[i][j].isSolid) {
                        return false
                    }
                }
            }
        }
        return true
    }

    checkIfPieceIsOutside(piece, n, m) {
        let isOutside = false
        for (let i = 0; i < piece.height; i++) {
            for (let j = 0; j < piece.length; j++) {
                //See if any blocks are outside
                if (n + (i - piece.pivot[0]) < 0) {
                    isOutside = true
                }
            }
        }
        return isOutside
    }

    checkForFullLine() {
        for (let i = 0; i < this.height; i++) {
            let lineIsFull = true
            for (let j = 0; j < this.length; j++) {
                if(!this.matrix[i][j].isSolid) {
                    lineIsFull = false
                    break
                }
            }
            if(lineIsFull) {
                return i //i is then the index of the full line    
            }
        }
        return false
    }

    removeFullLines() {
        //console.log(this.checkForFullLine())
        let linesRemoved = []
        while(this.checkForFullLine() !== false) { //Means there is still a full line
            let index = this.checkForFullLine()
            let removedLine = this.matrix.splice(index, 1) //Remove the full line
            linesRemoved.push(removedLine[0]) //Sent back which lines were removed //Splice gives out some other information that we dont want to keep. Only keep 0th index, element which is removed

            //Create a new to put in the begining
            let newRow = []
            let e = new Tile(false, "grey")
            for (let i = 0; i < this.length; i++) {
                newRow[i] = e    
            }
            this.matrix.unshift(newRow)
        }
        return linesRemoved
    }

    clearTile(n, m) {
        let clearedSolid = false
        let e = new Tile(false, "grey")
        if(n < this.height && n >= 0 && m < this.length && m >= 0) {
            if(this.matrix[n][m].isSolid) {
                clearedSolid = true
            }
            this.matrix[n][m] = e
        }
        return clearedSolid
    }
}