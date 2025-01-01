export class Line {
    constructor(x, y) {
        this.startPoint = [x, y]
        this.endPoint = [x, y]
    }

    draw(context) {
        context.beginPath();
        context.moveTo(this.startPoint[0], this.startPoint[1])
        context.lineTo(this.endPoint[0], this.endPoint[1])
        context.lineWidth = 4
        context.strokeStyle = 'white'
        context.stroke()
    }
}