const pool = require("../database.js");

module.exports = async function deleteBookCopies(req, res) {
    try {

        let body = "";
        req.on('data', (chunk) => {
            body += chunk;
        });

        req.on('end', async () => {
            try {

                const { isbn } = JSON.parse(body);
                console.log("isbn: ", isbn);

                if (!isbn) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: "Missing book ISBN" }));
                    return;
                }

                // set all copies of book as deleted
                await pool.query("UPDATE book_copies SET Book_Status = 'Deleted' WHERE ISBN = ?", [isbn]);

                // return all instances of book if checked out
                await pool.query("UPDATE borrow_record SET Return_Date = NOW() WHERE ISBN = ?", [isbn]);

            } catch (error) {
                console.log("Delete book error internal: ", error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: "Internal Server Error" }));
                return;
            }
        })

    } catch (error) {
        console.log("Delete book error: ", error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Internal Server Error" }));
        return;
    }
}