import express, { query } from "express";
import bodyParser from "body-parser";
import axios from "axios";
import sqlite3 from 'sqlite3';
import cors from "cors";

const key = "eeee60ef"

const app = express();
const port = 5000;

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))
app.use(express.json());
app.use(cors());

const db = new sqlite3.Database('./database.db');

app.get("/api/data", async (req, res) => {
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

    res.json({watchedMovies: watchedMovies, movieList: movieList});
})

app.post("/api/data", async (req, res) => {
    const name = req.body["name"];
    const year = req.body["year"];
    const type = req.body["type"];
    console.log(req.body)
    try{
        const api_resp = await axios.get(`http://www.omdbapi.com/?apikey=${key}&t=${name}&y=${year}&plot=short`);
        const data = api_resp.data;

        let checkQuery = ""
        let query = ""
        if (type === "Watched Movies"){
            checkQuery = "SELECT * FROM watched_movies WHERE name = ? AND year = ? AND plot = ? AND director = ?;"
            query = `INSERT INTO watched_movies (name, year, plot, poster, director, imdb_rating, imdb_id) VALUES (?, ?, ?, ?, ?, ?, ?);`
        } else if (type === "Movie List"){
            checkQuery = "SELECT * FROM movie_list WHERE name = ? AND year = ? AND plot = ? AND director = ?;"
            query = `INSERT INTO movie_list (name, year, plot, poster, director, imdb_rating, imdb_id) VALUES (?, ?, ?, ?, ?, ?, ?);`
        }
        db.get(checkQuery, [data.Title, data.Year, data.Plot, data.Director], (err, row) => {
            if (err) {
                console.error(err.message);
                return res.sendStatus(500);;
            }
            if (row) {
                console.log('Row already exists. Not inserted.');
                return res.sendStatus(200);;
            }

            const result = db.run(query,
            [data.Title, data.Year, data.Plot, data.Poster, data.Director, data.imdbRating, data.imdbID]);
            res.sendStatus(201);
        });

    } catch (error){
        console.log(error)
        res.sendStatus(500);
    }
})


app.post("/api/delete", async (req, res) => {
    const id = req.body["id"];
    const type = req.body["type"];
    console.log(id)
    try {
        if(type === "Watched Movies"){
            await db.run("DELETE FROM watched_movies WHERE id = ?", [id]);
        } else if (type === "Movie List"){
            await db.run("DELETE FROM movie_list WHERE id = ?", [id]);
        }
    } catch (error) {
        console.log(error);
        return res.sendStatus(500)
    }
    res.sendStatus(201)
});

app.post("/api/append", async (req, res) => {
    const id = req.body["id"];
    const type = req.body["type"];
    try {
        let checkQuery = `SELECT * 
        FROM watched_movies 
        WHERE name = (SELECT name FROM movie_list WHERE id = ?)
        AND year = (SELECT year FROM movie_list WHERE id = ?)
        AND plot = (SELECT plot FROM movie_list WHERE id = ?)
        AND director = (SELECT director FROM movie_list WHERE id = ?);`
        
        db.get(checkQuery, [id, id, id, id], (err, row) => {
            if (err) {
                console.error(err);
                return res.sendStatus(500);
            }
            
            if (!row) {
                db.run(`
                    INSERT INTO watched_movies (name, year, plot, poster, director, imdb_rating, imdb_id)
                    SELECT name, year, plot, poster, director, imdb_rating, imdb_id
                    FROM movie_list
                    WHERE id = ?;`, 
                    id,
                    (err) => {
                        if (err) {
                            console.error(err);
                            return res.sendStatus(500);
                        }

                        db.run("DELETE FROM movie_list WHERE id = ?;", id, (err) => {
                            if (err) {
                                console.error(err);
                                return res.sendStatus(500);
                            }
                            return res.sendStatus(201);
                        });
                    }
                );
            } else {
                console.log("row exists");
                return res.sendStatus(409); // Conflict, item already exists
            }
        });
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
