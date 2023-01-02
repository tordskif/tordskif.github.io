export default class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.velX = 0;
        this.velY = 0;
        this.width = 32;
        this.height = 48;
        this.color = "#87947B"

        //Physics variables
        this.gravity = 0.5;
        this.xFriction = 0.00002; //Have separate friction is each direction
        this.yFriction = 0.00002
        this.wallFriction = 0.02
        this.floorFriction = 0.01 //Friction to be used when no left/right arrow keys are held down
        this.accX = 0.5; //Base acceleration for holding right/left
        this.airAcc = 1; //Factor how effective acceleration is when not grounded
        this.baseJumpHeight = 10
        this.conversionFactor = 0.3; //Proportion of horizontal movement converted to upwards movement when jumping
        this.jumpEfficiency = 1.5 //Multiplier on above conversion
        //The following are multipliers on baseJump for walljump
        this.wallJumpX = 0.3
        this.wallJumpY = 2
        this.canHoldToJump = false //Decide whether holding down up should keep you continue try to jump
        //Make different presets for the above, like:
        //Default: Fun, fast and snappy
        //Technical: Less control while in the air, have to be more strategical about using mechanics
        //Moon gravity: Less gravity, maybe less control in air
        //etc. etc.
        //Have them serve different purposes/answers to questions, like:
        //Should you be able to infinite wall jump up a wall? (could also detect "lastJumpedWall" and prevent this...)
        //Should there be multiple ways to beat a level, or do you need exact precice inputs?
        //Etc.


        
        this.jumping = false;
        this.grounded = false;
        this.ceilinged = false; //Equivalent to grounded, just if a platform is touching top of player. If both ceilinged and grounded => squashed => game over
        this.ceilPlatform = undefined

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
        this.xFriction *= (1/scale)
        this.yFriction *= (1/scale)
        this.wallFriction *= (1/scale)
        this.floorFriction *= (1/scale)
        //Hook still needs scaling for it to work in other scales, dont really like how it works currently anyways though
    }

    setPreset(preset) {
        if(preset === "Default") {
            this.gravity = 0.5;
            this.xFriction = 0.0005;
            this.yFriction = 0.0005;
            this.wallFriction = 0.3
            this.floorFriction = 0.1
            this.accX = 1.2; //Base acceleration for holding right/left
            this.airAcc = 1; //Factor how effective acceleration is when not grounded
            this.baseJumpHeight = 20
            this.conversionFactor = 0; //Proportion of horizontal movement converted to upwards movement when jumping
            this.jumpEfficiency = 1.5 //Multiplier on above conversion
            //The following are multipliers on baseJump for walljump
            this.wallJumpX = 0.6
            this.wallJumpY = 1
            this.canHoldToJump = false
        }
        if(preset === "Hard") {
            this.gravity = 0.5;
            this.xFriction = 0.0002;
            this.yFriction = 0.0002;
            this.wallFriction = 0.9 //A proportion of how slowed down you are on walls. 0.9 means only 0.1 is left
            this.floorFriction = 0.01
            this.accX = 0.5; //Base acceleration for holding right/left
            this.airAcc = 0.3; //Factor how effective acceleration is when not grounded
            this.baseJumpHeight = 10
            this.conversionFactor = 0.3; //Proportion of horizontal movement converted to upwards movement when jumping
            this.jumpEfficiency = 1.5 //Multiplier on above conversion
            //The following are multipliers on baseJump for walljump
            this.wallJumpX = 0.3
            this.wallJumpY = 2
            this.canHoldToJump = true
        }
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

        //Gravity
        if (!this.grounded) {
            totalAccY += this.gravity
        }

        //Movement forces
        if(this.leftHeldDown && !this.rightHeldDown) { //Extra condition  && (this.grounded || !this.hook.attached)
            this.facingRight = false
            if(!this.hook.attached) {
                if(this.grounded) {
                    totalAccX -= this.accX
                } else {
                    totalAccX -= this.accX * this.airAcc
                }
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
                if(this.grounded) {
                    totalAccX += this.accX
                } else {
                    totalAccX += this.accX * this.airAcc
                }
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
        //Jump repeatadly if holding down up key, was previously on onkeydown instead
        if(this.upHeldDown && !this.hook.attached) {
            if(this.canHoldToJump) { //Only try to jump continiously if hold jumping is enabled
                this.jump();
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

        if((this.onLeftWall || this.onRightWall) && this.velY > 0) { //On a wall going downwards
            totalAccY -= this.wallFriction*this.velY
        } else if(!this.leftHeldDown && !this.rightHeldDown && this.grounded) { //On ground holding arrow keys
            totalAccX -= this.floorFriction*this.velX
        } else { //All other cases
            let totalVelocity = Math.sqrt(this.velX*this.velX + this.velY*this.velY)
            if(totalVelocity !== 0) { //So we dont divide by 0. No friction if youre still anyways
                let xComponent = this.velX/totalVelocity
                let yComponent = this.velY/totalVelocity
                //Apply friction in each direction according to these components
                totalAccX -= this.xFriction*totalVelocity*totalVelocity*xComponent
                totalAccY -= this.yFriction*totalVelocity*totalVelocity*yComponent
            }
        }
        //also need regular friction when holding buttons down

        this.velX += totalAccX
        this.velY += totalAccY
    }

    render(context, scrollX, scrollY) {
        context.fillStyle = this.color;
        context.fillRect(this.x - scrollX, this.y - scrollY, this.width, this.height)
    }

    jump() {
        if (!this.jumping && this.grounded) {
            console.log("1")
            this.jumping = true;
            this.grounded = false;
            //Idea is to convert some of xspeed into vertical speed
            this.velY -= this.baseJumpHeight + Math.abs(this.velX)*this.conversionFactor*this.jumpEfficiency;
            this.velX *= (1-this.conversionFactor)
            return
        }
        if (this.onLeftWall) {
            console.log("2")
            this.jumping = true;
            this.grounded = false;
            this.onLeftWall = false;
            this.velY = -this.wallJumpY * this.baseJumpHeight;
            this.velX += -this.wallJumpX* this.baseJumpHeight;
            return
        }
        if (this.onRightWall) {
            console.log("3")
            this.jumping = true;
            this.grounded = false;
            this.onRightWall = false;
            this.velY = -this.wallJumpY * this.baseJumpHeight;
            this.velX += this.wallJumpX* this.baseJumpHeight;
            return
        }
    }

    fly() {
        this.jumping = true;
        this.grounded = false;
        this.velY -= this.baseJumpHeight*2
    }
    
    shootHook() {
        this.hook.deploy(this.facingRight)
    }

    checkForDeath() {
        if(this.grounded && this.ceilinged) {
            //This kills the player in the rare case they are just outside of being squashed
            return this.ceilPlatform
        } else {
            return undefined
        }
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

        let collisionDirection
        if (rightBorderOverlap === minValue) {
            if(this.velX < 0) {
                this.x = platform.x + platform.width
                this.velX = 0
            }
            collisionDirection = "left"
            this.onRightWall = true
        }
        if (leftBorderOverlap === minValue) {
            if(this.velX > 0) {
                this.x = platform.x - this.width
                this.velX = 0
            }
            collisionDirection = "right"
            this.onLeftWall = true
        }
        if (botBorderOverlap === minValue) {
            if(this.velY < 0) {
                this.velY = platform.vy
                this.y = platform.y + platform.height
            }
            this.ceilinged = true
            this.ceilPlatform = platform
            collisionDirection = "top"
        }

        if (topBorderOverlap === minValue) {
            //If player was above platform:
            if(this.velY > 0) {
                this.jumping = false
                this.grounded = true
                this.y = platform.y - this.height
                this.velY = platform.vy
            }
            collisionDirection = "bot"
        }
        return collisionDirection //Maybe return early so i dont count as colliding right and bot when on corner... choose one to prefer
    }

    handleDownInput(input) {
        if (input === "ArrowLeft") {
            this.leftHeldDown = true
        }
        if (input === "ArrowRight") {
            this.rightHeldDown = true
        }
        if (input === "ArrowUp") {
            this.upHeldDown = true
            if(!this.canHoldToJump) { //If not supporting holdjump, trigger just once
                this.jump()
            }
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
        if(input === " ") {
            this.fly() //For testing
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
