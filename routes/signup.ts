import { Router } from 'express'
import { signupUser } from '../controllers/userControllers'
import { asyncHandler } from '../utils/asyncHandler'

const router = Router()

// Login user
router.post('/', asyncHandler(signupUser))

export default router