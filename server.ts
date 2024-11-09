import dotenv from 'dotenv'
import express, { Application, Request, Response } from 'express'
import http from 'http'
import { WebSocket, WebSocketServer } from 'ws'

// Env files config
dotenv.config()

// App setup
const app: Application = express()
const REST_PORT = process.env.REST_PORT || 3333
const WS_PORT = process.env.WS_PORT || 3334

// HTTP server & websocket server
const server = http.createServer(app)
const socket = new WebSocketServer({ server })

// WEBSOCKET
socket.on('connection', (ws: WebSocket) => {
  console.log('Client connected')

  // Disconnect event
  socket.on('disconnect', () => {
    console.log('Client disconnected')
  })
})

// REST
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Express & TypeScript Server!')
})

// Listeners
app.listen(REST_PORT, () => {
  console.log(`REST server is fire at https://localhost:${REST_PORT}`)
})

server.listen(WS_PORT, () => {
  console.log(`WEBSOCKET server is fire at https://localhost:${WS_PORT}`)
})