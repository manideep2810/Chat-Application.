import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "World",
  password: "Collage@2022",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentUserId = 1;

let users = [
  { id: 1, name: "Angela", color: "teal" },
  { id: 2, name: "Jack", color: "powderblue" },
];


async function checkVisisted(mem_id) {
  const result = await db.query("SELECT country_code FROM visited_countries WHERE mem_id = $1",[mem_id]);
  users = [];
  const res = await db.query("SELECT * FROM family_members");
  users = res.rows;
  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  return countries;
}

app.get("/", async (req, res) => {
  const countries = await checkVisisted(5);
  res.render("index.ejs", {
    countries: countries,
    total: countries.length,
    users: users,
    color: "teal",
    id : 5
  });
});

app.post("/add", async (req, res) => {
  const input = req.body["country"];
  const id = req.body["id"];
  console.log(id);
  try {
    const result = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%'",
      [input.toLowerCase()]
    );

    const data = result.rows[0];
    const countryCode = data.country_code;
    try {
      await db.query(
        "INSERT INTO visited_countries (country_code , mem_id) VALUES ($1,$2)",
        [countryCode,id]
      );
      res.redirect("/");
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/user", async (req, res) => {
  if(req.body.add){
    res.render("new.ejs");
  }else{
    let id = req.body.user;
    const countries = await checkVisisted(id);
    const result = await db.query("SELECT color FROM family_members WHERE id = $1",[id]);
    let c = (result.rows)[0].color;
    console.log(countries);
    res.render("index.ejs", {
      countries: countries,
      total: countries.length,
      users: users,
      color: c,
      id : id
    });
  }
  
});

app.post("/new", async (req, res) => {
  let name = req.body.name;
  let color = req.body.color;
  // console.log(name,color);
  await db.query("INSERT INTO family_members (name , color) VALUES ($1,$2)",[name,color]);
  res.redirect("/");
  //Hint: The RETURNING keyword can return the data that was inserted.
  //https://www.postgresql.org/docs/current/dml-returning.html
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
