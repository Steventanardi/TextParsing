const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const dataFilePath = path.join(__dirname, 'parsed_texts.json');

app.use(cors());
app.use(bodyParser.json());

const readDataFromFile = () => {
    if (!fs.existsSync(dataFilePath)) {
        return [];
    }
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
};

const writeDataToFile = (data) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
};

app.get('/texts', (req, res) => {
    const data = readDataFromFile();
    res.json(data);
});

app.get('/texts/search', (req, res) => {
    const { term } = req.query;
    const data = readDataFromFile();
    const results = data.filter(item => 
        item.agent.includes(term) || item.date.includes(term) || item.time.includes(term)
    );
    res.json(results);
});

app.post('/texts', (req, res) => {
    const { date, time, agent, description } = req.body;
    const data = readDataFromFile();
    const newText = { id: Date.now(), date, time, agent, description };
    data.push(newText);
    writeDataToFile(data);
    res.json(newText);
});

app.put('/texts/:id', (req, res) => {
    const { id } = req.params;
    const { date, time, agent, description } = req.body;
    const data = readDataFromFile();
    const index = data.findIndex(item => item.id === parseInt(id));
    if (index !== -1) {
        data[index] = { id: parseInt(id), date, time, agent, description };
        writeDataToFile(data);
        res.json(data[index]);
    } else {
        res.status(404).json({ message: 'Text not found' });
    }
});

app.delete('/texts/:id', (req, res) => {
    const { id } = req.params;
    const data = readDataFromFile();
    const newData = data.filter(item => item.id !== parseInt(id));
    writeDataToFile(newData);
    res.json({ id: parseInt(id) });
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
