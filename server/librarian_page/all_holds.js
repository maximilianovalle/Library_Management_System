const pool = require('../database.js');

module.exports = async function getHeldItems(req, res) {
    try {
        const [rows] = await pool.query(`
            SELECT 
                CONCAT(u.First_Name, ' ', u.Last_Name) AS Holder_Name,
                h.Category,
                h.Model
            FROM holds AS h
            JOIN user AS u ON h.User_ID = u.User_ID
            JOIN device_copies AS dc ON h.Category = dc.Category AND h.Model = dc.Model
        `);

        console.log(rows);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ heldItems: rows }));
    } catch (error) {
        console.error("Error fetching held items:", error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Internal Server Error' }));
    }
};
