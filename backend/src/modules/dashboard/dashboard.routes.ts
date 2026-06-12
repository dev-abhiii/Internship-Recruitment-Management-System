import { Router } from "express";
import { RecruiterStats, recruiterInternships, totalApplication, totalShortlisted } from "./dashboard.controller.ts";
import { AdminStats, adminInternships, totalUsers, activeRecruiters } from "./dashboard.controller.ts";
import { protect, allowedRoles } from "../../middlewares/auth.ts";

const router = Router();

router.get('/recruiter/stats', protect, allowedRoles('RECRUITER'), RecruiterStats);
router.get('/recruiter/internships', protect, allowedRoles('RECRUITER'), recruiterInternships);
router.get('/applications', protect, allowedRoles('RECRUITER'), totalApplication);
router.get('/shortlisted', protect, allowedRoles('RECRUITER'), totalShortlisted);

router.get('/admin/stats', protect, allowedRoles('ADMIN'), AdminStats);
router.get('/admin/internships', protect, allowedRoles('ADMIN'), adminInternships);
router.get('/users', protect, allowedRoles('ADMIN'), totalUsers);
router.get('/active_recruiters', protect, allowedRoles('ADMIN'), activeRecruiters);

export default router;