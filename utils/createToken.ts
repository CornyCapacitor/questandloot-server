import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

dotenv.config()

const JWT_SECRET = process.env.JWT_SERCRET

export const createToken = (userId: any, characterId: any): string => {
  return jwt.sign({ userId, characterId }, JWT_SECRET!, { expiresIn: '1h' })
}