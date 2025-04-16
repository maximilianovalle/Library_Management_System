const pool = require("../database.js");

/**
 * Calculate date range based on the specified filter
 * @param {string} range - The date range filter (week, month, quarter, year, all)
 * @returns {Object} - Object containing startDate and endDate
 */
function calculateDateRange(range) {
  const today = new Date();
  const endDate = new Date(today);
  let startDate = new Date(today);

  switch (range) {
    case "week":
      startDate.setDate(today.getDate() - 7);
      break;
    case "month":
      startDate.setMonth(today.getMonth() - 1);
      break;
    case "quarter":
      startDate.setMonth(today.getMonth() - 3);
      break;
    case "year":
      startDate.setFullYear(today.getFullYear() - 1);
      break;
    case "all":
      // Set to a very early date for "all time"
      startDate = new Date(2000, 0, 1);
      break;
    default:
      startDate.setDate(today.getDate() - 7); // Default to week
  }

  return {
    startDate: startDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
    endDate: endDate.toISOString().split("T")[0],
  };
}

module.exports = async function getReportsData(req, res) {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const reportType = url.searchParams.get("type") || "overview";
    const dateRange = url.searchParams.get("dateRange") || "week";

    const { startDate, endDate } = calculateDateRange(dateRange);

    console.log("=== Report Request ===");
    console.log(`Time: ${new Date().toISOString()}`);
    console.log(`Report Type: ${reportType}`);
    console.log(`Date Range: ${dateRange} (${startDate} to ${endDate})`);
    console.log(`User ID: ${req.user?.id || "Not authenticated"}`);

    let data = {};

    try {
      console.log(`Starting ${reportType} report generation...`);

      switch (reportType) {
        case "overview":
          data = await getOverviewData(startDate, endDate);
          break;
        case "overdue":
          data = await getOverdueData(startDate, endDate);
          break;
        case "fines":
          data = await getFinesData(startDate, endDate);
          break;
        case "checkouts":
          data = await getCheckoutsData(startDate, endDate);
          break;
        case "popular":
          data = await getPopularItemsData(startDate, endDate);
          break;
        default:
          data = await getOverviewData(startDate, endDate);
      }

      // Add date range information to the response
      data.dateRange = {
        type: dateRange,
        startDate,
        endDate,
      };

      console.log(
        `Successfully generated ${reportType} report with ${
          Object.keys(data).length
        } data points for date range ${dateRange}`
      );
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(data));
    } catch (queryError) {
      console.error("=== Database Error ===");
      console.error(`Report Type: ${reportType}`);
      console.error(`Date Range: ${dateRange}`);
      console.error(`Error Message: ${queryError.message}`);
      console.error(`Stack Trace: ${queryError.stack}`);
      console.error(`SQL State: ${queryError.sqlState || "N/A"}`);
      console.error(`SQL Message: ${queryError.sqlMessage || "N/A"}`);

      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: "Database error: Failed to load report data",
          error: queryError.message,
          reportType: reportType,
          dateRange: dateRange,
        })
      );
    }
  } catch (error) {
    console.error("=== Server Error ===");
    console.error(`Time: ${new Date().toISOString()}`);
    console.error(`Error Message: ${error.message}`);
    console.error(`Stack Trace: ${error.stack}`);

    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Internal Server Error",
        error: error.message,
      })
    );
  }
};

