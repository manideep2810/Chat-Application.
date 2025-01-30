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
  database : "permalist"
});

db.connect();


async function fetchitems(){
  var items1 = [];
  let result = await db.query("SELECT * FROM items");
  items1 = result.rows;
  return items1;
}

app.get("/", async (req, res) => {
  const db_items = await fetchitems();
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: db_items,
  });
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  // items.push({ title: item });
  await db.query("INSERT INTO items (title) VALUES ($1)",[item]);
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  console.log(req.body);
  const id = req.body.updatedItemId;
  const title = req.body.updatedItemTitle;
  await db.query("UPDATE items SET title = $1 WHERE id = $2",[title,id]);
  res.redirect("/");
});

app.post("/delete", async (req, res) => {
  const id = req.body.deleteItemId;
  await db.query("DELETE FROM items WHERE id = $1",[id]);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});