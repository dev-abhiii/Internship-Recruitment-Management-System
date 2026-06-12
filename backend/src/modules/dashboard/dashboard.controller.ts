import asyncHandler from "express-async-handler";
import prisma from "../../db.ts";
import type { AuthRequest } from "../../middlewares/auth.ts";


// RECRUITER METHODS
export const RecruiterStats = asyncHandler(async (req: AuthRequest, res) => {
    const userId = req.user?.userId;

    const Internships = await prisma.internship.count({
        where: { created_by: String(userId) }
    });

    const Applicants = await prisma.application.count({
        where: {
            internship: { created_by: String(userId) }
        }
    });

    const shortlistedCandidates = await prisma.application.count({
        where: {
            status: 'SHORTLISTED',
            internship: { created_by: String(userId) }
        }
    });

    res.status(200).json({
        success: true,
        data: {
            Internships,
            Applicants,
            shortlistedCandidates
        }
    });
});

// (this route shared by both Recruiter and Admin )
export const totalInternships = asyncHandler( async(req: AuthRequest, res) => {
    const userId = req.user?.userId;
    const userRole = req.user?.role;

    // assigning empty object to ADMINS so they get full access
    const queryCondition = userRole === 'ADMIN' ? {} : { created_by: String(userId) };

    const internships = await prisma.internship.findMany({
        where: queryCondition
    });
    
    res.status(200).json({
        success: true,
        data: {
            totalInternships: internships.length,
            internships
        }
    })
})

export const totalApplication = asyncHandler( async(req: AuthRequest, res) => {
    const userId = req.user?.userId;

    const applications = await prisma.application.findMany({
        where: {
            internship : { created_by : String(userId) }
        }
    });
    
    res.status(200).json({
        success: true,
        data: {
            totalApplications: applications.length,
            applications
        }
    })
})

export const totalShortlisted = asyncHandler( async(req: AuthRequest, res) => {
    const userId = req.user?.userId;

    const shortlisted = await prisma.application.findMany({
        where: {
            status: 'SHORTLISTED',
            internship : { created_by : String(userId) }
        }
    });
    
    res.status(200).json({
        success: true,
        data: {
            totalShortlisted: shortlisted.length,
            shortlisted
        }
    })
})



// ADMIN METHODS
export const AdminStats = asyncHandler(async (req: AuthRequest, res) => {

    const users = await prisma.user.count();

    const Internships = await prisma.internship.count();

    const activeRecruiters = await prisma.user.count({
        where: {
            role: 'RECRUITER',
            is_active: true
        }
    });
    
    res.status(200).json({
        success: true,
        data: {
            users,
            Internships,
            activeRecruiters
        }
    });
});


export const totalUsers = asyncHandler( async( req: AuthRequest, res) => {

    const users = await prisma.user.findMany();

    res.status(200).json({
        success:true,
        data:{
            userCount: users.length,
            users
        }
    })
})

export const activeRecruiters = asyncHandler( async( req: AuthRequest, res) => {

    const recruiters = await prisma.user.findMany({
        where: {
            role : 'RECRUITER',
            is_active: true
        }
    });

    res.status(200).json({
        success:true,
        data:{
            recruiterCount: recruiters.length,
            recruiters
        }
    })
})