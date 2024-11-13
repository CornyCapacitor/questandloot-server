import { Router } from 'express'
import { loginUser } from '../controllers/userControllers'

const router = Router()

// Login user
router.post('/', loginUser)

export default router