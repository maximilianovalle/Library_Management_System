const pool = require('../database.js');

// getDevices() - Fetches device info based on optional search, sort, and pagination params
module.exports = async function getDevices(req, res) {
    try {
        // Extract query parameters from request
        const url = new URL(req.url, `http://${req.headers.host}`);
        const searchParams = url.searchParams;

        const search_by = searchParams.get("search_by");
        const search_value = searchParams.get("search_value");
        const sort_by = searchParams.get("sort_by");
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 10;


        // Calculate pagination offset
        const offset = (parseInt(page) - 1) * parseInt(limit);

        // Allow only valid fields for filtering
        const allowedFields = ['model', 'category', 'device_condition', 'device_status'];
        const fieldMap = {
            model: "dc.Model",
            category: "dc.Category",
            device_condition: "dc.Device_Condition",
            device_status: "dc.Device_Status"
        };

        // Base query to join device and device_copies tables
        let query = `
            SELECT d.Category, d.Model, dc.Device_Condition, dc.Device_Status
            FROM device d
            JOIN device_copies dc
            ON d.Model = dc.Model AND d.Category = dc.Category
        `;

        const params = [];

        // Apply filtering if search parameters are valid
        if (search_by && search_value && allowedFields.includes(search_by.toLowerCase())) {
            const column = fieldMap[search_by.toLowerCase()];
            query += ` WHERE LOWER(${column}) LIKE ?`;
            params.push(`%${search_value.toLowerCase()}%`);
        } else {
            // Default: show only available devices
            query += ` WHERE dc.Device_Status = 'Available'`;
        }

        // Apply sorting based on dropdown selection
        if (sort_by === "Model A-Z") {
            query += ` ORDER BY dc.Model ASC`;
        } else if (sort_by === "Model Z-A") {
            query += ` ORDER BY dc.Model DESC`;
        } else if (sort_by === "Available First") {
            query += ` ORDER BY CASE WHEN dc.Device_Status = 'Available' THEN 0 ELSE 1 END ASC`;
        } else if (sort_by === "Unavailable First") {
            query += ` ORDER BY CASE WHEN dc.Device_Status = 'Available' THEN 1 ELSE 0 END ASC`;
        }

        // Apply pagination limits
        query += ` LIMIT ? OFFSET ?`;
        params.push(parseInt(limit), offset);

        // console.log("FINAL QUERY:", query);
        // console.log("PARAMS:", params);

        // Run device query
        const [rows] = await pool.query(query, params);

        // Format results into clean array of objects
        const formattedDevices = rows.map(row => ({
            model: row.Model,
            category: row.Category,
            condition: row.Device_Condition,
            status: row.Device_Status
        }));

        // Get counts by category to support frontend chips
        const [countRows] = await pool.query(`
            SELECT d.Category, COUNT(*) as count
            FROM device d
            JOIN device_copies dc ON d.Model = dc.Model AND d.Category = dc.Category
            GROUP BY d.Category
        `);

        const categoryCounts = {};
        countRows.forEach(row => {
            categoryCounts[row.Category] = row.count;
        });

        // Send results to frontend
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            devices: formattedDevices,
            categoryCounts: categoryCounts
        }));

    } catch (error) {
        console.error("Error in getDevices:", error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Internal Server Error' }));
    }
};
