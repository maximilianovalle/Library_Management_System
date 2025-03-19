var http = require("http");
const pool = require("./database.js");   

const login = require("./login_function/login.js");

const app = http.createServer(function (req, res) {                                // create the server
    res.write('Starting a base!');
    
}).listen(8000);


app.post("/login", (req,res) => {
    login(req,res);
})
// async function getLibrarianInfo() {
//     const [rows] = await pool.query('SELECT * FROM librarian');
//     return rows;
// }

// getLibrarianInfo().then((librarian) => {
//     console.log(librarian);
// });