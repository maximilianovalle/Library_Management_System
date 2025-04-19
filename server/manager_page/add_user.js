const pool = require('../database.js');

module.exports = async function addUser(req, res) {
    try {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', async () => {
            const { First_Name, Last_Name, Email, Role, Password } = JSON.parse(body);
            
              // Define user ID range based on role
              const roleRanges = {
                1: [7000000, 7999999],
                2: [8000000, 8999999],
                3: [9000000, 9999998],
              };              

            const [minID, maxID] = roleRanges[Role];

            // check if existing user or manager w/ email
            const [librarianEmail] = await pool.query(`SELECT * FROM librarian WHERE Email = ?`, [Email]);

            const [managerEmail] = await pool.query(`SELECT * FROM manager WHERE Email = ?`, [Email]);


  const [[{ maxUserID }]] = await pool.query(
    `SELECT MAX(User_ID) as maxUserID FROM user WHERE Role = ? AND User_ID BETWEEN ? AND ?`,
    [Role, minID, maxID]
  );

  const newUserID = maxUserID ? maxUserID + 1 : minID;

  if (librarianEmail.length === 0 && managerEmail.length === 0) {
    const [result] = await pool.query(
      `INSERT INTO user (User_ID, First_Name, Last_Name, Email, Role, Password, Created_At, Is_Deleted)
      VALUES (?, ?, ?, ?, ?, ?, NOW(), 0)`,
      [newUserID, First_Name, Last_Name, Email, Role, Password]
    );
    

    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "User added successfully", User_ID: newUserID }));
  }

  res.writeHead(500, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Email already in use." }));
  return;


});
} catch (error) { console.error("Error adding user:", error); res.writeHead(500, { "Content-Type": "application/json" }); res.end(JSON.stringify({ message: "Failed to add user" })); } };