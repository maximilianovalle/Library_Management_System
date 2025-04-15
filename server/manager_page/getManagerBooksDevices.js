const pool = require('../database.js');

module.exports = async function getManagerBooksDevices(req, res) {
    try {
        // gets all unique books + devices that have at least one non-deleted copy (i.e. all books available, checked out, or in maintenance)
        const [[allBooks], [allDevices]] = await Promise.all([
            pool.query(`SELECT DISTINCT book.*, author.Name FROM book JOIN author ON book.Author_ID = author.Author_ID JOIN book_copies ON book.ISBN = book_copies.ISBN WHERE book_copies.Book_Status != 'Deleted'`),

            pool.query(`SELECT DISTINCT device.* FROM device JOIN device_copies ON device.Model = device_copies.Model WHERE device_copies.Device_Status != 'Deleted'`),
        ]);

        // let uniqueBooks = allBooks.length;
        // let uniqueDevices = allDevices.length;

        let allBooksArr = allBooks.map(row => ({
            title: row.Title,
            genre: row.Genre,
            ISBN: row.ISBN,
            publication: row.Publication_Year,
            author: row.Name,
        }))

        let allDevicesArr = allDevices.map(row => ({
            model: row.Model,
            category: row.Category,
        }))

        let uniqueBooks = allBooksArr.length;
        let uniqueDevices = allDevicesArr.length;

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({
            allBooks: allBooksArr,
            allDevices: allDevicesArr,
            uniqueBooks: uniqueBooks,
            uniqueDevices: uniqueDevices,
        }))

    } catch (error) {
        console.error("Error fetching books: ", error);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Failed to fetch books" }));
    }
}