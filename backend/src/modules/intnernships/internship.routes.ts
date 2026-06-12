import { Router } from "express";
import { createInternship, getSingleInternship ,getInternship , updateInternship, deleteInternship} from "./internship.controller.ts";
import { protect, allowedRoles } from "../../middlewares/auth.ts";
import {apply, getAllApplication} from "../applications/application.controller.ts"

const router = Router();

router.get('/', protect, getInternship);
router.get('/:id', protect, getSingleInternship);
router.post('/', protect, allowedRoles('RECRUITER'), createInternship);
router.put('/:id', protect, allowedRoles('RECRUITER'), updateInternship);
router.delete('/:id',protect, allowedRoles('RECRUITER'), deleteInternship);

router.post('/:id/apply', protect, allowedRoles('CANDIDATE'), apply)
router.get('/:id/applications', protect, allowedRoles('RECRUITER'), getAllApplication);

export default router;