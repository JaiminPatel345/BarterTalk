import express from "express";
const router = express.Router();

import UserController from "../controllers/user.js";
import { protectRoute } from "../utilities/middleware.js";

router.get("/users", protectRoute, UserController.getUsers);
router.post("/user/profile", protectRoute, UserController.UpdateProfile);

export default router;
