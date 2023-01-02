export default class Platform {
    constructor(x, y, width, height, color, isFalling = false, vy = 0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color
        this.isFalling = isFalling
        this.vy = vy
    }

    render(context, scrollX, scrollY) {
        context.fillStyle = this.color;
        context.fillRect(this.x - scrollX, this.y - scrollY, this.width, this.height);
    }

    setScale(scale) {
        this.x *= scale
        this.y *= scale
        this.width *= scale
        this.height *= scale
        this.vy *= scale
    }
    
    update() {
        if(this.isFalling) {
            this.y += this.vy
        }
    }

    unCollide(otherPlatform) {
        //Only need to uncollide in y direction, also assume that it collided into otherPlatform from above
        this.y = otherPlatform.y-this.height
    }
}
