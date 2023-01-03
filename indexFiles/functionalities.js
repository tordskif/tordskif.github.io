let helpText = document.getElementById("helpText")

function function1() {
    helpText.innerHTML = `This is an attempt at basic rendering of a 3D scene from the perspective of a movable "camera", using a 2D canvas and a perspective projection. 
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
    The computer uses an algorithm based on the minimax concept, to determine its best next move. 
    <br>
    <br>
    Controls: <br>
    Place piece: Mouse click
    `
    helpText.style.visibility = "visible"
}

function function3() {
    helpText.innerHTML = `Some projects based on an implementation of a basic platforming engine`
    helpText.style.visibility = "visible"
}

function function4() {
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