var http = require("http");
const pool = require("./database.js"); // database connection
const cors = require("cors");
// import session tokens
const { currSessions } = require("./login_function/login.js");

const login = require("./login_function/login.js"); // login()
const getUserName = require("./account_info/account.js"); // getUserName()
const getBooks = require("./book_info/books.js"); // getBookInfo()
const getDevices = require("./device_info/devices.js"); // getDevices()
const payFine = require("./account_info/payFine.js"); // payFine()
const getGenres = require("./book_info/genres.js"); // getGenres()
const getCheckedOutItems = require("./checkedOutItems/checkedOut.js");
const holdDevice = require("./hold_item/hold_device.js"); //holdDevice()

const returnBook = require("./checkedOutItems/returnBook.js");
const removeHold = require("./checkedOutItems/removeHold.js");

const getNotifications = require("./account_info/getNotifs.js");


const getUserHolds = require("./hold_item/user_holds.js");
const cancelHold = require("./hold_item/cancel_hold.js");
const getReportsData = require("./reports/reports.js"); // getReportsData()
const add_book_to_user = require('./borrow_item/borrow_book.js'); // add_book_to_user()
const getStats = require('./librarian_page/getStats.js') // getStats()
const librarian_info = require('./librarian_page/librarian_info.js')
const add_books = require('./librarian_page/add_books.js')
const add_device = require('./librarian_page/add_device.js')
const get_books = require('./librarian_page/get_books.js')
const deleteBookCopy = require('./librarian_page/delete_book.js')
const all_devices = require('./librarian_page/get_devices.js')
const delete_one_copy_device = require('./librarian_page/delete_device.js')
const getHeldItems = require('./librarian_page/all_holds.js')
const getFines = require('./librarian_page/all_fines.js')
const updateFine = require('./librarian_page/update_fine.js')
const PickedUpDevice = require('./librarian_page/device_pickup.js')
const ReturnedDevice = require('./librarian_page/device_return.js')

const getManagerDashboardInfo = require('./manager_page/getManagerDashboardInfo.js');

const addLibrarian = require('./manager_page/add_librarian.js');
const viewLibrarians = require('./manager_page/view_librarian.js');
const updateLibrarian = require('./manager_page/update_librarian.js');
const deleteLibrarian = require('./manager_page/delete_librarian.js');

const addUser = require('./manager_page/add_user.js');
const viewUsers = require('./manager_page/view_user.js');
const updateUser = require('./manager_page/update_user.js');
const deleteUser = require('./manager_page/delete_user.js');

const getUnreadMaintenanceNotifs = require('./manager_page/get_unread_maintenance_notifs.js');
const markMaintenanceNotifsRead = require('./manager_page/mark_read_maintenance_notifs.js');
const getMaintenanceItems = require('./manager_page/get_maintenance_items.js');
const resolveMaintenanceItem = require('./manager_page/resolve_maintenance_items.js');

const getManagerBooksDevices = require("./manager_page/getManagerBooksDevices.js");
const getBooksManager = require("./manager_page/getBooksManager.js");
const getDevicesManager = require("./manager_page/getDevicesManager.js");
const deleteBookCopies = require('./manager_page/deleteBookCopies.js');
const deleteDeviceCopies = require('./manager_page/deleteDeviceCopies.js');

const bookUpdate = require('./manager_page/bookUpdate.js');
const deviceUpdate = require('./manager_page/deviceUpdate.js');
const markNotifAsRead = require("./account_info/markNotifAsRead.js");

const getManagerReportsData = require("./reports/manager_reports.js"); // getReportsData()

