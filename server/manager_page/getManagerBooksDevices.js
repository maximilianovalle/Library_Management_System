const pool = require('../database.js');

module.exports = async function getManagerBooks(req, res) {
    try {
        // gets all unique books that have at least one non-deleted copy (i.e. all books available, checked out, or in maintenance)
        const [allBooks] = await pool.query(`SELECT DISTINCT book.* FROM book JOIN book_copies ON book.ISBN = book_copies.ISBN WHERE book_copies.Book_Status != 'Deleted'`);

    } catch (error) {
        console.error("Error fetching books: ", error);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Failed to fetch books" }));
    }
}