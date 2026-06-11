import express from 'express';
import authRoutes from './modules/auth/auth.routes.ts'
import internshipRoutes from './modules/intnernships/internship.routes.ts'
import { errorHandler } from './middlewares/errorHandling.ts';

const app = express();

app.use(express.json());

// health route
app.get('/health', (req,res)=>{
    res.status(200).json({
        success: true,
        message: 'Server is healthy'
    })
})

app.use('/auth', authRoutes);
app.use('/internships', internshipRoutes);

app.use(errorHandler);

export default app;