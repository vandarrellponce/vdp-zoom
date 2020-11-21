import express from 'express'
const router = express.Router()
import {
	authUser,
	createUser,
	getUserProfile,
	getUsers,
	logoutAllUserSession,
	logoutUser,
	updateUserProfile,
} from '../controllers/userController.js'
import auth from '../middlewares/authMiddleware.js'
import admin from '../middlewares/adminMiddleware.js'

router.post('/login', authUser)
router.post('/register', createUser)
router.get('/logout', auth, logoutUser)
router.get('/logoutall', auth, logoutAllUserSession)
router.route('/profile').get(auth, getUserProfile).put(auth, updateUserProfile)
router.route('/').post(auth, admin, getUsers)

export default router
