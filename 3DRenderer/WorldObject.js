export default class WorldObject {
    constructor() {
        //Polygons is a list of polygon objects
        this.polygons = []
        this.translationId = 0
        this.maxTriangleLength = 2 //0.3 is basically the lowest i can go, it gets super laggy
    }

    translate(dx, dy, dz) {
        for(let i = 0; i < this.polygons.length; i++) {
            let polygon = this.polygons[i]
            polygon.translate(dx, dy, dz, this.translationId) //Include translationId as an identifier that same vertex isnt translated multiple times 
        }
        this.translationId += 1
    }

    addPolygon(polygon) {
        //Check if polygon is too large, if so, recursively cut it up into triangles untill it is small enough
        if(polygon.vertecies.length > 3) { //if not a triangle, cut it into triangles using centercut
            let pieces = polygon.centerCut()
            for(let i = 0; i < pieces.length; i++) {
                let piece = pieces[i]
                this.addPolygon(piece)
            }
        } else { //Is a triangle, check if it has a long side:
            let longestEdge = polygon.getLongestEdge()
            if(longestEdge.getLength() > this.maxTriangleLength) {
                let pieces = polygon.halfCut(longestEdge)
                for(let i = 0; i < pieces.length; i++) {
                    let piece = pieces[i]
                    this.addPolygon(piece)
                }
            } else {
                this.polygons.push(polygon)
            }
        }
    }
}