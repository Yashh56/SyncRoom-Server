import e from "express";
import {
  allChatsByIdHandler,
  createChatHandler,
  joinChatHandler,
  oneOnOneChatHandler,
} from "./chat.controllers.js";
import { authMiddleware } from "../middlewares/auth.js";
const router = e.Router();

router.post("/start", authMiddleware, createChatHandler);
router.put("/join", authMiddleware, joinChatHandler);
router.get("/:roomId", authMiddleware, allChatsByIdHandler);
router.get("/:currentUserId/:otherUserId", authMiddleware, oneOnOneChatHandler);
export default router;
