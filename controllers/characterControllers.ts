import { Request, RequestHandler, Response } from 'express'
import Character from '../models/characterModel'

export const getCharacters: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const characters = await Character.find().select('-__v')

    if (!characters.length) {
      res.status(404).send({ error: 'No characters found' })
      return
    }

    res.status(200).send(characters)
    return
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).send({ error: err.message })
      return
    } else {
      res.status(500).send({ error: 'An unknown error occurred' })
      return
    }
  }
}