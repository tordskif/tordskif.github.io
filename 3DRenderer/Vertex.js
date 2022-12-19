export default class Vertex {
    constructor(x,y,z) {
        this.x = x
        this.y = y
        this.z = z
    }

    translate(dx, dy, dz) {
        this.x += dx
        this.y += dy
        this.z += dz
    }
}