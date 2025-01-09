import React, { useEffect, useRef, useState } from 'react'
import { Line } from '../shapes/line.js'
import { Rectangle } from '../shapes/rectangle.js'
import { Circle } from '../shapes/circle.js'
import { FreeLine } from '../shapes/freeline.js'
import { useParams } from 'react-router'

const Canvas = () => {

  const { id:canvasId }= useParams()
  console.log(canvasId)

  const canvasRef = useRef(null)
  const contextRef = useRef(null)
  const socketRef = useRef(null)

  const [tool, setTool] = useState(null)
  const objectsRef = useRef([])

  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    socketRef.current = new WebSocket('ws://localhost:3001')

    socketRef.current.addEventListener('open', () => {
      console.log("Websocket connection established")
    })

    socketRef.current.addEventListener('message', (event) => {
      const message = JSON.parse(event.data)
      console.log(message)
      if (message.shapeType === 'freeline') {
        const { startPoints, endPoints, points } = message.data
        const shape = new FreeLine(startPoints[0], startPoints[1])
        shape.endPoints = endPoints
        shape.points = points
        console.log(shape)
        objectsRef.current.push(shape)
      } else if (message.shapeType === 'line') {
        const { startPoints, endPoints } = message.data
        const shape = new Line(startPoints[0], startPoints[1])
        shape.endPoints = endPoints
        console.log(shape)
        objectsRef.current.push(shape)
      } else if (message.shapeType === 'rectangle') {
        const { startPoints, endPoints } = message.data
        const shape = new Rectangle(startPoints[0], startPoints[1])
        shape.endPoints = endPoints
        console.log(shape)
        objectsRef.current.push(shape)
      } else if (message.shapeType === 'circle') {
        const { startPoints, endPoints } = message.data
        const shape = new Circle(startPoints[0], startPoints[1])
        shape.endPoints = endPoints
        console.log(shape)
        objectsRef.current.push(shape)
      }
    })

    socketRef.current.addEventListener('error', (error) => {
      console.log("Websockket error: ", error)
    })

    socketRef.current.addEventListener('close', () => {
      console.log("Websocket connection closed")
    })

    // Cleanup
    return () => {
      socketRef.current.close()
    }

  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    canvas.height = window.innerHeight
    canvas.width = window.innerWidth
    contextRef.current = context
  }, [])

  function getMousePos(canvas, evt) {
    const rect = canvas.getBoundingClientRect() // abs. size of element
    const scaleX = canvas.width / rect.width   // relationship bitmap vs. element for x
    const scaleY = canvas.height / rect.height // relationship bitmap vs. element for y

    return {
      x: (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
      y: (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
    }
  }

  function handleMouseMove(e) {
    if (isDragging) {
      const { x: curX, y: curY } = getMousePos(canvasRef.current, e)
      if (tool === "line") {
        const line = objectsRef.current[objectsRef.current.length - 1]
        line.endPoints = [curX, curY]
      } else if (tool === "rectangle") {
        const rectangle = objectsRef.current[objectsRef.current.length - 1]
        rectangle.endPoints = [curX, curY]
      } else if (tool === "circle") {
        const circle = objectsRef.current[objectsRef.current.length - 1]
        circle.endPoints = [curX, curY]
      } else if (tool === "freeline") {
        const freeline = objectsRef.current[objectsRef.current.length - 1]
        if (curX !== freeline.endPoints[0] || curY !== freeline.endPoints[1]) {
          freeline.points.push(freeline.endPoints)
          freeline.endPoints = [curX, curY]
        }
      }
    }
  }

  function handleMouseDown(e) {
    setIsDragging(true)
    const { x, y } = getMousePos(canvasRef.current, e)

    if (tool === "line") {
      objectsRef.current.push(new Line(x, y))
    } else if (tool === "rectangle") {
      objectsRef.current.push(new Rectangle(x, y))
    } else if (tool === "circle") {
      objectsRef.current.push(new Circle(x, y))
    } else if (tool === "freeline") {
      objectsRef.current.push(new FreeLine(x, y))
    }
    console.log(objectsRef.current)
  }

  function handleMouseUp(e) {
    setIsDragging(false)
    const shape = objectsRef.current.pop()
    if (Math.abs(shape.startPoints[0] - shape.endPoints[0]) > 2 || Math.abs(shape.startPoints[1] - shape.endPoints[1]) > 2) {
      objectsRef.current.push(shape)
      socketRef.current.send(JSON.stringify({ type: 'shape', shapeType: tool, data: shape }))
    }
  }

  function redrawCanvas() {
    contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    objectsRef.current.forEach((object) => object.draw(contextRef.current))
    requestAnimationFrame(redrawCanvas)
  }

  useEffect(() => {
    redrawCanvas()
  }, [])

  return (
    <div className='h-screen w-screen relative'>
      <div className='absolute z-10 bg-stone-200 top-10 left-10 rounded-md'>
        <button className={`size-10 p-3 hover:bg-white rounded-l-md ${tool === 'freeline' ? 'bg-white' : ''}`} onClick={() => setTool('freeline')}><img src="pencil.png" alt="" /></button>
        <button className={`size-10 p-3 hover:bg-white ${tool === 'line' ? 'bg-white' : ''}`} onClick={() => setTool('line')}><img src="line.png" alt="" /></button>
        <button className={`size-10 p-3 hover:bg-white ${tool === 'rectangle' ? 'bg-white' : ''}`} onClick={() => setTool('rectangle')}><img src="rectangle.png" alt="" /></button>
        <button className={`size-10 p-3 hover:bg-white rounded-r-md ${tool === 'circle' ? 'bg-white' : ''}`} onClick={() => setTool('circle')}><img src="circle.png" alt="" /></button>
      </div>
      <canvas
        className='bg-black h-full w-full'
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
      </canvas>
    </div>
  )
}

export default Canvas