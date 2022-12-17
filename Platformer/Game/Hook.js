export default class Hook {
    constructor(maxLength, startAngle, hookSpeed, hookStrength) {
        this.x
        this.y 
        this.maxLength = maxLength
        this.startAngle = startAngle
        this.hookSpeed = hookSpeed
        this.hookStrength = hookStrength
        this.deployed = false
        this.attached = false
        this.attachedLength = undefined
        this.currentLength = 0
        this.tension = 0.4
        this.deployToRight = undefined //Direction it should be deployed in

        this.player = undefined
    }

    addPlayer(player) {
        this.player = player
    }

    render(context, scrollX, scrollY) {
        if(this.deployed) {
            context.fillStyle = "black";
            context.beginPath()
            context.moveTo(this.player.x + this.player.width/2 - scrollX, this.player.y - scrollY)
            context.lineTo(this.x - scrollX, this.y - scrollY)
            context.stroke()
        }
    }

    deploy(facingRight) {
        this.attached = false
        this.deployed = true
        this.currentLength = 0
        this.deployToRight = facingRight
    }

    undeploy() {
        this.attached = false
        this.deployed = false
        this.currentLength = 0
        this.attachedLength = undefined
    }
    
    reelIn() {

    }

    update() { //Runs once every frame, called from player or game
        if(this.deployed && !this.attached) { //Deplpoyed, but not attached, start moving forwards
            if(this.currentLength < this.maxLength) { //Can extend further
                this.currentLength += this.hookSpeed
                this.y = this.player.y - this.currentLength*Math.cos(this.startAngle)
                if(this.deployToRight) {
                    this.x = this.player.x + this.player.width/2 + this.currentLength*Math.sin(this.startAngle)
                } else {
                    this.x = this.player.x + this.player.width/2 - this.currentLength*Math.sin(this.startAngle)
                }
            } else { //Reset if reach max length
                this.deployed = false
                this.currentLength = 0
                this.attachedLength = undefined
            }
        }
    }

    handleCollision(platform) {
        this.attached = true
        if(this.attachedLength === undefined) { //Initialize "length of rope" on first attachment
            this.attachedLength = this.currentLength
        }
    }
}