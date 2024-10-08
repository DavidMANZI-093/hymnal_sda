const db_conn = require('./db');

const updateHymn = async () => {
  try {
    const query = `
      UPDATE Hymns
      SET title = $1, verses = $2, refrain = $3, number = $4, author = $5
      WHERE id = 12;
    `;

    const values = [
      'Har’ Isoko',
      [
        "Har’ isokw’ ivamw’ amaraso, Yo mu mitsi y’ Imanuweri. Niy’ atungany’ abanyabyaha, Bagashirahw’ inenge, Bagatsembwahw’ ibicumuro, Byose bikabacikaho. Niy’ atungany’ abanyabyaha, Bagashirahw’ inenge.",
        "Igisambo ku musaraba, Kiyarabutswe cyarihannye; Nanjye mbwiriza nkwizigire, Noye kujya ncumura; Ibyaha mbicikeho rwose, Noye kujya nkugomera; Nanjye mbwiriza nkwizigire, Noye kujya ncumura.",
        "Amaraso yaw’ atunganye, Ahoran’ imbaraga nyinshi; Niyo wacunguj’ itorero, Aritsembamw’ ibyaha; Ryaganjij’ imbaraga yabyo. Ryarabirokotse rwose. Niyo wacunguj’ itorero, Yaritsembyemw’ ibyaha.",
        "Mperey’ igihe meny’ isoko, Iva mu bikomere byawe. Nogez’ urwo rukundo rwawe, Nzahora ngusingiza; Nzahora ngusingiz’ iteka, Nzajya ngusingiz’ iteka. Nogez’ urwo rukundo rwawe, Nzahora ngusingiza.",
        "Mwami mpora ngucumuraho, Mpa kwizer’ imbabazi zawe! N’ amaraso yaw’ atunganye, Mpa kuramishwa nawe! Mpa kuramishwa nawe Yesu! Mpa no kuramishwa nawe! N’ amaraso yaw’ atunganye, Mpa kuramishwa nawe!",
        "Har’ indirimbo zera ntazi, Nzaziririmbira mw’ ijuru. Naho nagobw’ ururim’ ubu, Uzarugobotora; Uzarugobotora Yesu, Ni wow’ uzankiza rwose. Naho nagobw’ ururim’ ubu, Uzarugobotora."
      ],
      '',
      12,
      'Unknown'
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
