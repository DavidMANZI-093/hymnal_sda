const db_conn = require('./db');

const insertHymn = async () => {
  try {
    const query = `
      INSERT INTO Hymns (title, verses, refrain, number, author)
      VALUES ($1, $2, $3, $4, $5);
    `;

    const values = [
      'Umwam’ Ageze Kw‘Irembo',
      [
        "Umwam’ ageze kw‘ irembo, Wabambwe ku musaraba; Yaje gukorany’ abera, Babane mw‘ ijuru.",
        "Ibyerekana kuza kwe, Birihuta kuboneka; Kandi tugiye guhabwa, Kubaho kw‘ iteka.",
        "Ntabw’ intambar’ izashira, Ntabw’ amahor‘ azahora, Kerek’ ibyaha n’ urupfu, Byatsembwe na Yesu.",
        "Maze mw‘ isi yagizwe nshya, Niho tuzabahw‘ iteka; Kudapfa kwakuye gupfa, Dushiz’ agahinda."
      ],
      'Kw‘ irembo (Kw‘ irembo), Kw‘ irembo (Kw‘ irembo), Kw‘ irembo, Ub‘ ari kw‘ irembo; Nukw‘ araje (araje), Nukw‘ araje (araje), Kand‘ ageze kw‘ irembo',
      2,
      'F. E. Belden'
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
