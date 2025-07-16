require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();

// Middleware
app.use(express.json());
app.use(express.static('public'));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));

const SECRET_PIN = process.env.SECRET_PIN;

// Routes
app.post('/api/verify', (req, res) => {
    if (req.body.pin === SECRET_PIN) {
        req.session.verified = true;
        return res.json({ verified: true });
    }
    return res.json({ verified: false });
});

app.get('/api/check-auth', (req, res) => {
    res.json({ verified: !!req.session.verified });
});

// Protected route
app.get('/portal', (req, res) => {
    if (!req.session.verified) return res.redirect('/');
    res.sendFile(path.join(__dirname, 'private/portal.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
