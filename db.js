const { Pool } = require('pg');

const db_conn = new Pool({
    user: 'sda_hymnal_001_user',
    host: 'dpg-crpej5m8ii6s73cgo5og-a.oregon-postgres.render.com',
    database: 'sda_hymnal_001',
    password: 'kvFR3r8wNPTwd8RpjJYPqOHN23L3fcXS',
    port: 5432
});

module.exports = db_conn;