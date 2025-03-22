var http = require('http');
const pool = require("./database.js");   
const cors = require('cors');
const login = require("./login_function/login.js");

const app = http.createServer( async (req, res) => {                                // create the server
    
    // FOR CORS : Cross-Origin Resource Sharing, allow methods and headers, and set the content type
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin');
    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }
    
    else if(req.url === '/login' && req.method === 'POST') {
      login(req, res);
      return;
    }
    res.end();
    
}).listen(8000, console.log('Server is running on port 8000'));

// async function getLibrarianInfo() {
//     const [rows] = await pool.query('SELECT * FROM librarian');
//     return rows;
// }

// getLibrarianInfo().then((librarian) => {
//     console.log(librarian);
// });