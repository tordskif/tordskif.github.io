//Handles everything while the game is going

import GameBoard from "./GameBoard.js"
import Renderer from "./Renderer.js"
import Piece from "./Piece.js"

const pieces = Piece.defaultPieces()

let gameState = 1 //0 means game is finished/not started, 1 means it is going

//Scoring, progression
const baseSpeed = 1000 //This is time in ms between each automatic move down
const speedMultiplier = 0.3 //each lvl makes it go this much faster (additive)
const scoreRequired = 500 //Score required to get to next level
let score = 0
let level = 0

//Powerups
const usePowerUps = true //If false, pieces with powerups dont appear
let powerUpActive = false //So we dont deploy several at the same time
let bombs = 0
const bombRadius = 2
const bombChance = 0.05

let clocks = 0
const clockPower = 4 //Factor at which speed is slowed
const clockDuration = 5 * 1000
let clockActive = false
const clockChance = 0.05


//Rendering
const l = 10
const h = 20
const tileSpacing = 2
const tileSize = 30
const displaySize = 100
const displaySpacing = 10
const pieceQueueLength = 5
const rend = new Renderer(l, h, tileSpacing, tileSize, displaySize, displaySpacing, pieceQueueLength)
rend.initialize()

let gameBoard



//Piece control
const startX = -1
const startY = 4

let x
let y
let currentPiece
let pieceQueue = []
let shiftedPiece = undefined
let shiftUsed = false



//Timers, timer bools
let doDownTicker
let movementHandler

const tileMoveSpeed = 80

let downLoop = false
let rightLoop = false
let leftLoop = false

function start() {
    //Generate blank gameBoard
    gameBoard = new GameBoard(l, h)
    //Initialize queue with random pieces
    for (let i = 0; i < pieceQueueLength; i++) {
        fillPieceQueue()
    }

    //Put piece on board
    initializeNewPiece()

    //Start relevant timers
    let tickSpeed = getTickSpeed()
    doDownTicker = setInterval(doDown, tickSpeed)
    movementHandler = setInterval(handleMovement, tileMoveSpeed)

    //Render updates
    update()
}

window.addEventListener("keydown", function (e) {
    if (e.repeat) { //Prevent default functionality when holding a button down
        return
    }
    if(e.key === "r") {
        //Todo: reset game
    }

    if (gameState === 0) { //Dont accept further inputs if game is finished
        return
    }
    if (e.key === "Shift") {
        if(!shiftUsed && !powerUpActive) { //Can only shift once per piece, and can't shift powerups
            doShiftPiece()
        }
    }
    if (e.key === "ArrowDown") {
        if(getTickSpeed() <= tileMoveSpeed) { //Means its already going faster down than you can force it to, dont do anything
            return
        }
        //Reset timer on natural down, start it again on key up
        clearInterval(doDownTicker)
        //Start timer for as long as down is held. Cancel on key up
        downLoop = true
    }
    if (e.key === "ArrowRight") {
        rightLoop = true
    }
    if (e.key === "ArrowLeft") {
        leftLoop = true
    }
    if (e.key === "ArrowUp") {
        doRotationRight()
    }
    if (e.key === " ") { //Spacebar
        doDropDown()
    }
    if (e.key === "q") {
        deployBomb()
    }
    if (e.key === "w") {
        activateClock()
    }
})

window.addEventListener("keyup", function (e) {
    if (e.key === "ArrowDown") {
        if(downLoop) {
            //Clear force down
            downLoop = false
            //Start usual down again
            let tickSpeed = getTickSpeed()
            doDownTicker = setInterval(doDown, tickSpeed)
        }
    }
    if (e.key === "ArrowRight") {
        rightLoop = false
    }
    if (e.key === "ArrowLeft") {
        leftLoop = false
    }
})

function getTickSpeed() {
    //Use level and baseSpeed to determine how fast it should tick...
    //Want it to get about 10% faster every level, divide base tick speed by 1.1 raised to level? 
    let multiplier = 1 + speedMultiplier*level //Math.pow(speedMultiplier, level)
    let newSpeed = Math.ceil(baseSpeed/multiplier)
    if(clockActive) {
        newSpeed*=clockPower //Increase tick period by clockPower factor, increasing time between ticks
    }
    return newSpeed
}

function getNewPiece() {
    fillPieceQueue()
    let newPiece = pieceQueue.shift()
    return newPiece
}

function fillPieceQueue() {
    //Choose from available pieces, make a clone
    let randomPiece = pieces[Math.floor(Math.random() * pieces.length)]
    let clone = randomPiece.clone()
    if (usePowerUps) {
        //Add powerups randomly
        let randPowerUp = Math.random()
        if (randPowerUp < bombChance) {
            clone.addPowerUp("bomb")
        } else if (randPowerUp < bombChance + clockChance) {
            clone.addPowerUp("clock")
        }
    }
    pieceQueue.push(clone)
}

function clonePiece(piece) {
    let cloneMatrix = JSON.parse(JSON.stringify(piece.matrix))
    let clone = new Piece(cloneMatrix, piece.length, piece.height, piece.pivot)
    return clone
}

function initializeNewPiece() {
    currentPiece = getNewPiece()
    x = startX
    y = startY
}

function doRight() {
    if (gameBoard.checkIfLegal(currentPiece, x, y + 1)) {
        y += 1
        update()
    }
}

function doLeft() {
    if (gameBoard.checkIfLegal(currentPiece, x, y - 1)) {
        y -= 1
        update()
    }
}

function handleMovement() {
    //Check if said keys are pressed down, if so do said movement
    if (rightLoop) {
        doRight()
    }
    if (leftLoop) {
        doLeft()
    }
    if (downLoop) {
        doDown()
    }
}

