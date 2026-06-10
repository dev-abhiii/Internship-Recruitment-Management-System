import express from 'express';

const app = express();

app.use(express.json());

// health route
app.get('/health', (req,res)=>{
    res.status(200).json({
        success: true,
        message: 'Server is healthy'
    })
})

export default app;