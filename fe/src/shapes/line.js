export class Line {
    constructor(x, y) {
        this.startPoints = [x, y]
        this.endPoints = [x, y]
    }

    draw(context) {
        context.beginPath();
        context.moveTo(this.startPoints[0], this.startPoints[1])
        context.lineTo(this.endPoints[0], this.endPoints[1])
        context.lineWidth = 3
        context.strokeStyle = 'white'
        context.stroke()
        context.closePath()
    }
}