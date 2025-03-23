const pool = require('../database.js')

async function getUser(userID, body) {
    try{
        const [rows] = await pool.query('SELECT * FROM user WHERE User_ID = ?', [userID]);  // queries database for user w/ userID

        if (rows.length === 0) {    // if no user found
            return null;    // return null
        }
        return rows[0]; // else return the user

    } catch (error) {
        throw error
    }
}

// getUser('7000001').then(user => console.log(user));

module.exports = async function login(req, res) {
    try {
        
        let body = '';
        req.on('data', (chunk) => { // listens for incoming data
            body += chunk;  // adds data chunk to body
        });
        
        // triggered when all data is received
        req.on('end', async () => {
            try {
                const { userID, password } = JSON.parse(body);  // request body is turned into javascript object, userID and password is extracted
                console.log(userID)
                console.log(password)

                // if ( userID or password do not exist )
                if (!userID || !password) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Missing User ID or Password' }));
                    return;
                }

                const user = await getUser(userID, body);   // calls above getUser() function to fetch user details
                console.log(user)
                console.log(user.Password)

                // if ( user == NULL )
                if (!user) {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Invalid User ID' }));
                    return;
                }

                // if ( stored password != inputted password)
                if (user.Password !== password) {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Invalid Password' }));
                    return;
                }

                // else 
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