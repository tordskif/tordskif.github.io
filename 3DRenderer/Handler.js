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
for (let i = 0; i <= 0; i++) {
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
    cube2.addPolygon(newPolygon)
}
scene.addObject(cube2)

//cube2.translate(1,0,0)

let cube3 = new WorldObject()
for (let i = 0; i <= 0; i++) {
    let newPolygon = new Polygon(1, "yellow")
    for (let j = 0; j <= 1; j++) {
        for (let k = 0; k <= 1; k++) {
            if(k+j === 2) {
                continue
            }
            let newVertex = new Vertex(i*3,j+2,k+4)
            newPolygon.addVertex(newVertex)
        }
    }
    cube3.addPolygon(newPolygon)
}
scene.addObject(cube3)

cube3.translate(1,0,0)

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

squareObject.translate(0.2,0,0)
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
let newer_vertex1 = new Vertex(-3, -3, -4)
let newer_vertex2 = new Vertex(-3, 3, -4)
let newer_vertex3 = new Vertex(3, 3, -4)
let newer_vertex4 = new Vertex(3, -3, -4)
newer_squarePolygon.addVertex(newer_vertex1)
newer_squarePolygon.addVertex(newer_vertex2)
newer_squarePolygon.addVertex(newer_vertex3)
newer_squarePolygon.addVertex(newer_vertex4)

newer_squareObject.addPolygon(newer_squarePolygon)
scene.addObject(newer_squareObject)

newer_squareObject.translate(0,30,-2)
newer_squareObject.translate(0,-20, 0)

let newerer_squareObject = new WorldObject()
let newerer_squarePolygon = new Polygon(1, "grey")
let newerer_vertex1 = new Vertex(-3.5, -3.5, -4)
let newerer_vertex2 = new Vertex(-3.5, 3.5, -4)
let newerer_vertex3 = new Vertex(3.5, 3.5, -4)
let newerer_vertex4 = new Vertex(3.5, -3.5, -4)
newerer_squarePolygon.addVertex(newerer_vertex1)
newerer_squarePolygon.addVertex(newerer_vertex2)
newerer_squarePolygon.addVertex(newerer_vertex3)
newerer_squarePolygon.addVertex(newerer_vertex4)

newerer_squareObject.addPolygon(newerer_squarePolygon)
scene.addObject(newerer_squareObject)


let tetrahedronMatrix = [1,  1,  1,   -1,  1, -1,    1, -1, -1,
-1,  1, -1,   -1, -1,  1,    1, -1, -1,
 1,  1,  1,    1, -1, -1,   -1, -1,  1,
 1,  1,  1,   -1, -1,  1,   -1,  1, -1,]
let tetrahedron = handleEdgeMatrix(tetrahedronMatrix, 3, 0, 0, 0 , "yellow")
scene.addObject(tetrahedron)
tetrahedron.translate(0,-4,0)

let phi = (1+Math.sqrt(5))/2

let a = Math.sqrt(2)/2
let b = 1
let octahedronString = "-a  0  a   -a  0 -a    0  b  0 -a  0 -a    a  0 -a    0  b  0 a  0 -a    a  0  a    0  b  0 a  0  a   -a  0  a    0  b  0 a  0 -a   -a  0 -a    0 -b  0 -a  0 -a   -a  0  a    0 -b  0 a  0  a    a  0 -a    0 -b  0 -a  0  a    a  0  a    0 -b  0"
let octahedronMatrix = handleMatrixString(octahedronString)
let octahedron = handleEdgeMatrix(octahedronMatrix, 3, a, b, 0 , "red")
octahedron.translate(0,-8,0)
scene.addObject(octahedron)

let hexahedronString = "-1 -1 -1    1 -1 -1    1 -1  1   -1 -1  1 -1 -1 -1   -1 -1  1   -1  1  1   -1  1 -1 -1 -1  1    1 -1  1    1  1  1   -1  1  1 -1  1 -1   -1  1  1    1  1  1    1  1 -1 1 -1 -1    1  1 -1    1  1  1    1 -1  1 -1 -1 -1   -1  1 -1    1  1 -1    1 -1 -1"
let hexahedronMatrix = handleMatrixString(hexahedronString)
let hexahedron = handleEdgeMatrix(hexahedronMatrix, 4, 0, 0, 0, "blue")
hexahedron.translate(0,-12,0)
scene.addObject(hexahedron)

