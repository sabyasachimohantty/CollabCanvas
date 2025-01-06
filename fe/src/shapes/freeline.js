export class FreeLine {
    constructor(x, y) {
        this.startPoints = [x, y]
        this.endPoints = [x, y]
        this.points = [this.startPoints]
    }

    draw(context) {
        let prev = this.points[0]
        this.points.forEach((point) => {
            context.beginPath()
            context.moveTo(prev[0], prev[1])
            context.lineTo(point[0], point[1])
            context.lineWidth = 3
            context.strokeStyle = 'white'
            context.stroke()
            context.closePath()
            prev = point
        })
    }
}