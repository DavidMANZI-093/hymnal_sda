const db_conn = require('./db');

const updateHymn = async () => {
  try {
    const query = `
      UPDATE Hymns
      SET title = $1, verses = $2, refrain = $3, number = $4, author = $5
      WHERE id = 3;
    `;

    const values = [
      'Nzabona Yesu',
      [
        "Nzabona Yesu mu maso, Umuns’ azatujyana; Niho nzamwitegereza, Kw’ ari we wampfiriye.",
        "Ubu ndamutekereza, Ariko simurora; Umuns’ uhiriw’ uzaza, Nzamubonan’ ubwiza.",
        "Tuzishimir’ imbere ye, Ubw’ ishavu rishize; Ibigande biganduwe, N’ ahijimye hakeye.",
        "Nzanezererw’ imbere ye, Nzamurora mumenye; Nzabana na Yes’ unkunda, Niwe Mukiza wanjye."
      ],
      'Nzamurora mu maso ye, Turi kumwe mw’ ijuru; Meny’ uk’ ubwiza bwe busa, Nzamusingiz’ iteka.',
      3,  // This will replace the number 4 with itself
      'Grant Colfax Tullar'
    ];

    await db_conn.query(query, values);
    console.log('Hymn updated successfully');
  } catch (err) {
    console.error('Error updating hymn', err);
  } finally {
    db_conn.end();
  }
};

updateHymn();
