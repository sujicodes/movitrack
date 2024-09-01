import express, { query } from "express";
import bodyParser from "body-parser";
import axios from "axios";
import cors from "cors";
import session from "express-session";
import passport from "passport";

import db from "./config/db.js";
import {
    handleAddMovie,
    handleAppendToWatchedMovie,
    handleDeleteMovie,
} from "./controllers/movieController.js";
import {
    deleteMovie,
    appendToWatchedMovie,
    getAllMovies,
} from "./models/movie.js";

import { loginUser } from "./models/user.js";

const key = "eeee60ef";

const app = express();
const port = 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());
app.use(cors());

app.use(
    session({
        secret: "sJFTOowoltEzB0WW9P7eCtxUOk08fryr",
        resave: false,
        saveUninitialized: true,
    }),
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
        if (err) {
            return done(err);
        }
        done(null, row);
    });
});

app.post("/api/auth/google", async (req, res) => {
    const { token } = req.body;
    try {
        const response = await axios.get(
            `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`,
        );
        const userData = response.data;
        const { status, user } = await loginUser(
            userData.name,
            userData.email,
            userData.sub,
            "google",
        );
        console.log(user);
        req.login(user, (err) => {
            if (err) {
                return res.status(500).send("Internal Server Error");
            }
            res.json({ success: true, user });
        });
    } catch (error) {
        console.error("Google authentication error:", error);
        res.status(401).send("Unauthorized");
    }
});

app.post("/api/auth/facebook", async (req, res) => {
    const userData = req.body.data;
    try {
        const { status, user } = await loginUser(
            userData.name,
            userData.email,
            userData.id,
            "facebook",
        );
        console.log(user);
        req.login(user, (err) => {
            if (err) {
                return res.status(500).send("Internal Server Error");
            }
            res.json({ success: true, user });
        });
    } catch (error) {
        console.error("Google authentication error:", error);
        res.status(401).send("Unauthorized");
    }
});

app.get("/api/data", async (req, res) => {
    const { watchedMovies, movieList } = await getAllMovies();
    res.json({ watchedMovies: watchedMovies, movieList: movieList });
});

app.post("/api/data", async (req, res) => {
    const name = req.body["name"];
    const year = req.body["year"];
    const type = req.body["type"];
    console.log(req.body);
    try {
        const api_resp = await axios.get(
            `http://www.omdbapi.com/?apikey=${key}&t=${name}&y=${year}&plot=short`,
        );
        const data = api_resp.data;
        try {
            const result = await addMovie(type, data);
            switch (result.status) {
                case "exists_in_current_table":
                    return res.status(400).json({
                        error: `Movie already exists in the ${result.table}.`,
                    });

                case "exists_in_other_table":
                    return res.status(400).json({
                        error: `Movie already exists in the other table (${result.table}).`,
                    });

                case "inserted":
                    return res
                        .status(201)
                        .json({ success: true, movieId: result.movieId });

                default:
                    return res
                        .status(500)
                        .json({ error: "Unexpected error occurred" });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.post("/api/delete", async (req, res) => {
    const id = req.body["id"];
    const type = req.body["type"];
    try {
        const result = await deleteMovie(type, id);

        if (result.status === "success") {
            return res.status(201).json({ success: true });
        }
        return res.status(400).json({ error: "Invalid type" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post("/api/append", async (req, res) => {
    const id = req.body["id"];
    try {
        const result = await appendToWatchedMovie(id);
        switch (result.status) {
            case "exists":
                return res
                    .status(409)
                    .json({ error: "Movie already exists in watched movies." });

            case "success":
                return res.status(201).json({ success: true });

            default:
                return res
                    .status(500)
                    .json({ error: "Unexpected error occurred" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
