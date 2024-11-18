// Libs
import cors from 'cors'
import dotenv from 'dotenv'
import express, { Application } from 'express'
import http from 'http'
import mongoose from 'mongoose'
import path from 'path'
import { Server, Socket } from 'socket.io'
// Middlewares
import { authenticateToken } from './middlewares/authenticateToken'
// Types
import { ClientToServerEvents } from './types/clientEvents'
import { ServerToClientEvents } from './types/serverEvents'
// Routes
import charactersRoute from './routes/characters'
import loginRoute from './routes/login'
import rootRoute from './routes/root'
import signupRoute from './routes/signup'
import usersRoute from './routes/users'
// Sockets
import { emitInit } from './events/emit/emitInit'
import { onDisconnect } from './events/on/onDisconnect'
import { onUpdate } from './events/on/onUpdate'

// Env files config
dotenv.config()

// App setup
const app: Application = express()

const REST_PORT = process.env.REST_PORT
const WS_PORT = process.env.WS_PORT
const CORS_ORIGIN = process.env.CORS
const MONGO_URI = process.env.MONGO_URI

// HTTP server & websocket server
const server = http.createServer(app)
const socketServer = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
  // cors: { origin: CORS_ORIGIN }
  cors: { origin: '*' }
})

// MIDDLEWARES
// Static page
app.use('/', express.static(path.join(__dirname, 'public')))
// REST: json parse
app.use(express.json())

// REST: Cors config
app.use(cors({
  // origin: CORS_ORIGIN,
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// Static page
app.use('/', express.static(path.join(__dirname, 'public')))

// WS: Token authenticate
socketServer.use(authenticateToken)

// WEBSOCKET
socketServer.on('connection', (socket: Socket) => {
  console.log('Client connected:', socket.id)

  // Initial character send
  emitInit(socket)

  // On liteners
  onDisconnect(socket)
  onUpdate(socket)
  socket.on('error', (err) => {
    console.error(err)
  })
})

// REST
app.use('/', rootRoute)
app.use('/api/login', loginRoute)
app.use('/api/signup', signupRoute)
app.use('/api/users', usersRoute)
app.use('/api/characters', charactersRoute)

// Listeners
mongoose.connect(MONGO_URI!).then(() => {
  console.log('Connected to mongodb!')

  app.listen(REST_PORT, () => {
    console.log(`REST server is fire at http://localhost:${REST_PORT}`)
  })

  server.listen(WS_PORT, () => {
    console.log(`WEBSOCKET server is fire at ws://localhost:${WS_PORT}`)
  })
})