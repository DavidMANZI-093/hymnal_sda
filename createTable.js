const db_conn = require('./db');

const createHymnsTable = async () => {
    try {
        const query = `
            CREATE TABLE IF NOT EXISTS Hymns (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                verses TEXT[] NOT NULL,
                refrain TEXT,
                number INT NOT NULL,
                author VARCHAR(255) NOT NULL
            );
        `;
        await db_conn.query(query);
        console.log('Hymns table created successfully');
    } catch (err) {
        console.error('Error creating table', err);
    } finally {
        db_conn.end();
    }
};

createHymnsTable();