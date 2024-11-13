import cors from 'cors'
import dotenv from 'dotenv'
import express, { Application } from 'express'
import http from 'http'
import mongoose from 'mongoose'
import path from 'path'
import { Server, Socket } from 'socket.io'
import { authenticateToken } from './middlewares/authenticateToken'
import Character from './models/characterModel'
import charactersRoute from './routes/characters'
import loginRoute from './routes/login'
import signupRoute from './routes/signup'
import usersRoute from './routes/users'
import { ClientToServerEvents } from './types/clientEvents'
import { Player } from './types/player'
import { ServerToClientEvents } from './types/serverEvents'

// Env files config
dotenv.config()

// App setup
const app: Application = express()

const REST_PORT = process.env.REST_PORT
const WS_PORT = process.env.WS_PORT
const JWT_SECRET = process.env.JWT_SECRET
const CORS_ORIGIN = process.env.CORS
const MONGO_URI = process.env.MONGO_URI

// HTTP server & websocket server
const server = http.createServer(app)
const socketServer = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
  cors: { origin: CORS_ORIGIN }
})

// MIDDLEWARES
// Static page
app.use('/', express.static(path.join(__dirname, 'public')))
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

  // Send player his player data based on socket.data.user
  socket.emit('init',)

  // Disconnect event
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
  })

  // Update player event
  socket.on('updatePlayer', async (data: Player) => {
    if (!data) {
      socket.emit('error', { message: 'No data to update' })
      return
    }

    try {
      const characterId = data.id

      const updatedCharacter = await Character.findByIdAndUpdate(
        characterId,
        { $set: data },
        { new: true }
      )

      if (updatedCharacter) {
        socket.emit('error', { message: 'Character not found' })
      }

      socket.emit('updateSuccess', updatedCharacter)
    } catch (err) {
      socket.emit('error', { message: 'Cannot update character' })
      return
    }
  })
})

// REST
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
    console.log(`WEBSOCKET server is fire at http://localhost:${WS_PORT}`)
  })
})