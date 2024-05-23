const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
const url = 'mongodb://localhost:27017';
const dbName = 'textParsingApp';
let db;

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if (err) throw err;
    db = client.db(dbName);
    console.log('Connected to database');
});

app.use(cors());
app.use(bodyParser.json());

app.get('/texts', async (req, res) => {
    const texts = await db.collection('texts').find().toArray();
    res.json(texts);
});

app.get('/texts/search', async (req, res) => {
    const { term } = req.query;
    const texts = await db.collection('texts').find({
        $or: [
            { agent: new RegExp(term, 'i') },
            { date: new RegExp(term, 'i') },
            { time: new RegExp(term, 'i') },
            { description: new RegExp(term, 'i') }
        ]
    }).toArray();
    res.json(texts);
});

app.post('/texts', async (req, res) => {
    const { date, time, agent, description } = req.body;
    const newText = { date, time, agent, description };
    const result = await db.collection('texts').insertOne(newText);
    res.json(result.ops[0]);
});

app.put('/texts/:id', async (req, res) => {
    const { id } = req.params;
    const { date, time, agent, description } = req.body;
    const result = await db.collection('texts').findOneAndUpdate(
        { _id: new MongoClient.ObjectID(id) },
        { $set: { date, time, agent, description } },
        { returnOriginal: false }
    );
    res.json(result.value);
});

app.delete('/texts/:id', async (req, res) => {
    const { id } = req.params;
    await db.collection('texts').deleteOne({ _id: new MongoClient.ObjectID(id) });
    res.json({ id });
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
