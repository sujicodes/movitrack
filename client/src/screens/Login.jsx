import React, { useContext } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { LoginSocialFacebook } from "reactjs-social-login";
import { FacebookLoginButton } from "react-social-login-buttons";
import { AuthContext } from "../components/Auth/AuthContext";
import axios from "axios";
import config from "../config";
import "./Login.css";

const Login = () => {
    const { login } = useContext(AuthContext);

    const handleGoogleSuccess = async (response) => {
        try {
            const res = await axios.post(
                `${config.apiUrl}/api/auth/google`,
                {
                    token: response.credential,
                },
            );
            login(res.data.user);
        } catch (error) {
            console.error("Google login error", error);
        }
    };
    const handleFacebookSuccess = async (response) => {
        try {
            console.log(response);
            const res = await axios.post(
                `${config.apiUrl}/api/auth/facebook`,
                {
                    data: response.data,
                },
            );
            login(res.data.user);
        } catch (error) {
            console.error("Facebook login error", error);
        }
    };
    return (
        <div className="login-container">
            <h1>Login, to use movitrack</h1>
            <LoginSocialFacebook
                appId={process.env.REACT_APP_FACEBOOK_APP_ID}
                onResolve={handleFacebookSuccess}
                onReject={(error) => {
                    console.log(error);
                }}
            >
                <FacebookLoginButton />
            </LoginSocialFacebook>
            <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
                <GoogleLogin onSuccess={handleGoogleSuccess} />
            </GoogleOAuthProvider>
        </div>
    );
};

export default Login;
