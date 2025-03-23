const pool = require('../database.js');

// getUserName() function, handles HTTP request and response
module.exports = async function getUserName(req, res) {
    try {

        // TEMPORARY USER ID FOR TESTING
        const TEMP_USER = 7000001;
        
        const [[userInfo], [fineInfo]] = await Promise.all([
            pool.query("SELECT First_Name, Last_Name, Email, Created_At FROM user WHERE User_ID = ?", [TEMP_USER]), // queries database for user info of specific User_ID
            pool.query("SELECT Amount FROM fines WHERE User_ID = ? AND Fine_Status = 2", [TEMP_USER])   // queries database for user unpaid fine amount
        ]);

        if (userInfo.length === 0) {    // if no user found
            console.log("User not found in database.");
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Missing User' }));
            return;
        }

        let firstName = userInfo[0].First_Name;
        let lastName = userInfo[0].Last_Name;
        let email = userInfo[0].Email;
        let createdAt = userInfo[0].Created_At;

        let fineAmntDue = 0;

        for (let i = 0; i < fineInfo.length; i++) {
            fineAmntDue += fineInfo[i].Amount;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            firstName: firstName,
            lastName: lastName,
            email: email,
            createdAt: createdAt,
            fineAmntDue: fineAmntDue,
        })); // send firstName, lastName, email, createdAt, fineAmntDue as JSON

    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' }); // HTTP 500: Internal Server Error
        res.end(JSON.stringify({ message: 'Internal Server Error' }));
        return;
    }
};