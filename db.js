const { Pool } = require('pg');
require('dotenv').config();

const db_conn = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    // connectionTimeoutMillis: 15000, // Increase to 15 seconds
    // idleTimeoutMillis: 10000, // Add idle timeout
    // max: 10, // Set maximum pool size
    ssl: {
        rejectUnauthorized: false // Only for testing purposes
    }
});

module.exports = db_conn;