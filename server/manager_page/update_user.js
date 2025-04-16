const pool = require('../database.js');

module.exports = async function updateUser(req, res) {
  try {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });

    req.on('end', async () => {
      const userId = req.url.split('/').pop();
      const { First_Name, Last_Name, Email, Role, Password } = JSON.parse(body);

      await pool.query(`
        UPDATE user
        SET First_Name = ?, Last_Name = ?, Email = ?, Role = ?, Password = ?
        WHERE User_ID = ?
      `, [First_Name, Last_Name, Email, Role, Password, userId]);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'User updated successfully' }));
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Failed to update user' }));
  }
};
