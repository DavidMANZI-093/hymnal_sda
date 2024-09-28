const db_conn = require('./db');

const insertHymn = async () => {
  try {
    const query = `
      INSERT INTO Hymns (title, verses, refrain, number, author)
      VALUES ($1, $2, $3, $4, $5);
    `;

    const values = [
      'Murinzi We Menyesh’ Igihe',
      [
        "Murinzi we! Menyesh’ igihe! Mbes’ iwacu n’ imuhero? At’ ijoro ryijimye cyane, Ariko buracya. Ntukarire, Gumy’ ugende, Nturorere kwiringira, Kugez’ igih’ uzasohora, Mu muns’ uhoraho.",
        "Murwanyi we ! Tyo mbwira nawe ! Ansubiza yitonz’ ati: Intambar’ igiye gushira. Guma ku rugamba. Wibabara, Ihangane, Wirek’ imirimo yawe, Kuko tuzabon’ ibihembo, Tumaze gutsinda.",
        "Ndacyabaz’ ibyaremwe byose, Binsubiza bitya biti: Iy’ is’ igiye guhanguka. Haz’ ind’ idashira. Ntukarir’ ibimenyetso, Byerekan’ aho tugeze, Kand’ ibintu byose byaremwe, Biriteg’ impanda.",
        "Imuhir’ ubu ni bugufi, Tunezerwe mu mitima. Duhumure ko tuzakira, Dushir’ agahinda. Ntukarire tuzabana, Amakub’ azab’ ashize. Ntabwo tuzabur’ amahoro mu rugo rwa Data."
      ],
      '',
      5,
      'Arranged'
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
