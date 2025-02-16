import { Router } from 'express'
import { getCharacters } from '../controllers/characterControllers'
import { authenticateTokenREST } from '../middlewares/authenticateTokenREST'
import { asyncHandler } from '../utils/asyncHandler'

const router = Router()

// Login user
router.get('/', authenticateTokenREST, asyncHandler(getCharacters))

export default router
