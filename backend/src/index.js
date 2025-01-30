import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import cookieParser from "cookie-parser";
import pg from "pg";
import cors from "cors";
import {app,server} from "./lib/socket.js"


app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin : "http://localhost:5173",
    credentials : true,
}))

app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);

const PORT = 5001;
const db = new pg.Client({
    database : "chat_app",
    password : "Collage@2022",
    host : "localhost",
    port : 5432,
    user : "postgres"
});

db.connect();



server.listen(PORT,()=>{
    console.log(`listening on port:${PORT}!`);
})

