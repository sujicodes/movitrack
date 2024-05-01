import express, { query } from "express";
import bodyParser from "body-parser";
import axios from "axios";
import pg from "pg";
import sqlite3 from 'sqlite3';


const key = "eeee60ef"

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))

const db = new sqlite3.Database('./database.db');
app.get("/", async (req, res) => {
    try {
        // Execute the first query to select all rows from watched_movies
        const watchedMoviesQuery = "SELECT * FROM watched_movies;";
        const watchedMovies = await new Promise((resolve, reject) => {
            db.all(watchedMoviesQuery, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });

        // Execute the second query to select all rows from movie_list
        const movieListQuery = "SELECT * FROM movie_list;";
        const movieList = await new Promise((resolve, reject) => {
            db.all(movieListQuery, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });

        // Combine the results and render the response
        res.render("index.ejs", { watchedMovies: watchedMovies, movieList: movieList });
    } catch (error) {
        console.error(error);
    }
});

app.post("/add", async (req, res) => {
    const name = req.body["name"];
    const year = req.body["year"];
    const type = req.body["type"];

    try{
        const api_resp = await axios.get(`http://www.omdbapi.com/?apikey=${key}&t=${name}&y=${year}&plot=short`);
        const data = api_resp.data;

        let checkQuery = ""
        let query = ""
        if (type === "watched"){
            checkQuery = "SELECT * FROM watched_movies WHERE name = ? AND year = ? AND plot = ? AND director = ?;"
            query = `INSERT INTO watched_movies (name, year, plot, poster, director, imdb_rating, imdb_id) VALUES (?, ?, ?, ?, ?, ?, ?);`
        } else if (type === "list"){
            checkQuery = "SELECT * FROM movie_list WHERE name = ? AND year = ? AND plot = ? AND director = ?;"
            query = `INSERT INTO movie_list (name, year, plot, poster, director, imdb_rating, imdb_id) VALUES (?, ?, ?, ?, ?, ?, ?);`
        }
        db.get(checkQuery, [data.Title, data.Year, data.Plot, data.Director], (err, row) => {
            if (err) {
                console.error(err.message);
                return;
            }
            if (row) {
                console.log('Row already exists. Not inserted.');
                return;
            }

            const result = db.run(query,
            [data.Title, data.Year, data.Plot, data.Poster, data.Director, data.imdbRating, data.imdbID]);
            });
        
    } catch (error){
        console.log(error)
    }

    res.redirect("/")

})

app.post("/delete", async (req, res) => {
    const id = req.body["delID"];
    const type = req.body["type"];
    try {
        if(type === "watched"){
            await db.run("DELETE FROM watched_movies WHERE id = ?", [id]);
        } else if (type === "list"){
            await db.run("DELETE FROM movie_list WHERE id = ?", [id]);
        }
    } catch (error) {
        console.log(error);
    }
    res.redirect("/")
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});


app.post("/append", async (req, res) => {
    const id = req.body["appID"];
    const type = req.body["type"];
    try {

        let checkQuery = `SELECT * 
        FROM watched_movies 
        WHERE name = (SELECT name FROM movie_list WHERE id = ?)
        AND year = (SELECT year FROM movie_list WHERE id = ?)
        AND plot = (SELECT plot FROM movie_list WHERE id = ?)
        AND director = (SELECT director FROM movie_list WHERE id = ?);`

        db.get(checkQuery, [id, id, id, id], (err, row) => {

            if (!row){
                db.run(`
                    INSERT INTO watched_movies (name, year, plot, poster, director, imdb_rating, imdb_id)
                    SELECT name, year, plot, poster, director, imdb_rating, imdb_id
                    FROM movie_list
                    WHERE id = ?;`, 
                    id,
                );
            } else {
                console.log("row exists");
            }

            db.run("DELETE FROM movie_list WHERE id = ?;", id);
        });

    }  catch (error) {
        console.log(error);
    }
    res.redirect("/")
});