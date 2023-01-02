export default class Lava {
    constructor(x, startY, width, speed) {
        this.x = x
        this.startY = startY
        this.y = startY
        this.width = width;
        this.speed = speed
    }

    render(context, scrollX, scrollY) {
        context.fillStyle = "red";
        context.fillRect(this.x - scrollX, this.y - scrollY, this.width, (this.startY-this.y));
    }

    setScale(scale) {
        this.x *= scale
        this.y *= scale
        this.width *= scale
        this.startY *= scale
        this.speed *= scale
    }
    
    update() {
        this.y -= this.speed
    }
}