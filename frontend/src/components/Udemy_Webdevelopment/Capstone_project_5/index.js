import express from "express";
import axios from "axios";
import pg from "pg";
import brcypt from "bcrypt";

const saltRounds = 10;

const app = express();
const port = 3000;
const db = new pg.Client({
    host : "localhost",
    port : 5432,
    database : "bookNotes",
    user : "postgres",
    password : "Collage@2022",
});

db.connect();

app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/login",(req,res)=>{
    res.render("login.ejs");
})

app.post("/users/register", async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (checkResult.rows.length > 0) {
      res.send("Email already exists. Try logging in.");
    } else {
      brcypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.log(err);
        }else{
          const result = await db.query(
            "INSERT INTO users (name , email, password) VALUES ($1, $2 , $3)",
            [name , email, hash]
          );
          // console.log(result);
          res.redirect("/");
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/users/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const storedPassword = user.password;
      brcypt.compare(password, storedPassword, (err, result) => {
        if (result) {
          res.redirect("/");
        } else {
          res.send("Incorrect Password");
        }
      });
    } else {
      res.send("User not found");
    }
  } catch (err) {
    console.log(err);
  }
});


app.get("/",(req,res)=>{
    res.render("index.ejs");
});

app.post("/searchBooks",async (req,res)=>{
    var q = req.body.query;
    try{
       let result = await axios.get(`https://openlibrary.org/search.json?q=${q}`); 
       let result1 = await db.query("SELECT name FROM all_collections");
       let data = result.data.docs;
       let collections = (result1.rows);
       console.log(collections.length);
    //    console.log(data);
       res.render("searchBooks.ejs",{data : data , collections : collections});
    }catch(error){
        console.log(error);
        res.send("error");
    }
    
});

app.post("/add",async (req,res)=>{
    let isbn = req.body.isbn;
    let title = req.body.title;
    let author_name = req.body.author_name;
    let first_publish_year = req.body.first_publish_year;
    let ratings_average = req.body.ratings_average;
    await db.query("INSERT INTO miscellaneous (isbn,title,author_name,first_publish_year,ratings_average) VALUES ($1,$2,$3,$4,$5)",[isbn,title,author_name,first_publish_year,ratings_average]);
    res.redirect("/myCollection");
});

app.get("/myCollection",async (req,res)=>{
    let result = await db.query("SELECT * FROM miscellaneous WHERE category IS NULL OR category = 'miscellaneous'");
    let result1 = await db.query("SELECT name FROM all_collections");
    let data = (result.rows);
    let collections = (result1.rows);
    // console.log(collections);
    res.render("myCollection.ejs",{data : data , collections : collections});
});


app.post("/deleteitem",async (req,res)=>{
    let isbn = req.body.isbn;
    await db.query("DELETE FROM miscellaneous WHERE isbn = $1",[isbn]);
    res.redirect("/myCollection");
});


app.post("/notes",async (req,res)=>{
    let isbn = req.body.isbn;
    let result = await db.query("SELECT * FROM miscellaneous WHERE isbn = $1",[isbn]);
    let result1 = await db.query("SELECT content FROM data WHERE isbn = $1",[isbn]);
    let content = '';
    if(result1.rows.length > 0) content = result1.rows[0].content;
    let data = (result.rows);
    // console.log(result1.rows);
    res.render("notes.ejs",{isbn:isbn,title : data[0].title , author : data[0].author_name , content : content});
});

app.post("/saveNotes",async (req,res)=>{
    let isbn = req.body.isbn;
    let content = req.body.content.trim();
    var isbn_present = 0;
    let result = await db.query("SELECT * FROM data WHERE isbn = $1",[isbn]);
    if(result.rows.length > 0){
        isbn_present = 1;
    }
    if(isbn_present===1){
        await db.query("UPDATE data SET content = $1 WHERE isbn = $2",[content,isbn]);
    }else{
        await db.query("INSERT INTO data (isbn,content) VALUES ($1,$2)",[isbn,content]);
    }
    res.redirect("/myCollection");
});

app.post("/newCollection",async (req,res)=>{
    let collection = req.body.collection;
    await db.query("INSERT INTO all_collections (name) VALUES ($1)",[collection]);
    res.redirect("/myCollection");
});

app.get("/about",(req,res)=>{
    res.render("about.ejs");
});

app.post("/getCollection",async (req,res)=>{
    let cc1 = req.body.collection;
    
    let result ;
    if(cc1 === "miscellaneous"){
        result = await db.query("SELECT * FROM miscellaneous WHERE category IS NULL OR category = 'miscellaneous'");
    }else{
        result = await db.query("SELECT * FROM miscellaneous WHERE category = $1",[cc1]);
    }
    let result1 = await db.query("SELECT name FROM all_collections");
    let data = (result.rows);
    let collections = (result1.rows);
    // console.log("hi! I am here");
    console.log(data);
    res.render("myCollection.ejs",{data : data , collections : collections , title : cc1});
});


app.post("/move_to",async (req,res)=>{
    let isbn = req.body.isbn;
    let collection = req.body.collection;
    let result1 = await db.query("SELECT name FROM all_collections WHERE name = $1",[collection]);
    if(result1.rows.length === 0){
        console.log("collection not present");
        res.send("collection not present");
    }else{
        await db.query("UPDATE miscellaneous SET category = $1 WHERE isbn = $2",[collection,isbn]);
    }
    res.redirect("/myCollection");
})

app.listen(port , ()=>{
    console.log(`listening on port:${port}!`);
});