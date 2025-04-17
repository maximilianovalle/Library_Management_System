const pool = require('../database.js');

module.exports = async function getCheckedOutItems(req, res, userID) {
    try {
        const USER = userID;

        const [[checkedOutBooks], [checkedOutDevices], [onHoldDevices]] = await Promise.all([
            // Fetch checked out books
            pool.query(`
                SELECT book.Title, book.Genre, author.Name, record.Checkout_Date, 
                       record.Due_Date, record.Book_Copy_ID, book.ISBN
                FROM borrow_record AS record
                JOIN book ON book.ISBN = record.ISBN
                JOIN author ON author.Author_ID = book.Author_ID
                WHERE record.User_ID = ?
                  AND record.Return_Date IS NULL
                  AND record.ISBN IS NOT NULL
            `, [USER]),

            // Fetch checked out devices (one per Device_Copy_ID)
            pool.query(`
                SELECT r.Category, r.Model, r.Checkout_Date, r.Due_Date, r.Device_Copy_ID
                FROM borrow_record r
                JOIN (
                    SELECT MAX(Record_ID) AS latest_record
                    FROM borrow_record
                    WHERE User_ID = ?
                      AND Return_Date IS NULL
                      AND Category IS NOT NULL
                    GROUP BY Device_Copy_ID
                ) latest ON r.Record_ID = latest.latest_record
            `, [USER]),

            // Fetch devices on hold (but not expired yet)
            pool.query(`
                SELECT Category, Model, Expiration_date
                FROM holds
                WHERE User_ID = ?
                  AND Category IS NOT NULL
                  AND Hold_Status = 1
                  AND Expiration_date > NOW()
            `, [USER]),
        ]);

        // Format checked out books
        const checkedOutBooksArr = checkedOutBooks.map(row => ({
            title: row.Title,
            genre: row.Genre,
            author: row.Name,
            isbn: row.ISBN,
            copyID: row.Book_Copy_ID,
            checkedOut: row.Checkout_Date
                ? new Date(row.Checkout_Date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
                : "???",
            due: row.Due_Date
                ? new Date(row.Due_Date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
                : "???",
        }));

        // Format checked out devices
        const checkedOutDevicesArr = checkedOutDevices.map(row => ({
            category: row.Category,
            model: row.Model,
            copyID: row.Device_Copy_ID,
            checkedOut: row.Checkout_Date
                ? new Date(row.Checkout_Date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
                : "???",
            due: row.Due_Date
                ? new Date(row.Due_Date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
                : "???",
        }));

        // Format held devices
        const heldDevicesArr = onHoldDevices.map(row => ({
            category: row.Category,
            model: row.Model,
            expires: row.Expiration_date
                ? new Date(row.Expiration_date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
                : "???",
        }));

        // Send response
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            checkedOutBooksArr,
            checkedOutDevicesArr,
            heldDevicesArr,
            message: 'Successfully retrieved borrowed items',
        }));

    } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Internal Server Error' }));
    }
};
