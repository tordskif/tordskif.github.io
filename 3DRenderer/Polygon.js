export default class Polygon {
    constructor(lineWidth = 5, color = "cyan") {
        //vertecies is a list of vertex objects, which all lie in a plane
        this.vertecies = []
        this.lineWidth = lineWidth
        this.color = color
    }
    
    translate(dx, dy, dz) {
        for(vertex in this.vertecies) {
            vertex.translate(dx, dy, dz)
        }
    }

    addVertex(vertex) {
        this.vertecies.push(vertex)
    }
}