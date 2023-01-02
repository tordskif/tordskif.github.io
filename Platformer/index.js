let helpText = document.getElementById("helpText")

function function1() {
    helpText.innerHTML = `This is a basic skeleton for a platformer game. 
    <br>
    <br>
    Controls: Arrow keys
    `
    helpText.style.visibility = "visible"
}

function function2() {
    helpText.innerHTML = `This is a simple level creator for the above platforming game. Gives out code which can be pasted into platforming game file.
    <br>
    <br>
    Controls:<br>
    Platform color: QWE<br>
    Movement: Arrow keys<br>
    Place player: P<br>
    Undo: Z <br>
    Get code snippet for level: B
    `
    helpText.style.visibility = "visible"
}

function function3() {
    helpText.innerHTML = `High score platforming game with falling blocks. Try to reach as high as possible, while avoiding the rising lava.
    <br>
    <br>
    Controls: Arrow keys <br>
    Reset: E
    `
    helpText.style.visibility = "visible"
}