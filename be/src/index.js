const http = require("http")
const { WebSocketServer } = require("ws")
const { v4: uuidv4 } = require("uuid")
const express = require('express')

const port = process.env.PORT || 3001
const app = express()
const server = http.createServer(app)
const wsServer = new WebSocketServer({server})
const clients = {}
const canvases = {}

function handleMessage(bytes, clientId) {
    const message = JSON.parse(bytes.toString())
    console.log(message)
    const canvasId = message.canvasId
    Object.keys(clients).forEach((uuid) => {
        if (uuid !== clientId) {
            const client = clients[uuid]
            client.send(JSON.stringify(message))
        }
    })
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

// express routes
app.get('/health', (req, res) => {
    res.send('Server running')
})

app.post('/canvas/:canvasId', (req, res) => {
    console.log(req.body)
})

server.listen(port, () => {
    console.log(`The server is successfully running on port ${port}`)
})