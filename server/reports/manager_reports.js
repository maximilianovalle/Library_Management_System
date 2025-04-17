// Backend: Route to generate Maintenance & Salary Reports for Managers
const pool = require("../database.js");

module.exports = async function getManagerReportsData(req, res) {
  try {
    // === MAINTENANCE REPORT ===
    const [maintenanceRows] = await pool.query(`
        SELECT 
          br.Record_ID,
          br.User_ID,
          u.First_Name,
          u.Last_Name,
          br.ISBN,
          b.Title,
          br.Model,
          d.Model AS DeviceModel,
          br.Checkout_Date,
          br.Due_Date,
          bc.Book_Condition,
          dc.Device_Condition,
          bc.Copy_ID AS Book_Copy_ID,
          dc.Copy_ID AS Device_Copy_ID,
          (
            SELECT COUNT(*) FROM book_copies 
            WHERE Copy_ID = bc.Copy_ID AND Book_Status = 'Maintenance'
          ) AS Book_Maintenance_Count,
          (
            SELECT COUNT(*) FROM device_copies 
            WHERE Copy_ID = dc.Copy_ID AND Device_Status = 'Maintenance'
          ) AS Device_Maintenance_Count
        FROM borrow_record br
        LEFT JOIN user u ON br.User_ID = u.User_ID
        LEFT JOIN book b ON br.ISBN = b.ISBN
        LEFT JOIN book_copies bc ON br.Book_Copy_ID = bc.Copy_ID AND br.ISBN = bc.ISBN
        LEFT JOIN device d ON br.Model = d.Model
        LEFT JOIN device_copies dc ON br.Device_Copy_ID = dc.Copy_ID AND br.Model = dc.Model
        WHERE bc.Book_Status = 'Maintenance' OR dc.Device_Status = 'Maintenance'
      `);
      
      const maintenanceReport = maintenanceRows.map((row) => {
        const isBook = !!row.ISBN;
      
        return {
          item_type: isBook ? "book" : "device",
          copy_id: isBook ? row.Book_Copy_ID : row.Device_Copy_ID,
          title: row.Title || null,
          model: row.DeviceModel || null,
          category: isBook ? "Book" : "Device",
          checkout_date: row.Checkout_Date,
          due_date: row.Due_Date,
          borrower: `${row.First_Name} ${row.Last_Name}`,
          times_sent_to_maintenance: isBook ? row.Book_Maintenance_Count : row.Device_Maintenance_Count,
        };
      });
      

    // === LIBRARIAN SALARY REPORT ===
    const [librarianRows] = await pool.query(`
      SELECT 
        Librarian_ID,
        First_Name,
        Last_Name,
        Department,
        Position,
        Hire_Date,
        Pay_Rate,
        TIMESTAMPDIFF(MONTH, Hire_Date, CURDATE()) AS Months_Employed,
        (Pay_Rate * TIMESTAMPDIFF(MONTH, Hire_Date, CURDATE())) AS Total_Cost
      FROM librarian
      WHERE Is_Active = 1
    `);

    const salaryReport = librarianRows.map(row => ({
      librarian_id: row.Librarian_ID,
      name: `${row.First_Name} ${row.Last_Name}`,
      department: row.Department,
      position: row.Position,
      hire_date: row.Hire_Date,
      pay_rate: row.Pay_Rate,
      months_employed: row.Months_Employed,
      total_cost: row.Total_Cost
    }));

    // === SEND COMBINED RESPONSE ===
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      maintenance_report: maintenanceReport,
      salary_report: salaryReport
    }));

  } catch (error) {
    console.error("Error in getManagerReportsData:", error);
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: "Internal Server Error", error: error.message }));
    }
  }
};
