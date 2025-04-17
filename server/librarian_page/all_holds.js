const pool = require('../database.js');

module.exports = async function getHeldItems(req, res) {
    try {
        const [rows] = await pool.query(`
           SELECT 
            CONCAT(u.First_Name, ' ', u.Last_Name) AS Holder_Name,
            h.User_ID,
            h.Category,
            h.Model,
            h.Hold_status,
            h.Created_at,
            h.Expiration_date,
            h.Hold_ID,
            (
                SELECT dc.Copy_ID 
                FROM device_copies dc 
                WHERE dc.Category = h.Category AND dc.Model = h.Model 
                LIMIT 1
            ) AS Copy_ID
            FROM holds AS h
            JOIN user AS u ON h.User_ID = u.User_ID;

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
