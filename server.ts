import cors from 'cors'
import dotenv from 'dotenv'
import express, { Application } from 'express'
import http from 'http'
import jwt from 'jsonwebtoken'
import { Server, Socket } from 'socket.io'
import { authenticateToken } from './middlewares/authenticateToken'

// Env files config
dotenv.config()

// App setup
const app: Application = express()

const REST_PORT = process.env.REST_PORT || 3333
const WS_PORT = process.env.WS_PORT || 3334
const JWT_SECRET = process.env.JWT_SECRET || 'quest&loot'
const CORS_ORIGIN = process.env.CORS || 'http://localhost:3000'

// HTTP server & websocket server
const server = http.createServer(app)
const socketServer = new Server(server, {
  cors: { origin: CORS_ORIGIN }
})

// MIDDLEWARES
// REST: json parse
app.use(express.json())

// REST: Cors config
app.use(cors({
  origin: CORS_ORIGIN,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// WS: Token authenticate
socketServer.use(authenticateToken)

// WEBSOCKET
socketServer.on('connection', (socket: Socket) => {
  console.log('Client connected:', socket.id)
  console.log('Authenticated user:', socket.data.user)

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
  })

  socket.on('playerUpdate', (data) => {

    // Check object type
    // If proper, send to db
    // If db accepts, send back data and send that information back to client
    // If db doesn't accept, get previous data back and force client to revert update

    console.log('Updating player:', data)
  })
})

// REST
app.post('/login', (req: any, res: any) => {
  const { username, password } = req.body

  // Check user in database and retrieve his id
  // Return player id inside token

  if (username === 'username' && password === 'password') {
    const id = 1
    const token = jwt.sign({ id }, JWT_SECRET, { expiresIn: '1h' })
    return res.json({ token })
  }

  res.status(401).send('Invalid credentials')
})

// Listeners
app.listen(REST_PORT, () => {
  console.log(`REST server is fire at http://localhost:${REST_PORT}`)
})

server.listen(WS_PORT, () => {
  console.log(`WEBSOCKET server is fire at http://localhost:${WS_PORT}`)
})