const pool = require('../database.js');

module.exports = async function getFines(req, res) {
    try {
        const [rows] = await pool.query(`
            SELECT 
                CONCAT(u.First_Name, ' ', u.Last_Name) AS User_Name,
                f.Amount,
                f.Reason,
                f.Record_ID,
                f.Fine_Status,
                f.User_ID,
                f.Created_at
            FROM fines AS f
            JOIN user AS u ON f.User_ID = u.User_ID
        `);

        console.log(rows);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ fines: rows }));
    } catch (error) {
        console.error("Error fetching fines:", error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Internal Server Error' }));
    }
};
