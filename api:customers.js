const axios = require('axios');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const APPSHEET_APP_ID = process.env.APPSHEET_APP_ID;
    const APPSHEET_ACCESS_KEY = process.env.APPSHEET_ACCESS_KEY;

    if (!APPSHEET_APP_ID || !APPSHEET_ACCESS_KEY) {
        return res.status(500).json({ error: 'Server configuration error: API keys not set.' });
    }

    try {
        const tableName = "Siemens Stock"; 

        const response = await axios.post(
            `https://api.appsheet.com/api/v2/apps/${APPSHEET_APP_ID}/tables/${tableName}/Action`,
            {
                "Action": "Find",
                "Properties": {
                    "Locale": "en-US"
                },
                "Rows": []
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'ApplicationAccessKey': APPSHEET_ACCESS_KEY
                }
            }
        );

        res.status(200).json(response.data);

    } catch (error) {
        console.error('Error fetching from AppSheet API:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to fetch data from AppSheet.' });
    }
};

