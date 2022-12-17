import Player from "./Player.js"
import Platform from "./Platform.js"
import Level from "./Level.js"
import Game from "./Game.js"


const game = new Game(110,530);const platform0 = new Platform(23,603,1474,49,'blue');
game.level.addPlatform(platform0);
const platform1 = new Platform(1495,603,1002,49,'blue');
game.level.addPlatform(platform1);
const platform2 = new Platform(2496,605,1225,29,'blue');
game.level.addPlatform(platform2);
const platform3 = new Platform(664,180,46,427,'blue');
game.level.addPlatform(platform3);
const platform4 = new Platform(-610,46,1016,42,'red');
game.level.addPlatform(platform4);
const platform5 = new Platform(1227,-3,1014,39,'red');
game.level.addPlatform(platform5);
const platform6 = new Platform(2710,4,1736,43,'red');
game.level.addPlatform(platform6);
const platform7 = new Platform(3718,333,775,297,'red');
game.level.addPlatform(platform7);
const platform8 = new Platform(4954,-26,86,1204,'red');
game.level.addPlatform(platform8);
const platform9 = new Platform(13,1095,4941,83,'green');
game.level.addPlatform(platform9);
const platform10 = new Platform(-274,283,62,892,'red');
game.level.addPlatform(platform10);
game.start();
