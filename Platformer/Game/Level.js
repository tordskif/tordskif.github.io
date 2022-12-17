export default class Level {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.platforms = [];
        //this.enemies = [];
    }

    addPlatform(platform) {
        this.platforms.push(platform);
    }

    /*addEnemy(enemy) {
        this.enemies.push(enemy);
    }*/

    update() {
        for (const platform of this.platforms) {
            //platform.update();
        }

        /*for (const enemy of this.enemies) {
            enemy.update();
        }*/
    }

    render(context, scrollX, scrollY) {
        for (const platform of this.platforms) {
            platform.render(context, scrollX, scrollY);
        }
        /*
        for (const enemy of this.enemies) {
            enemy.render(context);
        }*/
    }

    setScale(scale) {
        for (const platform of this.platforms) {
            platform.setScale(scale);
        }
    }
}
