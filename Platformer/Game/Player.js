export default class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.velX = 0;
        this.velY = 0;
        this.gravity = 0.5;
        this.friction = 0.0002;
        this.accX = 0.6;
        this.width = 32;
        this.height = 48;
        this.jumping = false;
        this.grounded = false;
        this.conversionFactor = 0.5;
        this.jumpEfficiency = 1.5
        this.baseJumpHeight = 6
        this.rightHeldDown = false;
        this.leftHeldDown = false;
        this.upHeldDown = false;
        this.downHeldDown = false;
        this.onRightWall = false;
        this.onLeftWall = false;
        this.facingRight = true; //to determine hookshot direction

        this.hook = undefined
    }

    setScale(scale) {
        this.x *= scale
        this.y *= scale
        this.width *= scale
        this.height *= scale
        this.accX *= scale
        this.baseJumpHeight *= scale
        this.gravity *= scale
        //Without friction enabled, the above seemed to be correct scaling
        //This friction scaling seems to be the one which preserves behaviour correctly:
        this.friction *= (1/scale)
        //Hook still needs scaling for it to work in other scales, dont really like how it works currently anyways though
    }

    addHook(hook) {
        this.hook = hook
    }

    update() {
        this.x += this.velX;
        this.y += this.velY;

        //Alter velocities according to forces affecting player
        let totalAccX = 0
        let totalAccY = 0
        //Movement forces
        if(this.leftHeldDown && !this.rightHeldDown) { //Extra condition  && (this.grounded || !this.hook.attached)
            this.facingRight = false
            if(!this.hook.attached) {
                totalAccX += -this.accX
            } else { //If hanging, accelerate in direction perpendicular to rope
                let xDiff = this.hook.x - (this.x + this.width / 2)
                let yDiff = (this.y) - this.hook.y
                let totalDiff = Math.sqrt(xDiff * xDiff + yDiff * yDiff) //This is length of rope
                if(totalDiff >= this.hook.attachedLength) { //Means the rope is "tight"
                    //Apply forces
                    //Normalized components
                    let xComponent = xDiff / totalDiff
                    let yComponent = yDiff / totalDiff
                    //Use this.accX in the perpendicular direction
                    totalAccX += -this.accX * yComponent
                    totalAccY -= this.accX * xComponent
                }
            }
        }
        if(this.rightHeldDown && !this.leftHeldDown) {
            this.facingRight = true
            if(!this.hook.attached) {
                totalAccX += this.accX
            } else { //If hanging, accelerate in direction perpendicular to rope
                let xDiff = this.hook.x - (this.x + this.width / 2)
                let yDiff = (this.y) - this.hook.y
                let totalDiff = Math.sqrt(xDiff * xDiff + yDiff * yDiff)
                if(totalDiff >= this.hook.attachedLength) { //Means the rope is "tight"
                    //Apply forces
                    //Normalized components
                    let xComponent = xDiff / totalDiff
                    let yComponent = yDiff / totalDiff
                    //Use this.accX in the perpendicular direction
                    totalAccX += this.accX * yComponent
                    totalAccY += this.accX * xComponent
                }
            }
        }
        if(this.upHeldDown && !this.downHeldDown && this.hook.attached) {
            if(this.hook.attachedLength >= 10) {
                this.hook.attachedLength -= 3
            }
        }
        if(this.downHeldDown && !this.upHeldDown && this.hook.attached) {
            this.hook.attachedLength += 3
        }

        //Hook forces:
        if(this.hook.attached) {
            //The total force of the rope, is the proportion of gravity going same direction as rope
            //Angle is the angle off the vertical, 0 means straight up
            //TotalForce = G * cos(angle)
            //Fy = F*cos(angle), Fx = F*sin(angle)
            let xDiff = this.hook.x - (this.x + this.width/2)
            let yDiff = (this.y) - this.hook.y
            let totalDiff = Math.sqrt(xDiff*xDiff + yDiff*yDiff)
            console.log(totalDiff, this.hook.attachedLength)
            if(totalDiff >= this.hook.attachedLength) {
                //Normalized components
                let xComponent = xDiff / totalDiff
                let yComponent = yDiff / totalDiff
                let totalForce = (totalDiff - this.hook.attachedLength)*this.hook.tension*0.2 + this.gravity*yComponent*1 //Basically hookes law, but restricted to only pulling in
                console.log("total force:" + totalForce)
                totalAccX += totalForce * xComponent
                totalAccY -= totalForce * yComponent
            }
            if(yDiff < 0) {
                this.hook.undeploy()
            }
        }
        //Friction forces, assume friction force is proportional to square of speed //Maybe constant friction if against a wall/on ground, lower friction in the air?
        let totalVelocity = Math.sqrt(this.velX*this.velX + this.velY*this.velY)
        if(totalVelocity !== 0) {
            let xComponent = this.velX/totalVelocity
            let yComponent = this.velY/totalVelocity
            console.log(this.onLeftWall, this.onRightWall)
            if(this.onLeftWall || this.onRightWall) {
                totalAccX -= this.friction*100 * totalVelocity * totalVelocity * xComponent
                totalAccY -= this.friction*100 * totalVelocity * totalVelocity * yComponent
            } else {
                totalAccX -= this.friction*totalVelocity*totalVelocity*xComponent
                totalAccY -= this.friction*totalVelocity*totalVelocity*yComponent
            }
        }

        if (!this.grounded) {
            totalAccY += this.gravity
        }
        this.velX += totalAccX
        this.velY += totalAccY
    }

    render(context, scrollX, scrollY) {
        context.fillStyle = "red";
        context.fillRect(this.x - scrollX, this.y - scrollY, this.width, this.height)
    }

    jump() {
        if (!this.jumping && this.grounded) {
            this.jumping = true;
            this.grounded = false;
            //Idea is to convert some of xspeed into vertical speed
            this.velY -= this.baseJumpHeight + Math.abs(this.velX)*this.conversionFactor*this.jumpEfficiency;
            this.velX *= (1-this.conversionFactor)
            return
        }
        if (this.onLeftWall) {
            this.jumping = true;
            this.grounded = false;
            this.onLeftWall = false;
            this.velY = -4 * this.baseJumpHeight;
            this.velX += -1.5* this.baseJumpHeight;
            return
        }
        if (this.onRightWall) {
            this.jumping = true;
            this.grounded = false;
            this.onRightWall = false;
            this.velY = -4 * this.baseJumpHeight;
            this.velX += 1.5* this.baseJumpHeight;
            return
        }
    }
    
    shootHook() {
        this.hook.deploy(this.facingRight)
    }

    unCollide(platform) {
        //console.log(this.onRightWall, this.onLeftWall)
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

        if (rightBorderOverlap === minValue) {
            if(this.velX < 0) {
                this.x = platform.x + platform.width
                this.velX = 0
            }
            this.onRightWall = true
        } else {
            this.onRightWall = false
        }
        if (leftBorderOverlap === minValue) {
            if(this.velX > 0) {
                this.x = platform.x - this.width
                this.velX = 0
            }
            this.onLeftWall = true
        } else {
            this.onLeftWall = false
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
    }

    handleDownInput(input) {
        if (input === "ArrowLeft") {
            this.leftHeldDown = true
        }
        if (input === "ArrowRight") {
            this.rightHeldDown = true
        }
        if (input === "ArrowUp") {
            if(!this.hook.attached) {
                this.jump();
            }
            this.upHeldDown = true
        }
        if (input === "ArrowDown") {
            this.downHeldDown = true
        }
        /* if (input === " ") {
            this.shootHook();
        } */ //Disable this for now, doesnt work that great
        if (input === "e") {
            this.hook.undeploy()
        }
    }

    handleUpInput(input) {
        if (input === "ArrowLeft") {
            this.leftHeldDown = false
        }
        if (input === "ArrowRight") {
            this.rightHeldDown = false
        }
        if (input === "ArrowUp") {
            this.upHeldDown = false
        }
        if (input === "ArrowDown") {
            this.downHeldDown = false
        }

    }
}
