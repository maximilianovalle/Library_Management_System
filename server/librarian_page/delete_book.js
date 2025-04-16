const pool = require("../database.js");

module.exports = async function deleteBookCopy(req, res, userID) {
    try {
        let body = "";

        req.on('data', (chunk) => {
            body += chunk;
        });

        req.on("end", async () => {
            try {
                const { Copy_ID, ISBN } = JSON.parse(body);

                if (!Copy_ID || !ISBN) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: "Missing Copy_ID or ISBN" }));
                    return;
                }

                const borrowResult = await pool.query(
                    "SELECT * FROM borrow_record WHERE Book_Copy_ID = ? AND ISBN = ?",
                    [Copy_ID, ISBN]
                );

                if (borrowResult.length > 0) {
                    await pool.query(
                        "UPDATE book_copies SET Book_Status = 'Deleted' WHERE Copy_ID = ? AND ISBN = ?",
                        [Copy_ID, ISBN]
                    );
                } else {
                    await pool.query(
                        "UPDATE book_copies SET Book_Status = 'Deleted' WHERE Copy_ID = ? AND ISBN = ?",
                        [Copy_ID, ISBN]
                    );
                }

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: "Book copy status updated to 'Deleted'" }));

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
