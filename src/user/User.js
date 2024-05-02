import { useEffect, useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Import styles
import './User.css';
import TopBar from '../top-bar/TopBar';
import { useVariables } from '../global-variables/GlobalVariablesContext';

const SERVER_BASE_URL = process.env.REACT_APP_SERVER_BASE_URL;

const User = () => {
    const { getVariable: getGlobalVariable } = useVariables();
    const [pages, setPages] = useState(null);
    const [selectedPage, setSelectedPage] = useState('');
    const [sinceDate, setSinceDate] = useState('');
    const [untilDate, setUntilDate] = useState('');

    // Handle page change
    const handlePageChange = (event) => {
        try {
            setSelectedPage(event.target.value);
        } catch (error) {
            console.error('Exception occurred in "handlePageChange" method. Error: ', error);
        }
    };

    // Handle since change
    const handleSinceChange = (date) => {
        try {
            const timestamp = date.getTime();
            setSinceDate(timestamp);
        } catch (error) {
            console.error('Exception occurred in "handleSinceChange" method. Error: ', error);
        }
    };
    
    // Handle until change
    const handleUntilChange = (date) => {
        try {
            const timestamp = date.getTime();
            setUntilDate(timestamp);
        } catch (error) {
            console.error('Exception occurred in "handleUntilChange" method. Error: ', error);
        }
    };

    const handleGetInsights = () => {
        try {
            console.error('handleGetInsights');
        } catch (error) {
            console.error('Exception occurred in "handleGetInsights" method. Error: ', error);
        }
    };

    // Access token change effect
    const accessTokenEffect = () => {
        const asyncFun = async () => {
            try {
                const accessToken = getGlobalVariable('accessToken');
                if (accessToken) {
                    // Set the authorization token as a default header for all Axios requests
                    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                    const endpointUrl = SERVER_BASE_URL + '/pages/get-all';

                    try {
                        const response = await axios.get(endpointUrl);
                        const pages = response?.data?.data?.data;
                        if (pages) {
                            setPages(pages);
                        }
                    } catch (error) {
                        console.error('Failed to fetch pages. Error: ', error);
                    }
                }
            } catch (error) {
                console.error('Exception occurred in "accessTokenEffect" method. Error: ', error);
            }
        };

        asyncFun();
    };

    // Use effect hooks
    useEffect(accessTokenEffect, [getGlobalVariable('accessToken')]); // Re-run on global variable accessToken change

    return (
        <div>
            <TopBar />
            { pages ?
                (
                    <div className="user-form">
                        <div className="content">
                            <div>
                                <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="pageSelect">Select a Page:</label>
                                    <select id="pageSelect" value={selectedPage} onChange={handlePageChange} required>
                                    <option value="">Select a page</option>
                                    {pages.map((page) => (
                                        <option key={page.id} value={page.id}>{page.name}</option>
                                    ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="sinceDatePicker">Since:</label>
                                    <DatePicker
                                    id="sinceDatePicker"
                                    selected={sinceDate}
                                    onChange={handleSinceChange}
                                    dateFormat="MM/dd/yyyy"
                                    placeholderText="Select since date"
                                    required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="untilDatePicker">Until:</label>
                                    <DatePicker
                                    id="untilDatePicker"
                                    selected={untilDate}
                                    onChange={handleUntilChange}
                                    dateFormat="MM/dd/yyyy"
                                    placeholderText="Select until date"
                                    required
                                    />
                                </div>
                                </div>

                                <button type="submit" onClick={handleGetInsights}>Submit</button>
                            </div>
                        </div>
                    </div>
                )
                :
                (
                    <div>
                        <p>Kindly login to access this feature</p>
                    </div>
                )
            }
        </div>
    );
}

export default User;
