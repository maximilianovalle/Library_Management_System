const pool = require('../database.js');

module.exports = async function getBooks(req, res) {
    try {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const searchParams = url.searchParams;

        const search_by = searchParams.get("search_by");
        const search_value = searchParams.get("search_value");
        console.log(search_by, search_value)
        let query = `
            SELECT b.Title, b.Genre, b.ISBN, b.Publication_Year, b.Image_URL
            FROM book b
            JOIN book_copies bc ON b.ISBN = bc.ISBN
            WHERE bc.Book_Status = 'Available'
        `;

        if (search_by && search_value) {
            if (search_by === 'Genre') {
                query += ` AND b.Genre LIKE ?`;
            } else if (search_by === 'Title') {
                query += ` AND b.Title LIKE ?`;
            } else if (search_by === 'ISBN') {
                query += ` AND b.ISBN LIKE ?`;
            }
        }

        const [rows] = await pool.query(query, [`%${search_value}%`]);
        console.log(rows)
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ books: rows  }));
        
    } catch (error) {
        console.error("Error fetching books:", error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Internal Server Error' }));
    }
};
