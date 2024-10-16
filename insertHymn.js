const fs = require('fs');
const db_conn = require('./db');

// Read the JSON file
const jsonData = JSON.parse(fs.readFileSync('json sources/hymnal-rw.json', 'utf-8'));

// Format the data into the required structure
const formatHymns = (data) => {
  return data.hymns.map(hymn => {
    return {
      title: hymn.title,
      verses: hymn.stanzas.verses.map(stanza => stanza.join(' ')), // Join lines into single verse strings
      refrain: hymn.stanzas.refrain.length > 0 ? hymn.stanzas.refrain.join(' ') : '', // Join refrain lines, or leave empty if none
      number: parseInt(hymn.num, 10), // Ensure number is a number
      author: hymn.author ? hymn.author : 'Arranged' // Replace missing author with "Arranged"
    };
  });
};

// Insert hymns into the database
const insertHymns = async (hymnsArray) => {
  try {
    const query = `
      INSERT INTO Hymns (title, verses, refrain, number, author)
      VALUES ($1, $2, $3, $4, $5);
    `;

    const insertPromises = hymnsArray.map(hymn => {
      const values = [
        hymn.title,
        hymn.verses,
        hymn.refrain,
        hymn.number,
        hymn.author
      ];
      
      // Return the promise for each query execution
      return db_conn.query(query, values);
    });

    // Use Promise.all to wait for all insertions to complete
    await Promise.all(insertPromises);

    console.log('All hymns added successfully');
  } catch (err) {
    console.error('Error inserting hymns', err);
  } finally {
    db_conn.end();
  }
};

// Process the hymns data and insert it into the database
const hymnsArray = formatHymns(jsonData);
insertHymns(hymnsArray);
