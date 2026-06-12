import asyncHandler from "express-async-handler";
import type {AuthRequest}from "../../middlewares/auth.ts";
import {string, success, z} from "zod";
import { ApplicationStatus } from "@prisma/client";
import prisma from "../../db.ts";
import app from "../../app.ts";


// Zod Schemas
const applySchema = z.object({
    resume: z.string().url("Must be a valid url")
});

const paramsSchema = z.object({
    id: z.string()
});

const statusUpdateSchema = z.object({
    status: z.nativeEnum(ApplicationStatus,{ 
        message: "Invalid status"
    })
});

// Controller methods
export const apply = asyncHandler(async(req:AuthRequest, res) => {
    const {id} = paramsSchema.parse(req.params);
    const validData = applySchema.parse(req.body);

    const internship = await prisma.internship.findUnique({
        where: {id}
    });

    if(!internship){
        res.status(404);
        throw new Error(`${id} is not a valid internship id`)
    }

    if( internship.status !== 'OPEN'){
        res.status(400);
        throw new Error("The apply window has closed");
    }


    const existingApplication = await prisma.application.findFirst({
        where: {
            internship_id: id,
            submitted_by: req.user?.userId
        }
    });

    if(existingApplication){
        res.status(400);
        throw new Error("Application already exists in the system")
    }

    const application =  await prisma.application.create({
        data: {
            resumeUrl: validData.resume,
            internship_id: id,
            submitted_by: req.user!.userId
        }
    });

    res.status(201).json({
        success: true,
        message: "Application submitted successfully",
        data: application
    });
});

export const getApplication = asyncHandler(async(req:AuthRequest,res) =>{ 

    const application = await prisma.application.findMany({
        where: {submitted_by: req.user?.userId},
            include: {
                internship:{
                    select: {
                        title: true,
                        location: true,
                        stipend: true,
                        status: true
                    }
                }
            },
            orderBy : {created_at :'desc'}
    });

    res.status(200).json({
        success: true,
        count: application.length,
        data: application
    });
});

export const getAllApplication = asyncHandler( async(req:AuthRequest, res)=> {
    const {id: internshipId} = req.params;

    const internship = await prisma.internship.findUnique({
        where: {id: String(internshipId)}
    });

    if(!internship){
        res.status(404);
        throw new Error("Internship not found");
    }

    if(internship.created_by !== req.user?.userId){
        res.status(403);
        throw new Error("Not authorized to view the applications");
    }

    const applications = await prisma.application.findMany({
        where: {internship_id: String(internshipId)},
        include: {
            candidate: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        },
        orderBy: {created_at: 'desc'}
    });

    res.status(200).json({
        success: true,
        count: applications.length,
        data: applications
    });
});

export const updateApplication = asyncHandler(async (req: AuthRequest, res) => {
    const {id: applicationId } = req.params;
    const {status} = statusUpdateSchema.parse(req.body);

    const application = await prisma.application.findUnique({
        where:{id : String(applicationId)},
        include: {internship: true} 
    });

    if(!application){
        res.status(404);
        throw new Error("Application not found");
    }

    if( application.internship.created_by !== req.user?.userId ){
        res.status(403);
        throw new Error("Not authorized to update the appllication");
    }

    const updatedApplication = await prisma.application.update({
        where: {id: String(applicationId)},
        data: {status}
    });

    res.status(200).json({
        success: true,
        message: `Application with status changed to ${status}`,
        data: updatedApplication
    });
});