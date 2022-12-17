import Player from "./Player.js"
import Level from "./Level.js"

export default class Game {
    constructor() {
        this.canvas = document.getElementById("game-canvas");
        this.context = this.canvas.getContext("2d");
        this.player;// = new Player(50, 50);
        this.level = new Level(2000, 2000);
        this.currentLevel = 0;
        //this.levels = [level1, level2, level3];
        this.running = false;
        this.paused = false;
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.gameTick = 0
    }

    start() {
        // Listen for keydown and keyup events on the window object
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);

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

    stop() {

        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('keyup', this.handleKeyUp);
    }

    mainLoop() {
        if (!this.running || this.paused) {
            return;
        }
        this.gameTick += 1
        // Update game state
        this.player.update();
        this.level.update();

        // Render game
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.player.render(this.context);
        this.level.render(this.context);

        // Check for collisions and other game events
        this.checkCollisions();
        this.checkVictory();

        // Request next frame
        requestAnimationFrame(() => this.mainLoop());
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

    checkCollisions() {
        // Check for collisions between the player and platforms
        let didMakeGrounded = false
        let didTouchWall = false
        for (const platform of this.level.platforms) { 
            if (this.player.x <= platform.x + platform.width &&
                this.player.x + this.player.width >= platform.x &&
                this.player.y <= platform.y + platform.height &&
                this.player.y + this.player.height >= platform.y) {
                // Collision detected
                this.player.unCollide(platform)
                didMakeGrounded = true
                didTouchWall = true
            }
        }
        if(!didMakeGrounded) {
            this.player.grounded = false;
        }
        if(!didTouchWall) {
            this.player.onRightWall = false
            this.player.onLeftWall = false
        }

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