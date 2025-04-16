const pool = require('../database.js');

module.exports = async function updateBook(req, res) {
    try {

        let body = "";

        req.on('data', (chunk) => {
            body += chunk;
        } )

        req.on('end', async () => {
            const data = JSON.parse(body);
            console.log("BOOK UPDATE:\n", data);
        })

    } catch (error) {
        console.error("Error updating book: ", error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Failed to update book' }));
    }
}