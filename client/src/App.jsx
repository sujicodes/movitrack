import React, {useState, useEffect, useContext} from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from "axios";
import Login from "./screens/Login";
import Home from "./screens/Home";
import { AuthContext } from './components/Auth/AuthContext';


function App() { 
  const {user} = useContext(AuthContext);
  //return( user ? (<Login />) : (<Home />))

  return(
    <Routes>
        <Route path="/" element={ !user ?  <Navigate to="/login" /> : <Home />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
    </Routes>
  );
}

export default App;