import React from 'react';
import axios from "axios";
import "./Card.css"

function Card({ movie, type, isMovieList, fetch, growTransition}){

    async function handleSubmit(event){
        event.preventDefault();
        try {
            movie.type = type;
            const response = await axios.post('http://localhost:5000/api/delete', movie);
            if (response.status === 201) {
                growTransition(false);
                setTimeout(()=>{
                    fetch();
                }, 1000);
                setTimeout(()=>{
                    growTransition(true)
                }, 1000)
            } else {
                console.error('Failed to add item');
              }
        } catch (error) {
            console.error('Error adding item:', error);
        }
    };

    return(
    <div className="movie">
        <img src={movie.poster} alt="" className="poster" height="250px" />
        <div className="info">
            <h3>{movie.name} ({movie.year})</h3>
            <p>{movie.plot}</p>
            <p> Director: {movie.director}</p>
        </div>
        <div className="hover-content">
            <div className="rating">
                <div>
                    <a href="https://www.imdb.com/title/<%=movie.imdb_id%>" target="_blank"><img src="images/imdb.svg" alt="" className="hover-image" /></a>
                    <p>{movie.imdb_rating}</p>
                </div>
            </div>
            <form onSubmit={handleSubmit}>
                <input type="hidden" name="type" value="watched" />
                <button name="delID" value={movie.id} className="delete"><img src="images/bin.png" alt="" height="" className="delete" /></button>
            </form>
            { isMovieList ? (               
                <form onSubmit={handleSubmit}>
                    <input type="hidden" name="type" value="list" />
                    <button name="appID" value={movie.id} className="append"><img src="images/tick.svg"/></button>
                </form>
            ): null
            }

        </div>
    </div>
    )
}
export default Card;