const pool = require("../database.js");

function getDateCondition(column, range) {
  switch (range) {
    case "week":
      return `AND ${column} >= CURDATE() - INTERVAL 7 DAY`;
    case "month":
      return `AND ${column} >= CURDATE() - INTERVAL 1 MONTH`;
    case "quarter":
      return `AND ${column} >= CURDATE() - INTERVAL 3 MONTH`;
    case "year":
      return `AND ${column} >= CURDATE() - INTERVAL 1 YEAR`;
    case "all":
    default:
      return "";
  }
}

module.exports = async function getManagerReportsData(req, res) {
  try {
    const dateRange = req.query.dateRange || "all";
    const maintenanceFilter = getDateCondition("br.Checkout_Date", dateRange);
    const salaryFilter = getDateCondition("l.Hire_Date", dateRange);

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
      WHERE (bc.Book_Status = 'Maintenance' OR dc.Device_Status = 'Maintenance')
      ${maintenanceFilter}
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

    // === SALARY REPORT ===
    const [salaryRows] = await pool.query(`
      SELECT 
        l.Librarian_ID,
        l.First_Name,
        l.Last_Name,
        l.Department,
        l.Position,
        l.Hire_Date,
        l.Pay_Rate,
        TIMESTAMPDIFF(MONTH, l.Hire_Date, CURDATE()) AS Months_Employed,
        (l.Pay_Rate * TIMESTAMPDIFF(MONTH, l.Hire_Date, CURDATE())) AS Total_Cost
      FROM librarian l
      WHERE l.Is_Active = 1 AND l.Is_Deleted = 0
      ${salaryFilter}
    `);

    const salaryReport = salaryRows.map(row => ({
      librarian_id: row.Librarian_ID,
      name: `${row.First_Name} ${row.Last_Name}`,
      department: row.Department,
      position: row.Position,
      hire_date: row.Hire_Date,
      pay_rate: row.Pay_Rate,
      months_employed: row.Months_Employed,
      total_cost: row.Total_Cost
    }));

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
