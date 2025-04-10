const pool = require('../database.js');

module.exports = async function getCheckedOutItems(req, res, userID) {
    try {
        const USER = userID;

        const [[checkedOutBooks], [checkedOutDevices]] = await Promise.all([
            pool.query("SELECT book.Title, book.Genre, author.Name, book.Publication_Year, record.Checkout_Date, book.ISBN, record.Due_Date FROM borrow_record AS record, book, author WHERE record.User_ID = ? AND record.Return_Date IS NULL AND record.ISBN IS NOT NULL AND book.ISBN = record.ISBN AND author.Author_ID = book.Author_ID", [USER]),   // gets user checked out books

            pool.query("SELECT Category, Model, Checkout_Date, Due_Date FROM borrow_record WHERE User_ID = ? AND Return_Date IS NULL AND Category IS NOT NULL", [USER]),    // gets user checked out devices
        ]);

        // format checkedOutBooks into array of objects
        let checkedOutBooksArr = checkedOutBooks.map(row => ({
            title: row.Title,
            genre: row.Genre,
            author: row.Name,
            isbn: row.ISBN,

            published: row.Publication_Year
            ? new Date(row.Publication_Year).toLocaleDateString("en-US", {
                year: "numeric", month: "long", day: "numeric" })
                : "???",

            checkedOut: row.Checkout_Date
            ? new Date(row.Checkout_Date).toLocaleDateString("en-US", {
                year: "numeric", month: "long", day: "numeric" })
                : "???",

            due: row.Due_Date
            ? new Date (row.Due_Date).toLocaleDateString("en-US", {
                year: "numeric", month: "long", day: "numeric" })
                : "???",
        }));

        // format checkedOutDevices into array of objects
        let checkedOutDevicesArr = checkedOutDevices.map(row => ({
            category: row.Category,
            model: row.Model,

            checkedOut: row.Checkout_Date
            ? new Date(row.Checkout_Date).toLocaleDateString("en-US", {
                year: "numeric", month: "long", day: "numeric" })
                : "???",

            due: row.Due_Date
            ? new Date (row.Due_Date).toLocaleDateString("en-US", {
                year: "numeric", month: "long", day: "numeric" })
                : "???",
        }));

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            checkedOutBooksArr: checkedOutBooksArr,
            checkedOutDevicesArr: checkedOutDevicesArr,
            message: 'Successfully retrieved borrowed items',
        })) // send checked out books + devices as JSON to checkedOut.jsx

    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Internal Server Error' }));
        return;
    }
};