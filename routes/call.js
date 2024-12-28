import express from "express";
const router = express.Router();
import callController from "../controllers/call.js";

import { protectRoute } from "../utilities/middleware.js";

router.post("/", protectRoute, callController.doCall);
router.post("/reject-call", protectRoute, callController.rejectCall);

export default router;