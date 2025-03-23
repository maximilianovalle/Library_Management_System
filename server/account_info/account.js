const pool = require('../database.js');

module.exports = async function getUserName(req, res) {
    try {

        // TEMPORARY USER ID FOR TESTING
        const TEMP_USER = 7000001;
        
        const [rows] = await pool.query("SELECT First_Name, Last_Name, Email, Created_At FROM user WHERE User_ID = ?", [TEMP_USER]);   // queries database for user info of specific User_ID

        if (rows.length === 0) {    // if no user found
            console.log("User not found in database.");
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Missing User' }));
            return;
        }

        let userName = rows[0].First_Name;
        // console.log("Name: ", userName);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ userName: userName })); // send userName as JSON

    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' }); // HTTP 500: Internal Server Error
        res.end(JSON.stringify({ message: 'Internal Server Error' }));
        return;
    }
};