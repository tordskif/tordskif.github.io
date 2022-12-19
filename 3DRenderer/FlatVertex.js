export default class FlatVertex {
    constructor(x,y, depth) {
        this.x = x
        this.y = y
        this.depth = depth
    }

    translate(dx, dy) {
        this.x += dx
        this.y += dy
    }
}