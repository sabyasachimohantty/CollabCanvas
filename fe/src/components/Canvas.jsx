import React, { useEffect, useRef, useState } from 'react'

const Canvas = () => {

  const canvasRef = useRef(null)
  const contextRef = useRef(null)

  const [isDragging, setIsDragging] = useState(false)
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    canvas.height = window.innerHeight
    canvas.width = window.innerWidth
    contextRef.current = context
  }, [])

  function  getMousePos(canvas, evt) {
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


  function handleMouseMove(e) {
    if (isDragging) {
      contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      const { x:curX, y:curY } = getMousePos(canvasRef.current, e)
      drawRectangle(x, y, curX, curY, contextRef.current, 'white')
    }
  }

  function handleMouseDown(e) {
    setIsDragging(true)
    const { x, y } = getMousePos(canvasRef.current, e)
    setX(x)
    setY(y)
  }

  function handleMouseUp(e) {
    setIsDragging(false)
  }

  return (
    <canvas
      className='bg-black h-full w-full absolute top-0 left-0'
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}

    >
    </canvas>
  )
}

export default Canvas