const pool = require('../database.js');
const { currSessions } = require('../login_function/login.js');

module.exports = async function cancelHold(req, res) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const session = currSessions.get(token);

    if (!session) {
      res.writeHead(401, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ message: "Unauthorized" }));
    }

    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      const { model } = JSON.parse(body);

      // First find the device copy being held
      const [[hold]] = await pool.query(`
        SELECT dc.Copy_ID, dc.Category
        FROM device_copies dc
        JOIN holds h ON h.model = dc.Model AND h.category = dc.Category
        WHERE h.model = ? AND h.user_id = ? AND h.hold_status = 2 AND dc.Device_Status = 'On Hold'
        ORDER BY dc.Copy_ID ASC
        LIMIT 1
      `, [model, session.userID]);

      if (!hold) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ message: "No pending hold found to release." }));
      }

      const copyID = hold.Copy_ID;
      const category = hold.Category;

      // Expire the hold
      await pool.query(`
        UPDATE holds
        SET hold_status = 3
        WHERE model = ? AND user_id = ? AND hold_status = 2
      `, [model, session.userID]);

      // Update device copy status back to Available
      await pool.query(`
        UPDATE device_copies
        SET Device_Status = 'Available'
        WHERE Model = ? AND Category = ? AND Copy_ID = ?
      `, [model, category, copyID]);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Pending hold released and device made available." }));
    });

  } catch (err) {
    console.error("Error cancelling hold:", err);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Internal server error" }));
  }
};
