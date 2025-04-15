const pool = require('../database.js');

module.exports = async function getRecentActivities(req, res) {
    try {
        const [rows] = await pool.query(`
            SELECT 
                b.Record_ID,
                b.User_ID,
                u.First_Name,
                u.Last_Name,-- Assuming User_Name is the name column in the users table
                b.Checkout_Date,
                b.Due_Date,
                b.Return_Date,
                CASE
                    WHEN bo.Title IS NOT NULL THEN bo.Title  -- Book title
                    ELSE d.Model  -- Device model (if no book, it's a device)
                END AS Item_Name,
                CASE
                    WHEN bo.Title IS NOT NULL THEN 'Book'  -- Indicating if it's a book
                    ELSE 'Device'  -- Indicating if it's a device
                END AS Item_Type
            FROM 
                borrow_record b
            LEFT JOIN 
                user u ON b.User_ID = u.User_ID  -- Join with users table to get the user name
            LEFT JOIN 
                book_copies bc ON b.Book_Copy_ID = bc.Copy_ID
            LEFT JOIN 
                book bo ON bc.ISBN = bo.ISBN
            LEFT JOIN 
                device_copies dc ON b.Device_Copy_ID = dc.Copy_ID
            LEFT JOIN 
                device d ON dc.Category = d.Category AND dc.Model = d.Model
            ORDER BY 
                b.Checkout_Date DESC;
        `);
        console.log(rows)
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ activities: rows }));
    } catch (error) {
        console.error("Error fetching recent activities:", error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Internal Server Error' }));
    }
};
