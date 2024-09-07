import React, { useContext } from "react";
import {
    Route,
    Routes,
    Navigate,
} from "react-router-dom";
import Login from "./screens/Login";
import Home from "./screens/Home";
import { AuthContext } from "./components/Auth/AuthContext";

function App() {
    const logged_user = sessionStorage.getItem("logged_user");
    console.log(logged_user)

    const { user, login } = useContext(AuthContext);
    if (logged_user && !user) {
        login(JSON.parse(logged_user));
    }

    return (
        <Routes>
            <Route
                path="/"
                element={!user ? <Navigate to="/login" /> : <Home />}
            />
            <Route
                path="/login"
                element={user ? <Navigate to="/" /> : <Login />}
            />
        </Routes>
    );
}

export default App;
