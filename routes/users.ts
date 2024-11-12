import { Router } from 'express'
import { getUsers } from '../controllers/userController'

const router = Router()

// Login user
router.get('/', getUsers)

export default router