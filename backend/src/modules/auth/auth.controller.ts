import zod from 'zod';
import asyncHandler from 'express-async-handler';
import prisma from '../../db.ts';
import bycrypt from 'bcrypt';


//validation
const registerSchema = zod.object({
    name: zod.string().min(1, 'Name is required'),
    email: zod.string().email('Invalid email'),
    password: zod.string().min(6, 'Password must be at least 6 characters long'),
    role: zod.enum(['ADMIN', 'CANDIDATE', 'RECRUITER'])
});


// registration controller
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
        message: "User registered successfully",
        data: {
            name: newUser.name,
            role: newUser.role
        }
    })

});

