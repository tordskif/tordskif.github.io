import Vertex from "./Vertex.js"
import Polygon from "./Polygon.js"
import WorldObject from "./WorldObject.js"
import Scene from "./Scene.js"
import Camera from "./Camera.js"

let camera = new Camera(-10,0,1)
let scene = new Scene()

let cube = new WorldObject()
for (let i = 0; i <= 1; i++) {
    let newPolygon = new Polygon(1 , "magenta")
    for (let j = 1; j >= 0; j--) {
        for (let k = 0; k <= 1; k++) {
            let newVertex = new Vertex(i-2,j,k+2)
            newPolygon.addVertex(newVertex)
        }
    }
    cube.addPolygon(newPolygon)
}
scene.addObject(cube)
 
let cube2 = new WorldObject()
for (let i = 0; i <= 2; i++) {
    let newPolygon = new Polygon(1, "red")
    for (let j = 0; j <= 1; j++) {
        for (let k = 0; k <= 1; k++) {
            if(k+j === 2) {
                continue
            }
            let newVertex = new Vertex(i*3,j+2,k+4)
            newPolygon.addVertex(newVertex)
        }
    }
    cube.addPolygon(newPolygon)
}
scene.addObject(cube2)

let squareObject = new WorldObject()
let squarePolygon = new Polygon(1, "blue")
let vertex1 = new Vertex(0, -1, -1)
let vertex2 = new Vertex(0, -1, 1)
let vertex3 = new Vertex(0, 1, 1)
let vertex4 = new Vertex(0, 1, -1)
squarePolygon.addVertex(vertex1)
squarePolygon.addVertex(vertex2)
squarePolygon.addVertex(vertex3)
squarePolygon.addVertex(vertex4)

squareObject.addPolygon(squarePolygon)
scene.addObject(squareObject)

let new_squareObject = new WorldObject()
let new_squarePolygon = new Polygon(1, "cyan")
let new_vertex1 = new Vertex(-2, 3, 2)
let new_vertex2 = new Vertex(-1, 3, 2)
let new_vertex3 = new Vertex(-1, 3, -2)
let new_vertex4 = new Vertex(-2, 3, -2)
new_squarePolygon.addVertex(new_vertex1)
new_squarePolygon.addVertex(new_vertex2)
new_squarePolygon.addVertex(new_vertex3)
new_squarePolygon.addVertex(new_vertex4)

new_squareObject.addPolygon(new_squarePolygon)
scene.addObject(new_squareObject)

let newer_squareObject = new WorldObject()
let newer_squarePolygon = new Polygon(1, "grey")
let newer_vertex1 = new Vertex(-10, -10, -4)
let newer_vertex2 = new Vertex(-10, 10, -4)
let newer_vertex3 = new Vertex(10, 10, -4)
let newer_vertex4 = new Vertex(10, -10, -4)
newer_squarePolygon.addVertex(newer_vertex1)
newer_squarePolygon.addVertex(newer_vertex2)
newer_squarePolygon.addVertex(newer_vertex3)
newer_squarePolygon.addVertex(newer_vertex4)

newer_squareObject.addPolygon(newer_squarePolygon)
scene.addObject(newer_squareObject)



camera.addScene(scene)
camera.renderScene(scene)
camera.start()