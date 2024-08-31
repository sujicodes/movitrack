import React, {useContext} from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { LoginSocialFacebook } from "reactjs-social-login";
import { FacebookLoginButton } from "react-social-login-buttons";
import { AuthContext } from '../components/Auth/AuthContext';
import axios from "axios";
import './Login.css'


const Login = () => {
    const responseFacebook = (response) => {
    console.log(response);
    }

    const {user, login, logout} = useContext(AuthContext);

    const handleGoogleSuccess = async (response) => {
        try {
          const res = await axios.post('http://localhost:5000/api/auth/google', {
            token: response.credential
          });
          login(res.data.user)
    
        } catch (error) {
          console.error('Google login error', error);
        }
      };
    const handleFacebookSuccess = async (response) => {
      try {
          console.log(response)
          const res = await axios.post('http://localhost:5000/api/auth/facebook', {
            data: response.data
          });
          login(res.data.user)
        } catch (error) {
          console.error('Facebook login error', error);
        }

    }
    
    return (
        <div className='login-container'>
            <h1>Login, to use movitrack</h1>
                <LoginSocialFacebook
                    appId="464555689517211"
                    onResolve={handleFacebookSuccess}
                    onReject={(error) => {
                        console.log(error);
                    }}
                >
                    <FacebookLoginButton />
                </LoginSocialFacebook>
                <GoogleOAuthProvider clientId="174570537860-6vkd39p098a9mnb66kpi9tlistc3i224.apps.googleusercontent.com">

                    <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    />
                </GoogleOAuthProvider>
        </div>
    );
};


export default Login;