async function getOverviewData(startDate, endDate) {
  // Create a default response with all zeroes in case any part fails
  const defaultData = {
    books: {
      total_books: 0,
      available_books: 0,
      checked_out_books: 0,
    },
    devices: {
      total_devices: 0,
      available_devices: 0,
      checked_out_devices: 0,
    },
    fines: {
      total_fines: 0,
      total_amount: 0,
      paid_amount: 0,
      unpaid_amount: 0,
    },
    overdue: {
      overdue_books: 0,
      overdue_devices: 0,
    },
  };

  try {
    console.log(`Starting getOverviewData for ${startDate} to ${endDate}...`);

    // For Books - handle possible table/column name differences
    let bookStats;
    try {
      const [rows] = await pool.query(`
        SELECT 
          COUNT(*) as total_books,
          SUM(CASE WHEN Book_Status = 'Available' THEN 1 ELSE 0 END) as available_books,
          SUM(CASE WHEN Book_Status = 'Checked out' THEN 1 ELSE 0 END) as checked_out_books
        FROM book_copies
      `);
      bookStats = rows[0];
      console.log("Book stats:", bookStats);
    } catch (err) {
      console.error("Failed to query book stats:", err);
      bookStats = defaultData.books;
    }

    // For Devices - handle possible table/column name differences
    let deviceStats;
    try {
      const [rows] = await pool.query(`
        SELECT 
          COUNT(*) as total_devices,
          SUM(CASE WHEN Device_Status = 'Available' THEN 1 ELSE 0 END) as available_devices,
          SUM(CASE WHEN Device_Status = 'Checked out' THEN 1 ELSE 0 END) as checked_out_devices
        FROM device_copies
      `);
      deviceStats = rows[0];
      console.log("Device stats:", deviceStats);
    } catch (err) {
      console.error("Failed to query device stats:", err);
      deviceStats = defaultData.devices;
    }

    // For Fines - handle possible table/column name differences with date range filtering
    let fineStats;
    try {
      const [rows] = await pool.query(
        `
        SELECT 
          COUNT(*) as total_fines,
          IFNULL(SUM(Amount), 0) as total_amount,
          IFNULL(SUM(CASE WHEN Fine_Status = 1 THEN Amount ELSE 0 END), 0) as paid_amount,
          IFNULL(SUM(CASE WHEN Fine_Status = 2 THEN Amount ELSE 0 END), 0) as unpaid_amount
        FROM fines
        WHERE Created_at BETWEEN ? AND ?
      `,
        [startDate, endDate]
      );
      fineStats = rows[0];
      console.log("Fine stats:", fineStats);
    } catch (err) {
      console.error("Failed to query fine stats:", err);
      fineStats = defaultData.fines;
    }

    // For Overdue items with date range filtering
    let overdueStats = { overdue_books: 0, overdue_devices: 0 };

    try {
      const [bookResult] = await pool.query(
        `
        SELECT COUNT(*) as count
        FROM borrow_record
        WHERE ISBN IS NOT NULL 
        AND Return_Date IS NULL 
        AND Due_Date < CURDATE()
        AND Checkout_Date BETWEEN ? AND ?
      `,
        [startDate, endDate]
      );
      overdueStats.overdue_books = bookResult[0].count || 0;

      const [deviceResult] = await pool.query(
        `
        SELECT COUNT(*) as count
        FROM borrow_record
        WHERE Category IS NOT NULL 
        AND Return_Date IS NULL 
        AND Due_Date < CURDATE()
        AND Checkout_Date BETWEEN ? AND ?
      `,
        [startDate, endDate]
      );
      overdueStats.overdue_devices = deviceResult[0].count || 0;

      console.log("Overdue stats:", overdueStats);
    } catch (err) {
      console.error("Failed to query overdue stats:", err);
      // Keep the default overdue stats
    }

    // Safely build the response with fallbacks for missing data
    const response = {
      books: {
        total_books: Number(bookStats?.total_books || 0),
        available_books: Number(bookStats?.available_books || 0),
        checked_out_books: Number(bookStats?.checked_out_books || 0),
      },
      devices: {
        total_devices: Number(deviceStats?.total_devices || 0),
        available_devices: Number(deviceStats?.available_devices || 0),
        checked_out_devices: Number(deviceStats?.checked_out_devices || 0),
      },
      fines: {
        total_fines: Number(fineStats?.total_fines || 0),
        total_amount: Number(fineStats?.total_amount || 0),
        paid_amount: Number(fineStats?.paid_amount || 0),
        unpaid_amount: Number(fineStats?.unpaid_amount || 0),
      },
      overdue: {
        overdue_books: Number(overdueStats?.overdue_books || 0),
        overdue_devices: Number(overdueStats?.overdue_devices || 0),
      },
    };

    console.log("Final response:", response);
    return response;
  } catch (error) {
    console.error("Error in getOverviewData:", error);
    console.error("SQL Error:", error.sqlMessage || "Unknown SQL error");
    console.error("Stack:", error.stack);

    // Instead of throwing an error, return the default data
    return defaultData;
  }
}

