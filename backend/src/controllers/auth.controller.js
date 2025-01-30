import pg from "pg";
import bcrypt from "bcrypt";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

const db = new pg.Client({
    database : "chat_app",
    password : "Collage@2022",
    host : "localhost",
    port : 5432,
    user : "postgres"
});

db.connect();


// db.query()

export const signup = async (req,res) => {
    let {fullName,email,password} = req.body;
    try{
        // console.log("right here!");
        // console.log(req.body);
        if(password.length < 6){
            return res.status(400).json({message : "password must be atleast 6 characters"});
        }

        const result = await db.query("SELECT * FROM users WHERE email = $1",[email]);
        // console.log(result);
        if(result.rows.length > 0){
            return res.status(400).json({message : "Email already exists"});
        }
        // return res.send("Hi");
        bcrypt.hash(password , 10 , async (err,hash)=>{
            if(err){
                return res.status(400).json({message : "Some Internal Error"});
            }
            let today = new Date();
            let date = today.toLocaleDateString();
            let result1 = await db.query("INSERT INTO users (email,fullname,password,createdat) VALUES ($1,$2,$3,$4) RETURNING *",[email,fullName,hash,date]);
            
            generateToken(result1.rows[0].id , res);
            // console.log(result1);
            return res.status(201).json({
                id : result1.rows[0].id,
                fullName : result1.rows[0].fullname,
                email : result1.rows[0].email,
                profilePic : result1.rows[0].profilepic,
            });
        })
    } catch(err){
        console.log("Error in signup controller",err.message);
        res.status(500).json({message : "internal server Error"});
    }
}

export async function login(req,res){
    const { email, password } = req.body;
    try {
        const result = await db.query("SELECT * FROM users WHERE email = $1",[email]);
        if(result.rows.length === 0){
            return res.status(400).json({ message: "Invalid credentials" });
        }

        bcrypt.compare(password , result.rows[0].password , (err,same)=>{
            if(err){
                console.log(err.message);
                return res.status(500).json({ message: "Internal Server Error in comparing passwords" });
            }
            if(!same){
                return res.status(400).json({ message: "Invalid credentials" });
            }
            
            generateToken(result.rows[0].id , res);
            return res.status(201).json({
                id : result.rows[0].id,
                fullName : result.rows[0].fullname,
                email : result.rows[0].email,
                profilePic : result.rows[0].profilepic,
            });
            
        })
    } catch (error) {
        console.log("Error in login controller",err.message);
        res.status(500).json({message : "internal server Error"});
    }
}

export function logout(req,res){
    try {
        res.cookie("jwt","",{maxAge : 0});
        res.status(200).json({message : "Logged out Succesfully"});
    } catch (error) {
        console.log("Error in logout controller",error.message);
        res.status(500).json({message : "Internal Server Error"});
    }
}

export async function updateProfile(req,res){
    try {
        const {profilePic} = req.body;
        const userid = req.user.id;
        if(!profilePic){
            return res.status(400).json({message : "No profile pic uploaded"});
        }
        const uploadedResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await db.query("UPDATE users SET profilepic = $1 WHERE id = $2 RETURNING *",[uploadedResponse.secure_url,userid]);
        res.status(200).json(updatedUser.rows[0]);
    } catch (error) {
        console.log("error in updating profile",error);
        res.status(500).json({message : "Internal server Error"});
    }
}

export async function checkAuth(req,res) {
    try{
        res.status(200).json(req.user);
    } catch (err){
        res.status(500).json({message : "Internal Server Error in checkAuth"});
    }
}


