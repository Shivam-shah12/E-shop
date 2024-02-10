import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import {createServer} from "http"
import connect from "./config/database.js";
import cookieParser from "cookie-parser";
// all Routes
import seller from "./routes/seller.js";
import user from "./routes/user.js";
import common from "./routes/common.js"

// env File
dotenv.config();
// Database Connection
connect();


const PORT=process.env.PORT || 8000
const app=express();
const server=createServer(app);


// app uses
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials:true
}))
app.use("/api/user",user);
app.use("/api/seller",seller);
app.use("/",common);



// server listen
server.listen(PORT, () => {
    console.log(`server is running at PORT Number ${PORT} `);
  });