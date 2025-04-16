const pool = require('../database.js');

module.exports = async function getDevices(req, res) {
    try {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const searchParams = url.searchParams;

        const search_by = searchParams.get("searchBy");
        const search_value = searchParams.get("searchValue");

        console.log("Search By:", search_by, "Search Value:", search_value);

        let query = `SELECT DISTINCT device.* FROM device JOIN device_copies ON device.model = device_copies.model WHERE device_copies.Device_Status != 'Deleted'`

        const params = [];

        if (search_by && search_value) {
            // Search by Title, ISBN, Genre, or Author (any availability)
            switch (search_by.toLowerCase()) {
                case 'model':
                    query += ` AND device.Model LIKE ?`;
                    params.push(`%${search_value}%`);
                    break;
                case 'category':
                    query += ` AND device.Category LIKE ?`;
                    params.push(`%${search_value}%`);
                    break;
                default:
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ message: 'Invalid search_by parameter' }));
            }
        } else {
            // Initial load — show only available devices
            query += ` AND device_copies.Device_Status != 'Deleted'`;
        }

        console.log("Final Query:", query);
        const [rows] = await pool.query(query, params);

        let allDevicesArr = rows.map(row => ({
            model: row.Model,
            category: row.Category,
        }))

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ allDevices: allDevicesArr }));
    } catch (error) {
        console.error("Error fetching devices:", error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Internal Server Error' }));
    }
};
