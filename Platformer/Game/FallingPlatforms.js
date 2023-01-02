import Game from "./Game.js"
import Platform from "./Platform.js"

let minX = 0
let midPoint = 1200
let midSpace = 5
let maxX = 1516
let platformPadding = 100

let game; //Will contain the current running game


function startFallingPlatforms() {
    game = new Game(1000,-200,"Default", 1, true, true, minX, maxX);
    const ground1 = new Platform(-platformPadding + minX,0,platformPadding + midPoint,300,'black');
    const ground2 = new Platform(midPoint+midSpace,0,maxX-(midPoint+midSpace) + platformPadding,300,'black');
    game.level.addPlatform(ground1)
    game.level.addPlatform(ground2)
    game.start();    
}


function stopFallingPlatforms() {
    game.stopGame()
}


window.addEventListener("keydown", (e) => {
    if(e.key === "e") {
        resetFallingPlatforms()
    }
})

function resetFallingPlatforms() {
    stopFallingPlatforms()
    startFallingPlatforms()
}


//Start game on load
startFallingPlatforms()


/*
const fallingBlock = new Platform(-100, 0, 1000, 50, "red", true, 1)
game.level.addPlatform(fallingBlock)
const fallingBlock2 = new Platform(-100, -2000, 1000, 50, "green", true, 20)
game.level.addPlatform(fallingBlock2)*/
