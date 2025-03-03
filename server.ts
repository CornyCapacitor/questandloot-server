// Configuration libraries
import dotenv from 'dotenv'
import express, { Application } from 'express'
import http from 'http'
import mongoose from 'mongoose'
import path from 'path'
import { Server, Socket } from 'socket.io'
// Middlewares
import cors from 'cors'
import mongoSanitize from 'express-mongo-sanitize'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import { authenticateTokenWS } from './middlewares/authenticateTokenWS'
// Types
import { ClientToServerEvents } from './types/clientEvents'
import './types/globals'
import { ServerToClientEvents } from './types/serverEvents'
// Routes
import charactersRoute from './routes/characters'
import loginRoute from './routes/login'
import rootRoute from './routes/root'
import signupRoute from './routes/signup'
import usersRoute from './routes/users'
// Socket actions
import { emitInit } from './events/emit/emitInit'
import { onDisconnect } from './events/on/onDisconnect'
import { onUpdate } from './events/on/onUpdate'

// Env files config
dotenv.config()

// App setup
const app: Application = express()

const REST_PORT = process.env.PORT || 443
const WS_PORT = process.env.WS_PORT || 443
const CORS_ORIGIN = process.env.CORS_ORIGIN
const MONGO_URI = process.env.MONGO_URI

// HTTP server & websocket server
const server = http.createServer(app)
const socketServer = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ["GET", "POST"]
  }
})

// MIDDLEWARES
// IP verification
app.set('trust proxy', 1)
// Static page
app.use('/', express.static(path.join(__dirname, 'public')))
// REST: json parse
app.use(express.json())

// REST: Cors config
app.use(cors({
  origin: CORS_ORIGIN,
  // origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// Helmet
app.use(helmet())

// Limiter
app.use(rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 60
}))

// Mongo sanitize
app.use(mongoSanitize())

// Static page
app.use('/', express.static(path.join(__dirname, 'public')))

// WS: Token authenticate
socketServer.use(authenticateTokenWS)

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
  console.log('Connected to Quest and Loot database!')
  console.log("CORS_ORIGIN:", CORS_ORIGIN)

  app.listen(REST_PORT, () => {
    console.log(`REST server is fire at PORT ${REST_PORT}`)
  })

  server.listen(WS_PORT, () => {
    console.log(`WEBSOCKET server is fire at PORT ${WS_PORT}`)
  })
})