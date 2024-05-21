const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Get all parsed texts
app.get('/texts', (req, res) => {
    db.query('SELECT * FROM parsed_texts', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Search parsed texts
app.get('/texts/search', (req, res) => {
    const { term } = req.query;
    db.query('SELECT * FROM parsed_texts WHERE agent LIKE ? OR date LIKE ? OR time LIKE ?', [`%${term}%`, `%${term}%`, `%${term}%`], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Add new parsed text
app.post('/texts', (req, res) => {
    const { date, time, agent } = req.body;
    db.query('INSERT INTO parsed_texts (date, time, agent) VALUES (?, ?, ?)', [date, time, agent], (err, result) => {
        if (err) throw err;
        res.json({ id: result.insertId, date, time, agent });
    });
});

// Update parsed text
app.put('/texts/:id', (req, res) => {
    const { id } = req.params;
    const { date, time, agent } = req.body;
    db.query('UPDATE parsed_texts SET date = ?, time = ?, agent = ? WHERE id = ?', [date, time, agent, id], (err, result) => {
        if (err) throw err;
        res.json({ id, date, time, agent });
    });
});

// Delete parsed text
app.delete('/texts/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM parsed_texts WHERE id = ?', [id], (err, result) => {
        if (err) throw err;
        res.json({ id });
    });
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
