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

                // set all copies of device as deleted
                await pool.query("UPDATE device_copies SET Device_Status = 'Deleted' WHERE Model = ?", [model]);

                // return all instances of device if checked out
                await pool.query("UPDATE borrow_record SET Return_Date = NOW() WHERE Model = ?", [model]);

                // remove all holds on instances of device
                await pool.query("UPDATE holds SET Hold_status = 3 WHERE Model = ?", [model]);

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