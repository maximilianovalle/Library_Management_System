const pool = require("../database.js");

// random condition algorithm
function getRandomWeighed() {
    const weights = {
        1: 0.85, // good condition, 85%
        2: 0.12,    // worn out, 12%
        // bad condition, 3%
    }

    const randomVal = Math.random();    // generate random val between 0 -1

    if (randomVal < weights[1]) {
        return 1;
    } else if (randomVal < weights[1] + weights[2]) {
        return 2;
    } else {
        return 3;
    }
}

module.exports = async function returnBook(req, res, userID) {

    try {

        let body = "";

        req.on('data', (chunk) => {
            body += chunk;
        });

        req.on("end", async () => {

            try {

                const { isbn, copyID } = JSON.parse(body);
                console.log("ISBN: ", isbn);
                console.log("CopyID: ", copyID);

                if (!isbn || !copyID) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: "Missing Book ISBN or Copy ID" }));
                    return;
                }

                const recordID = await pool.query("SELECT Record_ID FROM borrow_record WHERE User_ID = ? AND ISBN = ? AND Book_Copy_ID = ? AND Return_Date IS NULL", [userID, isbn, copyID]);

                await pool.query("UPDATE borrow_record SET Return_Date = NOW() WHERE Record_ID =  ?", [recordID]);


                // 1 = good condition, 2 = worn out, or 3 = bad cond.
                const bookCondition = getRandomWeighed();

                const condition = {
                    1: "Good condition",
                    2: "Worn out",
                    3: "Bad condition",
                }

                const status = {
                    1: "Available",
                    2: "Available",
                    3: "Maintenance",
                }

                await pool.query("UPDATE book_copies SET Book_Status = ?, Book_Condition = ? WHERE ISBN = ? AND Copy_ID = ?", [status[bookCondition], condition[bookCondition], isbn, copyID]);

                // fine user if book returned in bad condition
                if (condition == 3) {
                    await pool.query("INSERT INTO fines (User_ID, Record_ID, Amount, Reason) VALUES (?, ?, 25, 'Damaged')", [userID, recordID])
                };

            } catch (error) {
                console.log("Return book error: ", error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: "Internal Server Error" }));
                return;
            }

        });

    } catch (error) {
        console.log("Return book data chunk error: ", error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Internal Server Error" }));
        return;
    }
};