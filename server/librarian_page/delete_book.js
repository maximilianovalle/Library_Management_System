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

                // First, delete any dependent borrow records
                await pool.query(
                    "DELETE FROM borrow_record WHERE Book_Copy_ID = ? AND ISBN = ?",
                    [Copy_ID, ISBN]
                );

                // Then, delete the book copy itself
                const result = await pool.query(
                    "DELETE FROM book_copies WHERE Copy_ID = ? AND ISBN = ?",
                    [Copy_ID, ISBN]
                );

                if (result.affectedRows === 0) {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: "Book copy not found" }));
                    return;
                }

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: "Book copy deleted successfully!" }));

            } catch (error) {
                console.log("Error deleting book copy: ", error);
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
