var http = require("http");
const pool = require("./database.js");

http.createServer(function (req, res) { 
    res.write('Starting a base!');
    res.end();
}).listen(8000);

async function getLibrarianInfo() {
    const [rows] = await pool.query('SELECT * FROM librarian');
    return rows;
}

getLibrarianInfo().then((librarian) => {
    console.log(librarian);
});