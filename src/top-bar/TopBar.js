import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TopBar.css';
import { handleFBLogin, handleFBLogout } from '../fb-js-snippet/fbJsSnippet';
import { useVariables } from '../global-variables/GlobalVariablesContext';

const FB_GRAPH_BASE_URL = process.env.REACT_APP_FB_GRAPH_BASE_URL;

const TopBar = () => {
    const { setVariable: setGlobalVariable, getVariable: getGlobalVariable } = useVariables();
    const [user, setUser] = useState(null);
    
    // Handle Facebook login
    const login = async () => {
        try {
            const accessToken = await handleFBLogin();
            if (accessToken) {
                setGlobalVariable('accessToken', accessToken);
                localStorage.setItem('accessToken', accessToken);
            }
        } catch (error) {
            console.error('Exception occurred in "login" method. Error: ', error);
        }
    };

    // Handle user logout
    const logout = async () => {
        try {
            const isLoggedOut = await handleFBLogout();
            if (isLoggedOut) {
                setGlobalVariable('accessToken', '');
                localStorage.setItem('accessToken', '');
            }
        } catch (error) {
            console.error('Exception occurred in "logout" method. Error: ', error);
        }
    };

    // Initialize component
    const initialize = () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            if (accessToken) {
                setGlobalVariable('accessToken', accessToken);
            }
        } catch (error) {
            console.error('Exception occurred in "initialize" method. Error: ', error);
        }
    };

    // Access token change effect
    const accessTokenEffect = () => {
        const asyncFun = async () => {
            try {
                const accessToken = getGlobalVariable('accessToken');
                if (accessToken) {
                    const endpointUrl = FB_GRAPH_BASE_URL + '/me?fields=id,name,email&access_token=' + accessToken;

                    try {
                        const response = await axios.get(endpointUrl);
                        const userData = response?.data;
                        if (userData) {
                            setUser(userData);
                        }
                    } catch (error) {
                        console.error('Failed to fetch user data. Error: ', error);
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
    useEffect(accessTokenEffect, [getGlobalVariable('accessToken')]); // Re-run on global variable accessToken change

    return (
        <div className="top-bar">
            <div className="container">
                <div className="app-name">Facebook Insights App</div>
                <div className="login-logout">
                    { user ? (
                        <div>
                            <span className='welcome-msg'>Welcome, { user.name} </span>
                            <button onClick={logout}>Logout</button>
                        </div>
                    ) : (
                        <button onClick={login}>Login</button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TopBar;
