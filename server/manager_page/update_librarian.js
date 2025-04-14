// update_librarian.js
const pool = require('../database.js');

module.exports = async function updateLibrarian(req, res) {
    try {
        const id = req.url.split('/').pop();
        let body = "";

        req.on("data", chunk => body += chunk);
        req.on("end", async () => {
            const data = JSON.parse(body);

            const [result] = await pool.query(
                `UPDATE librarian SET 
                    First_Name = ?, Last_Name = ?, Password = ?,
                    Department = ?, Position = ?, SSN = ?,
                    Hire_Date = ?, End_Date = ?, Pay_Rate = ?
                 WHERE Librarian_ID = ?`,
                [
                    data.First_Name,
                    data.Last_Name,
                    data.Password,
                    data.Department,
                    data.Position,
                    data.SSN,
                    data.Hire_Date,
                    data.End_Date || null,
                    data.Pay_Rate || null,
                    id
                ]
            );

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Librarian updated successfully' }));
        });
    } catch (error) {
        console.error("Error updating librarian:", error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Failed to update librarian' }));
    }
};
