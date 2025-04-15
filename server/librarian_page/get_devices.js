const pool = require('../database.js');

module.exports = async function all_devices(req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT dc.Copy_ID, dc.Category, dc.Model, dc.Device_Condition, dc.Device_Status
      FROM device_copies AS dc
      JOIN device AS d 
        ON dc.Category = d.Category AND dc.Model = d.Model
    `);

    console.log("Devices fetched:", rows);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ devices: rows }));
  } catch (error) {
    console.error("Error fetching devices:", error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Internal Server Error' }));
  }
};
