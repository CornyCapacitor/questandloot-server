import { Request, Response } from 'express'
import Character from '../models/characterModel'

export const getCharacters = async (req: Request, res: Response): Promise<Response> => {
  // For now I don't want it to be behind authentication since the game allows only socketed users to use this endpoint
  // if (!req.user) {
  //   return res.status(401).send({ error: 'User not authenticated' })
  // }

  const page = parseInt(req.query.page as string) || 1
  const limit = parseInt(req.query.limit as string) || 50
  const skip = (page - 1) * limit

  try {
    const characters = await Character.find()
      .select('name title profession level description -_id')
      .skip(skip)
      .limit(limit)
      .sort({ level: -1 })

    if (!characters.length) {
      return res.status(404).send({ error: 'No characters found' })
    }

    const totalCharacters = await Character.countDocuments()
    const totalPages = Math.ceil(totalCharacters / limit)

    return res.status(200).send({
      data: characters,
      currentPage: page,
      totalPages,
      totalCharacters,
      perPage: limit
    })
  } catch (err) {
    if (err instanceof Error) {
      return res.status(500).send({ error: err.message })

    } else {
      return res.status(500).send({ error: 'An unknown error occurred' })

    }
  }
}