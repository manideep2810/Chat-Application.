import pg from "pg";
import cloudinary from "../lib/cloudinary.js";
import { io,getReceiverSocketId } from "../lib/socket.js";

const db = new pg.Client({
    database : "chat_app",
    password : "Collage@2022",
    host : "localhost",
    port : 5432,
    user : "postgres"
});

db.connect();

export const getUsersForSidebar = async (req,res) => {
    try {
        const loggedinUserId = req.user.id;
        const result = await db.query("SELECT * FROM users WHERE id <> $1",[loggedinUserId]);
        const filteredUsers = result.rows;
        res.status(200).json(filteredUsers); 
    } catch (error) {
        console.log("Error in getUsersFor Sidebar :",error.message);
        res.status(500).json({error : "Internal server Error"});
    }
};

export const getMessages = async(req,res)=>{
    console.log("Inside get Messages");
    try {
        const {id : userToChatId} = req.params;
        const senderId = req.user.id;
        console.log(req);

        // const messages = await MediaKeyMessageEvent;
        const result = await db.query("SELECT * FROM messages WHERE (senderId = $1 and receiverId = $2) or (senderId = $2 and receiverId = $1)",[userToChatId,senderId]);
        const messages = result.rows;
        // console.log(messages);
        res.status(200).json(messages);
    } catch (err) {
        console.log("error in getMessages Controller :", err.message);
        res.status(500).json({error : "Internal Server Error"});
    }
}

export const sendMessage = async(req,res)=>{
    // console.log(req.params.id);
    try {
        
        const {text , image } = req.body;
        const {id : receiverId} = req.params;
        const senderId = req.user.id;

        let imageurl;
        if(image){
            const uploadedResponse = await cloudinary.uploader.upload(image);
            imageurl = uploadedResponse.secure_url;
        }
        let today = new Date();
        let dateTime = today.toLocaleString();
        let result = await db.query("INSERT INTO messages (senderId,receiverId,text,image,createdat) VALUES ($1,$2,$3,$4,$5) RETURNING *",[senderId,receiverId,text,imageurl,dateTime]);
        const newMessage = result.rows[0];
        // todo :add socket io

        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("newMessage", newMessage);
        }
    

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage controller : " , error.message);
        res.status(500).json({error : "Internal Server error"});
    }
}