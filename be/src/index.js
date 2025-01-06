const http = require("http")
const { WebSocketServer } = require("ws")
const { v4: uuidv4 } = require("uuid")

const port = process.env.PORT || 3000
const server = http.createServer()
const wsServer = new WebSocketServer({server})
const clients = {}

function handleMessage(bytes, clientId) {
    const message = JSON.parse(bytes.toString())
    console.log(message)
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

server.listen(port, () => {
    console.log(`The server is successfully running on port ${port}`)
})