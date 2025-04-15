const pool = require('../database');
const getOrAddAuthorId = require('./add_author'); // adjust path as needed

module.exports = async function add_books(req, res) {
    let body = "";

    req.on("data", (chunk) => {
        body += chunk;
    });

    req.on("end", async () => {
        try {
            let {
                title,
                category_id,
                genre,
                isbn,
                publication_year,
                author,
                bio,
                image_url,
                copies
            } = JSON.parse(body);

            if (!category_id) category_id = null;

            const author_id = await getOrAddAuthorId(author, bio);

            const [existingBook] = await pool.query(
                'SELECT * FROM book WHERE ISBN = ?',
                [isbn]
            );

            if (existingBook.length === 0) {
                await pool.query(
                    'INSERT INTO book (Title, Category_ID, Genre, ISBN, Publication_Year, Author_ID, Image_URL) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [title, category_id, genre, isbn, publication_year, author_id, image_url]
                );
            }

            const [copyCountResult] = await pool.query(
                'SELECT COUNT(*) as count FROM book_copies WHERE ISBN = ?',
                [isbn]
            );
            const existingCopies = copyCountResult[0].count;

            for (let i = 1; i <= copies; i++) {
                await pool.query(
                    'INSERT INTO book_copies (Copy_ID, ISBN, Book_Condition, Book_Status) VALUES (?, ?, ?, ?)',
                    [existingCopies + i, isbn, 'Good Condition', 'Available']
                );
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Book and/or copies added successfully' }));

        } catch (err) {
            console.error(err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to add book' }));
        }
    });
};
