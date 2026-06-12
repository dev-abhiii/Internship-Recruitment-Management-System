import asyncHandler from "express-async-handler";
import {int, success, z} from "zod";
import prisma from "../../db.ts";
import type { AuthRequest } from "../../middlewares/auth.ts";

// ZOD Schemas
const createInternshipSchema = z.object({
    title: z.string().min(3,"Enter appropriate title"),
    description: z.string().min(9,"Description required"),
    stipend: z.number().int().positive("Enter valid stipend"),
    location: z.string().min(2,"location required"),
    skill_required: z.array(z.string()).nonempty("Enter a skill"),
    deadline: z.string().date("Invalid date format. Use YYYY-MM-DD")
});

const updateSchema = createInternshipSchema.partial();


// CONTROLLER METHODS
export const createInternship = asyncHandler(async(req:AuthRequest,res)=>{
    const validData = createInternshipSchema.parse(req.body);

    if(!req.user){
        res.status(401);
        throw new Error("No user found");
    }

    const correctedSkills = validData.skill_required.map(skill => skill.toLowerCase());

    const newInternship = await prisma.internship.create({
        data: {
            title: validData.title,
            description: validData.description,
            stipend : validData.stipend,
            location: validData.location,
            skill_required: correctedSkills,
            deadline: new Date(validData.deadline),
            created_by: req.user.userId
        }
    });

    res.status(201).json({
        success: true,
        message: "Internship created sucesfully",
            data: newInternship
    });
});


export const getInternship = asyncHandler(async(req:AuthRequest,res)=>{

    const { location, skills, status, page, limit, sortby, order } = req.query;

    const pageNo = Number(page) || 1;
    const pageEntries = Number(limit) || 10;
    const skip = (pageNo - 1) * pageEntries;

    // filteing conditions
    const where: any = {};
    
    if(location){
        where.location = {
            contains: String(location),
            mode: "insensitive"
        };
    }

    if(status){
        where.status = String(status).toUpperCase();
    }

    if(skills){
        where.skill_required = { has: String(skills).toLocaleLowerCase() }; 
    }

    const sortBy = String( sortby || "created_at" );    
    const sortOrder = String ( order || 'desc' );

    const totalInternships = await prisma.internship.count({
        where
    })

    const internships = await prisma.internship.findMany({
        where,
        skip,
        take: pageEntries,
        orderBy: {
            [sortBy] : sortOrder
        }
    });

    res.status(200).json({
        success: true,
        page: {
            totalInternships,
            currentPage : pageNo,
            totalPage: (totalInternships / pageEntries),
            limit: pageEntries
        },
        data: internships
    });
});

export const updateInternship = asyncHandler(async(req: AuthRequest,res) =>{

    const {id} = req.params;
    const validData = updateSchema.parse(req.body);

    const internship = await prisma.internship.findUnique({
        where: {id: String(id)}
    });

    if(!internship){
        res.status(404);
        throw new Error("Internship not found");
    }

    if( internship.created_by !== req.user?.userId){
        res.status(403);
        throw new Error("Yoou are not authorized to update this internship");
    }

    const updateInternship = await prisma.internship.update({
        where: {id: String(id)},
        data: validData
    });

    res.status(200).json({
        success: true,
        message: "Internship updated successfully",
        data: updateInternship
    })
})

export const deleteInternship = asyncHandler(async(req:AuthRequest, res) => {

    const {id} = req.params;

    const internship = await prisma.internship.findUnique({
        where: {id: String(id)}
    });

    if(!internship){
        res.status(404);
        throw new Error(`No internship found with id ${id}`);
    }

    if(internship.created_by !== req.user?.userId){
        res.status(403);
        throw new Error("You are not authorized to delete this internship");
    }

    await prisma.internship.delete({
        where: {id: String(id)}
    });

    res.status(200).json({
        success: true,
        message : `Internship with ${id} deleted successfully`
    })
})


export const getSingleInternship = asyncHandler(async (req:AuthRequest, res) => {
    const {id} =req.params;

    const internship = await prisma.internship.findUnique({
        where: {id: String(id)},
        include: {
            recruiter: {
                select: {
                    name: true, email: true
                }
            }
        }
    })

    if(!internship){
        res.status(404);
        throw new Error("No internship found");
    }

    res.status(200).json({
        success: true,
        data : internship
    });
})
