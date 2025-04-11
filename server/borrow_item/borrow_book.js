const pool = require('../database.js');

module.exports = async function add_book_to_user(req, res, userID) {
    let body = "";

    req.on("data", chunk => {
        body += chunk.toString();
    });

    req.on("end", async () => {
        try {
            const data = JSON.parse(body);
            const { ISBN } = data;

            const firstDigit = String(userID)[0];
            let userRole;

            if (firstDigit === '7') userRole = 1;
            else if (firstDigit === '8') userRole = 2;
            else if (firstDigit === '9') userRole = 3;
            else throw new Error("Invalid user ID format");

            const [availableCopy] = await pool.query(
                "SELECT Copy_ID FROM book_copies WHERE ISBN = ? AND Book_Status = 'Available' ORDER BY Copy_ID ASC LIMIT 1",
                [ISBN]
            );

            if (availableCopy.length === 0) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "No available copies for this book." }));
                return;
            }

            const bookCopyId = availableCopy[0].Copy_ID;

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

            await pool.query(
                `INSERT INTO borrow_record 
                (Record_ID, User_ID, Checkout_Date, Due_Date, Return_Date, ISBN, Book_Copy_ID, Category, Model, Device_Copy_ID) 
                VALUES (?, ?, ?, ?, NULL, ?, ?, NULL, NULL, NULL)`,
                [recordId, userID, checkoutDate, dueDate, ISBN, bookCopyId]
            );

            await pool.query(
                "UPDATE book_copies SET Book_Status = 'Checked out' WHERE ISBN = ? AND Copy_ID = ?",
                [ISBN, bookCopyId]
            );

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Book borrowed successfully", Copy_ID: bookCopyId }));

        } catch (error) {
            console.error("Error processing borrow request:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Internal Server Error" }));
        }
    });
};
