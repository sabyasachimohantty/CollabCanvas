export class Circle {
    constructor(x, y) {
        this.startPoints = [x, y]
        this.endPoints = [x, y]
    }

    draw(context) {
        const centreX = (this.startPoints[0] + this.endPoints[0]) / 2
        const centreY = (this.startPoints[1] + this.endPoints[1]) / 2
        const xRadius = Math.abs(this.startPoints[0] - this.endPoints[0]) / 2
        const yRadius = Math.abs(this.startPoints[1] - this.endPoints[1]) / 2
        context.beginPath()
        context.ellipse(centreX, centreY, xRadius, yRadius, 0, 0, 2 * Math.PI)
        context.strokeStyle = "white"
        context.lineWidth = 3
        context.stroke()
        context.closePath()
    }
}