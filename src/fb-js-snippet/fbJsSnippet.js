const appId = process.env.REACT_APP_FACEBOOK_APP_ID;

// Function to initialize Facebook SDK
const initializeFacebookSDK = async () => {
    try {
        window.fbAsyncInit = async function () {
                await window.FB.init({
                    appId: appId,
                    cookie: true,
                    xfbml: true,
                    version: 'v12.0',
                });
                
                await window.FB.AppEvents.logPageView();
            };
    
            // Load the SDK script
            (function (d, s, id) {
                var js,
                    fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) {
                    return;
                }
                js = d.createElement(s);
                js.id = id;
                js.src = 'https://connect.facebook.net/en_US/sdk.js';
                fjs.parentNode.insertBefore(js, fjs);
            })(document, 'script', 'facebook-jssdk');
    } catch (error) {
        console.error('Exception occurred in "initializeFacebookSDK" method. Error: ', error);
    }
};

// Method to get login status
const getLoginStatus = async () => {
    try {
        return new Promise(async (resolve, reject) => {
            window.FB.getLoginStatus(function (response) {
                if (response.status === 'connected') {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    } catch (error) {
        console.error('Exception occurred in "getLoginStatus" method. Error: ', error);
    } 
};

// Method to trigger Facebook login
export const handleFBLogin = async () => {
    try {
        return new Promise(async (resolve, reject) => {
            // Trigger Facebook login dialog
            await window.FB.login(
                function (response) {
                    if (response.authResponse) {
                        console.log('User logged in from Facebook successfully');
                        // User authorized your app
                        const accessToken = response.authResponse.accessToken;
                        resolve(accessToken);
                    } else {
                        // User cancelled login or did not fully authorize.
                        console.warn('User cancelled login or did not fully authorize your app');
                        reject();
                    }
                },
                { scope: 'public_profile,email,read_insights,pages_read_engagement' } // Request permissions
            );
        });
    } catch (error) {
        console.error('Exception occurred in "handleFBLogin" method. Error: ', error);
    }
};

// Method to trigger Facebook logout
export const handleFBLogout = async () => {
    try {
        return new Promise(async (resolve, reject) => {
            const isLoggedIn = await getLoginStatus();
            if (isLoggedIn) {
                await window.FB.logout(function (response) {
                    if (!response.authResponse) {
                        console.log('User logged out from Facebook successfully');
                        resolve(true);
                    } else {
                        console.warn('Failed to logout from Facebook!', 'Response: ', response);
                        reject(false);
                    }
                });
            }
        });
    } catch (error) {
        console.error('Exception occurred in "handleFBLogout" method. Error: ', error);
    }
};

// Initialize Facebook SDK
await initializeFacebookSDK();
