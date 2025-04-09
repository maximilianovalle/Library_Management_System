const { randomUUID } = require("crypto");   // generate unique session tokens
const pool = require('../database.js');  // database connection

// store session tokens in memory
const currSessions = new Map();


async function getUser(userID) {
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

async function getAdmin(userID) {
    try{
        const [rows] = await pool.query('SELECT * FROM librarian WHERE Librarian_ID = ?', [userID]);  // queries database for user w/ userID

        if (rows.length === 0) {    // if no user found
            return null;    // return null
        }
        return rows[0]; // else return the user

    } catch (error) {
        throw error
    }
}


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
                console.log("\nUserID:", userID);
                console.log("Password:", password);

                // if ( userID or password do not exist )
                if (!userID || !password) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Missing User ID or Password' }));
                    return;
                }

                let user = await getUser(userID, body);   // calls above getUser() function to fetch user details
                let role = 2;   // USER ROLE = 2
                
                // if ( user does not exist )
                if (!user) {
                    user = await getAdmin(userID, body);    // check if admin
                    role = 1;   // ADMIN ROLE = 1
                }
                // if ( user still does not exist )
                if (!user) {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Invalid User ID' }));
                    return;
                }

                // if ( stored password != inputted password )
                if (user.Password !== password) {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Invalid Password' }));
                    return;
                }

                // generate session token
                const sessionToken = randomUUID();

                // if USER role, store session token + User_ID +  to currSessions
                if (role == 2) {
                    currSessions.set(sessionToken, {
                        userID: user.User_ID,
                        role: role,
                    });

                    console.log(" - User stored in memory.");
                }

                // if LIBRARIAN role, store session token + Librarian_ID +  to currSessions
                else {
                    currSessions.set(sessionToken, {
                        userID: user.Librarian_ID,
                        role: role,
                    });

                    console.log(" - Librarian stored in memory.");
                }
                
                console.log("\n", user)
                console.log("\nSession token: ", sessionToken);
                console.log("currSessions map:", currSessions);

                // else 
                res.writeHead(200, {
                    'Content-Type': 'application/json',
                    'Set-Cookie': `token=${sessionToken}; HttpOnly; Path=/; SameSite=Strict`
                });

                let user_name = `${user.First_Name} ${user.Last_Name}`;
                res.end(JSON.stringify({
                    message: `Login successful!`,
                    user: user_name,
                    token: sessionToken,
                    role: role,
                }));    // send message, user, token, and role as JSON to LoginPage.jsx
                
            } catch (error) {
                console.log("Login error 2: ", error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Internal Server Error' }));
                return;
            }
        });

    } catch (error) {
        console.log("Login error 1: ", error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Internal Server Error' }));
        return;
    }
};

// exports session tokens so server.js can access
module.exports.currSessions = currSessions;