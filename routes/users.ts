import { Router } from 'express'
import { deleteUser, getUsers, updateUser } from '../controllers/userControllers'
import { asyncHandler } from '../utils/asyncHandler'

const router = Router()

// Login user
router.get('/', asyncHandler(getUsers))

// Delete user
router.delete('/', asyncHandler(deleteUser))

// Update user
router.patch('/', asyncHandler(updateUser))

export default router