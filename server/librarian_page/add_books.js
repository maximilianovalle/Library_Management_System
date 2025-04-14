const pool = require('../database'); // Assuming the database pool is already set up

module.exports = async function add_books(req, res) {
    let body = "";

    req.on("data", (chunk) => {
        body += chunk;
    });

    req.on("end", async () => {
        try {
            let { title, category_id, genre, isbn, publication_year, author, image_url, copies } = JSON.parse(body);
            if (!category_id) {
                category_id = null;
            }
            const authorResult = await pool.query('SELECT Author_ID FROM author WHERE Name = ?', [author]);
            
            let author_id;
            if (authorResult.length === 0) {
                const insertAuthorResult = await pool.query(
                    'INSERT INTO author (Name) VALUES (?)',
                    [author]
                );
                author_id = insertAuthorResult.insertId;
            } else {
                author_id = authorResult[0].Author_ID;
            }

            const insertBookResult = await pool.query(
                'INSERT INTO book (Title, Category_ID, Genre, ISBN, Publication_Year, Author_ID, Image_URL) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [title, category_id, genre, isbn, publication_year, author_id, image_url]
            );

            const book_isbn = insertBookResult.insertId;

            for (let i = 0; i < copies; i++) {
                await pool.query(
                    'INSERT INTO book_copies (ISBN, Book_Condition, Book_Status) VALUES (?, ?, ?)',
                    [book_isbn, 'Good Condition', 'Available']
                );
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Book added successfully' }));

        } catch (err) {
            console.error(err);

            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to add book' }));
        }
    });
};
