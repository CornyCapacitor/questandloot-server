// Temporary

import { Router } from 'express'
import { getCharacters } from '../controllers/characterControllers'

const router = Router()

// Login user
router.get('/', getCharacters)

export default router