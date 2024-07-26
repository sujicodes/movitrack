import React, {useContext} from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { LoginSocialFacebook } from "reactjs-social-login";
import { FacebookLoginButton } from "react-social-login-buttons";
import { AuthContext } from '../components/Auth/AuthContext';
import { jwtDecode } from "jwt-decode";
import './Login.css'


const Login = () => {
    const responseFacebook = (response) => {
    console.log(response);
    }

    const {user, login, logout} = useContext(AuthContext);

    return (
        <div className='login-container'>
            <h1>Login, to use movitrack</h1>
                <LoginSocialFacebook
                    appId="464555689517211"
                    onResolve={login}
                    onReject={(error) => {
                        console.log(error);
                    }}
                >
                    <FacebookLoginButton />
                </LoginSocialFacebook>
                <GoogleOAuthProvider clientId="174570537860-6vkd39p098a9mnb66kpi9tlistc3i224.apps.googleusercontent.com">

                    <GoogleLogin
                    onSuccess={credentialResponse => {
                        let cred = jwtDecode(credentialResponse.credential)
                        console.log(credentialResponse);
                        login(cred.email)
                    }}
                    />
                </GoogleOAuthProvider>
        </div>
    );
};


export default Login;