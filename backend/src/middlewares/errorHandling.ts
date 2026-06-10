import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    //zod errors
    if (err instanceof ZodError) {
        const errorMessage = err.issues.map((e) => e.message).join(', ');
        res.status(400).json({
            success: false,
            message: errorMessage
        });
        return;
    }

    //standard errors
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    res.status(statusCode).json({
        success: false,
        message: err.message || 'Interval Server Error'
    });
};