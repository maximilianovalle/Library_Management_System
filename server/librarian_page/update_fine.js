const pool = require('../database.js');

module.exports = async function updateFine(req, res) {
    try {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', async () => {
            const { user_id, new_amount, record_id } = JSON.parse(body);

            if (isNaN(new_amount) || new_amount < 0) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: 'Invalid fine amount' }));
            }

            const [result] = await pool.query(`
                UPDATE fines
                SET Amount = ?
                WHERE Record_ID = ? AND User_ID = ?
            `, [new_amount, record_id, user_id]);

            if (result.affectedRows > 0) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Fine updated successfully' }));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Record not found or not authorized' }));
            }
        });
    } catch (error) {
        console.error("Error updating fine:", error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Internal Server Error' }));
    }
};
