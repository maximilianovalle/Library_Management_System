const pool = require('../database.js')

async function login(req, res) {
    try {
        const { userID, password } = JSON.parse(body);
        console.log(userID, password);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({userID},'Login successful'));
        const [rows] = await pool.query('SELECT U.User_ID, U.Password FROM user as U WHERE User_ID = ? AND Password = ?', [userID, password]);
        if (rows.length === 1) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            console.log('UserID:', userID, 'Password:', password);
            res.end(JSON.stringify('Login successful'));
        }
        else {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify('Invalid user ID or password'));
        }
    }
    catch (error) {
        console.log(error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify('Internal Server Error'));
    }
}


module.exports = login;                                                 // Export the pool so it can be used in other files