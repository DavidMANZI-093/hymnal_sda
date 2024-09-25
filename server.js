const express = require('express');
const https = require('https');
const fs = require('fs');
const db_conn = require('./db');
const path = require('path');
const app = express();

const port = process.env.PORT || 3000;

const privateKey = fs.readFileSync(path.join(__dirname, 'https_certs/key.pem'), 'utf8');
const certificate = fs.readFileSync(path.join(__dirname, 'https_certs/cert.pem'), 'utf8');

const credentials = { key: privateKey, cert: certificate };

app.get('/hymns', async (req, res) => {
    try {
        const result = await db_conn.query('SELECT * FROM Hymns');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching hymns', err);
        res.status(500).send('Server Error');
    }
});

app.get('/hymns/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db_conn.query('SELECT * FROM Hymns WHERE id = $1', [id]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).send('Hymn not found');
        }
    } catch (err) {
        console.err('Error fetcing hymn by id', err);
        res.status(500).send('Server Error');
    }
});

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, () => {
    console.log(`HTTPS Server running on port ${port}`);
});