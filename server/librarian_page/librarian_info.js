const pool = require('../database.js');

module.exports = async function librarian_info(req, res, userID) {
    try {
        const [userInfo] = await pool.query(
            "SELECT First_Name, Last_Name, Position, Department, Hire_Date, End_Date, Pay_Rate FROM librarian WHERE Librarian_ID = ?",
            [userID]
        );

        if (userInfo.length === 0) {
            console.log("User not found in database.");
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'User not found' }));
            return;
        }

        let {
            First_Name: firstName,
            Last_Name: lastName,
            Position: position,
            Department: department,
            Hire_Date: hire_date,
            End_Date: end_date,
            Pay_Rate: pay_rate
        } = userInfo[0];

        // Optional: Format dates
        hire_date = hire_date?.toISOString().split('T')[0];
        end_date = end_date ? end_date.toISOString().split('T')[0] : null;

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            firstName,
            lastName,
            position,
            department,
            hire_date,
            end_date,
            pay_rate
        }));

    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' }); // HTTP 500: Internal Server Error
        res.end(JSON.stringify({ message: 'Internal Server Error' }));
        return;
    }
};
