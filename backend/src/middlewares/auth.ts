import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { env } from '../config/env.ts';

export interface AuthRequest extends Request{
    user?: {
        userId: string;
        role: string;
    };
}

export const protect = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction)=>{
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(
                token,
                env.JWT_SECRET_KEY
            ) as {userId: string; role: string};

            req.user = decoded; // attaching decoded data with req object

            next();
        }
        catch(eror){
            res.status(401);
            throw new Error('Not authorized, ivalid token')
        }
    }

    if(!token){
        res.status(401);
        throw new Error('No token found')
    }
});

// RBAC
export const allowedRoles = (...allowedRoles : string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if(!req.user || !allowedRoles.includes(req.user.role)){
            res.status(403);
            throw new Error(`${req.user?.role} is not authorized to access this route`)
        }
        next();
    };
};
