import Player from "./Player.js"
import Level from "./Level.js"
import Hook from "./Hook.js"
import Platform from "./Platform.js";
import Lava from "./Lava.js";

export default class Game {
    constructor(playerX, playerY, physicsPreset = "Default", scale = 1, haveFallingPlatforms = false, screenWrap = false, minX = 0, maxX = 1500) {
        this.canvas = document.getElementById("game-canvas");
        this.initializeCanvas()
        this.context = this.canvas.getContext("2d");
    
        this.backGroundImage = new Image
        this.backGroundImage.src = "./background.png"

        this.score = document.getElementById("score")
        this.endScreen = document.getElementById("endScreen")

        this.level = new Level(2000, 2000);
        
        this.playerStartX = playerX
        this.playerStartY = playerY
        this.player = new Player(this.playerStartX, this.playerStartY);
        this.hook = new Hook(400,Math.PI/6, 20, 0.003)
        this.addHookToPlayer(this.hook, this.player)
        this.currentLevel = 0;
        //this.levels = [level1, level2, level3];
        this.running = false;
        this.paused = false;
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.gameTick = 0

        this.scrollX = 0
        this.scrollY = 0

        this.physicsPreset = physicsPreset
        this.scale = scale

        this.haveFallingPlatforms = haveFallingPlatforms
        this.screenWrap = screenWrap
        //Some variables for random generation of falling platforms: (fp prefix for "Falling Platform")
        this.fpMinX = minX //Also use this for screenwrap purposes
        this.fpMaxX = maxX
        this.fpMinWidth = 80
        this.fpMaxWidth = 250
        this.fpMinVy = 2
        this.fpMaxVy = 5
        this.fpMinTimeout = 1000
        this.fpMaxTimeout = 2500
        this.fpStartHeight = 300
        this.maxAchievedHeight = undefined //Keep track of max height achieved, both for scoring, and where to spawn new blocks

        this.lava = new Lava(minX,300,maxX-minX, 0.45)
    }

    initializeCanvas() {
        let screenWidth = document.documentElement.clientWidth
        let screenHeight = document.documentElement.clientHeight
        this.canvas.width = screenWidth*0.987
        this.canvas.height = screenHeight*0.965
    }

    addHookToPlayer(hook, player) {
        hook.addPlayer(player)
        player.addHook(hook)
    }

    doScaling() {
        this.player.setScale(this.scale)
        this.level.setScale(this.scale)
        this.lava.setScale(this.scale)
        this.setScaleOfRest(this.scale)
    }

    setScaleOfRest(scale) {
        this.fpMinX *= scale
        this.fpMaxX *= scale
        this.fpMinWidth *= scale
        this.fpMaxWidth *= scale
        this.fpMinVy *= scale
        this.fpMaxVy *= scale
        this.fpStartHeight *= scale
    }

    start() {
        //Initialize physics variables using preset
        this.player.setPreset(this.physicsPreset)
        //Initialize scaling
        this.doScaling()
        this.maxAchievedHeight = this.player.y

        // Listen for keydown and keyup events on the window object
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);

        if(this.haveFallingPlatforms) {
            this.generateFallingPlatforms() //Have this as a self referential loop, with a random timeout for when to trigger agian
        }

        //Hide end screen
        this.endScreen.style.visibility = "hidden"

