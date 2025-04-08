const pool = require("../database.js");

// payFines() function, handles HTTP request and response
module.exports = async function payFine(req, res, userID) {
  try {
    console.log("'Pay Now' button clicked.");

    // Start a transaction to ensure all operations succeed or fail together
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Get the total unpaid fines amount before payment
      const [totalFinesBefore] = await connection.query(
        "SELECT SUM(Amount) AS total FROM fines WHERE User_ID = ? AND Fine_status = 2",
        [userID]
      );

      const totalBefore = totalFinesBefore[0].total || 0;
      const wasRestricted = totalBefore >= 25;

      // Update all unpaid fines to paid
      const [result] = await connection.query(
        "UPDATE fines SET Fine_Status = 1 WHERE User_ID = ? AND Fine_status = 2",
        [userID]
      );

      if (result.affectedRows === 0) {
        await connection.rollback();
        connection.release();

        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({ message: "No unpaid fines found for this user" })
        );
        return;
      }

      // Create a payment success notification
      await connection.query(
        `INSERT INTO notifications (User_ID, Message, Created_At, Is_Read, Type)
                 VALUES (?, ?, NOW(), 0, 'payment_success')`,
        [
          userID,
          `Your payment of $${totalBefore.toFixed(
            2
          )} has been successfully processed. Thank you for your payment.`,
        ]
      );

      // If the user was previously restricted (fines >= $25),
      // add a notification that they can now check out items
      if (wasRestricted) {
        await connection.query(
          `INSERT INTO notifications (User_ID, Message, Created_At, Is_Read, Type)
                     VALUES (?, ?, NOW(), 0, 'restriction_lifted')`,
          [
            userID,
            "Your account is no longer restricted. You can now check out and place holds on items.",
          ]
        );
      }

      // Commit the transaction
      await connection.commit();
      connection.release();

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: "Successfully paid all fines!",
          amount_paid: totalBefore.toFixed(2),
          restrictions_lifted: wasRestricted,
        })
      );
    } catch (error) {
      // If an error occurs, roll back the transaction
      await connection.rollback();
      connection.release();
      throw error;
    }
  } catch (error) {
    console.error("Error in payFine:", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Internal Server Error" }));
    return;
  }
};
