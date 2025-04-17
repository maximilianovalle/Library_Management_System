const pool = require("../database.js");

module.exports = async function PickedUpDevice(req, res) {
    try {
        let body = "";

        req.on('data', (chunk) => {
            body += chunk;
        });

        req.on("end", async () => {
            try {
                const {hold_id, model, userID, category, copy_id} = JSON.parse(body);
                console.log(hold_id, model, userID, category, copy_id)
                const firstDigit = String(userID)[0];
                let userRole;
    
                if (firstDigit === '7') userRole = 1;
                else if (firstDigit === '8') userRole = 2;
                else if (firstDigit === '9') userRole = 3;
                else throw new Error("Invalid user ID format");

                await pool.query(`
                    UPDATE holds
                    SET Hold_status = 1
                    WHERE Hold_ID = ?
                `,[hold_id]);

                await pool.query(`
                    UPDATE device_copies
                    SET Device_Status = 'Checked out'
                    WHERE Copy_ID = ?
                `, [copy_id]);
                    
                const [policyRows] = await pool.query(
                    "SELECT Borrow_Duration FROM borrow_policy WHERE Role = ? AND Item_Type = 1",
                    [userRole]
                );
    
                if (policyRows.length === 0) throw new Error("No borrow policy found.");
    
                const borrowDuration = policyRows[0].Borrow_Duration;
    
                const now = new Date();
                const checkoutDate = now.toISOString().split('T')[0];
                const dueDate = new Date(now.getTime() + borrowDuration * 24 * 60 * 60 * 1000)
                    .toISOString().split('T')[0];
    
                const [lastRecord] = await pool.query("SELECT MAX(Record_ID) as last FROM borrow_record");
                const recordId = (lastRecord[0].last || 3000000) + 1;
                console.log("Inserting into DB borrow: ", recordId, userID, checkoutDate, dueDate, category, model, copy_id)

                await pool.query(`INSERT INTO borrow_record 
                (Record_ID, User_ID, Checkout_Date, Due_Date, Return_Date, ISBN, Book_Copy_ID, Category, Model, Device_Copy_ID) 
                VALUES (?, ?, ?, ?, NULL, NULL, NULL, ?, ?, ?)`,
                [recordId, userID, checkoutDate, dueDate, category, model, copy_id]);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: "The device has been picked up" }));

            } catch (error) {
                console.log("Error updating book copy: ", error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: "Internal Server Error" }));
                return;
            }
        });

    } catch (error) {
        console.log("Error handling data chunk: ", error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Internal Server Error" }));
        return;
    }
};
