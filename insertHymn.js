const db_conn = require('./db');

const insertHymn = async () => {
  try {
    const query = `
      INSERT INTO Hymns (title, verses, refrain, number, author)
      VALUES ($1, $2, $3, $4, $5);
    `;

    const values = [
      'Mukiza We Niwe Mucyo Waka',
      [
        "Mukiza we! Niwe mucyo waka. Ntabw’ umwijim’ uhangar’ ah’ uri, Nyamururahw ibinyoshya, Bituma nanduranya nawe.",
        "Mukiza mu gihe njya kuryama, Ngo nduhuk’ imirimo nakoze, Umpe kugutekereza, Ngo nsinzire ndi kumwe nawe.",
        "Umpagarik’ umunsi n’ ijoro; Ntabwo nabaho tutari kumwe; Ungumane mu makuba, Kuko ntinya gupf’ utahari.",
        "N’ ubwo nkanguk’ ungume bugufi; N’ aho ndibujye gukora hose, Kugez’ ubwo nzaz’ iwawe, Meny’ urukundo rwawe rwose."
      ],
      '',
      31,
      'Peter Ritter'
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
