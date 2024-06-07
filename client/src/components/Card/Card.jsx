import React from 'react';
import "./Card.css"

function Card({ movie, isMovieList }){

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
            <form action="/delete" method="post">
                <input type="hidden" name="type" value="watched" />
                <button name="delID" value={movie.id} className="delete"><img src="images/bin.png" alt="" height="" className="delete" /></button>
            </form>
            { isMovieList ? (               
                <form action="/append" method="post">
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