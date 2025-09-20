import express from 'express'
import authRoutes from './routes/authRoutes.js'
import messageRoutes from './routes/messageRoutes.js'
import dotenv from 'dotenv'
import { connectDb } from './lib/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';


dotenv.config()

const app = express();
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use(express.json()) 
const PORT = process.env.PORT || 5001

app.use('/api/auth', authRoutes)
app.use('/api/message', messageRoutes)

app.listen(PORT,()=>{
    connectDb();
    console.log(`Server is running on port ${PORT}`);
    
})