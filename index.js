import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import pg from "pg";


const key = "eeee60ef"

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))


const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "movies",
    password: "Fixinggood123",
    port: 5432,
});

db.connect();

app.get("/", async ( req, res) => {
    try {
        const result = await db.query(" SELECT * FROM movies")
        let movies = result.rows
        res.render("index.ejs", {movies: movies});
    }
    catch (error){
        console.log(error)
    }

});

app.post("/add", async (req, res) => {
    const name = req.body["name"];
    const year = req.body["year"];

    try{
        const api_resp = await axios.get(`http://www.omdbapi.com/?apikey=${key}&t=${name}&y=${year}&plot=short`);
        const data = api_resp.data;
        console.log(data)
        const result = await db.query(`INSERT INTO movies (name, year, plot, poster, director, imdb_rating) VALUES ($1, $2, $3, $4, $5, $6)`,
        [data.Title, data.Year, data.Plot, data.Poster, data.Director, data.imdbRating]);
        
    } catch (error){
        console.log(error)
    }

    res.redirect("/")

})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
