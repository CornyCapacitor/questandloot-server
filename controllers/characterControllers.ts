import { Request, Response } from 'express'
import Character from '../models/characterModel'

export const getCharacters = async (req: Request, res: Response): Promise<Response> => {
  if (!req.user) {
    return res.status(401).send({ error: 'User not authenticated' })
  }

  const page = parseInt(req.query.page as string) || 1
  const limit = 50
  const skip = (page - 1) * limit

  try {
    const characters = await Character.find()
      .select('name title profession level description -_id')
      .skip(skip)
      .limit(limit)

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