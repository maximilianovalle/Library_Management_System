const pool = require("../database.js");

module.exports = async function ReturnedDevice(req, res) {

    try {

        let body = "";

        req.on('data', (chunk) => {
            body += chunk;
        });

        req.on("end", async () => {

            try {

                const { model , userID, category, copy_id } = JSON.parse(body);
                console.log("model: ", model);
                console.log("user: ", userID)

                if (!model) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: "Missing device model" }));
                    return;
                }

                // await pool.query("UPDATE holds SET Hold_Status = 3 WHERE User_ID = ? AND Model = ?", [userID, model]);

                // await pool.query("UPDATE device_copies SET Device_Status = 'Available' WHERE Model = ? AND Device_Status = 'On hold' LIMIT 1", [model]);
                await pool.query(`
                    UPDATE holds 
                    SET hold_status = 3
                    WHERE user_id = ? AND model = ? AND hold_status = 1
                `, [userID, model]);
    
                // 2. Revert device copy status
                await pool.query(`
                    UPDATE device_copies
                    SET Device_Status = 'Available'
                    WHERE Model = ? AND Device_Status = 'Checked out'
                    LIMIT 1
                `, [model]);
                

                const [rows] = await pool.query("SELECT Record_ID FROM borrow_record WHERE User_ID = ? AND Category = ? AND Model = ?  AND Device_Copy_ID = ? AND Return_Date IS NULL", 
                [userID, category, model, copy_id]);

                const recordID = rows[0]?.Record_ID;

                console.log("RECORD ID: ", recordID);

                await pool.query("UPDATE borrow_record SET Return_Date = NOW() WHERE Record_ID =  ?", [recordID]);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: "The device is returned" }));

            } catch (error) {
                console.log("Remove hold error: ", error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: "Internal Server Error" }));
                return;
            }

        });

    } catch (error) {
        console.log("Remove hold data chunk error: ", error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Internal Server Error" }));
        return;
    }

}