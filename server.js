const express = require('express');
const { param } = require('express-validator');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const db_conn = require('./db');
const db_conn_safe = require('./db1');
const app = express();
const path = require('path');
require('dotenv').config();

// const https = require('https'); //
// const fs = require('fs'); //

const port = process.env.PORT || 10000;

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});

app.use(limiter);

app.use(helmet());

app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Production error handler
if (app.get('env') === 'production') {
    app.use((err, req, res, next) => {
        console.error('Production error:', err.stack);
        res.status(500).send('Something went wrong!');
    });
}

// const privateKey = fs.readFileSync(path.join(__dirname, 'https_certs/key.pem'), 'utf8'); //
// const certificate = fs.readFileSync(path.join(__dirname, 'https_certs/cert.pem'), 'utf8'); //

// const credentials = { key: privateKey, cert: certificate }; //

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.send('Welcome to the SDA Hymnal API!');
});

const apiKeys = [process.env.ACCESS_TOKEN_SECRET];

function authenticateApiKey(req, res, next) {
    const apiKey = req.query.api_key || req.headers['x-api-key'];

    if (!apiKey ||!apiKeys.includes(apiKey)) {
        return res.status(401).send('Unauthorized: Invalid API Key');
    }

    next();
}
app.get('/hymns', authenticateApiKey, async (req, res) => {
    try {
        try {
            const result = await db_conn.query('SELECT * FROM Hymns ORDER BY number ASC');
            res.json(result.rows);
        } catch (primaryErr) {
            console.log('Primary database connection failed. Falling back to secondary database...');
            const result = await db_conn_safe.query('SELECT * FROM Hymns ORDER BY number ASC');
            res.json(result.rows);
        }
    } catch (err) {
        console.error('Error fetching hymns from both databases', err);
        res.status(500).send('Server Error');
    }
});

app.get('/hymns/:id', authenticateApiKey, [
    param('id').isInt().withMessage('ID must be an integer')
] ,async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { id } = req.params;
        try {
            const result = await db_conn.query('SELECT * FROM Hymns WHERE id = $1', [id]);
            if (result.rows.length > 0) {
                res.json(result.rows[0]);
                return;
            }
        } catch (primaryErr) {
            console.log('Primary database connection failed. Falling back to secondary database...');
            const result = await db_conn_safe.query('SELECT * FROM Hymns WHERE id = $1', [id]);
            if (result.rows.length > 0) {
                res.json(result.rows[0]);
                return;
            }
        }
        res.status(404).send('Hymn not found');
    } catch (err) {
        console.error('Error fetching hymn by id from both databases', err);
        res.status(500).send('Server Error');
    }
});

// const httpsServer = https.createServer(credentials, app); //

// httpsServer.listen(port, () => { //
//     console.log(`HTTPS Server running on port ${port}`); //
// }); //

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// ------------------------------------------------------ //