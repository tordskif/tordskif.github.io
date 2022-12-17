import Player from "./Player.js"
import Platform from "./Platform.js"
import Level from "./Level.js"
import Game from "./Game.js"


const game = new Game();

const platform1 = new Platform(0, 300, 700, 50);
const platform2 = new Platform(500, 250, 100, 50, "yellow");
const platform3 = new Platform(100, 200, 200, 50, "purple");
const platform4 = new Platform(0, 500, 700, 50, "cyan");
const platform5 = new Platform(150, 250, 50, 250, "red");
const platform6 = new Platform(800, 200, 10, 500, "blue");


game.level.addPlatform(platform1);
game.level.addPlatform(platform2);
game.level.addPlatform(platform3);
game.level.addPlatform(platform4);
game.level.addPlatform(platform5);
game.level.addPlatform(platform6);

game.player = new Player(200, 50);
game.start();