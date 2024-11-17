import express from "express"
const router = express.Router()
import authController from '../controllers/auth.js'

router.get("/login", authController.login)
router.get("/signup", authController.signup)
router.get("/output", authController.logout)


export default router;