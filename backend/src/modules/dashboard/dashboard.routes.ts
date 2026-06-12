import { Router } from "express";
import { RecruiterStats, AdminStats } from "./dashboard.controller.ts";
import { totalInternships, totalApplication, totalShortlisted } from "./dashboard.controller.ts";
import { totalUsers, activeRecruiters } from "./dashboard.controller.ts";
import { protect, allowedRoles } from "../../middlewares/auth.ts";

const router = Router();

router.get('/internships', protect, allowedRoles('RECRUITER', 'ADMIN'), totalInternships);
router.get('/applications', protect, allowedRoles('RECRUITER'), totalApplication);
router.get('/shortlisted', protect, allowedRoles('RECRUITER'), totalShortlisted);
router.get('/stats', protect, allowedRoles('RECRUITER'), RecruiterStats)

router.get('/users', protect, allowedRoles('ADMIN'), totalUsers);
router.get('/active_recruiters', protect, allowedRoles('ADMIN'), activeRecruiters);
router.get('/stats', protect, allowedRoles('ADMIN'), AdminStats);

export default router;