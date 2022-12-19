export default class Scene {
    constructor() {
        //worldObjects is a list of worldObject objects
        this.worldObjects = []
    }
    
    addObject(object) {
        this.worldObjects.push(object)
    }

}