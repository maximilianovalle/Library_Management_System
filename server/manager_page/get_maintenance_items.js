const pool = require('../database.js');

module.exports = async function getMaintenanceItems(req, res) {
  try {
    const [bookRows] = await pool.query(
      `SELECT bc.ISBN, bc.Copy_ID, bc.Book_Condition, b.Title
        FROM book_copies bc
        JOIN book b ON bc.ISBN = b.ISBN
        WHERE bc.Book_Status = 'Maintenance';
        `
    );

    const [deviceRows] = await pool.query(
      `SELECT dc.Model, dc.Copy_ID, dc.Device_Condition, d.Category
      FROM device_copies dc
      JOIN device d ON dc.Model = d.Model
      WHERE dc.Device_Status = 'Maintenance';
      `
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
