import { Router } from "express";
import { signup, loginUser } from "../controller/auth.controller.js";

const router = Router();

router.post("/signup" ,signup);
router.post("/login" ,loginUser);

export default router;