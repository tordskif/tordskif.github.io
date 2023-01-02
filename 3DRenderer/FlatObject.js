export default class FlatObject {
    constructor() {
        //Polygons is a list of polygon objects
        this.polygons = []
        this.outlines = []
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

    addOutline(outline) {
        this.outlines.push(outline)
    }
    
    addToList(list) {
        for(let i = 0; i < this.polygons.length; i++) {
            let polygon = this.polygons[i]
            polygon.addToList(list)
        }
        //Also include outlines, so that they are depth sorted together with main polygons
        for(let i = 0; i < this.outlines.length; i++) {
            let outline = this.outlines[i]
            outline.addToList(list)
        }
    }
}