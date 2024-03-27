import express,{Request,Response} from 'express';
import cors from 'cors';
import "dotenv/config";
import mongoose from 'mongoose';
import userRoutes from './routes/users';
import authRoutes from "./routes/auth";

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string)

const app=express();
app.use(express.json())
app.use(express.urlencoded({extended:true}))
// Example: Allow requests only from http://localhost:5173
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true // Set this if your frontend sends credentials (e.g., cookies)
  }));
  

app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);

app.listen(7000 , ()=>{
    console.log("server running on localhost 7000");
});

