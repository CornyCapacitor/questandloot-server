import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { Socket } from 'socket.io'

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET || 'quest&loot'

export const authenticateToken = ((socket: Socket, next: Function) => {
  const token = Array.isArray(socket.handshake.query.token) ? socket.handshake.query.token[0] : socket.handshake.query.token

  if (!token) {
    return next(new Error('Authentication error: No token provided'))
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(new Error('Authentication error: Invalid token'))
    }

    socket.data.user = decoded
    next()
  })
})