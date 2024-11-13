import { Router } from 'express'
import { signupUser } from '../controllers/userControllers'

const router = Router()

// Login user
router.post('/', signupUser)

export default router