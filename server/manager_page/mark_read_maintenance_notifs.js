// mark_read_maintenance_notifs.js
const pool = require('../database.js');

module.exports = async function markNotifsRead(req, res) {
    try {
        await pool.query(
            `UPDATE notifications
             SET Is_Read = 1
             WHERE Is_Read = 0 AND Type = 'maintenance'`
        );

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Marked all maintenance notifications as read" }));
    } catch (err) {
        console.error("Error updating maintenance notifications:", err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Server error" }));
    }
}
  