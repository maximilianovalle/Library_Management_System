var http = require('http');
const pool = require("./database.js");  // database connection
const cors = require('cors');
// import session tokens
const { currSessions } = require("./login_function/login.js");

const login = require("./login_function/login.js"); // login()
const getUserName = require("./account_info/account.js"); // getUserName()
const getBookInfo = require("./book_info/books.js")
const getDevices = require("./device_info/devices.js"); // getDevices()



// creates HTTP server and listens for incoming requests
const app = http.createServer( async (req, res) => {

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
    res.setHeader("Access-Control-Allow-Credentials", "true");  // cookies/sessions

     // if ( the browser sends OPTIONS request to check what methods + headers are allowed by the server )
    if (req.method === 'OPTIONS') {
      res.writeHead(204); // send 204 response to browser
      res.end();  // end the response
      return;
    }
    
    // if ( the browser sends POST request to "/login" )
    if(req.url === '/login' && req.method === 'POST') {
      login(req, res);  // call login() function imported above
      return;
    }

    // client sends request with authentication that might look like "Authorization: Bearer abc123"
    const token = req.headers.authorization?.split("Bearer ")[1];  // splits string into two parts at "Bearer " and returns the second part, "abc123", which is the actual token

    // if ( no token or currSessions doesn't have that token )
    if (!token || !currSessions.has(token)) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: "You must log in before accessing that page." }));
      return;
    }

    // if ( the browser sends a DELETE request to /logout )
    if (req.url === '/logout' && req.method == 'DELETE') {
      currSessions.delete(token);
      console.log("Token deleted: ${token}");
      res.writeHead(200, { 'Content-Type': "application/json" });
      res.end(JSON.stringify({ message: "Logged out successfully" }));
      return;
    }

    // retrieve userID from currSessions
    const userID = currSessions.get(token);

    // if ( the browser sends a GET request to "/account" and a token exists )
    if (req.url === '/account' && req.method === 'GET' && token) {
      getUserName(req, res, userID);  // call getUserName() function imported above
      return;
    }

    if(req.url === '/books' && req.method === 'GET' && token){
      getBookInfo(req, res, userID);
    }

    // if ( browser sends a GET request to "/devices" with valid token )
    if (req.url.startsWith('/devices') && req.method === 'GET' && token) {
      getDevices(req, res);  // call getDevices() to search devices
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