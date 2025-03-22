const pool = require('../database.js')



async function getUser(userID, body) {
    try{
    const [rows] = await pool.query('SELECT * FROM user WHERE User_ID = ?', [userID]);
    if (rows.length === 0) {
        return null;
    }
    return rows[0];
}catch (error) {
        throw error
    }
}

// getUser('7000001').then(user => console.log(user));



module.exports = async function login(req, res) {
    try {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end', async () => {
            try {
                const { userID, password } = JSON.parse(body);
                console.log(userID)
                console.log(password)

                if (!userID || !password) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Missing User ID or Password' }));
                    return;
                }

                const user = await getUser(userID, body);
                console.log(user)
                console.log(user.Password)

                if (!user) {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Invalid User ID' }));
                    return;
                }
                if (user.Password !== password) {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Invalid Password' }));
                    return;
                }

                res.writeHead(200, { 'Content-Type': 'application/json' });
                let user_name = user.First_Name + ' ' + user.Last_Name;
                res.end(JSON.stringify({ message: 'Login successful', User: user_name }));
            } catch (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Internal Server Error' }));
                return;
            }
        });
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Internal Server Error' }));
        return;
    }
};