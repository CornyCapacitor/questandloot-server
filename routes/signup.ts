import { Router } from 'express'
import { signupUser } from '../controllers/userController'

const router = Router()

// Login user
router.post('/', signupUser)

export default router