// Get overdue items data with date range filtering
async function getOverdueData(startDate, endDate) {
  try {
    console.log(
      `Getting overdue data for date range: ${startDate} to ${endDate}`
    );

    // Get overdue books
    const [overdueBooks] = await pool.query(
      `
            SELECT br.Record_ID, br.User_ID, u.First_Name, u.Last_Name, 
                   b.ISBN, b.Title, a.Name as Author_Name, br.Book_Copy_ID as Copy_ID,
                   br.Checkout_Date, br.Due_Date,
                   CASE 
                       WHEN u.Role = 1 THEN 'Student'
                       WHEN u.Role = 2 THEN 'Alumni'
                       WHEN u.Role = 3 THEN 'Faculty'
                       ELSE 'Unknown'
                   END as User_Role
            FROM borrow_record br
            JOIN user u ON br.User_ID = u.User_ID
            JOIN book b ON br.ISBN = b.ISBN
            JOIN author a ON b.Author_ID = a.Author_ID
            WHERE br.Return_Date IS NULL
            AND br.Due_Date < CURDATE()
            AND br.Checkout_Date BETWEEN ? AND ?
            LIMIT 100
        `,
      [startDate, endDate]
    );

    // Get overdue devices
    const [overdueDevices] = await pool.query(
      `
            SELECT br.Record_ID, br.User_ID, u.First_Name, u.Last_Name, 
                   br.Category, br.Model, br.Device_Copy_ID as Copy_ID,
                   br.Checkout_Date, br.Due_Date,
                   CASE 
                       WHEN u.Role = 1 THEN 'Student'
                       WHEN u.Role = 2 THEN 'Alumni'
                       WHEN u.Role = 3 THEN 'Faculty'
                       ELSE 'Unknown'
                   END as User_Role
            FROM borrow_record br
            JOIN user u ON br.User_ID = u.User_ID
            WHERE br.Return_Date IS NULL
            AND br.Category IS NOT NULL
            AND br.Due_Date < CURDATE()
            AND br.Checkout_Date BETWEEN ? AND ?
            LIMIT 100
        `,
      [startDate, endDate]
    );

    return {
      books: overdueBooks || [],
      devices: overdueDevices || [],
    };
  } catch (error) {
    console.error("Error in getOverdueData:", error);
    throw error;
  }
}

// Get fines data with date range filtering
async function getFinesData(startDate, endDate) {
  try {
    console.log(
      `Getting fines data for date range: ${startDate} to ${endDate}`
    );

    // Get fines list
    const [fines] = await pool.query(
      `
            SELECT f.Fine_ID, f.User_ID, u.First_Name, u.Last_Name, 
                   f.Amount, f.Reason, f.Created_at as Date_Issued, f.Fine_Status,
                   CASE 
                       WHEN u.Role = 1 THEN 'Student'
                       WHEN u.Role = 2 THEN 'Alumni'
                       WHEN u.Role = 3 THEN 'Faculty'
                       ELSE 'Unknown'
                   END as User_Role
            FROM fines f
            JOIN user u ON f.User_ID = u.User_ID
            WHERE f.Created_at BETWEEN ? AND ?
            ORDER BY f.Created_at DESC
            LIMIT 100
        `,
      [startDate, endDate]
    );

    // Get stats by reason
    const [reasonStats] = await pool.query(
      `
            SELECT 
                Reason, 
                COUNT(*) as count,
                SUM(Amount) as total_amount,
                SUM(CASE WHEN Fine_Status = 1 THEN Amount ELSE 0 END) as paid_amount,
                SUM(CASE WHEN Fine_Status = 2 THEN Amount ELSE 0 END) as unpaid_amount
            FROM fines
            WHERE Created_at BETWEEN ? AND ?
            GROUP BY Reason
        `,
      [startDate, endDate]
    );

    // Get fines by user role
    const [roleStats] = await pool.query(
      `
            SELECT 
                CASE 
                    WHEN u.Role = 1 THEN 'Student'
                    WHEN u.Role = 2 THEN 'Alumni'
                    WHEN u.Role = 3 THEN 'Faculty'
                    ELSE 'Unknown'
                END as User_Role, 
                COUNT(*) as count,
                SUM(f.Amount) as total_amount
            FROM fines f
            JOIN user u ON f.User_ID = u.User_ID
            WHERE f.Created_at BETWEEN ? AND ?
            GROUP BY u.Role
        `,
      [startDate, endDate]
    );

    return {
      fines: fines || [],
      reasonStats: reasonStats || [],
      roleStats: roleStats || [],
    };
  } catch (error) {
    console.error("Error in getFinesData:", error);
    throw error;
  }
}

