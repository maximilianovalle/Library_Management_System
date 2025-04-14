// get_unread_maintenance_notifs.js
const pool = require('../database.js');

module.exports = async function getUnreadNotifs(req, res) {
    try {
        const [rows] = await pool.query(
            `SELECT COUNT(*) AS count
             FROM notifications
             WHERE Is_Read = 0 AND Type = 'maintenance'`
        );

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ count: rows[0].count }));
    } catch (err) {
        console.error("Error fetching unread maintenance notifications:", err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Server error" }));
    }
}
