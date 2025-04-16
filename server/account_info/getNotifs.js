const pool = require('../database.js');

module.exports = async function getNotifs(req, res, userID) {
    try {

        const [[myNotifs], [totalUnread]] = await Promise.all([
            pool.query(`SELECT * FROM notifications WHERE User_ID = ? AND ( (Is_Read = 0 AND Created_At <= NOW()) OR (Is_Read = 1 AND Created_At >= NOW() - INTERVAL 10 DAY AND Created_At < NOW()) ) ORDER BY Is_Read ASC, Created_At DESC`, [userID]),

            pool.query(`SELECT COUNT(*) FROM notifications WHERE User_ID = ? AND Is_Read = 0 AND Created_At <= NOW()`, [userID]),
        ]);

        let notificationsArr = myNotifs.map(row => ({
            id: row.Notification_ID,
            text: row.Message,
            date: row.Created_At,
            isRead: row.Is_Read,
            type: row.Type,
        }))

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({
            notifications: notificationsArr,
            unreadNotifsAmnt: totalUnread[0]['COUNT(*)'],
        }))

    } catch (error) {
        console.error("Error fetching notifications: ", error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Internal Server Error' }));
    }
};
