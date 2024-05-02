import { useEffect, useState } from 'react';
import TopBar from '../top-bar/TopBar';
import Login from '../login/Login';

const User = () => {
    const [accessToken, setAccessToken] = useState(null);

    // Initialize component
    const initialize = () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            if (accessToken) {
                setAccessToken(accessToken);
            }
        } catch (error) {
            console.error('Exception occurred in "initialize" method. Error: ', error);
        }
    };

    // Use effect hooks
    useEffect(initialize, []); // Run only once on component mount

    return (
        <div>
            <TopBar />
            { accessToken ?
                (
                    <div>
                        
                    </div>
                )
                :
                (
                    <div>

                    </div>
                )
            }
        </div>
    );
}

export default User;
