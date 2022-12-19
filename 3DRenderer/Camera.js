import FlatPolygon from "./FlatPolygon.js"
import FlatScene from "./FlatScene.js"
import FlatVertex from "./FlatVertex.js"
import FlatObject from "./FlatObject.js"

export default class Camera {
    constructor(x,y,z) {
        //Camera position
        this.x = x
        this.y = y
        this.z = z
        //Camera angle, first vertical plane,  0-2pi, pitch, then in horizontal plane, yaw -pi/2 - pi/2
        this.v = 0 //Theta, yaw
        this.w = 0 //Phi, pitch
        //Something about FOV, or width/height of "screen" to project onto
        //Height of hypothetical "screen"
        this.height = 1.5
        //Width of hypothetical "screen"
        this.width = 4
        //How far hypothetical "screen" is from camera position
        this.distance = 1

        this.stepLength = 1

        this.scene = undefined

        this.canvas = document.getElementById("canvas")
        let screenWidth = document.documentElement.clientWidth
        let screenHeight = document.documentElement.clientHeight
        this.canvas.width = screenWidth*0.987
        this.canvas.height = screenHeight*0.965

        //Assume right hand system with x, y as flat directions

        
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
    }

    start() {
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
    }

    handleKeyDown(e) {
        if(e.repeat) {
            return
        }
        if(e.key === "ArrowUp") {
            this.moveForward()
            this.renderScene(this.scene)
        }
        if(e.key === "ArrowDown") {
            this.moveBackward()
            this.renderScene(this.scene)
        }
        if(e.key === "ArrowRight") {
            this.moveRight()
            this.renderScene(this.scene)
        }
        if(e.key === "ArrowLeft") {
            this.moveLeft()
            this.renderScene(this.scene)
        }
        if(e.key === "a") {
            this.v += 0.15
            this.renderScene(this.scene)
        }
        if(e.key === "d") {
            this.v -= 0.15
            this.renderScene(this.scene)
        }
        if(e.key === "w") {
            this.w += 0.05
            this.renderScene(this.scene)
        }
        if(e.key === "s") {
            this.w -= 0.05
            this.renderScene(this.scene)
        }

    }

    moveForward() {
        this.x += Math.cos(this.v)*this.stepLength
        this.y += -Math.sin(this.v)*this.stepLength
    }
    moveBackward() {
        this.x += -Math.cos(this.v)*this.stepLength
        this.y += Math.sin(this.v)*this.stepLength
    }
    moveRight() {
        this.x += Math.sin(this.v)*this.stepLength
        this.y += Math.cos(this.v)*this.stepLength
    }
    moveLeft() {
        this.x += -Math.sin(this.v)*this.stepLength
        this.y += -Math.cos(this.v)*this.stepLength
    }

    handleKeyUp(e) {

    }

    addScene(scene) {
        this.scene = scene
    }

    //Take in scene, project everythng onto screen, return 2d scene. Have separate method to actually render this scene
    projectScene(scene) {
        console.log(1)
        let flatScene = new FlatScene()
        for(let i = 0; i < scene.worldObjects.length; i++) {
            let worldObject = scene.worldObjects[i]
            let flatObject = this.projectObject(worldObject)
            flatScene.addObject(flatObject)
        }
        return flatScene
    }

    projectObject(worldObject) {
        console.log(2)
        let flatObject = new FlatObject()
        //console.log("worldobject:", worldObject)
        for(let i = 0; i < worldObject.polygons.length; i++) {
            let polygon = worldObject.polygons[i]
            let flatPolygon = this.projectPolygon(polygon)
            console.log(flatPolygon)
            flatObject.addPolygon(flatPolygon)
        }
        return flatObject
    }

    projectPolygon(polygon) {
        console.log(3)
        let flatPolygon = new FlatPolygon(polygon.lineWidth, polygon.color)
        for(let i = 0; i < polygon.vertecies.length; i++) {
            let vertex = polygon.vertecies[i]
            let flatVertex = this.projectVertex(vertex)
            flatPolygon.addVertex(flatVertex)
        }
        return flatPolygon
    }

    projectVertex(vertex) {
        console.log(4)
        //Do math
        //Define ray from camera location to vertex location
        let xDist = vertex.x - this.x
        let yDist = vertex.y - this.y
        let zDist = vertex.z - this.z
        //This is a vector in "standard" coordinates
        //Transfrom them into suitable coordinates for the camera, so that x is straight forward, y to the side, and z up
        let newCoordinates = this.applyRotation(xDist,yDist,zDist)
        let x = newCoordinates[0]
        let y = newCoordinates[1]
        let z = newCoordinates[2]
        
        //See if this ray intersects "Screen"
        //Assuming the screen is parallell with the y,z plane, we get the following:
        let screenY = y*this.distance/x //This will be the x-coordinate on screen
        let screenZ = z*this.distance/x //This will be the y-coordinate on screen
        //Then check if this is within screen width/height, and scale, letting screenX/screenY = 0 be the midpoint of screen, and max width/height be corners of screen
        console.log(screenY, screenZ)
        let canvasX = this.canvas.width/2 + screenY/(this.width)*this.canvas.width
        let canvasY = this.canvas.height/2 - screenZ/(this.height)*this.canvas.height

        let flatVertex = new FlatVertex(canvasX, canvasY)
        console.log(canvasX,canvasY)
        return flatVertex
    }

    applyRotation(x,y,z) {
        let cosTheta = Math.cos(this.v)
        let sinTheta = Math.sin(this.v)
        let cosPhi = Math.cos(this.w)
        let sinPhi = Math.sin(this.w)
        //Yaw matrix
        let newX = cosTheta*x - sinTheta*y
        let newY = sinTheta*x + cosTheta*y
        let newZ = z
        //Pitch matrix
        let newerX = cosPhi*newX + sinPhi*newZ
        let newerY = newY
        let newerZ = -sinPhi*newX + cosPhi*newZ

        //Doing them one after the other seemed to make it work...

        return [newerX, newerY, newerZ]


        /**
         * //Rotation matrix that worked around usual y axis
        let newX = cosTheta*cosPhi*x - sinTheta*y + cosTheta*sinPhi*z
        let newY = sinTheta*cosPhi*x + cosTheta*y + sinTheta*sinPhi*z
        let newZ = -sinPhi*x + cosPhi*z
        another attempt:
        
        let newerX = (cosPhi + sinTheta*sinTheta*(1-cosPhi))*newX + (sinTheta*cosTheta*(1-cosPhi))*newY + cosTheta*sinPhi*newZ
        let newerY = (sinTheta*cosTheta*(1-cosPhi))*newX + (cosPhi + cosTheta*cosTheta*(1-cosPhi))*newY - sinTheta*sinPhi*newZ
        let newerZ = (-cosTheta * sinPhi)*newX + (sinTheta*sinPhi)*newY + cosPhi*newZ
         */
    }

    //Take in 3dscene, use projectscene to get a 2dscene, and render this
    renderScene(scene) {
        console.log(scene)
        let flatScene = this.projectScene(scene)
        console.log(flatScene)

        
        let context = this.canvas.getContext("2d")
        
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        //Clear context first? 
        flatScene.render(context)
    }
    //Still need to give closer objects priority on rendering, and not render stuff that is not in field of view...
    //Atleast dont render if they are behind camera/camerascreen, should be relatively easy to check
    //How to give rendering priority? If every time something is projected, it keeps track of the distance it took
    //What is a good measurement of distance here? 
    //Then when rendering the flat scenes, render the closest things last. That is sort objects before rendering by this property..
}