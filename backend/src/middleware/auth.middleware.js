import jwt from "jsonwebtoken";
import pg from "pg";

const db = new pg.Client({
    database : "chat_app",
    password : "Collage@2022",
    host : "localhost",
    port : 5432,
    user : "postgres"
});
const JWT_SECRET = "SECRET";

db.connect();

export async function protectRoute(req,res,next){
    try {
        // console.log(req.body);
        const token = req.cookies.jwt;

        if(!token){
            return res.status(401).json({ message: "Unauthorized - No Token Provided" });
        }

        const decode = jwt.verify(token,JWT_SECRET);

        if(!decode){
            return res.status(401).json({ message: "Unauthorized - Invalid Token" });
        }
        console.log(decode);
        // console.log("Inside protectRoute");
        const result = await db.query("SELECT * FROM users WHERE id = $1",[decode.userId]);
        const user = result.rows;
        if(user.length === 0){
            return res.status(404).json({ message: "User not found" });
        }
        req.user = user[0];
        next();
    } catch (error) {
        console.log("Error in protectRoute middleware: ", error.message);
        res.status(500).json({ message: "Internal server error in protectRoute" });
    }
    
}