const pool = require('../database');

async function getOrAddAuthorId(name) {
  // First check if the author already exists
  const [existing] = await pool.query(
    "SELECT Author_ID FROM Author WHERE LOWER(Name) = LOWER(?)",
    [name]
  );

  // If author exists, return their ID
  if (existing.length > 0) {
    return existing[0].Author_ID;
  }

  // If author doesn't exist, get the next available ID
  const [last] = await pool.query("SELECT MAX(Author_ID) as last FROM Author");
  const newId = (last[0].last || 6000000) + 1;

  // Insert the new author without the Bio field
  await pool.query("INSERT INTO Author (Author_ID, Name) VALUES (?, ?)", [
    newId,
    name,
  ]);

  return newId;
}

module.exports = getOrAddAuthorId;