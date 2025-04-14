const pool = require('../database.js');

module.exports = async function getMaintenanceItems(req, res) {
  try {
    const [bookRows] = await pool.query(
      `SELECT Copy_ID, ISBN, Book_Condition FROM book_copies WHERE Book_Status = 'Maintenance'`
    );

    const [deviceRows] = await pool.query(
      `SELECT Copy_ID, Model, Device_Condition FROM device_copies WHERE Device_Status = 'Maintenance'`
    );

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      books: bookRows,
      devices: deviceRows
    }));
  } catch (err) {
    console.error("Error fetching maintenance items:", err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: "Failed to fetch maintenance items" }));
  }
};
