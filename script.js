const apiUrl = 'http://localhost:5000';

async function parseText() {
    const inputText = document.getElementById('inputText').value;
    const parsedResultDiv = document.getElementById('parsedResult');

    const parsedLines = inputText.split('\n').map(line => {
        const dateTimeAgentPattern = /^\d{1,2}\/\d{1,2}\/\d{2}, \d{1,2}:\d{2} - (.+?):/;
        const match = line.match(dateTimeAgentPattern);
        if (match) {
            const [dateTime, agent] = line.split(' - ');
            const [date, time] = dateTime.split(', ');
            saveParsedText({ date, time, agent: match[1] });
            return `<div class="alert alert-info"><strong>Date:</strong> ${date} <strong>Time:</strong> ${time} <strong>Agent:</strong> ${match[1]}</div>`;
        }
        return '';
    }).filter(line => line !== '');

    parsedResultDiv.innerHTML = parsedLines.join('');
}

async function saveParsedText(parsedText) {
    await fetch(`${apiUrl}/texts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(parsedText)
    });
}


async function saveParsedText(parsedText) {
    await fetch(`${apiUrl}/texts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(parsedText)
    });
}

async function searchText() {
    const searchTerm = document.getElementById('searchTerm').value;
    const response = await fetch(`${apiUrl}/texts/search?term=${searchTerm}`);
    const results = await response.json();
    displaySearchResults(results);
}

function displaySearchResults(results) {
    const searchResultDiv = document.getElementById('searchResult');
    searchResultDiv.innerHTML = results.map(result => `
        <div>
            <strong>Date:</strong> ${result.date}
            <strong>Time:</strong> ${result.time}
            <strong>Agent:</strong> ${result.agent}
            <button onclick="deleteText(${result.id})">Delete</button>
            <button onclick="editText(${result.id})">Edit</button>
        </div>
    `).join('<br>');
}

async function deleteText(id) {
    await fetch(`${apiUrl}/texts/${id}`, {
        method: 'DELETE'
    });
    searchText();
}

async function editText(id) {
    const date = prompt('Enter new date:');
    const time = prompt('Enter new time:');
    const agent = prompt('Enter new agent:');
    await fetch(`${apiUrl}/texts/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ date, time, agent })
    });
    searchText();
}
