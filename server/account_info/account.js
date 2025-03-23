const pool = require('../database.js');

// getUserName() function, handles HTTP request and response
module.exports = async function getUserName(req, res) {
    try {

        // TEMPORARY USER ID FOR TESTING
        const TEMP_USER = 7000001;
        
        const [[userInfo], [fineInfo], [pastBooksRows], [pastDevicesRows]] = await Promise.all([
            pool.query("SELECT First_Name, Last_Name, Email, Created_At FROM user WHERE User_ID = ?", [TEMP_USER]), // queries database for user info of specific User_ID
            pool.query("SELECT Amount FROM fines WHERE User_ID = ? AND Fine_Status = 2", [TEMP_USER]),   // queries database for user unpaid fine amount
            pool.query("SELECT book.Title, author.Name, borrow_record.Checkout_Date, borrow_record.Return_Date FROM borrow_record, book, author WHERE borrow_record.User_ID = ? AND borrow_record.Return_Date IS NOT NULL AND borrow_record.ISBN IS NOT NULL AND book.ISBN = borrow_record.ISBN AND author.Author_ID = book.Author_ID", [TEMP_USER]),  // select all previously checked out + returned books for user
            pool.query("SELECT Category, Model, Checkout_Date, Return_Date FROM borrow_record WHERE User_ID = ? AND Return_Date IS NOT NULL AND Category IS NOT NULL", [TEMP_USER]),
        ]);

        if (userInfo.length === 0) {    // if no user found
            console.log("User not found in database.");
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Missing User' }));
            return;
        }

        let firstName = userInfo[0].First_Name;
        let lastName = userInfo[0].Last_Name;
        let email = userInfo[0].Email;
        let createdAt = userInfo[0].Created_At

        let fineAmntDue = 0;

        for (let i = 0; i < fineInfo.length; i++) { // add up all fine amounts to get total fines due
            fineAmntDue += fineInfo[i].Amount;
        }

        let pastBooksArray = pastBooksRows.map(row => ({    // format pastBooks into array of objects
            title: row.Title,
            author: row.Name,

            checkoutDate: row.Checkout_Date
            ? new Date(row.Checkout_Date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
            : "???",    // changes YYYY-MM-DD to Month DD, YYYY

            returnedDate: row.Return_Date
            ? new Date(row.Return_Date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
            : "???",    // changes YYYY-MM-DD to Month DD, YYYY
        }));

        let pastDevicesArray = pastDevicesRows.map(row => ({
            category: row.Category,
            model: row.Model,
            checkoutDate: row.Checkout_Date

            ? new Date(row.Checkout_Date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
            : "???",    // changes YYYY-MM-DD to Month DD, YYYY

            returnedDate: row.Return_Date
            ? new Date(row.Return_Date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
            : "???",    // changes YYYY-MM-DD to Month DD, YYYY
        }));

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            firstName: firstName,
            lastName: lastName,
            email: email,
            createdAt: createdAt,
            fineAmntDue: fineAmntDue,
            pastBooksArray: pastBooksArray,
            pastDevicesArray: pastDevicesArray,
        })); // send firstName, lastName, email, createdAt, fineAmntDue as JSON to Account.jsx

    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' }); // HTTP 500: Internal Server Error
        res.end(JSON.stringify({ message: 'Internal Server Error' }));
        return;
    }
};