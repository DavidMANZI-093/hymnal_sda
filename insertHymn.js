const fs = require('fs');
const db_conn = require('./db');


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
        console.error(`Error inserting hymn titled "${hymn.title}":`, err.message);
        throw err;
      }
    });


    await Promise.all(insertPromises);
    console.log('All hymns added successfully!');
  } catch (err) {
    console.error('An error occurred during the hymn insertion process:', err.message);
  } finally {
    db_conn.end();
  }
};

const hymnsArray = formatHymns(jsonData);
insertHymns(hymnsArray);
