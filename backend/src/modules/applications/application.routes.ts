import {Router} from 'express'
import {apply, getApplication, getAllApplication, updateApplication } from './application.controller.ts'
import {protect, allowedRoles} from "../../middlewares/auth.ts"

const router = Router();

router.get('/me' ,protect ,allowedRoles('CANDIDATE'), getApplication );
router.put('/:id/status', protect, allowedRoles('RECRUITER'), updateApplication);

export default router;