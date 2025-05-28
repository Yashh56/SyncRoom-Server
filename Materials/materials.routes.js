import e from "express";

import {
  createMaterialHandler,
  deleteMaterialHandler,
  getMaterialsHandler,
  updateMaterialHandler,
} from "./materials.controllers.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = e.Router();

router.post("/:roomId", isAuthenticated, createMaterialHandler);
router.get("/:roomId", isAuthenticated, getMaterialsHandler);
router.put("/update", isAuthenticated, updateMaterialHandler);
router.delete("/:materialId", isAuthenticated, deleteMaterialHandler);

export default router;
