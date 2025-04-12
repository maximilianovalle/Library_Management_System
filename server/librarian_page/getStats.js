const pool = require('../database.js');

module.exports = async function getStats(req, res) {
    try {
        const totalBooksQuery = await pool.query(`SELECT COUNT(*) FROM book_copies`);
        console.log(totalBooksQuery);

        const totalDevicesQuery = await pool.query(`SELECT COUNT(*) FROM device_copies`);
        const checkedOutBooksQuery = await pool.query(`
            SELECT SUM(CASE WHEN Book_Status = 'Checked out' THEN 1 ELSE 0 END) FROM book_copies
        `);
        const checkedOutDevicesQuery = await pool.query(`
            SELECT SUM(CASE WHEN Device_Status = 'Checked out' THEN 1 ELSE 0 END) FROM device_copies
        `);
        const overdueItemsQuery = await pool.query(`
            SELECT 
                (SELECT COUNT(*) 
                 FROM borrow_record 
                 WHERE Category IS NOT NULL 
                 AND Return_Date IS NULL 
                 AND Due_Date < CURDATE()) 
            + 
            (SELECT COUNT(*) 
             FROM borrow_record 
             WHERE ISBN IS NOT NULL 
             AND Return_Date IS NULL 
             AND Due_Date < CURDATE()) 
            AS overdueItems
        `);
        const activeHoldsQuery = await pool.query(`SELECT COUNT(*) FROM holds WHERE Hold_status = 1`);
        const finesDueQuery = await pool.query(`SELECT SUM(CASE WHEN Fine_Status = 2 THEN Amount ELSE 0 END) FROM fines`);

        const [
            totalBooksResult, totalDevicesResult, checkedOutBooksResult, checkedOutDevicesResult, overdueItemsResult, activeHoldsResult, finesDueResult
        ] = await Promise.all([
            totalBooksQuery,
            totalDevicesQuery,
            checkedOutBooksQuery,
            checkedOutDevicesQuery,
            overdueItemsQuery,
            activeHoldsQuery,
            finesDueQuery
        ]);

        const totalBooks = totalBooksResult[0][0]['COUNT(*)'];
        const totalDevices = totalDevicesResult[0][0]['COUNT(*)'];
        const checkedOutBooks = checkedOutBooksResult[0][0]['SUM(CASE WHEN Book_Status = \'Checked out\' THEN 1 ELSE 0 END)'];
        const checkedOutDevices = checkedOutDevicesResult[0][0]['SUM(CASE WHEN Device_Status = \'Checked out\' THEN 1 ELSE 0 END)'];
        const overdueItems = overdueItemsResult[0][0].overdueItems;
        const activeHolds = activeHoldsResult[0][0]['COUNT(*)'];
        const finesDue = finesDueResult[0][0]['SUM(CASE WHEN Fine_Status = 2 THEN Amount ELSE 0 END)'];

        const stats = {
            totalBooks,
            totalDevices,
            checkedOutBooks,
            checkedOutDevices,
            overdueItems,
            activeHolds,
            finesDue
        };

        console.log(stats);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(stats));

    } catch (error) {
        console.error("Error sending stats:", error);

        if (!res.headersSent) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Internal Server Error' }));
        }
    }
};
