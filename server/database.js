const mysql = require('mysql2/promise');
require('dotenv').config();
const fs = require('fs');

const pool = mysql.createPool({
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
        ca: fs.readFileSync('../server/DigiCertGlobalRootCA.crt.pem'),
    }
});

console.log('Created Pool');
module.exports = pool;
