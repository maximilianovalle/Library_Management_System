const pool = require('../database.js');

module.exports = async function resolveMaintenanceItem(req, res) {
  try {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', async () => {
      const { type, copyId, identifier } = JSON.parse(body);

      if (type === 'book') {
        await pool.query(
          `UPDATE book_copies 
           SET Book_Status = 'Available', Book_Condition = 'Good condition' 
           WHERE Copy_ID = ? AND ISBN = ?`,
          [copyId, identifier]
        );
      } else if (type === 'device') {
        await pool.query(
          `UPDATE device_copies 
           SET Device_Status = 'Available', Device_Condition = 'Good condition' 
           WHERE Copy_ID = ? AND Model = ?`,
          [copyId, identifier]
        );
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Item resolved from maintenance' }));
    });
  } catch (err) {
    console.error("Error resolving maintenance:", err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: "Server error" }));
  }
};
