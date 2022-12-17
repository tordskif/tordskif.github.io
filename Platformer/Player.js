export default class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.velX = 0;
        this.velY = 0;
        this.gravity = 0.5;
        this.friction = 0.005;
        this.accX = 0.8;
        this.width = 32;
        this.height = 32;
        this.jumping = false;
        this.grounded = false;
        this.rightHeldDown = false;
        this.leftHeldDown = false;
        this.onRightWall = false;
        this.onLeftWall = false;
    }

    update() {
        console.log(this.grounded)
        this.x += this.velX;
        this.y += this.velY;

        if(this.leftHeldDown && !this.rightHeldDown) {
            this.velX += -this.accX
        }
        if(this.rightHeldDown && !this.leftHeldDown) {
            this.velX += this.accX
        }
        //assume friction force is proportional to square of speed
        let deAccelerationForce = this.friction*this.velX*this.velX
        if(this.velX < 0) {
            this.velX += deAccelerationForce
        }
        if(this.velX > 0) {
            this.velX -= deAccelerationForce
        }
        /*
        if((this.rightHeldDown && this.leftHeldDown) || (!this.rightHeldDown && !this.leftHeldDown)) {
            this.velX = 0
        }*/

        if (!this.grounded) {
            this.velY += this.gravity
        }
    }

    render(context) {
        context.fillStyle = "red";
        context.fillRect(this.x, this.y, this.width, this.height)
    }

    jump() {
        console.log(this.grounded) //But then this is false somehow...
        if (!this.jumping && this.grounded) {
            this.jumping = true;
            this.grounded = false;
            this.velY += -12;
            return
        }
        if (this.onLeftWall) {
            this.jumping = true;
            this.grounded = false;
            this.onLeftWall = false;
            this.velY = -14;
            this.velX += -15;
            return
        }
        if (this.onRightWall) {
            this.jumping = true;
            this.grounded = false;
            this.onRightWall = false;
            this.velY = -14;
            this.velX += 15;
            return
        }
    }

    unCollide(platform) {
        //Need to do different things based on which direction the collision happened:
        /*
                this.x < platform.x + platform.width //Left of right border
                this.x + this.width > platform.x  //Right of left border
                this.y < platform.y + platform.height //Above bottom border
                this.y + this.height > platform.y //Below top border
        */
        //This is maybe not the perfect solution, but should mostly work. Define the following quantities:
        let rightBorderOverlap = (platform.x + platform.width) - this.x
        let leftBorderOverlap = (this.x + this.width) - platform.x
        let botBorderOverlap = (platform.y + platform.height) - this.y
        let topBorderOverlap = (this.y + this.height) - platform.y

        //Depending which of these are smallest, do appropriate behaviour:
        let minValue = Math.min(rightBorderOverlap, leftBorderOverlap, botBorderOverlap, topBorderOverlap)

        if (rightBorderOverlap === minValue && this.velX < 0) {
            this.x = platform.x + platform.width
            this.velX = 0
            this.onRightWall = true
        }
        if (leftBorderOverlap === minValue && this.velX > 0) {
            this.x = platform.x - this.width
            this.velX = 0
            this.onLeftWall = true
        }
        if (botBorderOverlap === minValue && this.velY < 0) {
            this.velY = 0
            this.y = platform.y + platform.height
        }
        if (topBorderOverlap === minValue && this.velY > 0) {
            //If player was above platform:
            this.jumping = false
            this.grounded = true
            this.velY = 0
            this.y = platform.y - this.height
        }
        //console.log(this.grounded) //This gives true all the time


        //console.log(rightBorderOverlap, leftBorderOverlap, botBorderOverlap, topBorderOverlap)
    }

    handleDownInput(input) {
        if (input === "ArrowLeft") {
            this.leftHeldDown = true
        }
        if (input === "ArrowRight") {
            this.rightHeldDown = true
        }
        if (input === " ") {
            this.jump();
        }
    }

    handleUpInput(input) {
        if (input === "ArrowLeft") {
            this.leftHeldDown = false
        }
        if (input === "ArrowRight") {
            this.rightHeldDown = false
        }
    }
}
