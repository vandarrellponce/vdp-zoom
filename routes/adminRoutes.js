import express from 'express'
import {
	deleteUser,
	getUser,
	updateUser,
} from '../controller/userController.js'
import admin from '../middlewares/adminMiddleware.js'
import auth from '../middlewares/authMiddleware.js'
const router = express.Router()

router
	.route('/users/:id')
	.delete(auth, admin, deleteUser)
	.get(auth, admin, getUser)
	.put(auth, admin, updateUser)

export default router
