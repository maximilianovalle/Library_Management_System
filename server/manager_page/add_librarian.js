const pool = require('../database.js');

module.exports = async function addLibrarian(req, res) {
    try {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk;
        });

        req.on("end", async () => {
            const {
                First_Name,
                Last_Name,
                Password,
                Department,
                Position,
                SSN,
                Hire_Date,
                End_Date,
                Pay_Rate
            } = JSON.parse(body);

            if (!First_Name || !Last_Name || !Password || !Department || !Position || !SSN || !Hire_Date) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "Missing required fields." }));
                return;
            }

            const [result] = await pool.query(
                `INSERT INTO librarian 
                (First_Name, Last_Name, Password, Department, Position, SSN, Hire_Date, End_Date, Pay_Rate, Is_Active, Is_Deleted)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 0)`,
                [
                    First_Name,
                    Last_Name,
                    Password,
                    Department,
                    Position,
                    SSN,
                    Hire_Date,
                    End_Date || null,
                    Pay_Rate || null
                ]
            );

            res.writeHead(201, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Librarian added successfully.", librarian_id: result.insertId }));
        });
    } catch (error) {
        console.error("Error adding librarian:", error);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Server error while adding librarian." }));
    }
};
