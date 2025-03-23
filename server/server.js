var http = require('http');
const pool = require("./database.js");  // imports database pool from database.js
const cors = require('cors');

const login = require("./login_function/login.js"); // login()
const getUserName = require("./account_info/account.js"); // getUserName()



const app = http.createServer( async (req, res) => {  // creates HTTP server and listens for incoming requests

    // req [AKA request] - object representing the HTTP request sent by the client, contains details like
    // - HTTP Method: GET, POST, PUT, etc.
    // - URL/path: some general examples include "/login" and "api/users/" 
    // - Header(s): sent by back-end to tell client how to handle resonse
    // - Body: data sent from front-end to back-end
    // - Query Parameters: for example, "/users?id=7000001"
    
    // FOR CORS : Cross-Origin Resource Sharing, allow methods and headers, and set the content type
    res.setHeader('Access-Control-Allow-Origin', '*');  // allows requests from any domain
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // specifies which HTTP methods are allowed from the client
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin'); // specifies which headers the client can send in the request

     // if ( the browser sends OPTIONS request to check what methods + headers are allowed by the server )
    if (req.method === 'OPTIONS') {
      res.writeHead(204); // send 204 response to browser (204: request successful but no content to return)
      res.end();  // end the response
      return;
    }
    
    // else if ( the browser sends POST request to "/login" )
    else if(req.url === '/login' && req.method === 'POST') {
      login(req, res);  // call login() function imported above
      return;
    }

    // else if ( the browser sends a GET request to "/account" )
    else if (req.url === '/account' && req.method === 'GET') {
      getUserName(req, res);  // call getUserName() function imported above
      return;
    }

    res.end();  // if request does not match any of the defined routes, ends response w/ no data
    
}).listen(8000, console.log('Server is running on port 8000')); // server is listening on port 8000 for incoming HTTP requests



// async function getLibrarianInfo() {
//     const [rows] = await pool.query('SELECT * FROM librarian');
//     return rows;
// }

// getLibrarianInfo().then((librarian) => {
//     console.log(librarian);
// });