const pool = require("../database.js");

module.exports = async function deleteDeviceCopies(req, res) {
    try {

        let body = "";
        req.on('data', (chunk) => {
            body += chunk;
        });

        req.on('end', async () => {
            try {

                const { model } = JSON.parse(body);
                console.log("model: ", model);

                // set all available copies of device as deleted
                await pool.query("UPDATE device_copies SET Device_Status = 'Deleted' WHERE Model = ? AND Device_Status != 'Checked out' AND Device_Status != 'On hold'", [model]);

            } catch (error) {
                console.log("Delete device error internal: ", error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: "Internal Server Error" }));
                return;
            }
        })

    } catch (error) {
        console.log("Delete device error: ", error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Internal Server Error" }));
        return;
    }
}