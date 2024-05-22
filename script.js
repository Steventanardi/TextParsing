function parseText() {
    const inputText = document.getElementById('inputText').value;
    const fileInput = document.getElementById('fileInput');
    const parsedResultDiv = document.getElementById('parsedResult');

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = function(event) {
            const textToParse = event.target.result;
            parseAndDisplayText(textToParse, parsedResultDiv);
        };
        reader.readAsText(file);
    } else {
        parseAndDisplayText(inputText, parsedResultDiv);
    }
}

function parseAndDisplayText(text, parsedResultDiv) {
    const dateTimeAgentPattern = /^(\d{1,2}\/\d{1,2}\/\d{2}), (\d{1,2}:\d{2}) - (.+?):/i;
    const messages = text.split('\n').reduce((acc, line) => {
        if (dateTimeAgentPattern.test(line)) {
            acc.push([line]);
        } else if (acc.length > 0) {
            acc[acc.length - 1].push(line);
        }
        return acc;
    }, []);

    const parsedMessages = messages.map(messageLines => {
        const header = messageLines[0];
        const body = messageLines.slice(1).join(' ');

        const dateTimeMatch = header.match(dateTimeAgentPattern);
        if (!dateTimeMatch) return '';

        const date = dateTimeMatch[1];
        const time = dateTimeMatch[2];
        const agent = dateTimeMatch[3];

        const propertyDetails = parsePropertyText(body);

        saveParsedText({ date, time, agent, description: propertyDetails });

        return `<div class="card mb-3">
                    <div class="card-body">
                        <strong>Date:</strong> ${date} <strong>Time:</strong> ${time} <strong>Agent:</strong> ${agent}
                        <p><strong>Description:</strong> ${propertyDetails || 'N/A'}</p>
                    </div>
                </div>`;
    }).filter(line => line !== '');

    parsedResultDiv.innerHTML = parsedMessages.join('');
}

function parsePropertyText(text) {
    // Combine all the relevant information into the description
    return text.trim();
}

function saveParsedText(parsedText) {
    let parsedTexts = JSON.parse(localStorage.getItem('parsedTexts')) || [];
    parsedTexts.push({ ...parsedText, id: Date.now() });
    localStorage.setItem('parsedTexts', JSON.stringify(parsedTexts));
}

function clearAllData() {
    localStorage.removeItem('parsedTexts');
    document.getElementById('parsedResult').innerHTML = '';
    document.getElementById('searchResult').innerHTML = '';
}

function searchText() {
    const searchTerm = document.getElementById('searchTerm').value.toLowerCase();
    let parsedTexts = JSON.parse(localStorage.getItem('parsedTexts')) || [];
    const results = parsedTexts.filter(text => 
        text.agent.toLowerCase().includes(searchTerm) || 
        text.date.includes(searchTerm) || 
        text.time.includes(searchTerm) ||
        text.description && text.description.toLowerCase().includes(searchTerm)
    );
    displaySearchResults(results);
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
                    <p class="card-text"><strong>Description:</strong> ${result.description || 'N/A'}</p>
                    <button onclick="deleteText(${result.id})" class="btn btn-danger btn-sm">Delete</button>
                </div>
            </div>
        `).join('');
    }
}

function deleteText(id) {
    let parsedTexts = JSON.parse(localStorage.getItem('parsedTexts')) || [];
    parsedTexts = parsedTexts.filter(text => text.id !== id);
    localStorage.setItem('parsedTexts', JSON.stringify(parsedTexts));
    loadAllParsedTexts();
}
