const db_conn = require('./db');
const db_conn_safe = require('./db1');

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
        try {
            await db_conn.query(query);
            console.log('Hymns table created successfully using primary database');
        } catch (primaryErr) {
            console.log('Primary database connection failed. Falling back to secondary database...');
            await db_conn_safe.query(query);
            console.log('Hymns table created successfully using secondary database');
        }
    } catch (err) {
        console.error('Error creating table on both primary and secondary databases', err);
    } finally {
        try {
	    await db_conn.end();
	} catch {}
	try {
	    await db_conn_safe.end();
	}
    }
};

createHymnsTable();