function doRotationRight() {
    let clone = clonePiece(currentPiece)
    clone.rotateRight()
    if (gameBoard.checkIfLegal(clone, x, y)) {
        currentPiece.rotateRight()
        update()
    } else if (gameBoard.checkIfLegal(clone, x, y + 1)) { //Try to push it either left or right if that makes the rotation legal
        currentPiece.rotateRight()
        y += 1
        update()
    } else if (gameBoard.checkIfLegal(clone, x, y - 1)) {
        currentPiece.rotateRight()
        y -= 1
        update()
    } else if (gameBoard.checkIfLegal(clone, x, y + 2)) { //Need to do 2 for it to work with the long piece. Should prolly do this in general until it works to make it work for arbitrary pieces
        currentPiece.rotateRight()
        y += 2
        update()
    } else if (gameBoard.checkIfLegal(clone, x, y - 2)) {
        currentPiece.rotateRight()
        y -= 2
        update()
    }
}

function doDown() {
    if (gameBoard.checkIfLegal(currentPiece, x + 1, y)) {
        x += 1
        update()
    } else {
        doInsertion(x, y)
    }
}

function doDropDown() { //Remove piece, insert at shadows spot
    let index = gameBoard.getShadowLocation(currentPiece, x, y)
    doInsertion(index, y)
}

function doInsertion(n, m) {
    //Update shift
    shiftUsed = false
    //Do powerup actions
    if(currentPiece.isDeployedPowerUp) {
        if(currentPiece.powerUpType === "bomb") {
            doBombExplosion(n, m)
            powerUpActive = false
            initializeNewPiece()
            update()
            return
        }
    }

    //Do insertion
    gameBoard = gameBoard.insert(currentPiece, n, m)
    let linesRemoved = gameBoard.removeFullLines() //Remove lines, returns number of lines removed
    let numLinesRemoved = linesRemoved.length
    gatherPowerUps(linesRemoved)
    //Award more score for high combos, use triangle numbers:
    score += 100*(numLinesRemoved)*(numLinesRemoved + 1)/2
    if((level + 1) * scoreRequired <= score) { //Increase level every 500 score
        level = Math.floor(score/scoreRequired)
        //Update ticker with new tick speed
        if(!downLoop) { //If not already holding down (means it will reset automatically on release)
            clearInterval(doDownTicker)
            let tickSpeed = getTickSpeed()
            doDownTicker = setInterval(doDown, tickSpeed)
        }

    }

    //Check if this insertion goes off the screen:
    if(gameBoard.checkIfPieceIsOutside(currentPiece, n, m)) {
        stop()
    }
    if(gameState === 1) { //If game is still going, get new piece
        initializeNewPiece()
    }
    update()
}

function gatherPowerUps(linesRemoved) {
    for (let i = 0; i < linesRemoved.length; i++) { //Go through each removed line
        for (let j = 0; j < linesRemoved[i].length; j++) { //Go through each tile in the removed line
            if(linesRemoved[i][j].powerUp === "bomb") {
                bombs += 1
            }
            if(linesRemoved[i][j].powerUp === "clock") {
                clocks += 1
            }
        }
    }
}

function deployBomb() {
    if(bombs <= 0) { //Dont deploy if we dont have any left
        return
    }
    if(powerUpActive) { //Dont activate if we already have a powerup out
        return
    }
    powerUpActive = true
    bombs -= 1
    let bombPiece = Piece.getBombPiece()
    currentPiece = bombPiece
    update()
}

function activateClock() {
    if(clocks <= 0) {
        return
    }
    if(clockActive) { //Dont activate if clock already is active
        return
    }
    clockActive = true
    gameBoard.isSlowedDown = true
    clocks -= 1
    if(!downLoop) { //If not already holding down (means it will reset automatically on release)
        clearInterval(doDownTicker)
        let tickSpeed = getTickSpeed()
        doDownTicker = setInterval(doDown, tickSpeed)
    }
    setTimeout(() => { //After clockDuration, set clockActive to false and update interval
        clockActive = false
        gameBoard.isSlowedDown = false
        if(!downLoop) { //If not already holding down (means it will reset automatically on release)
            clearInterval(doDownTicker)
            let tickSpeed = getTickSpeed()
            doDownTicker = setInterval(doDown, tickSpeed)
        }
    }, clockDuration);
    update()
}

function doBombExplosion(n, m) {
    for (let i = -bombRadius; i <= bombRadius; i++) {
        for (let j = -bombRadius; j <= bombRadius; j++) {
            let tileCleared = gameBoard.clearTile(n + i, m + j)
            if(tileCleared) { //True if a solid tile was cleared
                score += 10
            }
        }    
    }
}

function doShiftPiece() {
    shiftUsed = true
    if(shiftedPiece === undefined) {
        shiftedPiece = currentPiece
        initializeNewPiece()
    } else {
        let tempPiece = shiftedPiece
        shiftedPiece = currentPiece
        currentPiece = tempPiece
        x = startX
        y = startY
    }
    rend.shiftDraw(shiftedPiece)
    update()
}

function update() {
    let shadowBoard = gameBoard.insertShadow(currentPiece, x, y)
    let finalBoard = shadowBoard.insert(currentPiece, x, y)
    rend.draw(finalBoard)
    rend.nextDraw(pieceQueue)
    rend.updateScore(score)
    rend.updateLevel(level)
    rend.updatePowerUpCounts(bombs, clocks)
}

function stop() {
    gameState = 0
    console.log("lost")
    clearInterval(doDownTicker)
    clearInterval(movementHandler)
}

start()