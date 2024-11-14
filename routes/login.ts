import { Router } from 'express'
import { loginUser } from '../controllers/userControllers'
import { asyncHandler } from '../utils/asyncHandler'

const router = Router()

// Login user
router.post('/', asyncHandler(loginUser))

export default router