import { Request, Response } from 'express'
import validator from 'validator'
import Character from '../models/characterModel'
import User from '../models/userModel'
import { createToken } from '../utils/createToken'
import { hashPassword } from '../utils/hashPassword'

export const loginUser = async (req: Request, res: Response): Promise<Response> => {
  const { username, password } = req.body

  if (!username || !password) {
    throw new Error('All fields are required')
  }

  try {
    const user = await User.login(username, password)

    if (!user) {
      throw new Error('Invalid username or password')
    }

    const character = await Character.findOne({ user_id: user._id })

    if (character && character._id) {
      const token = createToken(user._id, character._id)

      return res.status(200).send({ token })
    }

    throw new Error('User login failed or token generation failed')
  } catch (err) {
    if (err instanceof Error) {
      return res.status(400).send({ error: err.message })
    } else {
      return res.status(500).send({ error: 'An unknown error occurred' })
    }
  }
}

export const signupUser = async (req: Request, res: Response): Promise<Response> => {
  const { username, password, name, profession } = req.body

  if (!username || !password || !name || !profession) {
    throw new Error('All fields are required')
  }

  try {
    const user = await User.signup(username, password)

    if (!user || !user._id) {
      throw new Error('Failed to create user')
    }

    try {
      const character = await Character.createCharacter(user._id.toString(), name, profession)

      if (!character || !character._id) {
        throw new Error('Failed to create character')
      }

      const token = createToken(user._id, character._id)
      return res.status(200).send({ token })
    } catch (characterErr) {
      await User.deleteOne({ _id: user._id })
      throw characterErr
    }
  } catch (err) {
    if (err instanceof Error) {
      return res.status(400).send({ error: err.message })
    } else {
      return res.status(500).send({ error: 'An unknown error occurred' })
    }
  }
}

export const getUsers = async (req: Request, res: Response): Promise<Response> => {
  try {
    const users = await User.find()

    if (!users.length) {
      return res.status(404).send({ error: 'No users found' })
    }

    return res.status(200).send(users)
  } catch (err) {
    if (err instanceof Error) {
      return res.status(400).send({ error: err.message })
    } else {
      return res.status(500).send({ error: 'An unknown error occurred' })
    }
  }
}

export const deleteUser = async (req: Request, res: Response): Promise<Response> => {
  if (!req.user) {
    return res.status(401).send({ error: 'User not authenticated' })
  }

  const userId = req.user.id

  try {
    const deleteUser = await User.findOneAndDelete({ _id: userId })

    if (!deleteUser) {
      return res.status(404).send({ error: 'User not found' })
    }

    const deleteCharacter = await Character.findOneAndDelete({ user_id: userId })

    if (!deleteCharacter) {
      return res.status(404).send({ error: 'Character not found' })
    }

    if (deleteUser && deleteCharacter) {
      return res.status(200).send({ deletedUser: deleteUser._id, deletedCharacter: deleteCharacter._id })
    }

    throw new Error('Failed to delete user or user character')
  } catch (err) {
    if (err instanceof Error) {
      return res.status(400).send({ error: err.message })
    } else {
      return res.status(500).send({ error: 'An unknown error occurred' })
    }
  }
}

export const updateUser = async (req: Request, res: Response): Promise<Response> => {
  const { newPassword, repeatNewPassword } = req.body

  if (!req.user) {
    return res.status(401).send({ error: 'User not authenticated' })
  }

  const userId = req.user.id

  try {
    if (!newPassword) {
      throw new Error('You need to type a new password')
    }

    if (newPassword === !repeatNewPassword) {
      throw new Error('Passwords are not equal')
    }

    const user = await User.findById({ _id: userId })

    if (!user) {
      return res.status(498).send({ error: 'Id from jwt does not match any user in database' })
    }

    const username = user.username

    if (!validator.isStrongPassword(newPassword)) {
      throw new Error('Password not strong enough')
    }

    const hashedPassword = await hashPassword(newPassword)

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId, username },
      { $set: { password: hashedPassword } },
      { new: true, runValidators: true }
    )

    if (!updatedUser) {
      return res.status(404).send({ error: 'User not found' })
    }

    return res.status(200).send({ success: 'User password updated succesfully' })
  } catch (err) {
    if (err instanceof Error) {
      return res.status(400).send({ error: err.message })
    } else {
      return res.status(500).send({ error: 'An unknown error occurred' })
    }
  }
}