export default class Platform {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color
        this.scale = 1/4
    }

    render(context, scrollX, scrollY) {
        context.fillStyle = this.color;
        context.fillRect((this.x - scrollX)*this.scale, (this.y - scrollY)*this.scale, (this.width)*this.scale, (this.height)*this.scale);
    }
}
