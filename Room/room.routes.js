import e from "express";
import { authMiddleware, isAuthenticated } from "../middlewares/auth.js";
import {
  createRoomHandler,
  deleteRoomHandler,
  getRoomHandler,
  joinRoomHandler,
  leaveRoomHandler,
  updateRoomHandler,
  getAllJoinedRoomsHandler,
  getAllPublicRoomsHandler,
  getRoomMembersHandler,
  getRoomByInviteCodeHandler,
} from "./room.controllers.js";

const router = e.Router();

router.post("/create", isAuthenticated, createRoomHandler);
router.get("/joined", isAuthenticated, getAllJoinedRoomsHandler);
router.get("/public", isAuthenticated, getAllPublicRoomsHandler);
router.get("/members/:id", isAuthenticated, getRoomMembersHandler);
router.get("/details/:id", isAuthenticated, getRoomHandler);

router.post("/join", isAuthenticated, joinRoomHandler);
router.get("/invite/:inviteCode", isAuthenticated, getRoomByInviteCodeHandler);
router.post("/leave", isAuthenticated, leaveRoomHandler);
router.put("/:id", isAuthenticated, updateRoomHandler);
router.delete("/:id", isAuthenticated, deleteRoomHandler);

export default router;
