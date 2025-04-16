const pool = require('../database.js');

module.exports = async function getBooks(req, res, userID) {
    try {

        let body = "";
        req.on('data', (chunk) => {
            body += chunk;
        });

        req.on('end', async () => {
            try {

                const { id } = JSON.parse(body);
                console.log("Notif ID: ", id);

                // mark notif as read
                await pool.query("UPDATE notifications SET Is_Read = 1 WHERE Notification_ID = ?", [id]);

            } catch (error) {
                console.log("Read notif error internal: ", error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: "Internal Server Error" }));
                return;
            }
        })

    } catch (error) {
        console.error("Read notif error: ", error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Internal Server Error' }));
    }
};
