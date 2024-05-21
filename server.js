const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/texts', (req, res) => {
    db.query('SELECT * FROM parsed_texts', (err, results) => {
        if (err) throw err;
        console.log('Fetched all texts:', results); // Log fetched results
        res.json(results);
    });
});

app.get('/texts/search', (req, res) => {
    const { term } = req.query;
    db.query('SELECT * FROM parsed_texts WHERE agent LIKE ? OR date LIKE ? OR time LIKE ?', [`%${term}%`, `%${term}%`, `%${term}%`], (err, results) => {
        if (err) throw err;
        console.log('Search results for term:', term, results); // Log search results
        res.json(results);
    });
});

app.post('/texts', (req, res) => {
    const { date, time, agent } = req.body;
    db.query('INSERT INTO parsed_texts (date, time, agent) VALUES (?, ?, ?)', [date, time, agent], (err, result) => {
        if (err) throw err;
        console.log('Inserted text:', { id: result.insertId, date, time, agent }); // Log inserted text
        res.json({ id: result.insertId, date, time, agent });
    });
});

app.put('/texts/:id', (req, res) => {
    const { id } = req.params;
    const { date, time, agent } = req.body;
    db.query('UPDATE parsed_texts SET date = ?, time = ?, agent = ? WHERE id = ?', [date, time, agent, id], (err, result) => {
        if (err) throw err;
        console.log('Updated text:', { id, date, time, agent }); // Log updated text
        res.json({ id, date, time, agent });
    });
});

app.delete('/texts/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM parsed_texts WHERE id = ?', [id], (err, result) => {
        if (err) throw err;
        console.log('Deleted text with id:', id); // Log deleted text
        res.json({ id });
    });
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
