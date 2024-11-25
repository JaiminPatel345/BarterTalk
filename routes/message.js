import express from 'express';
const router = express.Router()
import {
    protectRoute
} from "../utilities/middleware.js"
import {
    sendMessage,
    getMessage,
} from "../controllers/message.js"

router.get("/:userId", protectRoute, getMessage)
router.post("/send/:userId", protectRoute, sendMessage)


export default router