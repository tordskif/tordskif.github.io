function setup() {
    let divFig1 = document.getElementById("fig1");
    let divBoks = document.getElementById("boks1");

    let moveFrames = [
        { left: "0px" },
        { left: "800px" }
    ];
    let moveSettings = {
        duration: 6000,
        iterations: 1,
        fill: "forwards"
    }

    let move1 = divFig1.animate(moveFrames, moveSettings);

    let stepFrames = [
        { backgroundPositionX: "0px" },
        { backgroundPositionX: "-894px" }
    ];
    let stepSettings = {
        duration: 800,
        iterations: Infinity,
        easing: "steps(8)"
    }

    let step = divFig1.animate(stepFrames, stepSettings);

    move1.onfinish = ferdigMove;

    function ferdigMove(e) {
        step.cancel();
        divFig1.style.backgroundPositionY = "calc( -112px * 8 - 12px )";
        stepSettings.iterations = 1;
        let bend = divFig1.animate(stepFrames, stepSettings);
        let lift = divBoks.animate(liftFrames, liftSettings);
        lift.onfinish = gaaTilbake;
    }

    let liftFrames = [
        { top: "475px" },
        { top: "440px" }
    ];
    let liftSettings = {
        duration: 500,
        delay: 470,
        iterations: 1,
        easing: "ease-out",
        fill: "forwards"
    }
    function gaaTilbake() {
        divBoks.parentNode.removeChild(divBoks);
        let divBoks2 = document.getElementById("boks2");
        divBoks2.style.opacity = 1;
        divFig1.style.transform = "scaleX(-1)";
        divFig1.style.backgroundPositionY = "calc( -112px * 2 - 12px )";
        stepSettings.iterations = Infinity;
        let stepBack = divFig1.animate(stepFrames, stepSettings);
        moveFrames = [
            { left: "800px" },
            { left: "0px" }
        ];
        moveSettings.delay = 300;
        let moveBack = divFig1.animate(moveFrames, moveSettings);
        moveBack.onfinish = ferdigTilbake;
        function ferdigTilbake() {
            stepBack.cancel();
        }
    }
}