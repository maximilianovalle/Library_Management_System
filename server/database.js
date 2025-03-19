const mysql = require('mysql2/promise');                                // include the library
require('dotenv').config();                                             // include the .env file with all the information to connect to the DBMS             
const fs = require('fs');

const pool = mysql.createPool({                                         // Create the pool
    connectionLimit: 10,
    maxIdle: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    waitForConnections: true,
    require_secure_transport: false,
    ssl: {
        ca: fs.readFileSync('../server/DigiCertGlobalRootCA.crt.pem'),  // for authorization adding the CA file provided to us
    }
});

console.log('Created Pool');
module.exports = pool;                                                 // Export the pool so it can be used in other files

// In this file, we basically create a pool for the connections that are made to the database. The reason we use pool is because it allows multiple connections rather than one