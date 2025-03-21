var http = require('http');
const pool = require("./database.js");   
const cors = require('cors');
const login = require("./login_function/login.js");
const { log } = require('console');

const app = http.createServer( async (req, res) => {                                // create the server
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'backend' }));

    if(req.url === '/login' && req.method === 'POST') {
        login(req, res);
    }
    res.end();
}).listen(8000, console.log('Server is running on port 8000'));


// app.post("/login", (req,res) => {
//     login(req,res);
// })
// async function getLibrarianInfo() {
//     const [rows] = await pool.query('SELECT * FROM librarian');
//     return rows;
// }

// getLibrarianInfo().then((librarian) => {
//     console.log(librarian);
// });