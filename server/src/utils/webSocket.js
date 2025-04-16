import WebSocket from 'ws'
import { AxiosInstance } from './AxiosInstance'; // Adjust the path as needed

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws, req) => {
    console.log('Client connected');
    
    const queryParams = new URLSearchParams(req.url.split('?')[1]);
    const trend_type = queryParams.get('trend_type') || 'MOST_ACTIVE';

    const fetchData = async () => {
        try {
            const response = await AxiosInstance.get(
                `https://real-time-finance-data.p.rapidapi.com/market-trends`,
                {
                    params: {
                        trend_type,
                        country: 'in',
                        language: 'en'
                    },
                    headers: {
                        "x-rapidapi-key": "e73efbd959msh76019b42ac94269p1dc7cbjsnbc0475767cf6",
                        "x-rapidapi-host": "real-time-finance-data.p.rapidapi.com",
                    },
                }
            );

            if (response.data.status === "OK") {
                ws.send(JSON.stringify(response.data.data));
            } else {
                console.error('Error fetching market trends');
            }
        } catch (error) {
            console.error('API error:', error.message);
        }
    };

    const interval = setInterval(fetchData, 2000);

    ws.on('close', () => {
        console.log('Client disconnected');
        clearInterval(interval);
    });
});
