var http = require('http');
const pool = require("./database.js");  // database connection
const cors = require('cors');
// import session tokens
const { currSessions } = require("./login_function/login.js");

const login = require("./login_function/login.js"); // login()
const getUserName = require("./account_info/account.js"); // getUserName()
const getBooks = require("./book_info/books.js") // getBookInfo()
const getDevices = require("./device_info/devices.js"); // getDevices()
const payFine = require('./account_info/payFine.js'); // payFine()
const getGenres = require('./book_info/genres.js'); // getGenres()
const getCheckedOutItems = require('./checkedOutItems/checkedOut.js');
const holdDevice = require("./hold_item/hold_device.js"); //holdDevice()
const getUserHolds = require('./hold_item/user_holds.js');
const cancelHold = require('./hold_item/cancel_hold.js');



// creates HTTP server and listens for incoming requests
const app = http.createServer( async (req, res) => {
  // req [AKA request] - object representing the HTTP request sent by the client, contains details like
  // - HTTP Method: GET, POST, PUT, etc.
  // - URL/path: some general examples include "/login" and "api/users/" 
  // - Header(s): sent by back-end to tell client how to handle resonse
  // - Body: data sent from front-end to back-end
  // - Query Parameters: for example, "/users?id=7000001"
  
  // FOR CORS : Cross-Origin Resource Sharing, allow methods and headers, and set the content type
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // specifies which HTTP methods are allowed from the client
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin'); // specifies which headers the client can send in the request
  res.setHeader("Access-Control-Allow-Credentials", "true");  // cookies/sessions

  console.log("\nIncoming Request:", req.method, req.url);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }
  
  if(req.url === '/login' && req.method === 'POST') {
    login(req, res);  // call login() function imported above
    return;
  }

  // client sends request with authentication ("Authorization: Bearer [tokenString]")
  const token = req.headers.authorization?.split("Bearer ")[1]; // retrieves actual token string from request

  if (!token || !currSessions.has(token)) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: "You must log in before accessing that page." }));
    return;
  }

  console.log("Token authorized.")

  // console.log("passed auth")
  // logout function
  if (req.url === '/logout' && req.method == 'DELETE') {
    currSessions.delete(token);
    console.log(`Token deleted: ${token}`);
    res.writeHead(200, { 'Content-Type': "application/json" });
    res.end(JSON.stringify({ message: "Logged out successfully" }));
    return;
  }

  // retrieve userID + role mapped in currSessions w/ token
  const ID_and_Role = currSessions.get(token);
  const userID = ID_and_Role ? ID_and_Role.userID : null; // extract userID
  const role = ID_and_Role ? ID_and_Role.role : null;  // extract user role (1 = LIBRARIAN, 2 = USER)

  // when /account page loads
  if (req.url === '/account' && req.method === 'GET' && role === 2) {
    getUserName(req, res, userID);  // call getUserName() function imported above
    return;
  }

  // when /account "pay now" button clicked
  if (req.url === '/account' && req.method === 'PUT' && role === 2) {
    payFine(req, res, userID);
    return;
  }

  // if ( the browser sends a GET request to "/books" and has USER role )
  if (req.url.startsWith('/books') && req.method === 'GET' && role === 2){
    console.log('req for books')
    getBooks(req, res);
    return;
  }

  // if ( browser sends a GET request to "/devices" and USER role )
  if (req.url.startsWith('/devices') && req.method === 'GET' && role === 2) {
    getDevices(req, res);  // call getDevices() to search devices
    return;
  }
  
  // when /checkedout loads
  if (req.url === '/checkedout' && req.method === 'GET' && role === 2) {
    console.log("Retrieving user checked out page info.")
    getCheckedOutItems(req, res, userID);
    console.log("Checked out page info retrieved.");
    return;
  }

  if(req.url === '/genres' && req.method === 'GET' && role === 2){
    getGenres(req, res);  // call getGenres() to search genres
    return;
  }
  if(req.url === '/book_by_genre' && req.method === 'GET' && role === 2){
    console.log("book by genre neow")
    get_book_by_genre(req, res);
    return;
  }
  if(req.url === '/borrowbooks' && req.method === 'GET' && role === 2){
    listBooks(req,res);
    return;
  }


  if (req.url === '/hold' && req.method === 'POST' && role === 2) {
    holdDevice(req, res);
    return;
  }
  if (req.url === '/user/holds' && req.method === 'GET' && role === 2) {
    getUserHolds(req, res);
    return;
  }
  if (req.url === '/hold/cancel' && req.method === 'POST') {
    cancelHold(req, res);
    return;
}



  res.end();  // if request does not match any of the defined routes, ends response w/ no data
    
}).listen(8000, console.log('Server is running on port 8000')); // server is listening on port 8000 for incoming HTTP requests
