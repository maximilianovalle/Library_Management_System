const pool = require("../database.js");

module.exports = async function removeHold(req, res, userID) {

    try {

        let body = "";

        req.on('data', (chunk) => {
            body += chunk;
        });

        req.on("end", async () => {

            try {

                const { model } = JSON.parse(body);
                console.log("model: ", model);

                if (!model) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: "Missing device model" }));
                    return;
                }

                const [result] = await pool.query("UPDATE holds SET Hold_Status = 3 WHERE User_ID = ? AND Model = ?", [userID, model]);

            } catch (error) {
                console.log("Remove hold error: ", error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: "Internal Server Error" }));
                return;
            }

        });

    } catch (error) {
        console.log("Remove hold data chunk error: ", error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Internal Server Error" }));
        return;
    }

}