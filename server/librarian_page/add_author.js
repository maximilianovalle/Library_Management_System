const pool = require('../database');

async function getOrAddAuthorId(name, bio = null) {
    const [existing] = await pool.query(
        "SELECT Author_ID FROM Author WHERE LOWER(Name) = LOWER(?)",
        [name]
    );

    if (existing.length > 0) {
        return existing[0].Author_ID;
    }

    const [last] = await pool.query("SELECT MAX(Author_ID) as last FROM Author");
    const newId = (last[0].last || 6000000) + 1;

    await pool.query(
        "INSERT INTO Author (Author_ID, Name, Bio) VALUES (?, ?, ?)",
        [newId, name, bio]
    );

    return newId;
}

module.exports = getOrAddAuthorId;
