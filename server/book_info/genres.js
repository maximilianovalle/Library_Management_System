const pool = require('../database.js');
// console.log("imhere"); // log to console that we are fetching genres


module.exports = async function getGenres(req, res) {
    console.log("getGenres function CALLED")
    try {
        const [rows] = await pool.query("SELECT DISTINCT Genre FROM book"); // queries database for all genres
        console.log(rows);

    //     if (rows.length === 0) {    // if no genres found
    //         console.log("No genres found in database.");
    //         res.writeHead(400, { 'Content-Type': 'application/json' });
    //         res.end(JSON.stringify({ message: 'Missing Genres' }));
    //         return;
    //     }

    //     res.writeHead(200, { 'Content-Type': 'application/json' });
    //     res.end(JSON.stringify({genres : rows})); // returns all genres in JSON format
    } catch (error) {
        console.error("Error fetching genres:", error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Internal Server Error' }));
    }
}
