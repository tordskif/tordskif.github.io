//A class with static methods for handling collision detection between different types of objects
export default class Collision {
    constructor(isCollision) {
        this.isCollision = isCollision
        //The following is a (normalized?) vector signifying the direction the first object should move
        //to handle the colision. Overlap is a measure of how far it should move to deal with it
        this.x = 0
        this.y = 0
        this.overlap = 0
    }

    static rectRect(rect1, rect2) {
        if (rect1.x <= rect2.x + rect2.width &&
            rect1.x + rect1.width >= rect2.x &&
            rect1.y <= rect2.y + rect2.height &&
            rect1.y + rect1.height >= rect2.y) {
            // Collision detected
            let collision = new Collision(true)
            
            //The following are the lengths which rect1 overlaps with rect2s specified borders
            let rightBorderOverlap = (rect2.x + rect2.width) - rect1.x
            let leftBorderOverlap = (rect1.x + rect1.width) - rect2.x
            let botBorderOverlap = (rect2.y + rect2.height) - rect1.y
            let topBorderOverlap = (rect1.y + rect1.height) - rect2.y
            let minOverlap = Math.min(rightBorderOverlap, leftBorderOverlap, botBorderOverlap, topBorderOverlap)

            collision.overlap = minOverlap

            if (rightBorderOverlap === minOverlap) {
                collision.x += -1
            }
            if (leftBorderOverlap === minOverlap) {
                collision.x += 1
            }
            if (botBorderOverlap === minOverlap) {
                collision.y += 1
            }
            if (topBorderOverlap === minOverlap) {
                collision.y -= 1
            }
            return collision
        } else {
            let noColision = new Collision(false)
            return noColision
        }
    }

    static rectCirc(rect, circ) {
        if (rect.x <= circ.x + circ.width &&
            rect.x + rect.width >= circ.x &&
            rect.y <= circ.y + circ.height &&
            rect.y + rect.height >= circ.y) {
            }
    }


    static distance(p, q) {
        return Math.sqrt((p.x-q.x)*(p.x-q.x) + (p.y-q.y)(p.y-q.y)) 
    }
}