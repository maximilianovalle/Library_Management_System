const pool = require('../database');

module.exports = async function add_device(req, res) {
    let body = "";

    req.on("data", (chunk) => {
        body += chunk;
    });

    req.on("end", async () => {
        try {
            let { device_model, device_category, device_copy } = JSON.parse(body);
            console.log(device_model, device_category, device_copy)

            const [existingDevice] = await pool.query(
                'SELECT * FROM device WHERE Model = ?',
                [device_model]
            );

            if (existingDevice.length === 0) {
                await pool.query(
                    'INSERT INTO device (Model, Category) VALUES (?, ?)',
                    [device_model, device_category]
                );
            }

            const [copyCountResult] = await pool.query(
                'SELECT COUNT(*) as count FROM device_copies WHERE Model = ?',
                [device_model]
            );
            const existingCopies = copyCountResult[0].count;

            for (let i = 1; i <= device_copy; i++) {
                await pool.query(
                    'INSERT INTO device_copies (Copy_ID, Category, Model, Device_Condition, Device_Status) VALUES (?, ?, ?, ?, ?)',
                    [existingCopies + i, device_category, device_model, 'Good Condition', 'Available']
                );
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Device and/or copies added successfully' }));

        } catch (err) {
            console.error(err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to add device' }));
        }
    });
};
