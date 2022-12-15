//bool isSolid: true if tile is solid, false if background/empty tile.
//string color: hex/color name to determine color of said tile
export default class Tile {
    constructor(isSolid, color) {
        this.isSolid = isSolid
        this.color = color
        this.isShadow = false
        this.powerUp = "none"
        this.activePowerUp = "none"
    }
}