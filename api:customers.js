// This is the updated, more robust version of the backend function.

// The main function that Vercel will run.
module.exports = async (req, res) => {
    // Set CORS headers to allow requests from your Vercel domain
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle pre-flight OPTIONS request for CORS
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Retrieve the secret keys from Vercel's environment variables
    const APPSHEET_APP_ID = process.env.APPSHEET_APP_ID;
    const APPSHEET_ACCESS_KEY = process.env.APPSHEET_ACCESS_KEY;
    const tableName = "Siemens Stock"; // The name of your table in AppSheet

    // Check if the secret keys are configured
    if (!APPSHEET_APP_ID || !APPSHEET_ACCESS_KEY) {
        console.error("Server configuration error: AppSheet API keys are not set.");
        return res.status(500).json({ error: 'Server configuration error.' });
    }

    // Prepare the request to the AppSheet API
    const apiURL = `https://api.appsheet.com/api/v2/apps/${APPSHEET_APP_ID}/tables/${tableName}/Action`;
    const body = JSON.stringify({
        "Action": "Find",
        "Properties": {},
        "Rows": []
    });

    try {
        // Use the built-in 'fetch' to call the AppSheet API
        const apiResponse = await fetch(apiURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'ApplicationAccessKey': APPSHEET_ACCESS_KEY
            },
            body: body
        });

        // Check if the response from AppSheet is successful
        if (!apiResponse.ok) {
            const errorText = await apiResponse.text();
            console.error(`AppSheet API Error: ${apiResponse.status} ${apiResponse.statusText}`, errorText);
            return res.status(apiResponse.status).json({ error: `Failed to fetch from AppSheet: ${errorText}` });
        }

        // Send the successful data back to your webpage
        const data = await apiResponse.json();
        res.status(200).json(data);

    } catch (error) {
        console.error('Internal server error:', error);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
};
