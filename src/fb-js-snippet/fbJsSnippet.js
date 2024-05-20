const appId = process.env.REACT_APP_FACEBOOK_APP_ID;

// Function to initialize Facebook SDK
const initializeFacebookSDK = () => {
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

// Method to trigger Facebook login
export const login = async () => {
    try {
        return new Promise(async (resolve, reject) => {
            // Trigger Facebook login dialog
            await window.FB.login(
                function (response) {
                    if (response.authResponse) {
                        // User authorized your app
                        const accessToken = response.authResponse.accessToken;
                        resolve(accessToken);
                    } else {
                        // User cancelled login or did not fully authorize.
                        console.warn('User cancelled login or did not fully authorize.');
                        reject();
                    }
                },
                { scope: 'public_profile,email' } // Request permissions
            );
        });

        
    } catch (error) {
        console.error('Exception occurred in "login" method. Error: ', error);
    }
};

initializeFacebookSDK();
