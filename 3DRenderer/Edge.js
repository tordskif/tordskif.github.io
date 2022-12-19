import Vertex from "./Vertex.js"

export default class Edge {
    constructor(s, t) {
        //s and t are start and end vertecies
        this.s = s
        this.t = t
    }

    getLength() {
        let xDist = this.t.x - this.s.x
        let yDist = this.t.y - this.s.y
        let zDist = this.t.z - this.s.z
        return Math.sqrt(xDist*xDist + yDist*yDist + zDist*zDist)
    }

    getHalfPoint() {
        let x = (this.s.x + this.t.x)/2
        let y = (this.s.y + this.t.y)/2
        let z = (this.s.z + this.t.z)/2
        let halfPoint = new Vertex(x,y,z)
        return halfPoint
    }
}