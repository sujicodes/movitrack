import React, { useContext } from "react";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import "./LogoutButton.css";


import { AuthContext } from "../Auth/AuthContext";


function LogoutButton() {
    const {user, logout } = useContext(AuthContext);

    return(
        <div class="logout">
            <Avatar alt={user.fullname} src={user.picture} />
            <Button variant="contained" size="small" color="success" onClick={logout}>
                Logout
            </Button>
        </div>
    )

}

export default LogoutButton;