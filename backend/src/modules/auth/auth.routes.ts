import { Router } from "express";
import { registerUser, loginUser, Profile} from "./auth.controller.ts";
import { protect } from "../../middlewares/auth.ts";

const router = Router();

router.post('/register',registerUser);
router.post('/login',loginUser);
router.get('/profile',protect, Profile);

export default router;