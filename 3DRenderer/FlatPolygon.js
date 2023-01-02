export default class FlatPolygon {
    constructor(lineWidth = 1, color = "grey") {
        //vertecies is a list of flatVertex objects
        this.vertecies = []
        this.lineWidth = lineWidth
        this.color = color
        this.justOutline = false
    }
    
    translate(dx, dy) {
        for(vertex in this.vertecies) {
            vertex.translate(dx, dy)
        }
    }

    addVertex(vertex) {
        this.vertecies.push(vertex)
    }

    render(context) {
        context.fillStyle = this.color
        context.beginPath()
        context.moveTo(this.vertecies[0].x, this.vertecies[0].y) //Start at first vertex
        for(let i = 0; i < this.vertecies.length; i++) {
            let vertex = this.vertecies[i]
            context.lineTo(vertex.x, vertex.y)
        }
        context.closePath()
        context.lineWidth = 1
        context.strokeStyle = "black"
        if(this.justOutline) {
            //context.stroke()
            //context.fill()
        } else {  
            context.stroke()  
            context.fill()
        }
        //Addsome way to draw the "true" outline border, and not all the interior triangles...
    }

    addToList(list) {
        list.push(this)
    }
    
    //Return average depth of vertecies
    getAverageDepth() {
        let average = 0
        let numVertecies = this.vertecies.length
        for(let i = 0; i < numVertecies; i++) {
            let vertex = this.vertecies[i]
            average += vertex.depth/numVertecies
        }
        return average
    }
}