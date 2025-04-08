const pool = require("../database");

async function getGenres(res,req) {
    const [rows] = await pool.query("SELECT DISTINCT genre FROM book")
    
    return rows;
}

getGenres().then((genres) => {
    console.log(genres);
});

module.exports = {getGenres}

// module.exports = async function getGenres(req, res) {
//     console.log("got here")
//     try {
//         const [rows] = await pool.execute("SELECT DISTINCT genre FROM book");
//         const genres = rows.map(row => row.genre);
//         console.log(genres)


//         res.writeHead(200, { 'Content-Type': 'application/json' });
//         return res.end(JSON.stringify({genres: genres}));

//     } catch (error) {
//         console.error("Error fetching genres:", error);
//         res.writeHead(500, { 'Content-Type': 'application/json' });
//         return res.end(JSON.stringify({
//             message: "Internal Server Error",
//             error: error.message
//         }));
//     }
// }