// Get checkouts data with date range filtering
async function getCheckoutsData(startDate, endDate) {
  try {
    console.log(
      `Getting checkouts data for date range: ${startDate} to ${endDate}`
    );

    // Get checked out books
    const [books] = await pool.query(
      `
            SELECT br.Record_ID, br.User_ID, u.First_Name, u.Last_Name, 
                   b.ISBN, b.Title, a.Name as Author_Name, br.Book_Copy_ID as Copy_ID,
                   br.Checkout_Date, br.Due_Date, 
                   CASE WHEN br.Due_Date < CURDATE() THEN 1 ELSE 0 END as Is_Overdue,
                   CASE 
                       WHEN u.Role = 1 THEN 'Student'
                       WHEN u.Role = 2 THEN 'Alumni'
                       WHEN u.Role = 3 THEN 'Faculty'
                       ELSE 'Unknown'
                   END as User_Role
            FROM borrow_record br
            JOIN user u ON br.User_ID = u.User_ID
            JOIN book b ON br.ISBN = b.ISBN
            JOIN author a ON b.Author_ID = a.Author_ID
            WHERE br.Return_Date IS NULL
            AND br.ISBN IS NOT NULL
            AND br.Checkout_Date BETWEEN ? AND ?
            LIMIT 100
        `,
      [startDate, endDate]
    );

    // Get checked out devices
    const [devices] = await pool.query(
      `
            SELECT br.Record_ID, br.User_ID, u.First_Name, u.Last_Name, 
                   br.Category, br.Model, br.Device_Copy_ID as Copy_ID,
                   br.Checkout_Date, br.Due_Date, 
                   CASE WHEN br.Due_Date < CURDATE() THEN 1 ELSE 0 END as Is_Overdue,
                   CASE 
                       WHEN u.Role = 1 THEN 'Student'
                       WHEN u.Role = 2 THEN 'Alumni'
                       WHEN u.Role = 3 THEN 'Faculty'
                       ELSE 'Unknown'
                   END as User_Role
            FROM borrow_record br
            JOIN user u ON br.User_ID = u.User_ID
            WHERE br.Return_Date IS NULL
            AND br.Category IS NOT NULL
            AND br.Checkout_Date BETWEEN ? AND ?
            LIMIT 100
        `,
      [startDate, endDate]
    );

    // Get stats by user role
    const [userRoleStats] = await pool.query(
      `
            SELECT 
                CASE 
                    WHEN u.Role = 1 THEN 'Student'
                    WHEN u.Role = 2 THEN 'Alumni'
                    WHEN u.Role = 3 THEN 'Faculty'
                    ELSE 'Unknown'
                END as User_Role,
                COUNT(*) as count 
            FROM borrow_record br
            JOIN user u ON br.User_ID = u.User_ID
            WHERE br.Return_Date IS NULL
            AND br.Checkout_Date BETWEEN ? AND ?
            GROUP BY u.Role
        `,
      [startDate, endDate]
    );

    return {
      books: books || [],
      devices: devices || [],
      userRoleStats: userRoleStats || [],
    };
  } catch (error) {
    console.error("Error in getCheckoutsData:", error);
    throw error;
  }
}

// Get popular items data with date range filtering
async function getPopularItemsData(startDate, endDate) {
  try {
    console.log(
      `Getting popular items data for date range: ${startDate} to ${endDate}`
    );

    // Get popular books
    const [popularBooks] = await pool.query(
      `
            SELECT 
                b.ISBN, 
                b.Title, 
                a.Name as Author_Name, 
                b.Genre,
                COUNT(*) as checkout_count
            FROM borrow_record br
            JOIN book b ON br.ISBN = b.ISBN
            JOIN author a ON b.Author_ID = a.Author_ID
            WHERE br.ISBN IS NOT NULL
            AND br.Checkout_Date BETWEEN ? AND ?
            GROUP BY b.ISBN
            ORDER BY checkout_count DESC
            LIMIT 10
        `,
      [startDate, endDate]
    );

    // Get popular devices
    const [popularDevices] = await pool.query(
      `
            SELECT 
                Category, 
                Model, 
                COUNT(*) as checkout_count
            FROM borrow_record
            WHERE Category IS NOT NULL
            AND Checkout_Date BETWEEN ? AND ?
            GROUP BY Category, Model
            ORDER BY checkout_count DESC
            LIMIT 10
        `,
      [startDate, endDate]
    );

    // Get checkouts by genre
    const [genreStats] = await pool.query(
      `
            SELECT 
                b.Genre, 
                COUNT(*) as checkout_count
            FROM borrow_record br
            JOIN book b ON br.ISBN = b.ISBN
            WHERE br.ISBN IS NOT NULL AND b.Genre IS NOT NULL
            AND br.Checkout_Date BETWEEN ? AND ?
            GROUP BY b.Genre
            ORDER BY checkout_count DESC
        `,
      [startDate, endDate]
    );

    return {
      popularBooks: popularBooks || [],
      popularDevices: popularDevices || [],
      genreStats: genreStats || [],
    };
  } catch (error) {
    console.error("Error in getPopularItemsData:", error);
    throw error;
  }
}
