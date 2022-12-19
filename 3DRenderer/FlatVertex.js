export default class FlatVertex {
    constructor(x,y) {
        this.x = x
        this.y = y
    }

    translate(dx, dy) {
        this.x += dx
        this.y += dy
    }
}