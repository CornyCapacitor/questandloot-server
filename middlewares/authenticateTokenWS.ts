import dotenv from 'dotenv'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { Socket } from 'socket.io'

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET

export const authenticateTokenWS = ((socket: Socket, next: Function) => {
  const token = Array.isArray(socket.handshake.query.token) ? socket.handshake.query.token[0] : socket.handshake.query.token

  if (!token) {
    return next(new Error('Authentication error: No token provided'))
  }

  jwt.verify(token, JWT_SECRET!, (err, decoded) => {
    if (err) {
      return next(new Error('Authentication error: Invalid token'))
    }

    if (typeof decoded === 'object' && 'userId' in decoded && 'characterId' in decoded) {
      socket.data.user = (decoded as JwtPayload).userId;
      socket.data.character = (decoded as JwtPayload).characterId;
    } else {
      return next(new Error('Authentication error: Token payload invalid'));
    }

    next()
  })
})