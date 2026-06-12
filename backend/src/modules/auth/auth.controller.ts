import zod, { date, success } from 'zod';
import asyncHandler from 'express-async-handler';
import prisma from '../../db.ts';
import bycrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.ts';
import type { AuthRequest } from '../../middlewares/auth.ts';


// ZOD schema
const registerSchema = zod.object({
    name: zod.string().min(1, 'Name is required'),
    email: zod.string().email('Invalid email'),
    password: zod.string().min(6, 'Password must be at least 6 characters long'),
    role: zod.enum(['ADMIN', 'CANDIDATE', 'RECRUITER'])
});

const loginSchema = zod.object({
    email: zod.string().email('Invalid email'),
    password: zod.string().min(1, 'Password required')
});


// Controller methods
export const registerUser = asyncHandler(async (req, res) => {

    const validData = registerSchema.parse(req.body);

    const user = await prisma.user.findUnique({
        where: { email: validData.email }
    })

    if(user){
        res.status(400).json({ message: `User already exists with mail: ${validData.email}` });
        return;
    }

    // number of times bycrypt runs so same passwords have diff hash
    const costFactor = 10;  
    const hashPass = await bycrypt.hash( validData.password, costFactor );

    const newUser = await prisma.user.create({
        data:{
            name: validData.name,
            email: validData.email,
            password: hashPass,
            role: validData.role
        }
    });

    res.status(201).json({ 
        success: true,
        message: "User registered successfully",
        data: {
            name: newUser.name,
            role: newUser.role
        }
    })

});



export const loginUser = asyncHandler(async (req, res) => {

    const validData = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
        where: { email: validData.email }
    })

    if(!user){
        res.status(400).json({ message: `No user found with mail: ${validData.email}` });
        return;
    }

    const isMatch = await bycrypt.compare(validData.password, user.password);

    if(!isMatch){
        res.status(400).json({ message: 'Invalid credentials' });
        return;
    }

    const token = jwt.sign(
        { userId: user.id, role: user.role },
        env.JWT_SECRET_KEY, // need to get seret like this bcs it expects an  process.env.JWT_SECRET_KEY || fallback but that can be a security issue
        { expiresIn: '2h' }
    );

    res.status(200).json({ 
        success: true,
        message: "Login successful",
        token
    });

});

export const Profile = asyncHandler(async(req:AuthRequest, res) => {

    const user = await prisma.user.findUnique({
        where: { id: req.user?.userId},
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            created_at: true
        }
    });

    if(!user){
        res.status(404);
        throw new Error("User not found");
    }

    res.status(200).json({
        success: true,
        data: user
    });
});
