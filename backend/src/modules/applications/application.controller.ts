import asyncHandler from "express-async-handler";
import type {AuthRequest}from "../../middlewares/auth.ts";
import {z} from "zod";
import prisma from "../../db.ts";


// Zod Schemas
const applySchema = z.object({
    resume: z.string().url("Must be a valid url")
});

const paramsSchema = z.object({
    id: z.string()
});

// controller methods
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
});
