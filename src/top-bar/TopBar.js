import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TopBar.css';
import { login as fbLogin } from '../fb-js-snippet/fbJsSnippet';

const TopBar = () => {
    const [accessToken, setAccessToken] = useState(null);
    const [user, setUser] = useState(null);
    const SERVER_BASE_URL = process.env.REACT_APP_SERVER_BASE_URL;

    // Handle Facebook login
    const handleFBLogin = async () => {
        try {
            const accessToken = await fbLogin();
            if (accessToken) {
                localStorage.setItem('accessToken', accessToken);
            }
        } catch (error) {
            console.error('Exception occurred in "handleFacebookLogin" method. Error: ', error);
        }
    };

    // Handle user logout
    const handleFBLogout = () => {
        try {
            localStorage.setItem('accessToken', null);
            setAccessToken(null);
        } catch (error) {
            console.error('Exception occurred in "handleLoginLogout" method. Error: ', error);
        }
    };

    // Initialize component
    const initialize = () => {
        try {
            // Testing code
            const token = 'EAATbdLudQegBO6FFJENZBdkHWdqH4tDNvaaefwPRoUOpS5dzfsIF09mviRXwCD1byOBPMpJjg7OZC9Wff7APmdEa5QxzGY2ZCZAHwc3QGTAWfxan35IR8uFJSM5GltU933gFHt75ZBoAGmJAQlmym7y6xiJ99HywGpQqxLhi8Yzu8SsrY4O7yBHewTTuxtCT5NwZDZD';
            localStorage.setItem('accessToken', token);

            const accessToken = localStorage.getItem('accessToken');
            if (accessToken) {
                setAccessToken(accessToken);
            }
        } catch (error) {
            console.error('Exception occurred in "initialize" method. Error: ', error);
        }
    };

    // Access token change effect
    const accessTokenEffect = () => {
        const asyncFun = async () => {
            try {
                if (accessToken) {
                    // Set the authorization token as a default header for all Axios requests
                    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

                    const endpointUrl = SERVER_BASE_URL + '/user/get-user';
                    const response = await axios.get(endpointUrl);
                    const userData = response?.data?.data;
                    if (userData) {
                        setUser(userData);
                    }
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error('Exception occurred in "accessTokenEffect" method. Error: ', error);
            }
        };

        asyncFun();
    };
  
    // Use effect hooks
    useEffect(initialize, []); // Run only once on component mount
    useEffect(accessTokenEffect, [accessToken]); // Re-run on accessToken change

    return (
        <div className="top-bar">
            <div className="container">
                <div className="app-name">Facebook Insights App</div>
                <div className="login-logout">
                    { user ? (
                        <div>
                            <span className='welcome-msg'>Welcome, { user.name} </span>
                            <button onClick={handleFBLogout}>Logout</button>
                        </div>
                    ) : (
                        <button onClick={handleFBLogin}>Login</button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TopBar;
