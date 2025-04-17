const pool = require("../database.js");

module.exports = async function delete_one_copy_device(req, res) {
    try {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk;
        });

        req.on("end", async () => {
            try {
                const { model, category, copyID } = JSON.parse(body);
                console.log("Attempting to delete copy:", copyID, "of model:", model, "category: ", category);

                // Step 1: Check if the copy is currently checked out
                const [borrowRows] = await pool.query(
                    "SELECT * FROM borrow_record WHERE Category = ? AND Model = ? AND Device_Copy_ID = ? AND Return_Date IS NULL",
                    [category, model, copyID]
                );

                if (borrowRows.length > 0) {
                    // Device is currently checked out, cannot delete
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ message: "Device copy is currently checked out and cannot be deleted." }));
                    return;
                }

                // Step 2: Proceed with deletion
                await pool.query(
                    "UPDATE device_copies SET Device_Status = 'Deleted' WHERE Model = ? AND Category = ? AND Copy_ID = ?",
                    [model, category, copyID]
                );

                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "Device copy deleted successfully." }));
            } catch (error) {
                console.error("Internal error while deleting device copy:", error);
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "Internal Server Error" }));
            }
        });
    } catch (error) {
        console.error("Delete device copy error:", error);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Internal Server Error" }));
    }
};
