import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url)); 

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render(__dirname+"/views/index.ejs");
});

app.post("/submit", (req, res) => {
  var len = req.body["fName"].length + req.body["lName"].length;
  // console.log(req.body.fname);
  res.render(__dirname+"/views/index.ejs",{Letters:len});
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
