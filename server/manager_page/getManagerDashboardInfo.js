const pool = require('../database.js');

module.exports = async function getManagerDashboardInfo(req, res, userID) {
    try {
        const [[managerInfo], [totalLibrarians], [booksInMaintenance], [devicesInMaintenance]] = await Promise.all([
            pool.query("SELECT * FROM manager WHERE Manager_ID = ?", [userID]),

            pool.query(`
              SELECT COUNT(*) FROM librarian 
              WHERE End_Date IS NULL 
              AND (Is_Deleted IS NULL OR Is_Deleted = 0)`),

            pool.query("SELECT COUNT(*) FROM book_copies WHERE Book_Status = 'Maintenance'"),

            pool.query("SELECT COUNT(*) FROM device_copies WHERE Device_Status = 'Maintenance'")
        ]);

        if (managerInfo.length === 0) {
            console.log("User not found in database.");
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Missing User' }));
            return;
        }

        let firstName = managerInfo[0].First_Name;
        let lastName = managerInfo[0].Last_Name;

        console.log("Manager Name: ", firstName, lastName);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            firstName,
            lastName,
            activeLibrarians: totalLibrarians[0]['COUNT(*)'],
            maintenanceBooks: booksInMaintenance[0]['COUNT(*)'],
            maintenanceDevices: devicesInMaintenance[0]['COUNT(*)'],
        }));

    } catch (error) {
        console.error("Error in getManagerDashboardInfo:", error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Internal Server Error' }));
    }
};
