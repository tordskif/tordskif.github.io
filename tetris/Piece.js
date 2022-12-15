import Tile from "./Tile.js"
//array matrix: a 2d array with elements of Tile class.
//Every smaller array is one row, amount of smaller arrays is height
//int length: length of matrix
//int height: height of matrix
//pivot is two numbers (m,n) specifying where rotation happens about.

export default class Piece {
    constructor(matrix, length, height, pivot) {
        this.matrix = matrix
        this.length = length
        this.height = height
        this.pivot = pivot
        this.isDeployedPowerUp = false
        this.powerUpType = "none"
    }

    rotateRight() {
        //First create empty rows to put the objects in. Note that this is AFTER rotation, so use length instead of height
        let rotated = []
        for (let i = 0; i < this.length; i++) {
            let newRow = []
            rotated[i] = newRow
        }
        //Fill rows with appropriate elements
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.length; j++) {
                rotated[j][(this.height - 1) - i] = this.matrix[i][j]
            }
        }
        this.matrix = rotated

        //Switch height and length:
        let temp = this.height
        this.height = this.length
        this.length = temp
    }

    rotateLeft() {
        //First create empty rows to put the objects in. Note that this is AFTER rotation, so use length instead of height
        let rotated = []
        for (let i = 0; i < this.length; i++) {
            let newRow = []
            rotated[i] = newRow
        }
        //Fill rows with appropriate elements
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.length; j++) {
                rotated[(this.length - 1) - j][i] = this.matrix[i][j]
            }
        }
        this.matrix = rotated

        //Switch height and length:
        let temp = this.height
        this.height = this.length
        this.length = temp
    }

    makeShadow() {
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.length; j++) {
                this.matrix[i][j].isShadow = true
            }
            
        }
    }

    clone() {
        let cloneMatrix = JSON.parse(JSON.stringify(this.matrix))
        let clone = new Piece(cloneMatrix, this.length, this.height, this.pivot)
        return clone
    }

    
    addPowerUp(powerUpType) {
        let rand = Math.floor(4*Math.random()) //Choose which of the 4 solid tiles to put powerup in in.
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.length; j++) {
                if(this.matrix[i][j].isSolid) {
                    if(rand === 0) {
                        this.matrix[i][j].powerUp = powerUpType
                        return
                    } else {
                        rand -= 1
                    }
                }
            }
            
        }
    }

    static defaultPieces() {
        let defaultPieces = []
        let e = new Tile(false, "#7f7f7f") //Empty
    
        //I tile
        let lb = new Tile(true, "#00ffff")
        let IPiece = new Piece([[e, lb, e, e], [e, lb, e, e], [e, lb, e, e], [e, lb, e, e]], 4, 4, [1, 1])
        defaultPieces.push(IPiece)
    
        //J tile
        let b = new Tile(true, "#0000ff")
        let JPiece = new Piece([[e, b, e], [e, b, e], [b, b, e]], 3, 3, [1, 1])
        defaultPieces.push(JPiece)
    
        //L
        let o = new Tile(true, "#ff7f00")
        let LPiece = new Piece([[e, o, e], [e, o, e], [e, o, o]], 3, 3, [1, 1])
        defaultPieces.push(LPiece)
    
        //O
        let y = new Tile(true, "#ffff00")
        let OPiece = new Piece([[y, y], [y, y]], 2, 2, [0, 0])
        defaultPieces.push(OPiece)
    
        //S
        let g = new Tile(true, "#00ff00")
        let SPiece = new Piece([[e, e, e], [e, g, g], [g, g, e]], 3, 3, [1, 1])
        defaultPieces.push(SPiece)
    
        //T
        let p = new Tile(true, "#800080")
        let TPiece = new Piece([[e, p, e], [p, p, p], [e, e, e]], 3, 3, [1, 1])
        defaultPieces.push(TPiece)
    
        //Z
        let r = new Tile(true, "#ff0000")
        let ZPiece = new Piece([[e, e, e], [r, r, e], [e, r, r]], 3, 3, [1, 1])
        defaultPieces.push(ZPiece)
        return defaultPieces
    }

    static getBombPiece() {
        let e = new Tile(true, "#7f7f7f") //Empty
        e.activePowerUp = "bomb"
        let bombPiece = new Piece([[e]], 1, 1, [0, 0])
        bombPiece.isDeployedPowerUp = true
        bombPiece.powerUpType = "bomb"
        return bombPiece
    }
}

/*
//Example
let e = new Tile(false, "grey")
let b = new Tile(true, "blue")
let p = new Tile(true, "blue", true)

let arr = [[b, e], [p, e], [b, b]] //This has a length of 2, height of 3

let lPiece1 = new Piece(arr, 2, 3, [1,0])

lPiece1.rotateLeft()
lPiece1.rotateRight()*/