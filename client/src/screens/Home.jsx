import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../components/Auth/AuthContext";
import Tabs from "../components/Tabs/Tabs";
import AddForm from "../components/AddForm/AddForm";
import Card from "../components/Card/Card";
import TabButton from "../components/Tabs/TabButton";
import TabContent from "../components/Tabs/TabContent";
import LogoutButton from "../components/Buttons/LogoutButton";
import Grow from "@mui/material/Grow";

function Home() {
    const [data, setData] = useState({});
    const [isFetched, setIsFetched] = useState(false);
    const {user, login, logout } = useContext(AuthContext);

    const fetchData = async () => {
        try {
            console.log("Fetching data...");
            const response = await axios.get("http://localhost:5000/api/data", {
                params: {user: user}
            });
            console.log("Data received:", response.data);
            setIsFetched(false);
            setTimeout(() => {
                setData(response.data);
            }, 500);
            setTimeout(() => {
                setIsFetched(true);
            }, 500);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const tabs = ["Watched Movies", "Movie List"];
    const initialTab = sessionStorage.getItem("activeTab") || tabs[0];

    const [activeTab, setActiveTab] = useState(initialTab);

    useEffect(() => {
        sessionStorage.setItem("activeTab", activeTab);
    }, [activeTab]);

    let watchedMovies = [];
    let movieList = [];

    if (data) {
        watchedMovies = data.watchedMovies || [];
        movieList = data.movieList || [];
    }

    return (
        <div>
            <LogoutButton />
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
                        <AddForm
                            key={label}
                            type={label}
                            refresh={fetchData}
                            growTransition={setIsFetched}
                        />
                        <Grow in={isFetched}>
                            <div className="movie-container">
                                {label === "Movie List"
                                    ? movieList.map((movie) => (
                                          <Card
                                              key={movie.id}
                                              movie={movie}
                                              isMovieList={true}
                                              refresh={fetchData}
                                              type={label}
                                          />
                                      ))
                                    : watchedMovies.map((movie) => (
                                          <Card
                                              key={movie.id}
                                              movie={movie}
                                              isMovieList={false}
                                              refresh={fetchData}
                                              type={label}
                                          />
                                      ))}
                            </div>
                        </Grow>
                    </TabContent>
                ))}
            </div>
        </div>
    );
}

export default Home;
