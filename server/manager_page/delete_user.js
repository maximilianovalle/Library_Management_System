const pool = require('../database.js');

module.exports = async function deleteUser(req, res) {
  try {
    const userId = req.url.split('/').pop();
    await pool.query(
        `UPDATE user SET Is_Deleted = 1 WHERE User_ID = ?`,
        [userId]
      );
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'User deleted successfully' }));
  } catch (error) {
    console.error("Error deleting user:", error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Failed to delete user' }));
  }
};
