import { Router } from 'express'
import { getUsers } from '../controllers/userControllers'

const router = Router()

// Login user
router.get('/', getUsers)

export default router