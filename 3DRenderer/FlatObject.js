export default class FlatObject {
    constructor() {
        //Polygons is a list of polygon objects
        this.polygons = []
    }

    translate(dx, dy, dz) {
        for(let polygon in this.polygons) {
            polygon.translate(dx, dy, dz)
        }
    }

    render(context) {
        for(let i = 0; i < this.polygons.length; i++) {
            let polygon = this.polygons[i]
            polygon.render(context)
        }
    }

    addPolygon(polygon) {
        this.polygons.push(polygon)
    }
    
    addToList(list) {
        for(let i = 0; i < this.polygons.length; i++) {
            let polygon = this.polygons[i]
            polygon.addToList(list)
        }
    }
}