import express from "express"
const router = express.Router()
import authController from '../controllers/auth.js'

router.post("/login", authController.login)
router.post("/signup", authController.signup)
router.post("/logout", authController.logout)


export default router;