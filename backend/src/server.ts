import app from './app.ts';
import { env } from './config/env.ts';

const PORT = env.PORT || 8000;

app.listen(PORT,()=>{
    console.log('Server is running');
})