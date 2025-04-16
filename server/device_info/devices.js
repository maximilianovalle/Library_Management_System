const pool = require('../database.js');
module.exports = async function getDevices(req, res) {
    try {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const searchParams = url.searchParams;

        const search_value = searchParams.get("search_value")?.toLowerCase();
        const sort_by = searchParams.get("sort_by");
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 10;
        const offset = (page - 1) * limit;

        // Base query to join device and device_copies tables
        let query = `
            SELECT d.Category, d.Model, dc.Device_Condition, dc.Device_Status, dc.Copy_ID
            FROM device d
            JOIN device_copies dc ON d.Model = dc.Model AND d.Category = dc.Category
            WHERE dc.Device_Status != 'Deleted'
        `;

        const params = [];

        if (search_value) {
            query += ` AND (
                LOWER(dc.Model) LIKE ?
                OR LOWER(dc.Category) LIKE ?
                OR LOWER(dc.Device_Condition) LIKE ?
                OR LOWER(dc.Device_Status) LIKE ?
            )`;
            for (let i = 0; i < 4; i++) params.push(`%${search_value}%`);
        }

        // Sorting
        if (sort_by === "Model A-Z") {
            query += ` ORDER BY dc.Model ASC`;
        } else if (sort_by === "Model Z-A") {
            query += ` ORDER BY dc.Model DESC`;
        } else if (sort_by === "Available First") {
            query += ` ORDER BY CASE WHEN dc.Device_Status = 'Available' THEN 0 ELSE 1 END ASC`;
        } else if (sort_by === "Unavailable First") {
            query += ` ORDER BY CASE WHEN dc.Device_Status = 'Available' THEN 1 ELSE 0 END ASC`;
        }

        // Pagination
        query += ` LIMIT ? OFFSET ?`;
        params.push(limit, offset);

        const [rows] = await pool.query(query, params);

        const formattedDevices = rows.map(row => ({
            model: row.Model,
            category: row.Category,
            condition: row.Device_Condition,
            status: row.Device_Status,
            copy_id: row.Copy_ID
        }));

        const [countRows] = await pool.query(`
            SELECT d.Category, COUNT(*) as count
            FROM device d
            JOIN device_copies dc ON d.Model = dc.Model AND d.Category = dc.Category
            WHERE dc.Device_Status != 'Deleted'
            GROUP BY d.Category
        `);

        const categoryCounts = {};
        countRows.forEach(row => {
            categoryCounts[row.Category] = row.count;
        });

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
