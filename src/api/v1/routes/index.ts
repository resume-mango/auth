import express from 'express'
import mainController from '../controllers/main'
import authController from '../controllers/auth'

import privateController from '../controllers/private'
import { requiresAuth } from 'express-openid-connect'

const router = express.Router()
router.get('/', requiresAuth(), mainController.home)
router.get('/data', mainController.initialData)
router.get('/refresh', mainController.refreshSession)
router.get('/private/token', privateController.token)
router.get('/login', authController.login)
router.get('/logout', authController.logout)

export default router
