import { Request, RequestHandler, Response } from 'express'
import Character from '../models/characterModel'
import User from '../models/userModel'
import { createToken } from '../utils/createToken'

export const loginUser: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body

  try {
    const user = await User.login(username, password);

    if (!user) {
      res.status(400).send({ error: 'Invalid username or password' });
      return;
    }

    const character = await Character.findOne({ user_id: user._id })

    if (character && character._id) {
      const token = createToken(user._id, character._id);

      res.status(200).send({ token })
    }

    res.status(400).send({ error: 'User login failed or token generation failed' })
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).send({ error: err.message })
    } else {
      res.status(500).send({ error: 'An unknown error occurred' })
    }
  }
}

export const signupUser: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const { username, password, name, profession } = req.body

  try {
    const user = await User.signup(username, password)

    if (user && user._id) {
      const character = await Character.createCharacter(user._id.toString(), name, profession)

      const token = createToken(user._id, character._id)

      res.status(200).send({ token, character })
    }

    res.status(400).send({ error: 'User creation failed or token generation failed' })
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).send({ error: err.message })
    } else {
      res.status(500).send({ error: 'An unknown error occurred' })
    }
  }
}