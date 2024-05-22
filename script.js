const apiUrl = 'http://localhost:5000';

async function parseText() {
    const inputText = document.getElementById('inputText').value;
    const fileInput = document.getElementById('fileInput');
    const parsedResultDiv = document.getElementById('parsedResult');

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = function(event) {
            const textToParse = event.target.result;
            console.log('File content:', textToParse); // Log the file content for debugging
            parseAndDisplayText(textToParse, parsedResultDiv);
        };
        reader.readAsText(file);
    } else {
        parseAndDisplayText(inputText, parsedResultDiv);
    }
}

function parseAndDisplayText(text, parsedResultDiv) {
    const parsedLines = text.split('\n').map(line => {
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
    try {
        const response = await fetch(`${apiUrl}/texts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(parsedText)
        });
        const result = await response.json();
        console.log('Saved parsed text:', result); // Log the result for debugging
    } catch (error) {
        console.error('Error saving parsed text:', error); // Log errors for debugging
    }
}

async function searchText() {
    const searchTerm = document.getElementById('searchTerm').value;
    try {
        const response = await fetch(`${apiUrl}/texts/search?term=${searchTerm}`);
        const results = await response.json();
        console.log('Search results:', results); // Log results for debugging
        displaySearchResults(results);
    } catch (error) {
        console.error('Error fetching search results:', error); // Log errors for debugging
    }
}

function displaySearchResults(results) {
    const searchResultDiv = document.getElementById('searchResult');
    if (results.length === 0) {
        searchResultDiv.innerHTML = '<p>No results found</p>';
    } else {
        searchResultDiv.innerHTML = results.map(result => `
            <div class="card mb-3">
                <div class="card-body">
                    <h5 class="card-title"><strong>Date:</strong> ${result.date}</h5>
                    <p class="card-text"><strong>Time:</strong> ${result.time}</p>
                    <p class="card-text"><strong>Agent:</strong> ${result.agent}</p>
                    <button onclick="deleteText(${result.id})" class="btn btn-danger btn-sm">Delete</button>
                    <button onclick="editText(${result.id})" class="btn btn-warning btn-sm">Edit</button>
                </div>
            </div>
        `).join('');
    }
}

async function deleteText(id) {
    try {
        await fetch(`${apiUrl}/texts/${id}`, {
            method: 'DELETE'
        });
        console.log('Deleted text with id:', id); // Log deletion
        searchText();
    } catch (error) {
        console.error('Error deleting text:', error); // Log errors for debugging
    }
}

async function editText(id) {
    const date = prompt('Enter new date:');
    const time = prompt('Enter new time:');
    const agent = prompt('Enter new agent:');
    try {
        await fetch(`${apiUrl}/texts/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ date, time, agent })
        });
        console.log('Updated text with id:', id); // Log update
        searchText();
    } catch (error) {
        console.error('Error updating text:', error); // Log errors for debugging
    }
}
