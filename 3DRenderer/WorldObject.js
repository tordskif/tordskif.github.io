export default class WorldObject {
    constructor() {
        //Polygons is a list of polygon objects
        this.polygons = []
    }

    translate(dx, dy, dz) {
        for(polygon in this.polygons) {
            polygon.translate(dx, dy, dz)
        }
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
            if(longestEdge.getLength() > 1) {
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