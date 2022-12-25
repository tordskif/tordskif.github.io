export default class Platform {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color
    }

    render(context, scrollX, scrollY) {
        context.fillStyle = this.color;
        context.fillRect((this.x - scrollX), (this.y - scrollY), (this.width), (this.height));
    }

    scale(scale) {
        let newPlatform = new Platform(this.x*scale, this.y*scale ,this.width*scale, this.height*scale, this.color)
        return newPlatform
    }
}
