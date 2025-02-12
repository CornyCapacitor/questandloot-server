import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../models/userModel';

const JWT_SECRET = process.env.JWT_SECRET

export const authenticateTokenREST = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // "Bearer TOKEN"

  if (!token) {
    return next(new Error('Authentication error: No token provided'))
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET!) as JwtPayload

    if (!decoded.userId) {
      return next(new Error('Authentication error: Invalid token'))
    }

    const decodedId = decoded.userId

    const user = await User.findById(decodedId)

    if (!user) {
      return next(new Error('Authentication error: User not found'))
    }

    const userId = user._id

    req.user = { id: userId }
    next()
  } catch (err) {
    return next(new Error('Authentication error: Token payload invalid'));
  }
};