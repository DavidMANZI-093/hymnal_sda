const fs = require('fs');
const db_conn = require('./db');
const db_conn_safe = require('./db1');

const jsonData = JSON.parse(fs.readFileSync('json sources/hymnal-ext.json', 'utf-8'));


const formatHymns = (data) => {
  return data.hymns.map(hymn => {
    return {
      title: hymn.title,
      verses: hymn.verses,
      refrain: hymn.refrain,
      number: hymn.number,
      author: hymn.author
    };
  });
};


const insertHymns = async (hymnsArray) => {
  try {
    try {
      await db_conn.query('DELETE FROM Hymns;'); // Delete faulty entries
    } catch (primaryErr) {
      console.log('Primary database connection failed. Falling back to secondary database...');
      await db_conn_safe.query('DELETE FROM Hymns;');
    }

    const query = `
      INSERT INTO Hymns (title, verses, refrain, number, author)
      VALUES ($1, $2, $3, $4, $5);
    `;

    const insertPromises = hymnsArray.map(async hymn => {
      const values = [
        hymn.title,
        hymn.verses,
        hymn.refrain,
        hymn.number,
        hymn.author
      ];

      try {
        return await db_conn.query(query, values);
      } catch (err) {
        console.log('Primary database connection failed. Falling back to secondary database...');
        return await db_conn_safe.query(query, values);
      }
    });

    await Promise.all(insertPromises);
    console.log('All hymns added successfully!');
  } catch (err) {
    console.error('An error occurred during the hymn insertion process:', err.message);
  } finally {
    try {
      await db_conn.end();
    } catch {}
    try {
      await db_conn_safe.end();
    } catch {}
  }
};

const hymnsArray = formatHymns(jsonData);
insertHymns(hymnsArray);