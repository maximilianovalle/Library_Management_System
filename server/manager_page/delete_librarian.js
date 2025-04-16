// delete_librarian.js
const pool = require('../database.js');

module.exports = async function deleteLibrarian(req, res) {
    try {
        const id = req.url.split('/').pop();

        const [result] = await pool.query(
            `UPDATE librarian SET Is_Deleted = 1 WHERE Librarian_ID = ?`,
            [id]
          );          

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Librarian deleted successfully' }));
    } catch (error) {
        console.error("Error deleting librarian:", error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Failed to delete librarian' }));
    }
};