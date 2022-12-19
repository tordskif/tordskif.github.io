export default class FlatScene {
    constructor() {
        this.flatObjects = []
    }

    addObject(object) {
        this.flatObjects.push(object)
    }

    render(context) {
        for(let i = 0; i < this.flatObjects.length; i++) {
            let flatObject = this.flatObjects[i]
            flatObject.render(context)
        }
    }
}