        //Start main loop
        this.running = true;
        this.paused = false;
        this.mainLoop();
    }

    pause() {
        this.paused = true;
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('keyup', this.handleKeyUp);
    }

    stopGame() {
        this.running = false
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('keyup', this.handleKeyUp);
        this.endScreen.style.visibility = "visible"
        this.endScreen.innerHTML = "You died. Your score was " + Math.floor(-this.maxAchievedHeight/this.scale)/10 + ", press e to try again."
    }

    showEndScreen() {
        //Stop game
        this.running = false
        //Show score and inform to press e to reset
        //this.endScreen.style.visibility = "visble"
        //this.endScreen.innerHTML = "You died. Your score was " + Math.floor(-this.maxAchievedHeight/this.scale)/10 + ", press e to try again."
    }

    mainLoop() {
        if (!this.running || this.paused) {
            return;
        }
        this.gameTick += 1
        // Update game state
        this.level.update();
        this.player.update();
        this.hook.update();
        if(this.haveFallingPlatforms) {
            this.lava.update()
            if(this.player.y < this.maxAchievedHeight) { //Update scoring
                this.maxAchievedHeight = this.player.y
            }
            this.score.innerHTML = Math.floor(-this.maxAchievedHeight/this.scale)/10
        }

        //Check if player is too far up/down/left/right, move scroll
        this.doScroll();

        //If screenwrap is on, do screenwrap check:
        if(this.screenWrap) {
            this.checkScreenWrap()
        }

        // Check for collisions and other game events
        this.checkCollisions();
        this.checkForDeath();
        //this.checkVictory();

        // Render game
        this.render()

        // Request next frame
        requestAnimationFrame(() => this.mainLoop());
    }

    render() {
        this.drawBackground()
        this.player.render(this.context, this.scrollX, this.scrollY);
        this.hook.render(this.context, this.scrollX, this.scrollY)
        if(this.haveFallingPlatforms) {
            this.lava.render(this.context, this.scrollX, this.scrollY)
        }
        this.level.render(this.context, this.scrollX, this.scrollY);
    }

    drawBackground() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        let xTilesNeeded = Math.ceil(this.canvas.width/this.backGroundImage.width)
        let xStartTile = Math.ceil(this.scrollX/this.backGroundImage.width) - 1
        let xEndTile = xStartTile + xTilesNeeded + 1 
        for (let x = xStartTile; x < xEndTile; x += 1) {
            //Have to be a bit more careful about the height, to get the correct repeating pattern
            //Figure out the appropriate "tiles" to draw, depending on scrollY, imgheight, and canvasheight
            let yTilesNeeded = Math.ceil(this.canvas.height/this.backGroundImage.height)
            let yStartTile = Math.ceil(this.scrollY/this.backGroundImage.height) - 1 //Highest tile
            //Using scrollY, find out what yStartTile should be
            let yEndTile = yStartTile + yTilesNeeded + 1 //Lowest tile
            for (let y = yStartTile; y < yEndTile; y += 1) {
                let xDraw = x*this.backGroundImage.width - this.scrollX
                let yDraw = y*this.backGroundImage.height - this.scrollY
                this.context.drawImage(this.backGroundImage, xDraw, yDraw);
            }
        }
        //this.context.drawImage(this.backGroundImage, this.scrollX, -1000-this.scrollY)
    }

    generateFallingPlatforms() {
        //Generate random values:
        let width = Math.floor(Math.random()*(this.fpMaxWidth-this.fpMinWidth)) + this.fpMinWidth
        //x go from MinX, to MaxX-width
        let x = Math.floor(Math.random()*((this.fpMaxX-width)-this.fpMinX)) + this.fpMinX
        let vy = Math.floor(Math.random()*(this.fpMaxVy-this.fpMinVy)) + this.fpMinVy
        let y = this.maxAchievedHeight - this.fpStartHeight*this.scale - width //Have platforms spawn some height above max achieved height
        let randomColor = "#" + Math.floor(Math.random()*16777215).toString(16);
        let randomTimeout = Math.floor(Math.random()*(this.fpMaxTimeout-this.fpMinTimeout))+this.fpMinTimeout
        //Take into account x/y values are top left of platforms, do some adjustments because of this

        //Create new platform
        let newPlatform = new Platform(x, y, width, width, randomColor, true, vy)
        this.level.addPlatform(newPlatform)
        //this.generateFallingPlatforms()
        setTimeout(() => {
            this.generateFallingPlatforms()
        }, randomTimeout);

    }

    handleKeyDown(event) {
        if(event.repeat) {
            return
        }
        // Handle keydown events here
        this.player.handleDownInput(event.key);
    }

    handleKeyUp(event) {
        // Handle keyup events here
        this.player.handleUpInput(event.key);
    }

    doScroll() {
        if (!this.screenWrap) {
            while (this.player.x - this.scrollX > this.canvas.width * 0.6) { //Right side
                this.scrollX += 1
            }
        }
        if(!this.screenWrap) {
            while(this.player.x - this.scrollX < this.canvas.width*0.4) { //Left side
                this.scrollX -= 1
            }
        }
        
        while(this.player.y - this.scrollY > this.canvas.height*0.6) { //Bot side
            this.scrollY += 1
        }
        while(this.player.y - this.scrollY < this.canvas.height*0.5) { //Top side
            this.scrollY -= 1
        }
    }

    checkScreenWrap() {
        if(this.player.x + this.player.width < this.fpMinX) {
            this.player.x = this.fpMaxX
        }
        if(this.player.x > this.fpMaxX) {
            this.player.x = this.fpMinX
        }
    }

    checkCollisions() {
        // Check for collisions between the player and platforms
        let didMakeGrounded = false
        let didTouchWall = false
        let didTouchCeiling = false
        for (const platform of this.level.platforms) { 
            if (this.player.x <= platform.x + platform.width &&
                this.player.x + this.player.width >= platform.x &&
                this.player.y <= platform.y + platform.height &&
                this.player.y + this.player.height >= platform.y) {
                // Collision detected
                let collisionDirection = this.player.unCollide(platform)
                if(collisionDirection === "bot") {
                    didMakeGrounded = true
                }
                if(collisionDirection === "top") {
                    didTouchCeiling = true
                }
                if(collisionDirection === "left" || collisionDirection === "right") {
                    didTouchWall = true
                }
            }
        }
        //All of the three below really dont check if that specific condition happened, just that SOME collision happened. Does this logic hold up? 
        if(!didMakeGrounded) {
            this.player.grounded = false;
        }
        if(!didTouchWall) {
            this.player.onRightWall = false
            this.player.onLeftWall = false
        }
        if(!didTouchCeiling) {
            this.player.ceilinged = false
        }
        if(this.hook.deployed) {
            for (const platform of this.level.platforms) { 
                if (this.hook.x <= platform.x + platform.width &&
                    this.hook.x >= platform.x &&
                    this.hook.y <= platform.y + platform.height &&
                    this.hook.y >= platform.y) {
                    // Collision detected
                    this.hook.handleCollision(platform)
                }
            }
        }
        //Check for collisions between hook and platforms:


        // Check for collisions between the player and enemies
        /*
        for (const enemy of this.level.enemies) {
            if (this.player.x < enemy.x + enemy.width &&
                this.player.x + this.player.width > enemy.x &&
                this.player.y < enemy.y + enemy.height &&
                this.player.y + this.player.height > enemy.y) {
                // Collision detected
                this.player.die();
                break;
            }
        }*/
        //Check for collisions between falling platforms and other platforms:
        for (const fallingPlatform of this.level.platforms) {
            if(fallingPlatform.isFalling) { //If it is falling, compare against all other platforms:
                for(const otherPlatform of this.level.platforms) {
                    if(otherPlatform !== fallingPlatform) { //Dont compare against itself
                        if (fallingPlatform.x <= otherPlatform.x + otherPlatform.width &&
                            fallingPlatform.x + fallingPlatform.width >= otherPlatform.x &&
                            fallingPlatform.y <= otherPlatform.y + otherPlatform.height &&
                            fallingPlatform.y + fallingPlatform.height >= otherPlatform.y) {
                            // Collision detected
                            if(!otherPlatform.isFalling) { //If colliding into a still platform, rest
                                fallingPlatform.isFalling = false
                                fallingPlatform.vy = 0
                                fallingPlatform.unCollide(otherPlatform)
                            } else { //Else, match speed of the lowest platform
                                if(fallingPlatform.y < otherPlatform.y) { //Check which has greater y value, and let speed of furthest up one match the lower ones
                                    fallingPlatform.vy = otherPlatform.vy
                                    fallingPlatform.unCollide(otherPlatform)
                                }
                            }
                            //Have specific uncollide behaviour here
                        }
                    }
                }
            }
        }
    }
    
    checkForDeath() {
        if(!this.haveFallingPlatforms) {
            return
        }
        //Check for squish
        let squishPlatform = this.player.checkForDeath() //Returns platform which squishes if there is one
        if(squishPlatform !== undefined) {
            console.log("squish")
            this.stopGame()
            this.playSquishAnimation(squishPlatform)
        }
        //Check for hitting lava:
        if(this.player.y + this.player.height > this.lava.y) {
            console.log("lava")
            this.stopGame()
            this.playSinkAnimation()
        }
    }

    playSquishAnimation(platform) {
        if(this.player.height > 0) { //If player is not fully squished, keep updating platform until it completely squishes player   
            this.level.update() //Make platform move still
            this.lava.update() //Updata lava as well, why not
            let yChange = this.player.y - (platform.y + platform.height)
            this.player.y = platform.y + platform.height
            this.player.height += yChange
            this.player.x += yChange/2
            this.player.width -= yChange
            this.render()
            requestAnimationFrame(() => this.playSquishAnimation(platform))
        } else {
            this.showEndScreen()
        }
    }

    playSinkAnimation() {
        if(this.player.y < this.lava.y) {
            this.player.y += 0.6
            this.render()
            requestAnimationFrame(() => this.playSinkAnimation())
        } else {
            this.showEndScreen()
        }
    }

    checkVictory() {
        // Check if the player has reached the end of the level
        if (this.player.x > this.level.width) {
            this.currentLevel++;
            if (this.currentLevel >= this.levels.length) {
                // Player has completed all levels
                this.win();
            } else {
                // Load next level
                this.level = this.levels[this.currentLevel];
                this.player.x = 0;
            }
        }
    }

    win() {
        this.running = false;
        this.displayWinScreen();
    }
}