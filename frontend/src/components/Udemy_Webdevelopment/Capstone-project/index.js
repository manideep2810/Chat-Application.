import express from "express";
import axios from "axios";
const app = express();
const port = 3000;
const API_KEY = "33fa1be1ccf840eda2a775755ec17651";

app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/",async (req,res)=>{
    try{
        let result = await axios.get(`https://newsapi.org/v2/everything?q=keyword&apiKey=${API_KEY}`);
        let data = result.data;
        // console.log(data);
        res.render("index.ejs",{news:data.articles , flag : 0});
    }catch (error){
        res.send(error);
    }
})

const countryToCode = {
    "united arab emirates": "ae",
    "argentina": "ar",
    "austria": "at",
    "australia": "au",
    "belgium": "be",
    "bulgaria": "bg",
    "brazil": "br",
    "canada": "ca",
    "switzerland": "ch",
    "china": "cn",
    "colombia": "co",
    "czech republic": "cz",
    "germany": "de",
    "egypt": "eg",
    "france": "fr",
    "united kingdom": "gb",
    "greece": "gr",
    "hong kong": "hk",
    "hungary": "hu",
    "indonesia": "id",
    "ireland": "ie",
    "israel": "il",
    "india": "in",
    "italy": "it",
    "japan": "jp",
    "south korea": "kr",
    "lithuania": "lt",
    "latvia": "lv",
    "morocco": "ma",
    "mexico": "mx",
    "malaysia": "my",
    "nigeria": "ng",
    "netherlands": "nl",
    "norway": "no",
    "new zealand": "nz",
    "philippines": "ph",
    "poland": "pl",
    "portugal": "pt",
    "romania": "ro",
    "serbia": "rs",
    "russia": "ru",
    "saudi arabia": "sa",
    "sweden": "se",
    "singapore": "sg",
    "slovenia": "si",
    "slovakia": "sk",
    "thailand": "th",
    "turkey": "tr",
    "taiwan": "tw",
    "ukraine": "ua",
    "united states": "us",
    "venezuela": "ve",
    "south africa": "za"
};

app.get("/technology",async (req,res)=>{
    try{
        let result = await axios.get(`https://newsapi.org/v2/top-headlines/sources?category=technology&apiKey=${API_KEY}`);
        let data = result.data;
        // console.log(result);
        res.render("index1.ejs",{news:data.sources});
    }catch (error){
        res.send(error);
    }
})

app.get("/business",async (req,res)=>{
    try{
        let result = await axios.get(`https://newsapi.org/v2/top-headlines/sources?category=business&apiKey=${API_KEY}`);
        let data = result.data;
        // console.log(result);
        res.render("index1.ejs",{news:data.sources});
    }catch (error){
        res.send(error);
    }
})

app.get("/entertainment",async (req,res)=>{
    try{
        let result = await axios.get(`https://newsapi.org/v2/top-headlines/sources?category=entertainment&apiKey=${API_KEY}`);
        let data = result.data;
        // console.log(result);
        res.render("index1.ejs",{news:data.sources});
    }catch (error){
        res.send(error);
    }
})

app.get("/general",async (req,res)=>{
    try{
        let result = await axios.get(`https://newsapi.org/v2/top-headlines/sources?category=general&apiKey=${API_KEY}`);
        let data = result.data;
        // console.log(result);
        res.render("index1.ejs",{news:data.sources});
    }catch (error){
        res.send(error);
    }
})

app.get("/health",async (req,res)=>{
    try{
        let result = await axios.get(`https://newsapi.org/v2/top-headlines/sources?category=health&apiKey=${API_KEY}`);
        let data = result.data;
        // console.log(result);
        res.render("index1.ejs",{news:data.sources});
    }catch (error){
        res.send(error);
    }
})

app.get("/science",async (req,res)=>{
    try{
        let result = await axios.get(`https://newsapi.org/v2/top-headlines/sources?category=science&apiKey=${API_KEY}`);
        let data = result.data;
        // console.log(result);
        res.render("index1.ejs",{news:data.sources});
    }catch (error){
        res.send(error);
    }
})

app.get("/sports",async (req,res)=>{
    try{
        let result = await axios.get(`https://newsapi.org/v2/top-headlines/sources?category=sports&apiKey=${API_KEY}`);
        let data = result.data;
        // console.log(result);
        res.render("index1.ejs",{news:data.sources});
    }catch (error){
        res.send(error);
    }
})

app.post("/Country",async (req,res)=>{
    
    try{
        // console.log(req);
        // console.log(req.body);
        let countryName = req.body.Country.toLowerCase();
        // console.log(countryName);
        let countrycode = countryToCode[countryName];
        // console.log(countrycode);
        let result = await axios.get(`https://newsapi.org/v2/top-headlines/sources?country=${countrycode}&apiKey=33fa1be1ccf840eda2a775755ec17651`);
        let data = result.data;
        // console.log(result);
        res.render("index1.ejs",{news:data.sources});
    }catch (error){
        res.send(error);
    }
})

app.listen(port,()=>{
    console.log(`listening on port:${port}`);
})

