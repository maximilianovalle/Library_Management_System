const pool = require("../database.js");
const { currSessions } = require("../login_function/login.js");

module.exports = async function getUserHolds(req, res) {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        const session = currSessions.get(token);

        if (!session) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Unauthorized' }));
        }

        const userID = session.userID;

        const [holds] = await pool.query(`
            SELECT model, hold_status 
            FROM holds 
            WHERE user_id = ? AND hold_status = 1
        `, [userID]);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ holds }));
    } catch (err) {
        console.error("Error fetching holds:", err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Internal server error' }));
    }
};
