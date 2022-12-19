import Vertex from "./Vertex.js"
import Edge from "./Edge.js"

export default class Polygon {
    constructor(lineWidth = 5, color = "cyan") {
        //vertecies is a list of vertex objects, which all lie in a plane
        this.vertecies = []
        this.lineWidth = lineWidth
        this.color = color
    }

    addVertex(vertex) {
        this.vertecies.push(vertex)
    }

    getArea() { //Get area of polygon
        //Use this formula: https://www.mathopenref.com/coordpolygonarea.html, https://math.stackexchange.com/questions/3207981/how-do-you-calculate-the-area-of-a-2d-polygon-in-3d
        let totalArea = 0
        let centerPoint = this.getCenter()
        let prevVertex = undefined
        for(let i = 0; i < this.vertecies.length; i++) {
            let vertex = this.vertecies[i]
            if(prevVertex === undefined) {
                prevVertex = vertex
            } else {
                let newTriangle = new Polygon(this.lineWidth, this.color)
                newTriangle.addVertex(prevVertex)
                newTriangle.addVertex(vertex)
                newTriangle.addVertex(centerPoint)
                totalArea += this.getTriangleArea(newTriangle)
                //Update prevVertex
                prevVertex = vertex
            }
        }
        let newTriangle = new Polygon(this.lineWidth, this.color)
        newTriangle.addVertex(prevVertex)
        newTriangle.addVertex(this.vertecies[0])
        newTriangle.addVertex(centerPoint)
        totalArea += this.getTriangleArea(newTriangle)
        //Do check for last vertex compared to first one
        return totalArea
    }

    getLongestEdge() { //Get length of longest side
        let maxLength = 0
        let prevVertex = undefined
        let longestEdge = undefined
        for(let i = 0; i < this.vertecies.length; i++) {
            let vertex = this.vertecies[i]
            if(prevVertex === undefined) {
                prevVertex = vertex
            } else {
                let currentLength = this.getLength(prevVertex, vertex)
                if(currentLength > maxLength) {
                    maxLength = currentLength
                    longestEdge = new Edge(prevVertex, vertex)
                }
                //Update prevVertex
                prevVertex = vertex
            }
        }
        //Do check for last vertex compared to first one
        let currentLength = this.getLength(prevVertex, this.vertecies[0])
        if (currentLength > maxLength) {
            maxLength = currentLength
            longestEdge = new Edge(prevVertex, this.vertecies[0])
        }
        return longestEdge
    }


    getLength(vertex1, vertex2) {
        let xDist = vertex2.x - vertex1.x
        let yDist = vertex2.y - vertex1.y
        let zDist = vertex2.z - vertex1.z
        return Math.sqrt(xDist*xDist + yDist*yDist + zDist*zDist)
    }


    getTriangleArea(triangle) {
        //Triangle has 3 vertecies. Use herons formula to get area
        let a = this.getLength(triangle.vertecies[0], triangle.vertecies[1])
        let b = this.getLength(triangle.vertecies[1], triangle.vertecies[2])
        let c = this.getLength(triangle.vertecies[2], triangle.vertecies[0])
        let s = (a+b+c)/2
        let area = Math.sqrt(s*(s-a)*(s-b)*(s-c))
        return area
    }

    centerCut() {
        //Cuts polygon into triangles with centerpoint, return list of pieces
        let pieces = []
        let centerPoint =  this.getCenter()
        //Now we have centerpoint. Go through every set of 2 consecutive points, and make new triangle
        let prevVertex = undefined
        for(let i = 0; i < this.vertecies.length; i++) {
            let vertex = this.vertecies[i]
            if(prevVertex === undefined) {
                prevVertex = vertex
            } else {
                let newTriangle = new Polygon(this.lineWidth, this.color)
                newTriangle.addVertex(prevVertex)
                newTriangle.addVertex(vertex)
                newTriangle.addVertex(centerPoint)
                pieces.push(newTriangle)
                //Update prevVertex
                prevVertex = vertex
            }
        }
        let newTriangle = new Polygon(this.lineWidth, this.color)
        newTriangle.addVertex(prevVertex)
        newTriangle.addVertex(this.vertecies[0])
        newTriangle.addVertex(centerPoint)
        pieces.push(newTriangle)

        return pieces
    }

    getCenter() {
        let centerPointX = 0
        let centerPointY = 0
        let centerPointZ = 0
        let numVertecies = this.vertecies.length
        for(let i = 0; i < numVertecies; i++) {
            let vertex = this.vertecies[i]
            centerPointX += vertex.x/numVertecies
            centerPointY += vertex.y/numVertecies
            centerPointZ += vertex.z/numVertecies
        }
        let centerPoint = new Vertex(centerPointX, centerPointY, centerPointZ)
        return centerPoint
    }

    halfCut(longestEdge) {
        //We know it is a triangle, introduce the halfwaypoint on longest edge, and return the 2 new triangles
        //First identify the final vertex which is not on the edge
        let finalVertex
        if(longestEdge.t === this.vertecies[0]) {
            finalVertex = this.vertecies[1]
        }
        if(longestEdge.t === this.vertecies[1]) {
            finalVertex = this.vertecies[2]
        }
        if(longestEdge.t === this.vertecies[2]) {
            finalVertex = this.vertecies[0]
        }
        let halfPoint = longestEdge.getHalfPoint()
        let triangle1 = new Polygon(this.lineWidth, this.color)
        triangle1.addVertex(longestEdge.s)
        triangle1.addVertex(halfPoint)
        triangle1.addVertex(finalVertex)        
        let triangle2 = new Polygon(this.lineWidth, this.color)
        triangle2.addVertex(halfPoint)
        triangle2.addVertex(longestEdge.t)
        triangle2.addVertex(finalVertex)
        let triangles = [triangle1, triangle2]
        return triangles
    }
}