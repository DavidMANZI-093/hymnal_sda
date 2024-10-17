const express = require('express');
const { param } = require('express-validator');
const xss = require('xss-clean');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
// const https = require('https'); //
// const fs = require('fs'); //
const db_conn = require('./db');
const path = require('path');
const app = express();

const port = process.env.PORT || 10000;

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});

app.use(limiter);

app.use(xss());

app.use(helmet());

if (app.get('env') === 'production') {
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).send('Something went worng!');
    });
}

// const privateKey = fs.readFileSync(path.join(__dirname, 'https_certs/key.pem'), 'utf8'); //
// const certificate = fs.readFileSync(path.join(__dirname, 'https_certs/cert.pem'), 'utf8'); //

// const credentials = { key: privateKey, cert: certificate }; //

function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    console.log(token);
    if (!token) return res.status(401).send('Access Denied');

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).send('Invalid Token');
        req.user = user;
        next();
    });
}

app.use(express.static(path.join(__dirname, 'public')));

app.get('/hymns', authenticateToken, async (req, res) => {
    try {
        const result = await db_conn.query('SELECT * FROM Hymns ORDER BY number ASC');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching hymns', err);
        res.status(500).send('Server Error');
    }
});

app.get('/hymns/:id', authenticateToken, [
    param('id').isInt().withMessage('ID must be an integer')
] ,async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
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

// const httpsServer = https.createServer(credentials, app); //

// httpsServer.listen(port, () => { //
//     console.log(`HTTPS Server running on port ${port}`); //
// }); //

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// ------------------------------------------------------ //