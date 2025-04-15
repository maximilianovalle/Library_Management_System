const pool = require('../database.js');

module.exports = async function getBooks(req, res) {
    try {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const searchParams = url.searchParams;

        const search_by = searchParams.get("search_by");
        const search_value = searchParams.get("search_value");

        console.log("Search By:", search_by, "Search Value:", search_value);

        let query = `SELECT DISTINCT book.*, author.Name FROM book JOIN author ON book.Author_ID = author.Author_ID JOIN book_copies ON book.ISBN = book_copies.ISBN WHERE book_copies.Book_Status != 'Deleted'`

        const params = [];

        if (search_by && search_value) {
            // Search by Title, ISBN, Genre, or Author (any availability)
            switch (search_by.toLowerCase()) {
                case 'genre':
                    query += ` AND book.Genre LIKE ?`;
                    params.push(`%${search_value}%`);
                    break;
                case 'title':
                    query += ` AND book.Title LIKE ?`;
                    params.push(`%${search_value}%`);
                    break;
                case 'isbn':
                    query += ` AND book.ISBN LIKE ?`;
                    params.push(`%${search_value}%`);
                    break;
                case 'author':
                    query += ` AND author.Name LIKE ?`;
                    params.push(`%${search_value}%`);
                    break;
                default:
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ message: 'Invalid search_by parameter' }));
            }
        } else {
            // Initial load — show only available books
            query += ` AND book_copies.Book_Status != 'Deleted'`;
        }

        console.log("Final Query:", query);
        const [rows] = await pool.query(query, params);

        let allBooksArr = rows.map(row => ({
            title: row.Title,
            genre: row.Genre,
            ISBN: row.ISBN,
            publication: row.Publication_Year,
            author: row.Name,
        }))

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ allBooks: allBooksArr }));
    } catch (error) {
        console.error("Error fetching books:", error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Internal Server Error' }));
    }
};
