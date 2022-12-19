export default class Vertex {
    constructor(x,y,z) {
        this.x = x
        this.y = y
        this.z = z
        this.lastTranslationId = undefined
    }

    translate(dx, dy, dz, id) {
        if(id !== this.lastTranslationId) {
            this.x += dx
            this.y += dy
            this.z += dz
            this.lastTranslationId = id
        }
    }
}