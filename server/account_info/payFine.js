const pool = require('../database.js');

// payFines() function, handles HTTP request and response
module.exports = async function payFine(req, res, userID) {
    try {
        console.log("'Pay Now' button clicked.");

        const [rows] = await pool.query('UPDATE fines SET Fine_Status = 1 WHERE User_ID = ? AND Fine_status = 2', [userID]);

        if (rows.affectedRows === 0) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "No unpaid fines found for this user" }));
            return;
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Successfully paid fine!" }));

    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' }); // HTTP 500: Internal Server Error
        res.end(JSON.stringify({ message: 'Internal Server Error' }));
        return;
    }
};