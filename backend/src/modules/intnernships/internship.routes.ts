import { Router } from "express";
import { createInternship, getInternship , updateInternship, deleteInternship} from "./internship.controller.ts";
import { protect, allowedRoles } from "../../middlewares/auth.ts";

const router = Router();

router.get('/', protect, getInternship);
router.post('/', protect, allowedRoles('RECRUITER'), createInternship);
router.put('/:id', protect, allowedRoles('RECRUITER'), updateInternship);
router.delete('/:id',protect, allowedRoles('RECRUITER'), deleteInternship)

export default router;