export default class FlatPolygon {
    constructor(lineWidth, color) {
        //vertecies is a list of flatVertex objects
        this.vertecies = []
        this.lineWidth = lineWidth
        this.color = color
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
        context.fillStyle = "black"
        context.beginPath()
        context.moveTo(this.vertecies[0].x, this.vertecies[0].y) //Start at first vertex
        for(let i = 0; i < this.vertecies.length; i++) {
            let vertex = this.vertecies[i]
            console.log(vertex)
            context.lineTo(vertex.x, vertex.y)
        }
        context.closePath()
        context.lineWidth = this.lineWidth
        context.stroke()
        context.fillStyle = this.color
        context.fill()
    }
}