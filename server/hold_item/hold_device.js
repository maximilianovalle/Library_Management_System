const pool = require("../database.js");
const { currSessions } = require("../login_function/login.js");

module.exports = async function holdDevice(req, res) {
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
            const { model, category } = JSON.parse(body);
            const userID = session.userID;

            // 1. Check if user already has an active hold for this model
            const [existing] = await pool.query(`
                SELECT * FROM holds 
                WHERE user_id = ? AND model = ? AND hold_status = 1
            `, [userID, model]);

            if (existing.length > 0) {
                return res.writeHead(409).end(JSON.stringify({ message: "Device already on hold." }));
            }

            // 2. Update one available device copy to 'On Hold'
            const [result] = await pool.query(`
                UPDATE device_copies 
                SET Device_Status = 'On Hold'
                WHERE Model = ? AND Category = ? AND Device_Status = 'Available'
                LIMIT 1
            `, [model, category]);

            if (result.affectedRows === 0) {
                return res.writeHead(400).end(JSON.stringify({ message: "No available devices to hold." }));
            }

            // 3. Insert into holds table
            const expirationDate = new Date();
            expirationDate.setMinutes(expirationDate.getMinutes() + 5);
            const formattedExpiration = expirationDate.toISOString().slice(0, 10); // 'YYYY-MM-DD'

            await pool.query(`
                INSERT INTO holds (user_id, model, category, isbn, hold_status, created_at, expiration_date)
                VALUES (?, ?, ?, NULL, 1, NOW(), ?)
            `, [userID, model, category, formattedExpiration]);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Device held successfully.' }));
        });

    } catch (err) {
        console.error("Error placing hold:", err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Internal server error' }));
    }
};
