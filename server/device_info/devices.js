const pool = require('../database.js');  // database connection

// getDevices() function, handles HTTP GET request for device search
module.exports = async function getDevices(req, res) {
    try {
        const { search_by, search_value } = req.query;  // get search fields from frontend request

        console.log("SEARCH BY:", search_by);
        console.log("SEARCH VALUE:", search_value);

        // Base query: join device table with device_copies table
        let query = `
            SELECT d.Category, d.Model, dc.Condition, dc.Status
            FROM device d
            JOIN device_copies dc ON d.Model = dc.Model AND d.Category = dc.Category
        `;

        const params = [];

        // if ( search_by and search_value are provided )
        if (search_by && search_value) {
            // only allow filtering by valid fields
            const allowedFields = ['model', 'category', 'condition', 'status'];

            if (!allowedFields.includes(search_by.toLowerCase())) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Invalid search field' }));
                return;
            }

            // add filtering clause to SQL query
            query += ` WHERE LOWER(${search_by}) LIKE ?`;
            params.push(`%${search_value.toLowerCase()}%`);
        }

        console.log("FINAL QUERY:", query);
        console.log("PARAMS:", params);

        // execute query using parameterized inputs to avoid SQL injection
        const [rows] = await pool.query(query, params);

        // format each row into clean object
        const formattedDevices = rows.map(row => ({
            model: row.Model,
            category: row.Category,
            condition: row.Condition,
            status: row.Status
        }));

        // send formatted results to frontend
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(formattedDevices));
    } catch (error) {
        console.error("Error in getDevices:", error);
        res.writeHead(500, { 'Content-Type': 'application/json' }); // HTTP 500: Internal Server Error
        res.end(JSON.stringify({ message: 'Internal Server Error' }));
    }
};
