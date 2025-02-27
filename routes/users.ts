import { Router } from 'express'
import { deleteUser, updateUser } from '../controllers/userControllers'
import { authenticateTokenREST } from '../middlewares/authenticateTokenREST'
import { asyncHandler } from '../utils/asyncHandler'

const router = Router()

// Login user
// router.get('/', asyncHandler(getUsers))

// Delete user
router.delete('/', authenticateTokenREST, asyncHandler(deleteUser))

// Update user
router.patch('/', authenticateTokenREST, asyncHandler(updateUser))

export default router