let icosahedronString = `0  b -a    b  a  0   -b  a  0 0  b  a   -b  a  0    b  a  0 0  b  a    0 -b  a   -a  0  b 0  b  a    a  0  b    0 -b  a 0  b -a    0 -b -a    a  0 -b 0  b -a   -a  0 -b    0 -b -a 0 -b  a    b -a  0   -b -a  0 0 -b -a   -b -a  0    b -a  0 -b  a  0   -a  0  b   -a  0 -b -b -a  0   -a  0 -b   -a  0  b b  a  0    a  0 -b    a  0  b b -a  0    a  0  b    a  0 -b 0  b  a   -a  0  b   -b  a  0 0  b  a    b  a  0    a  0  b 0  b -a   -b  a  0   -a  0 -b 0  b -a    a  0 -b    b  a  0 0 -b -a   -a  0 -b   -b -a  0 0 -b -a    b -a  0    a  0 -b 0 -b  a   -b -a  0   -a  0  b 0 -b  a    a  0  b    b -a  0`
let icosahedronMatrix = handleMatrixString(icosahedronString)
a = 1
b = 1/(phi)
let icosahedron = handleEdgeMatrix(icosahedronMatrix, 3, a, b, 0, "cyan")
icosahedron.translate(0,-16,0)
scene.addObject(icosahedron)

let dodecahedronString = " c  0  1   -c  0  1   -b  b  b    0  1  c    b  b  b -c  0  1    c  0  1    b -b  b    0 -1  c   -b -b  b  c  0 -1   -c  0 -1   -b -b -b    0 -1 -c    b -b -b -c  0 -1    c  0 -1    b  b -b    0  1 -c   -b  b -b  0  1 -c    0  1  c    b  b  b    1  c  0    b  b -b  0  1  c    0  1 -c   -b  b -b   -1  c  0   -b  b  b  0 -1 -c    0 -1  c   -b -b  b   -1 -c  0   -b -b -b  0 -1  c    0 -1 -c    b -b -b    1 -c  0    b -b  b  1  c  0    1 -c  0    b -b  b    c  0  1    b  b  b  1 -c  0    1  c  0    b  b -b    c  0 -1    b -b -b -1  c  0   -1 -c  0   -b -b -b   -c  0 -1   -b  b -b -1 -c  0   -1  c  0   -b  b  b   -c  0  1   -b -b  b"
let dodecahedronMatrix = handleMatrixString(dodecahedronString)
b = 1/phi
let c = 2-1*phi
let dodecahedron = handleEdgeMatrix(dodecahedronMatrix, 5, 0, b, c, "purple")
dodecahedron.translate(0,-20,0)
scene.addObject(dodecahedron)

camera.addScene(scene)
camera.renderScene(scene)
camera.start()





function handleEdgeMatrix(matrix, edgeCount, aValue = 0, bValue = 0, cValue = 0, color = "purple") {
    let newWorldObject = new WorldObject()
    let newPolygon = undefined
    let x = undefined
    let y = undefined
    let z = undefined
    while(matrix.length > 0) {
        if(newPolygon === undefined) {
            newPolygon = new Polygon(1, color)
        }
        let newNum = matrix.shift() //Read first element
        if(x === undefined) {
            x = assignValue(newNum, aValue, bValue, cValue)
            continue
        }
        if(y === undefined) {
            y = assignValue(newNum, aValue, bValue, cValue)
            continue
        }
        if(z === undefined) {
            z = assignValue(newNum, aValue, bValue, cValue)
            //All three coordinates are set, create vertex
            let newVertex = new Vertex(x,y,z)
            newPolygon.addVertex(newVertex)
            if(newPolygon.vertecies.length === edgeCount) { //The polygon has enough edges
                newWorldObject.addPolygon(newPolygon)
                newPolygon = undefined
            }
            x = undefined
            y = undefined
            z = undefined
            continue
        }
    }
    return newWorldObject
}

function handleMatrixString(string) {
    let newArray = []
    let array = string.split(" ")
    for(let i = 0; i < array.length; i++) {
        if(array[i] !== "") {
            newArray.push(array[i])
        }
    }
    return newArray
}

function assignValue(num, aValue, bValue, cValue) {
    let assigned
    if(num === "0") {
        assigned = 0
    }
    if(num === "a") {
        assigned = aValue
    }
    if(num === "b") {
        assigned = bValue
    }
    if(num === "c") {
        assigned = cValue
    }
    if(num === "-a") {
        assigned = -aValue
    }
    if(num === "-b") {
        assigned = -bValue
    }
    if(num === "-c") {
        assigned = -cValue
    }
    if(num === 1 || num === "1") {
        assigned = 1
    }
    if(num === -1 || num === "-1") {
        assigned = -1
    }
    return assigned
}