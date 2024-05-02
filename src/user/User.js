import { useEffect, useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './User.css';
import TopBar from '../top-bar/TopBar';
import { useVariables } from '../global-variables/GlobalVariablesContext';
import CodeViewer from '../code-viewer/CodeViewer';

const FB_GRAPH_BASE_URL = process.env.REACT_APP_FB_GRAPH_BASE_URL;

const User = () => {
    const { getVariable: getGlobalVariable } = useVariables();
    const [pages, setPages] = useState(null);
    const [selectedPage, setSelectedPage] = useState('');
    const [sinceDate, setSinceDate] = useState('');
    const [untilDate, setUntilDate] = useState('');
    const [insightsData, setInsightsData] = useState(null);

    // Handle page change
    const handlePageChange = (event) => {
        try {
            const selectedPage = JSON.parse(event.target.value);
            setSelectedPage(selectedPage);
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

    const handleGetInsights = async () => {
        try {
            const accessToken = getGlobalVariable('accessToken');
            if (accessToken) {
                const pageId = selectedPage?.id;
                const pageAccessToken = selectedPage?.access_token;
                const endpointUrl = FB_GRAPH_BASE_URL + '/' + pageId + '/insights?metric=' + 'page_fans,page_fans_country,page_impressions,page_impressions_unique' + '&since' + sinceDate + '&until' + untilDate + '&access_token=' + pageAccessToken;
                
                try {
                    const response = await axios.get(endpointUrl);
                    const insightsData = response;
                    if (insightsData) {
                        console.error('Insights data: ', insightsData);
                        setInsightsData(insightsData);
                    }
                } catch (error) {
                    console.error('Failed to fetch insights data. Error: ', error);
                }
            } else {
                console.error('Failed to get insights data. Access token not found');
            }
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
                    const endpointUrl = FB_GRAPH_BASE_URL + '/me/accounts?access_token=' + accessToken;

                    try {
                        const response = await axios.get(endpointUrl);
                        const pages = response?.data?.data;
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
                                        <option key={page.id} value={JSON.stringify(page)}>{page.name}</option>
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

                                <button className="button" type="submit" onClick={handleGetInsights}>Submit</button>
                                { insightsData &&
                                (
                                    <CodeViewer data={insightsData} /> 
                                )}
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
