const pool = require('../database.js');

module.exports = async function viewUsers(req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT User_ID, First_Name, Last_Name, Email, Password, Role, Created_At
      FROM user
      WHERE Is_Deleted = 0 AND User_ID != 9999999
      ORDER BY Created_At DESC
    `);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(rows));
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Failed to retrieve users' }));
  }
};
