import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


let db = new pg.Client({
  host : "localhost",
  user : "postgres",
  password : "Collage@2022",
  port : 5432,
  database : "World"
});

db.connect();



app.get("/", async (req, res) => {
  const result = await db.query("SELECT country_code FROM visited_countries");
  const total = result.rows.length;
  var countries = [];
  var x = "";
  for(var i = 0 ; i < total ; i++){
    countries.push((result.rows)[i].country_code);
    x += (result.rows)[i].country_code;
    if(i!=total-1){
      x += ",";
    }
  }

  console.log(x);
  res.render("index.ejs",{total : countries.length , countries : x});
});

app.post("/add",async (req,res)=>{
  let country = req.body.country;
  console.log(country);
  let country_code = await db.query("SELECT country_code FROM countries WHERE country_name =  $1",[country]);
  console.log(country_code);
  await db.query("INSERT INTO visited_countries (country_code) VALUES ($1)",[(country_code.rows)[0].country_code]);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});


