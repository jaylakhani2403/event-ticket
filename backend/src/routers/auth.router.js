import authMiddleware from "../middlewares/auth.middleware.js";

import { Router } from "express";
import { signup, loginUser } from "../controllers/auth.controller.js";

const router = Router();

router.post("/signup",signup ,signup);
router.post("/login", authMiddleware,loginUser);

export default router;