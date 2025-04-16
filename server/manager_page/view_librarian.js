const pool = require('../database.js');

module.exports = async function viewLibrarians(req, res) {
    try {
        const [rows] = await pool.query(`
            SELECT Librarian_ID, First_Name, Last_Name, Password, Department, Position, SSN, Hire_Date, End_Date, Pay_Rate, Is_Active
            FROM librarian
            WHERE Is_Deleted = 0
            ORDER BY is_Active DESC
        `);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(rows));
    } catch (error) {
        console.error("Error retrieving librarians:", error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Failed to retrieve librarians' }));
    }
};
