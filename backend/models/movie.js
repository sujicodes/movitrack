import db from "../config/db.js";

export const getAllMovies = async (id) => {
    const watchedMoviesQuery = "SELECT * FROM watched_movies WHERE user_id = ?;";
    const movieListQuery = "SELECT * FROM movie_list WHERE user_id = ?;";

    const queryDatabase = (query) => {
        return new Promise((resolve, reject) => {
            db.all(query, id, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    };

    try {
        const [watchedMovies, movieList] = await Promise.all([
            queryDatabase(watchedMoviesQuery),
            queryDatabase(movieListQuery),
        ]);

        return { watchedMovies, movieList };
    } catch (err) {
        console.error("Error fetching movies:", err);
        throw err;
    }
};

export const addMovie = (type, data, userId) => {
    return new Promise((resolve, reject) => {
        let checkQuery = "";
        let query = "";
        let otherTableCheckQuery = "";

        if (type === "Watched Movies") {
            checkQuery =
                "SELECT * FROM watched_movies WHERE name = ? AND year = ? AND plot = ? AND director = ? AND user_id = ?;";
            otherTableCheckQuery =
                "SELECT * FROM movie_list WHERE name = ? AND year = ? AND plot = ? AND director = ? AND user_id = ?;";
            query = `INSERT INTO watched_movies (name, year, plot, poster, director, imdb_rating, imdb_id, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`;
        } else if (type === "Movie List") {
            checkQuery =
                "SELECT * FROM movie_list WHERE name = ? AND year = ? AND plot = ? AND director = ? AND user_id = ?;";
            otherTableCheckQuery =
                "SELECT * FROM watched_movies WHERE name = ? AND year = ? AND plot = ? AND director = ?  AND user_id = ?;";
            query = `INSERT INTO movie_list (name, year, plot, poster, director, imdb_rating, imdb_id, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`;
        }

        db.get(
            checkQuery,
            [data.Title, data.Year, data.Plot, data.Director, userId],
            (err, row) => {
                if (err) {
                  console.log("sdsdadadad");
                    return reject(err);
                }
                if (row) {
                    return resolve({
                        status: "exists_in_current_table",
                        table: type,
                    });
                }

                db.get(
                    otherTableCheckQuery,
                    [data.Title, data.Year, data.Plot, data.Director, userId],
                    (err, otherRow) => {
                        if (err) {
                            console.log("sdsdaddfsddsdadad");
                            return reject(err);
                        }
                        if (otherRow) {
                            
                            return resolve({
                                status: "exists_in_other_table",
                                table:
                                    type === "Watched Movies"
                                        ? "Movie List"
                                        : "Watched Movies",
                            });
                        }

                        db.run(
                            query,
                            [
                                data.Title,
                                data.Year,
                                data.Plot,
                                data.Poster,
                                data.Director,
                                data.imdbRating,
                                data.imdbID,
                                userId,
                            ],
                            function (err) {
                                if (err) {
                                  console.log("sdsdadadad");
                                  console.log(userId);
                                    return reject(err);
                                }
                                resolve({
                                    status: "inserted",
                                    movieId: this.lastID,
                                });
                            },
                        );
                    },
                );
            },
        );
    });
};

export const appendToWatchedMovie = (id, user_id) => {
    return new Promise((resolve, reject) => {
        const checkQuery = `
            SELECT * 
            FROM watched_movies 
            WHERE name = (SELECT name FROM movie_list WHERE id = ?)
            AND year = (SELECT year FROM movie_list WHERE id = ?)
            AND plot = (SELECT plot FROM movie_list WHERE id = ?)
            AND director = (SELECT director FROM movie_list WHERE id = ?)
            AND user_id = ?;
        `;

        db.get(checkQuery, [id, id, id, id, user_id], (err, row) => {
            if (err) {
                return reject(err);
            }

            if (row) {
                //TODO: delete if already in watched movies
                console.log("huiiasias");
                return resolve({ status: "exists", table: "watched_movies" });
            }
            console.log("hsakhskalhsajhakjs")
            db.run(
                `
                INSERT INTO watched_movies (name, year, plot, poster, director, imdb_rating, imdb_id, user_id)
                SELECT name, year, plot, poster, director, imdb_rating, imdb_id, user_id
                FROM movie_list
                WHERE id = ?;
            `,
                id,
                (err) => {
                    if (err) {
                        return reject(err);
                    }
                    db.run(
                        "DELETE FROM movie_list WHERE id = ?;",
                        id,
                        (err) => {
                            if (err) {
                                return reject(err);
                            }
                            resolve({ status: "success" });
                        },
                    );
                },
            );
        });
    });
};

export const deleteMovie = (type, id) => {
    return new Promise((resolve, reject) => {
        let query = "";

        if (type === "Watched Movies") {
            query = "DELETE FROM watched_movies WHERE id = ?;";
        } else if (type === "Movie List") {
            query = "DELETE FROM movie_list WHERE id = ?;";
        } else {
            return reject(new Error("Invalid type"));
        }

        db.run(query, [id], function (err) {
            if (err) {
                return reject(err);
            }
            resolve({ status: "success" });
        });
    });
};
