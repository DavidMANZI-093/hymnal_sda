const db_conn = require('./db');
const db_conn_safe = require('./db1');

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

    try {
      await db_conn.query(query, values);
      console.log('Hymn updated successfully in primary database');
    } catch (primaryErr) {
      console.log('Primary database connection failed. Falling back to secondary database...');
      await db_conn_safe.query(query, values);
      console.log('Hymn updated successfully in secondary database');
    }
  } catch (err) {
    console.error('Error updating hymn in both databases', err);
  } finally {
    try {
      await db_conn.end();
    } catch {}
    try {
      await db_conn_safe.end();
    } catch {}
  }
};

updateHymn();
