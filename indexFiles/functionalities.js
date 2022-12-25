let helpText = document.getElementById("helpText")

function function1() {
    helpText.innerHTML = `This is an attempt at rendering a 3D scene from the perspective of a movable "camera", using only a 2D canvas and some math. 
    <br>
    <br>
    Controls: <br>
    Move horizontally: WASD <br>
    Move vertically: Shift/Spacebar <br> 
    Enable camera rotation: Mouse click
    `
    helpText.style.visibility = "visible"
}

function function2() {
    helpText.innerHTML = `This is an implementation of the game "Connect Four" where you play against the computer. 
    The computer uses an algorithm based on the minimax concept, to determine its next move. 
    <br>
    <br>
    Controls: <br>
    Place piece: Mouse click
    `
    helpText.style.visibility = "visible"
}

function function3() {
    helpText.innerHTML = `This is a basic skeleton for a platformer game, with some experimental physics elements, including friction, wall jumps and momentum direction conversion. 
    <br>
    <br>
    Controls: Arrow keys
    `
    helpText.style.visibility = "visible"
}

function function4() {
    helpText.innerHTML = `This is a simple level creator for the above platforming game. Gives out code which can be pasted into platforming game file.
    <br>
    <br>
    Controls:<br>
    Platform color: QWE<br>
    Movement: Arrow keys<br>
    Place player: P<br>
    Get code snippet for level: B
    `
    helpText.style.visibility = "visible"
}

function function5() {
    helpText.innerHTML = `This is an implementation of Tetris, with some experimental powerups added. Clear lines with powerup blocks to be able to deploy them later.
    <br>
    <br>
    Controls:<br>
    Movement: Arrow keys<br>
    Drop piece: Spacebar<br>
    Shift piece: Shift<br>
    Deploy Bomb: Q<br>
    Slow time: W
    `
    helpText.style.visibility = "visible"
}