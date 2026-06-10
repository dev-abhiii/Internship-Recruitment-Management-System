import { Router } from "express";
import { registerUser } from "./auth.controller.ts";
import { loginUser } from "./auth.controller.ts";

const router = Router();

router.post('/register',registerUser);
router.post('/login',loginUser)

export default router;