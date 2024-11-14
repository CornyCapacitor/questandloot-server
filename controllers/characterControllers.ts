import { Request, Response } from 'express'
import Character from '../models/characterModel'

export const getCharacters = async (req: Request, res: Response): Promise<Response> => {
  try {
    const characters = await Character.find().select('-__v')

    if (!characters.length) {
      return res.status(404).send({ error: 'No characters found' })
    }

    return res.status(200).send(characters)

  } catch (err) {
    if (err instanceof Error) {
      return res.status(500).send({ error: err.message })

    } else {
      return res.status(500).send({ error: 'An unknown error occurred' })

    }
  }
}