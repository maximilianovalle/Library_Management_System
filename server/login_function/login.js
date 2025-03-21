const pool = require('../database.js')

async function login(req, res) {
    const { userID, password } = req.body;
    const [rows] = await pool.query('SELECT * FROM librarian WHERE user_ID = ? AND password = ?', [userID, password]);
    if (rows.length > 0) {
        res.status(200).json({ message: 'Login successful' });
    } else {
        res.status(401).json({ message: 'Invalid username or password' });
    }
}

module.exports = login;                                                 // Export the pool so it can be used in other files
