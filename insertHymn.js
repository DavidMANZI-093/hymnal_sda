const db_conn = require('./db');

const insertHymn = async () => {
  try {
    const query = `
      INSERT INTO Hymns (title, verses, refrain, number, author)
      VALUES ($1, $2, $3, $4, $5);
    `;

    const values = [
      'Murinzi We, Vuz’ Impanda',
      [
        "Murinzi, jy‘ uvuz’ impanda, Uhan’ umuntu wese; Ng’ uzumv’ izo nkuru nziza, Yihan’ akizw’ ibyaha.",
        "Yivugirize mu mpinga, Mw’ ishyamba mu gisiza; Ndetse no mu nyanja hose, Bameny’ ako gakiza.",
        "Yivugirize mu nzira, Mu rwiherero hose. Dat’ arabategereje, Ntacy’ ataringanije.",
        "Uyivugiriz‘ indembe, Nazo zikizw’ ibyaha. Yes’ arabatumir’ ati: Nimuze mbaboneze."
      ],
      'Murinzi we vuz’ impanda! Yivuze cyane hose (hose), Menyesha bos’ ubutumwa, Imbohe zibohorwe.',
      1,
      'Wm. J. Kirkpatrick'
    ];

    await db_conn.query(query, values);
    console.log('Hymn added successfully');
  } catch (err) {
    console.error('Error inserting hymn', err);
  } finally {
    db_conn.end();
  }
};

insertHymn();
