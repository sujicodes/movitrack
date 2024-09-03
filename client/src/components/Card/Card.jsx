import React, { useContext } from "react";
import axios from "axios";
import IconButton from "@mui/material/IconButton";
import { AuthContext } from "../Auth/AuthContext";
import "./Card.css";

function Card({ movie, type, isMovieList, refresh }) {
    const { user } = useContext(AuthContext);

    async function handleSubmit(event) {
        event.preventDefault();
        try {
            movie.type = type;
            const button_class_list = event.currentTarget.classList;
            let response;
            if (button_class_list.contains("delete")) {
                response = await axios.post(
                    "http://localhost:5000/api/delete",
                    movie,
                );
            } else {
                response = await axios.post(
                    "http://localhost:5000/api/append",
                    {movie: movie, user: user}
                );
                console.log(response);
            }
            if (response.status === 201) {
                refresh();
            } else {
                console.error("Failed to add item");
            }
        } catch (error) {
            console.error("Error adding item:", error);
        }
    }

    console.log(isMovieList);

    return (
        <div className="movie">
            <img src={movie.poster} alt="" className="poster" height="250px" />
            <div className="info">
                <h3>
                    {movie.name} ({movie.year})
                </h3>
                <p>{movie.plot}</p>
                <p> Director: {movie.director}</p>
            </div>
            <div className="hover-content">
                <div className="rating">
                    <div>
                        <a
                            href="https://www.imdb.com/title/<%=movie.imdb_id%>"
                            target="_blank"
                        >
                            <img
                                src="images/imdb.svg"
                                alt=""
                                className="hover-image"
                            />
                        </a>
                        <p>{movie.imdb_rating}</p>
                    </div>
                </div>
                <IconButton
                    value={movie.id}
                    className="delete"
                    onClick={handleSubmit}
                >
                    <img src="images/bin.png" height="40px" />
                </IconButton>
                {isMovieList ? (
                    <IconButton
                        value={movie.id}
                        className="append"
                        onClick={handleSubmit}
                    >
                        <img src="images/tick.svg" height="40px" />
                    </IconButton>
                ) : null}
            </div>
        </div>
    );
}
export default Card;
