import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
const __dirname = dirname(fileURLToPath(import.meta.url)); 
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
const port = 3000;

var blogTitles = [];
var author = [];
var body = [];

function getIndex(Title){
    for(var i = 0 ; i < blogTitles.length ; i++){
        if(blogTitles[i] === Title){
            return i;
        }
    }
    return -1;
}

app.get("/",(req,res)=>{
    res.render("index.ejs");
})

app.get("/myBlogs" , (req,res)=>{
    console.log(blogTitles.length);
    res.render("myBlogs.ejs",{Title : blogTitles});
})

app.get("/Create" , (req,res)=>{
    res.render("createBlogs.ejs");
})

app.post("/createBlog",(req,res)=>{
    blogTitles.push(req.body["Blog-Name"]);
    author.push(req.body["Author"]);
    body.push(req.body["Body"]);
    res.render("Succesfully.ejs");
})



app.get("/delete/:name",(req,res)=>{
    const blogName = req.params.name;
    var index = getIndex(blogName);
    if(index!==-1){
        blogTitles.splice(index,1);
        author.splice(index,1);
        body.splice(index,1);
    }
    res.redirect("/myBlogs");
})

app.post("/edit" , (req,res)=>{
    const blogName = req.body.Title;
    console.log(req.body);
    var index = getIndex(blogName);
    if(index!==-1){
        blogTitles.splice(index,1);
        author.splice(index,1);
        body.splice(index,1);
    }
    res.render("editt.ejs");
    
})

app.get("/:name",(req,res)=>{
    const blogName = req.params.name;
    var index = getIndex(blogName);
    if(index === -1){
        res.send("Sorry! Unavailable Right Now");
    }
    res.render("viewBlog.ejs",
        {
            Title:blogTitles[index],
            auth:author[index],
            content:body[index]
        }
    );
})


app.listen(port , ()=>{
    console.log(`listening on port:${port}`);
})

// console.log(blogTitles);