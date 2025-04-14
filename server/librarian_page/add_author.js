const pool = require('../database');

module.exports = async function add_author(req, res) {
    let body = "";

    req.on("data", (chunk) => {
        body += chunk;
    });

    req.on("end", async () => {
        try {
            const {name, bio} = JSON.parse(body);
            const [lastAuthor] = await pool.query("SELECT MAX(Author_ID) as last FROM Author");
            const authorId = (lastAuthor[0].last || 6000000) + 1;
            await pool.query("INSERT INTO Author (Author_ID, Name, Bio) VALUES (?, ?, ?)", 
            [authorId, name, bio || null]);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Author added successfully' }));

        } catch (err) {
            console.error(err);

            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to add author' }));
        }
    });
}
