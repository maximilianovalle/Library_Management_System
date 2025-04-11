const pool = require('../database.js');

module.exports = async function getBooks(req, res) {
    try {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const searchParams = url.searchParams;

        const search_by = searchParams.get("search_by");
        const search_value = searchParams.get("search_value");

        console.log("Search By:", search_by, "Search Value:", search_value);

        let query = `
            SELECT b.Title, author.Name, b.Genre, b.ISBN, b.Publication_Year, b.Image_URL, bc.Book_Status
            FROM book AS b
            JOIN author ON author.Author_ID = b.Author_ID
            JOIN book_copies AS bc ON b.ISBN = bc.ISBN
            WHERE bc.Book_Status = 'Available'

        `;

        const params = [];

        if (search_by && search_value) {
            // Search by Title, ISBN, Genre, or Author (any availability)
            switch (search_by.toLowerCase()) {
                case 'genre':
                    query += ` AND b.Genre LIKE ?`;
                    params.push(`%${search_value}%`);
                    break;
                case 'title':
                    query += ` AND b.Title LIKE ?`;
                    params.push(`%${search_value}%`);
                    break;
                case 'isbn':
                    query += ` AND b.ISBN LIKE ?`;
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
            query += ` AND bc.Book_Status = 'Available'`;
        }

        console.log("Final Query:", query);
        const [rows] = await pool.query(query, params);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ books: rows }));
    } catch (error) {
        console.error("Error fetching books:", error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Internal Server Error' }));
    }
};
