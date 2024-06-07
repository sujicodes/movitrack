import React, {useState, useEffect} from "react"
import AddForm from "../AddForm/AddForm";
import Card from "../Card/Card";
import TabButton from "./TabButton"
import TabContent from "./TabContent";
import "./Tabs.css"


function Tabs({ data }) {
    
    const tabs = ["Watched Movies", "Movie List"];
    const initialTab = sessionStorage.getItem('activeTab') || tabs[0];

    const [activeTab, setActiveTab] = useState(initialTab);

    useEffect(() => {
        sessionStorage.setItem('activeTab', activeTab);
    }, [activeTab]);

    let watchedMovies = [];
    let movieList = [];
    
    if (data) {
        watchedMovies = data.watchedMovies || [];
        movieList = data.movieList || [];
    }

    return (
        <div>
            <div className="tabs">
                {tabs.map((label) => (
                    <TabButton 
                        key={label} 
                        label={label} 
                        activeTab={activeTab}
                        onClick={() => setActiveTab(label)}
                    />
                ))}
            </div>
            <div>
                {tabs.map((label) => (
                    <TabContent key={label} label={label} activeTab={activeTab}>
                        <AddForm key = {label}/>
                        <div className="movie-container">
                            {label === "Movie List" ? (
                                movieList.map((movie) => (
                                    <Card key={movie.id} movie={movie} isMovieList={true} />
                                ))
                            ) : (
                                watchedMovies.map((movie) => (
                                    <Card key={movie.id} movie={movie} isMovieList={false} />
                                ))
                            )}
                        </div>
                    </TabContent> 
                ))}
            </div>
        </div>
    );
}


export default Tabs;