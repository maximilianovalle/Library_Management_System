const pool = require('../database.js');

module.exports = async function getBooks(req, res) {
    try {


        const [rows] =  await pool.query(`
            SELECT b.Title, author.Name, b.Genre, b.ISBN, b.Publication_Year, b.Image_URL, bc.Book_Status, bc.Book_Condition, bc.Copy_ID
            FROM book AS b
            JOIN author ON author.Author_ID = b.Author_ID
            JOIN book_copies AS bc ON b.ISBN = bc.ISBN
        `);
        console.log(rows)

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ books: rows }));
    } catch (error) {
        console.error("Error fetching books:", error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Internal Server Error' }));
    }
};
