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
        this.polygons.push(polygon)
    }
}