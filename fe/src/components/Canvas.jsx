import React, { useEffect, useRef, useState } from 'react'
import { Line } from '../shapes/line.js'

const Canvas = () => {

  const canvasRef = useRef(null)
  const contextRef = useRef(null)

  const [tool, setTool] = useState(null)
  const objectsRef = useRef([])

  const [isDragging, setIsDragging] = useState(false)
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)
  const [prevX, setPrevX] = useState(0)
  const [prevY, setPrevY] = useState(0)
  
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

  function drawLine(e) {
    if (isDragging) {
      const { x: curX, y: curY } = getMousePos(canvasRef.current, e)
      contextRef.current.moveTo(x, y)
      contextRef.current.lineTo(curX, curY)
      contextRef.current.lineWidth = 4
      contextRef.current.strokeStyle = 'white'
      contextRef.current.stroke()
      setX(curX)
      setY(curY)
    }
  }

  function drawRectangle(x1, y1, x2, y2, context, color) {
    context.beginPath()
    context.moveTo(x1, y1)
    context.lineTo(x2, y1)
    context.lineTo(x2, y2)
    context.lineTo(x1, y2)
    context.lineTo(x1, y1)
    context.strokeStyle = color
    context.stroke()
  }

  function drawFillRectangle(x1, y1, x2, y2, context, color) {
    context.beginPath()
    context.moveTo(x1, y1)
    context.lineTo(x2, y1)
    context.lineTo(x2, y2)
    context.lineTo(x1, y2)
    context.lineTo(x1, y1)
    context.fillStyle = color
    context.fill()
  }


  function handleMouseMove(e) {
    if (isDragging) {
      // contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      // drawFillRectangle(x, y, prevX, prevY, contextRef.current, 'black')
      const { x: curX, y: curY } = getMousePos(canvasRef.current, e)
      // drawRectangle(x, y, curX, curY, contextRef.current, 'white')
      // setPrevX(curX)
      // setPrevY(curY)
      if (tool === "line") {
        const line = objectsRef.current[objectsRef.current.length - 1]
        line.endPoint = [curX, curY]
      }
    }
  }

  function handleMouseDown(e) {
    setIsDragging(true)
    const { x, y } = getMousePos(canvasRef.current, e)
    setX(x)
    setY(y)
    setPrevX(x)
    setPrevY(y)

    if (tool === "line") {
      objectsRef.current.push(new Line(x, y))
      console.log(objectsRef.current)
    }
  }

  function handleMouseUp(e) {
    setIsDragging(false)
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
    <div className='h-full w-full relative'>
      <div className='absolute z-10 bg-stone-200 top-10 left-10 rounded-md'>
        <button className={`size-10 p-3 hover:bg-white rounded-l-md ${tool === 'pencil' ? 'bg-white' : ''}`} onClick={() => setTool('pencil')}><img src="pencil.png" alt="" /></button>
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