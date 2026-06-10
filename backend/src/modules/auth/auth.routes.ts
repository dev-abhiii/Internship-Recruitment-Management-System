import { Router } from "express";
import { registerUser } from "./auth.controller.ts";

const router = Router();

router.post('/register',registerUser);

export default router;