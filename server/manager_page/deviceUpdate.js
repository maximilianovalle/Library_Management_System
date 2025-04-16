const pool = require('../database.js');

module.exports = async function updateDevice(req, res) {
    try {

        let body = "";

        req.on('data', (chunk) => {
            body += chunk;
        } )

        req.on('end', async () => {
            const data = JSON.parse(body);
            console.log("DEVICE UPDATE:\n", data);

            // update device category in device
            await pool.query(`UPDATE device SET Category = ? WHERE Model = ?`, [data.category, data.model]);

            console.log("Device updated in device.");

            // update device category in device_copies
            await pool.query(`UPDATE device_copies SET Category = ? WHERE Model = ?`, [data.category, data.model]);

            console.log("Device updated in device_copies.");

            // update device category in borrow_record
            await pool.query(`UPDATE borrow_record SET Category = ? WHERE Model = ?`, [data.category, data.model])

            console.log("Device updated in borrow_record.");

            // update device category in holds
            await pool.query(`UPDATE holds SET Category = ? WHERE Model = ?`, [data.category, data.model]);

            console.log("Device updated in holds.");
        })

    } catch (error) {
        console.error("Error updating device: ", error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Failed to update device' }));
    }
}