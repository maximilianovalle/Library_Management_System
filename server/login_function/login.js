const pool = require('../database.js')
const bcrypt = require('bcrypt');



async function getUser(userID) {
    try{
    const [rows] = await pool.query('SELECT * FROM user WHERE User_ID = ?', [userID]);
    if (rows.length === 0) {
        return null;
    }
    return rows[0];
}catch (error) {
        console.error("DB error: ", error);
        throw error
    }
}

// getUser('7000001').then(user => console.log(user));


async function login(req, res) {
    try {
        if (!req.body || !req.body.userID || !req.body.password) {
            return res.status(400).json({ message: 'Missing userID or password' });
        }

        const { userID, password } = req.body;
        const user = await getUser(userID);

        if (!user) {
            return res.status(401).json({ message: 'Invalid user ID' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.Password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        if(user.Role === 1){
            return res.status(200).json({ message: 'Login successful', User: 'User' });
        }
        if(user.Role === 2){
            return res.status(200).json({ message: 'Login successful', User: 'Librarian' });
        }
        if(user.Role === 3){
            return res.status(200).json({ message: 'Login successful', User: 'Admin' });
        }
        const fullName = `${user.First_Name} ${user.Last_Name}`;
        res.status(200).json({ message: 'Login successful', User: fullName });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = { login };                                                 // Export the pool so it can be used in other files