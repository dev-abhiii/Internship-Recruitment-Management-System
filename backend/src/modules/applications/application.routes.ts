import {Router} from 'express'
import {getApplication} from './application.controller.ts'
import {protect, allowedRoles} from "../../middlewares/auth.ts"

const router = Router();

router.get('/me' ,protect ,allowedRoles('CANDIDATE'), getApplication );

export default router;