const app = http
  .createServer(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, Origin"
    );
    res.setHeader("Access-Control-Allow-Credentials", "true"); // cookies/sessions

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }
  
  if(req.url === '/login' && req.method === 'POST') {
    login(req, res);
    return;
  }
  
  console.log("\nIncoming Request:", req.method, req.url);

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url === "/login" && req.method === "POST") {
    login(req, res); // call login() function imported above
    return;
  }

  console.log("Authorizing token...");

  const token = req.headers.authorization?.split("Bearer ")[1]; // retrieves actual token string from request

  if (!token || !currSessions.has(token)) {
    res.writeHead(401, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: "You must log in before accessing that page.",
      })
    );
    return;
  }

  console.log("Token authorized.");

  // logout function
  if (req.url === "/logout" && req.method == "DELETE") {
    currSessions.delete(token);
    console.log(`Token deleted: ${token}`);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Logged out successfully" }));
    return;
  }

  // retrieve userID + role mapped in currSessions w/ token
  const ID_and_Role = currSessions.get(token);
  const userID = ID_and_Role ? ID_and_Role.userID : null; // extract userID
  const role = ID_and_Role ? ID_and_Role.role : null; // extract user role (1 = LIBRARIAN, 2 = USER)

  // when /account page loads
  if (req.url === "/account" && req.method === "GET" && role === 2) {
    getUserName(req, res, userID); // call getUserName() function imported above
    return;
  }

  // if ( browser sends a GET request to "/devices" and USER role )
  if (req.url.startsWith('/devices') && req.method === 'GET' && role === 2) {
    getDevices(req, res);  // call getDevices() to search devices
    return;
  }

  if (req.url === "/getNotifications" && req.method === 'GET' && role === 2) {
    console.log("Fetching notifications...");
    getNotifications(req, res, userID);
    console.log("Notifications fetched.");
    return;
  }

  if (req.url === '/markAsRead' && req.method === 'PUT' && role === 2) {
    console.log("Marking notification as read...");
    markNotifAsRead(req, res);
    console.log("Marked notification as read.");
  }
    
  
  // CheckedOut page
  if (req.url === '/checkedout' && req.method === 'GET' && role === 2) {
    console.log("Retrieving user checked out page info.");
    getCheckedOutItems(req, res, userID);
    console.log("Checked out page info retrieved.");
    return;
  }

    if (req.url === '/returnItem' && req.method === 'PUT' && role === 2) {
      console.log("Returning book...");
      returnBook(req, res, userID);
      console.log("Book returned!");
    }

    if (req.url === '/removeHold' && req.method === 'PUT' && role === 2) {
      console.log("Removing hold...");
      removeHold(req, res, userID);
      console.log("Hold removed.");
    }

    if(req.url === '/genres' && req.method === 'GET' && role === 2){
      getGenres(req, res);
      return;
    }
    if(req.url === '/book_by_genre' && req.method === 'GET' && role === 2){
      console.log("book by genre neow")
      get_book_by_genre(req, res);
      return;
    }
    if(req.url === '/borrow_book' && req.method === 'PUT' && role === 2){
      add_book_to_user(req,res, userID);
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
    // when /account "pay now" button clicked
    if (req.url === "/account" && req.method === "PUT" && role === 2) {
      console.log("Paying user fine amount.");
      payFine(req, res, userID);
      console.log("User fine amount paid.");
      return;
    }

    // if ( the browser sends a GET request to "/books" and has USER role )
    if (req.url.startsWith("/books") && req.method === "GET" && role === 2) {
      console.log("req for books");
      getBooks(req, res);
      return;
    }

    // if ( browser sends a GET request to "/devices" and USER role )
    if (req.url.startsWith("/devices") && req.method === "GET" && role === 2) {
      getDevices(req, res); // call getDevices() to search devices
      return;
    }

    // when /checkedout loads
    if (req.url === "/checkedout" && req.method === "GET" && role === 2) {
      console.log("Retrieving user checked out page info.");
      getCheckedOutItems(req, res, userID);
      console.log("Checked out page info retrieved.");
      return;
    }

    if (req.url === "/genres" && req.method === "GET" && role === 2) {
      getGenres(req, res);
      return;
    }

    if(req.url === '/borrow_book' && req.method === 'PUT' && role === 2){
      add_book_to_user(req,res, userID);
      return;
    }

    if (req.url === "/hold" && req.method === "POST" && role === 2) {
      holdDevice(req, res);
      return;
    }

    if (req.url === "/user/holds" && req.method === "GET" && role === 2) {
      getUserHolds(req, res);
      return;
    }

    if (req.url === "/hold/cancel" && req.method === "POST") {
      cancelHold(req, res);
      return;
    }

    //////// LIBRARIAN SIDE REQUESTS ////////

    if (req.url.startsWith("/reports") && req.method === "GET" && role === 1) {
      console.log("Fetching library reports data...");
      getReportsData(req, res);
      return;
    }

    if(req.url === '/stats' && req.method === 'GET' && role === 1){
      console.log("GIMME THE STATS NOEW")
      getStats(req,res)
      return;
    }
    
    if(req.url === '/librarian_account' && req.method === 'GET' && role === 1){
      console.log("Hand over the info.")
      librarian_info(req, res, userID)
      return;
    }
 
    if(req.url === '/addbooks' && req.method === 'POST' && role === 1){
      console.log("ADD BOOKS NEWO")
      add_books(req, res)
      return;
    }

    if(req.url === '/adddevice' && req.method === 'POST' && role === 1){
      console.log("ADD DEVICE NEWO")
      add_device(req, res)
      return;
    }

    if(req.url === '/get_books' && req.method === 'GET' && role === 1){
      console.log("getting books")
      get_books(req, res)
      return;
    } 
    if(req.url === '/delete_book' && req.method === 'DELETE' && role === 1){
      console.log("deleting book")
      deleteBookCopy(req, res)
      return;
    }

    if(req.url === '/get_devices' && req.method === 'GET' && role === 1){
      console.log("getting devices")
      all_devices(req, res)
      return;
    } 
    if(req.url === '/get_holds' && req.method === 'GET' && role === 1){
      console.log("getting holds")
      getHeldItems(req, res)
      return;
    } 
    if(req.url === '/get_fines' && req.method === 'GET' && role === 1){
      console.log("getting fines")
      getFines(req, res)
      return;
    } 

    if(req.url === '/update_fine' && req.method === 'POST' && role === 1){
      console.log("updating fines")
      updateFine(req, res)
      return;
    } 

    if(req.url === '/device_pickup' && req.method === 'POST' && role === 1){
      console.log("Picked up device")
      PickedUpDevice(req, res)
      return;
    }

    if(req.url === '/returned_device' && req.method === 'POST' && role === 1){
      console.log("Returned device")
      ReturnedDevice(req, res)
      return;
    }
    if(req.url === '/delete_one_device' && req.method === 'DELETE' && role === 1){
      console.log("deleting device")
      delete_one_copy_device(req, res)
      return;
    }

    // if(req.url === '/get_activity' && req.method === 'GET' && role === 1){
    //   console.log("Get recent activities")
    //   getRecentActivities(req, res)
    //   return;
    // }


    //////// MANAGER SIDE REQUESTS ////////

    if (req.url === '/manager' && req.method === 'GET' && role === 3) {
      console.log("Getting dashboard info...");
      getManagerDashboardInfo(req, res, userID);
      console.log("Dashboard info receved.");
      return;
    }


    if(req.url === '/add_librarian' && req.method === 'POST' && role === 3){
      addLibrarian(req, res, userID)
      return;
    }

    if (req.url === '/bookUpdateManager' && req.method === 'PUT' && role === 3) {
      console.log("Updating book...");
      bookUpdate(req, res);
      console.log("Book updated.");
    }

    if (req.url === '/deviceUpdateManager' && req.method === 'PUT' && role === 3) {
      console.log("Updating device...");
      deviceUpdate(req, res);
      console.log("Device updated.");
    }

    if (req.url === '/deleteBookManager' && req.method === 'PUT' && role === 3) {
      console.log("Deleting book...");
      deleteBookCopies(req, res);
      console.log("Book deleted.");
    }

    if (req.url === '/deleteDeviceManager' && req.method === 'PUT' && role === 3) {
      console.log("Deleting device...");
      deleteDeviceCopies(req, res);
      console.log("Device deleted.");
    }

    if(req.url === '/view_librarians' && req.method === 'GET' && role === 3){
      viewLibrarians(req, res, userID)
      return;
    }

    if (req.url.startsWith('/update_librarians') && req.method === 'PUT' && role === 3) {
      updateLibrarian(req, res);
      return
    }
    
    if (req.url.startsWith('/delete_librarians') && req.method === 'DELETE' && role === 3) {
      deleteLibrarian(req, res);
      return
    }

    if(req.url === '/add_user' && req.method === 'POST' && role === 3){
      addUser(req, res, userID)
      return;
    }

    if(req.url === '/view_user' && req.method === 'GET' && role === 3){
      viewUsers(req, res, userID)
      return;
    }

    if (req.url.startsWith('/update_user') && req.method === 'PUT' && role === 3) {
      updateUser(req, res);
      return
    }
    
    if (req.url.startsWith('/delete_user') && req.method === 'DELETE' && role === 3) {
      deleteUser(req, res);
      return
    }

    if (req.url === '/maintenance-notifications/unread' && req.method === 'GET' && role === 3) {
      getUnreadMaintenanceNotifs(req, res);
      return;
    }

    if (req.url === '/maintenance-notifications/mark-read' && req.method === 'POST' && role === 3) {
      markMaintenanceNotifsRead(req, res);
      return;
    }

    if (req.url === '/manage_items' && req.method === 'GET' && role === 3) {
      console.log("Getting items for manager...");
      getManagerBooksDevices(req, res);
      console.log("Items received.");
      return;
    }

    if (req.url.startsWith("/books") && req.method === "GET" && role === 3) {
      console.log("req for books");
      getBooksManager(req, res);
      return;
    }

    if (req.url.startsWith("/devices") && req.method === 'GET' && role === 3) {
      console.log("Getting devices for manager...");
      getDevicesManager(req, res);
      console.log("Devices received for manager");
      return;
    }

    if (req.url === '/maintenance-items' && req.method === 'GET' && role === 3) {
      getMaintenanceItems(req, res);
      return;
    }
    
    if (req.url === '/resolve-maintenance' && req.method === 'PUT' && role === 3) {
      resolveMaintenanceItem(req, res);
      return;
    }

    if (req.url.startsWith("/manager_reports") && req.method === "GET" && role === 3) {
      getManagerReportsData(req, res);
      return;
    }

    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Route not found." }));
  })


  .listen(8000, console.log("Server is running on port 8000")); // server is listening on port 8000 for incoming HTTP requests
