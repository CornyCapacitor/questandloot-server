import { Router } from 'express'
import { getCharacters } from '../controllers/characterControllers'
import { asyncHandler } from '../utils/asyncHandler'

const router = Router()

// Login user
router.get('/', asyncHandler(getCharacters))

export default router
