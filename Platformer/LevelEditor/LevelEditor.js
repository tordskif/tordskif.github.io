import Platform from "./Platform.js"

let canvas = document.getElementById("editor-canvas")
let screenWidth = document.documentElement.clientWidth
let screenHeight = document.documentElement.clientHeight
canvas.width = screenWidth*0.987
canvas.height = screenHeight*0.965
let ctx = canvas.getContext("2d")
let currentColor = "grey"
let firstX = undefined
let firstY = undefined
let platformStrings = []
let platforms = []
let platformCounter = 0
let currentMouseX = undefined
let currentMouseY = undefined
let scrollX = 0
let scrollY = 0
let playerX = 50
let playerY = 50
let playerSquare = new Platform(50,50, 32, 48, "red")
let textArea = document.getElementById("textArea")
let scale = 1

window.addEventListener("click", (e) => {
    let x = e.offsetX + scrollX
    let y = e.offsetY + scrollY
    if(firstX === undefined) {
        firstX = x
        firstY = y
    } else {
        let smallX = Math.min(firstX, x)
        let bigX = Math.max(firstX, x)
        let smallY = Math.min(firstY, y)
        let bigY = Math.max(firstY, y)
        let newPlatform = new Platform(smallX, smallY, bigX - smallX, bigY - smallY, currentColor)
        platforms.push(newPlatform)
        render()

        let platformString = getPlatformString(smallX, smallY, bigX - smallX, bigY - smallY, currentColor, platformCounter)
        platformStrings.push(platformString)
        platformCounter += 1
        firstX = undefined
        firstY = undefined
    }
})

window.addEventListener("mousemove", (e) => {
    currentMouseX = e.offsetX + scrollX
    currentMouseY = e.offsetY + scrollY
    render()
})

window.addEventListener("keydown", (e) => {
    if(e.repeat) {
        return
    }
    if(e.key === "q") {
        currentColor = "red"
        render()
    }
    if(e.key === "w") {
        currentColor = "blue"
        render()
    }
    if(e.key === "e") {
        currentColor = "green"
        render()
    }
    if(e.key === "z") {
        platforms.pop()
        platformStrings.pop()
        render()
    }
    if(e.key === "b") {
        //First change output depending on scale variable
        //That is a todo change...

        
        textArea.innerHTML = "const game = new Game("+playerX+","+ playerY+");"
        for (let i = 0; i < platformStrings.length; i++) {
            textArea.innerHTML += (platformStrings[i] + "\n")
        }
        textArea.innerHTML += "game.start();"
        textArea.style.visibility = "visible"
    }
    if(e.key === "ArrowRight") {
        scrollRight()
    }
    if(e.key === "ArrowLeft") {
        scrollLeft()
    }
    if(e.key === "ArrowDown") {
        scrollDown()
    }
    if(e.key === "ArrowUp") {
        scrollUp()
    }
    if(e.key === "p") {
        placePlayer()
        render()
    }
})

function placePlayer() {
    playerX = currentMouseX
    playerY = currentMouseY
    playerSquare = new Platform(playerX, playerY, 32, 48, "red")
}

function scalePlatforms() {
    let newPlatforms = []
    for (let i = 0; i < platforms.length; i++) {
        let platform = platforms[i];
        let newPlatform = platform.scale(scale)
        newPlatforms.push(newPlatform)
    }
    return newPlatforms
}

function render() {
    //Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //Draw all stored rectangles
    for (let i = 0; i < platforms.length; i++) {
        let platform = platforms[i]
        platform.render(ctx, scrollX, scrollY)
    }
    //Draw current if needed
    if(firstX !== undefined) {
        let tempPlatform = new Platform(firstX, firstY, currentMouseX - firstX, currentMouseY - firstY, currentColor)
        tempPlatform.render(ctx, scrollX, scrollY)
    }
    playerSquare.render(ctx, scrollX, scrollY)
}

function scrollRight() {
    scrollX += 200
    render()
}
function scrollLeft() {
    scrollX -= 200
    render()
}
function scrollUp() {
    scrollY -= 200
    render()
}
function scrollDown() {
    scrollY += 200
    render()
}

function getPlatformString(x, y, width, height, color, counter) {
    let str = "const platform"+counter+" = new Platform("+x+","+ y+"," +width+"," +height+"," +"'"+color+"'"+");"
    str += "\n"
    str += "game.level.addPlatform(platform"+counter+");"
    return str
}


//TODO: able to place goal, have goal functionality, have several levels, automatic progression to next one
//Timer, track best times
//Maybe scap the hook idea, it doesnt really work that well. put all those parts into a separate file, with comments what they did
//Or maybe just copy player and hook to somewhere before deleting those parts
//Add better color picker/maybe some textures instead to render on the objects?
//Background?
//Enemies, respawn/reset button while playing.
//Some attacks to kill enemies? Try to implement modular system?

