const pool = require('../database.js');

module.exports = async function add_book_to_user(req, res) {

    try{
        const statsResult = await pool.query(`
            SELECT
                (SELECT COUNT(*) FROM book_copies) AS totalBooks,
                (SELECT COUNT(*) FROM device_copies) AS totalDevices,
                (SELECT SUM(CASE WHEN Book_Status = 'Checked out' THEN 1 ELSE 0 END) FROM book_copies) AS checkedOutBooks,
                (SELECT SUM(CASE WHEN Device_Status = 'Checked out' THEN 1 ELSE 0 END) FROM device_copies) AS checkedOutDevices,
                (
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
                ) AS overdueItems,
                (SELECT COUNT(*) FROM holds WHERE Hold_status = 1) AS activeHolds,
                (SELECT SUM(CASE WHEN Fine_Status = 2 THEN Amount ELSE 0 END) FROM fines) AS finesDue;
                `);
        console.log(statsResult);


        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ stats: statsResult }));
    } catch(error){
        console.error('Error fetching statistics:', error);
        res.status(500).json({ error: 'An error occurred while fetching statistics' });

    }
}