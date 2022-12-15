//This class takes care of all the rendering
export default class Renderer {
    constructor(length, height, spacing, tileSize, displaySize, displaySpacing, nextNum) {
        this.length = length
        this.height = height
        this.spacing = spacing
        this.tileSize = tileSize
        this.displaySize = displaySize
        this.displaySpacing = displaySpacing
        this.nextNum = nextNum

        this.tileDivs = []
        this.tileHolder = document.getElementById("tileHolder")
        this.shiftHolder = document.getElementById("shiftHolder")
        this.nextHolders = []
        this.queueDiv = document.getElementById("queueDiv")
        this.scoreDiv = document.getElementById("scoreDiv")
        this.levelDiv = document.getElementById("levelDiv")
        this.bombCount = document.getElementById("bombCount")
        this.clockCount = document.getElementById("clockCount")
    }


    //Creates all divs
    initialize() {
        //Create gameboard
        for (let i = 0; i < this.height; i++) {
            this.tileDivs[i] = []
            for (let j = 0; j < this.length; j++) {
                this.createTileDiv(i, j)
            }     
        }
        //Create divs to hold next pieces
        for (let i = 0; i < this.nextNum; i++) {
            this.createNextHolder(i)
        }
    }

    createTileDiv(i, j) {
        let newElement = document.createElement("div")
        this.tileDivs[i][j] = newElement
        newElement.classList.add("tile")
        newElement.style.top = i*(this.spacing + this.tileSize) + "px"
        newElement.style.left = j*(this.spacing + this.tileSize) +"px"
        newElement.style.width = this.tileSize + "px"
        newElement.style.height = this.tileSize + "px"
        this.tileHolder.appendChild(newElement)
    }

    //Draws a given gameBoard object onto the screen
    draw(gameBoard) {
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.length; j++) {
                let currentTile = this.tileDivs[i][j]
                //Make it the right color
                currentTile.style.backgroundColor = gameBoard.matrix[i][j].color

                //Remove all properties
                currentTile.style.opacity = 1
                currentTile.classList.remove("bomb")
                currentTile.classList.remove("clock")

                //Add back relevant properties
                if(gameBoard.matrix[i][j].isShadow) {
                    currentTile.style.opacity = 0.6
                }
                if(gameBoard.matrix[i][j].powerUp === "bomb") { //bomb to be collected
                    currentTile.classList.add("bomb")
                }
                if(gameBoard.matrix[i][j].activePowerUp === "bomb") { //bomb when deployed
                    currentTile.classList.add("bomb")
                }
                if(gameBoard.matrix[i][j].powerUp === "clock") { //Clock to be collected
                    currentTile.classList.add("clock")
                }

                //Slowdown
                if(gameBoard.isSlowedDown) {
                    currentTile.style.filter = "hue-rotate(30deg)"
                } else {
                    currentTile.style.filter = "hue-rotate(0deg)"
                }
            }
        }
    }

    shiftDraw(piece) {
        //First clear all old children of shiftholder
        this.shiftHolder.innerHTML = ""
        for (let i = 0; i < piece.height; i++) {
            for (let j = 0; j < piece.length; j++) {
                let displayTile = this.createDisplayTile(i, j, piece.height, this.shiftHolder)
                displayTile.style.backgroundColor = piece.matrix[i][j].color
                if(piece.matrix[i][j].powerUp === "bomb") {
                    displayTile.classList.add("bomb")
                }
                if(piece.matrix[i][j].powerUp === "clock") {
                    displayTile.classList.add("clock")
                }
            }  
        }
    }

    createDisplayTile(i, j, height, parent) {
        let newElement = document.createElement("div")
        newElement.classList.add("display")
        let displayTileSize = this.displaySize/height
        newElement.style.top = i*(displayTileSize) + "px"
        newElement.style.left = j*(displayTileSize) +"px"
        newElement.style.width = displayTileSize + "px"
        newElement.style.height = displayTileSize + "px"
        parent.appendChild(newElement)
        return newElement
    }

    createNextHolder(i) {
        let nextHolder = document.createElement("div")
        let nextHoldBorder = document.createElement("div")
        nextHolder.classList.add("nextHolder")
        nextHoldBorder.classList.add("nextHoldBorder")
        nextHoldBorder.style.top = i*(this.displaySize + 3 * this.displaySpacing) + this.displaySpacing + "px" //i*(this.displaySize)/5
        nextHolder.style.width = this.displaySize + "px"
        nextHolder.style.height = this.displaySize + "px"
        this.nextHolders[i] = nextHolder
        nextHoldBorder.appendChild(nextHolder)
        this.queueDiv.appendChild(nextHoldBorder)
    }

    nextDraw(pieces) {
        for (let i = 0; i < pieces.length; i++) { //For each piece, create a display
            let piece = pieces[i]
            let parent = this.nextHolders[i]
            parent.innerHTML = ""
            for (let i = 0; i < piece.height; i++) {
                for (let j = 0; j < piece.length; j++) {
                    let displayTile = this.createDisplayTile(i, j, piece.height, parent)
                    displayTile.style.backgroundColor = piece.matrix[i][j].color
                    if(piece.matrix[i][j].powerUp === "bomb") {
                        displayTile.classList.add("bomb")
                    }
                    if(piece.matrix[i][j].powerUp === "clock") {
                        displayTile.classList.add("clock")
                    }
                }  
            }      
        }
    }



    updateScore(score) {
        this.scoreDiv.innerHTML = "Score: " + score
    }

    updateLevel(level) {
        this.levelDiv.innerHTML = "Level: " + level
    }

    updatePowerUpCounts(bombs, clocks) {
        this.bombCount.innerHTML = ": " + bombs
        this.clockCount.innerHTML = ": " + clocks
    }
}