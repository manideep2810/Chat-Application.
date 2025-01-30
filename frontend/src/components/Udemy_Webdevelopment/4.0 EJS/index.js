import express from "express";
import ejs from "ejs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import { data } from "react-router-dom";
const __dirname = dirname(fileURLToPath(import.meta.url)); 
const app = express();
const port = 3000;
const day = new Date();

// console.log(day.getDay());

app.use(bodyParser.urlencoded({extended:true}));
     
app.get("/",(req,res)=>{ 
    res.render(__dirname+"/views/index.ejs",{day: day.getDay()});
})
 
app.listen(port,()=>{
    console.log(`listening on port:${port}`);
}) 
