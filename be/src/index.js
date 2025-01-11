const http = require("http")
const { WebSocketServer } = require("ws")
const { v4: uuidv4 } = require("uuid")
const express = require('express')
const cors = require('cors')

const port = process.env.PORT || 3001
const app = express()
const server = http.createServer(app)
const wsServer = new WebSocketServer({ server })
const clients = {}
const canvases = {}
const drawings = {}

function handleMessage(bytes, clientId) {
    const message = JSON.parse(bytes.toString())
    if (message.type === "init") {
        const canvasId = message.canvasId
        if (!canvases[canvasId]) {
            canvases[canvasId] = []
            drawings[canvasId] = []
        }
        canvases[canvasId].push(clientId)
        const client = clients[clientId]
        client.send(JSON.stringify({type: 'init-canvas', data: drawings[canvasId]}))
    } else {
        const canvasId = message.canvasId
        drawings[canvasId].push({shapeType: message.shapeType, data: message.data})
        console.log(canvases[canvasId])
        canvases[canvasId].forEach((uuid) => {
            if (uuid !== clientId) {
                const client = clients[uuid]
                client.send(JSON.stringify(message))
            }
        })
    }
}

function handleClose(clientId) {
    delete clients[clientId]
}

wsServer.on('connection', (ws) => {
    const clientId = uuidv4()
    clients[clientId] = ws
    console.log("New client connected", clientId)
    ws.on('message', (message) => handleMessage(message, clientId))
    ws.on('close', () => handleClose(clientId))
    ws.on('error', (error) => console.log(error))
})


// middlewares
app.use(express.json())
app.use(cors())

// express routes
app.get('/health', (req, res) => {
    res.send('Server running')
})

server.listen(port, () => {
    console.log(`The server is successfully running on port ${port}`)
})