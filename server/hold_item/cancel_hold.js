// cancel_hold.js
const pool = require("../database.js");
const { currSessions } = require("../login_function/login.js");

module.exports = async function cancelHold(req, res) {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        const session = currSessions.get(token);

        if (!session) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Unauthorized' }));
        }

        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            const { model } = JSON.parse(body);
            const userID = session.userID;

            // 1. Set hold to expired
            await pool.query(`
                UPDATE holds 
                SET hold_status = 3
                WHERE user_id = ? AND model = ? AND hold_status = 1
            `, [userID, model]);

            // 2. Revert device copy status
            await pool.query(`
                UPDATE device_copies
                SET Device_Status = 'Available'
                WHERE Model = ? AND Device_Status = 'On Hold'
                LIMIT 1
            `, [model]);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Hold canceled successfully.' }));
        });
    } catch (err) {
        console.error("Error canceling hold:", err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Internal server error' }));
    }
};
