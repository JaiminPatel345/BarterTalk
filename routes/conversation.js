import express from "express";
import { protectRoute } from "../utilities/middleware.js";
import {
  createGroup,
  getMyGroups,
  addGroupMembers,
  removeGroupMember,
  leaveGroup,
  deleteGroup,
  setAdmin,
  unsetAdmin,
} from "../controllers/conversation.js";

const router = express.Router();

router.post("/groups", protectRoute, createGroup);
router.get("/groups", protectRoute, getMyGroups);
router.post("/groups/:conversationId/members", protectRoute, addGroupMembers);
router.delete(
  "/groups/:conversationId/members/:memberId",
  protectRoute,
  removeGroupMember,
);
router.post("/groups/:conversationId/leave", protectRoute, leaveGroup);
router.delete("/groups/:conversationId", protectRoute, deleteGroup);
router.post(
  "/groups/:conversationId/admins/:memberId",
  protectRoute,
  setAdmin,
);
router.delete(
  "/groups/:conversationId/admins/:memberId",
  protectRoute,
  unsetAdmin,
);

export default router;


