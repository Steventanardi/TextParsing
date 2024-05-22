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
    const parsedLines = text.split('\n').map(line => {
        const dateTimeAgentPattern = /^(\d{1,2}\/\d{1,2}\/\d{2}), (\d{1,2}:\d{2}) - (.+?):/;
        const match = line.match(dateTimeAgentPattern);
        if (match) {
            const date = match[1];
            const time = match[2];
            const agent = match[3];
            const lt = extractInfo(text, /LT\s*:\s*(\d+ m2)/);
            const lb = extractInfo(text, /LB\s*:\s*(\+?-?\d+ m2)/);
            const price = extractInfo(text, /Harga\s*:\s*([\d\w\s]+ per meter)/);
            const location = extractInfo(text, /Lokasi\s*:\s*([^\n]+)/);
            const shm = extractInfo(text, /SHM\s*:\s*([^\n]+)/);
            saveParsedText({ date, time, agent, lt, lb, price, location, shm });
            return `<div class="card mb-3">
                        <div class="card-body">
                            <strong>Date:</strong> ${date} <strong>Time:</strong> ${time} <strong>Agent:</strong> ${agent}
                            <p><strong>LT:</strong> ${lt}</p>
                            <p><strong>LB:</strong> ${lb}</p>
                            <p><strong>Price:</strong> ${price}</p>
                            <p><strong>Location:</strong> ${location}</p>
                            <p><strong>SHM:</strong> ${shm}</p>
                        </div>
                    </div>`;
        }
        return '';
    }).filter(line => line !== '');

    parsedResultDiv.innerHTML = parsedLines.join('');
}

function extractInfo(text, regex) {
    const match = text.match(regex);
    return match ? match[1] : 'N/A';
}

function saveParsedText(parsedText) {
    let parsedTexts = JSON.parse(localStorage.getItem('parsedTexts')) || [];
    parsedTexts.push({ ...parsedText, id: Date.now() });
    localStorage.setItem('parsedTexts', JSON.stringify(parsedTexts));
}

function searchText() {
    const searchTerm = document.getElementById('searchTerm').value.toLowerCase();
    let parsedTexts = JSON.parse(localStorage.getItem('parsedTexts')) || [];
    const results = parsedTexts.filter(text => 
        text.agent.toLowerCase().includes(searchTerm) || 
        text.date.includes(searchTerm) || 
        text.time.includes(searchTerm) ||
        text.lt.toLowerCase().includes(searchTerm) ||
        text.lb.toLowerCase().includes(searchTerm) ||
        text.price.toLowerCase().includes(searchTerm) ||
        text.location.toLowerCase().includes(searchTerm) ||
        text.shm.toLowerCase().includes(searchTerm)
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
                    <p class="card-text"><strong>LT:</strong> ${result.lt}</p>
                    <p class="card-text"><strong>LB:</strong> ${result.lb}</p>
                    <p class="card-text"><strong>Price:</strong> ${result.price}</p>
                    <p class="card-text"><strong>Location:</strong> ${result.location}</p>
                    <p class="card-text"><strong>SHM:</strong> ${result.shm}</p>
                    <button onclick="deleteText(${result.id})" class="btn btn-danger btn-sm">Delete</button>
                    <button onclick="editText(${result.id})" class="btn btn-warning btn-sm">Edit</button>
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

function editText(id) {
    const date = prompt('Enter new date:');
    const time = prompt('Enter new time:');
    const agent = prompt('Enter new agent:');
    const lt = prompt('Enter new LT:');
    const lb = prompt('Enter new LB:');
    const price = prompt('Enter new Price:');
    const location = prompt('Enter new Location:');
    const shm = prompt('Enter new SHM:');
    let parsedTexts = JSON.parse(localStorage.getItem('parsedTexts')) || [];
    const index = parsedTexts.findIndex(text => text.id === id);
    if (index !== -1) {
        parsedTexts[index] = { id, date, time, agent, lt, lb, price, location, shm };
        localStorage.setItem('parsedTexts', JSON.stringify(parsedTexts));
        loadAllParsedTexts();
    }
}

function loadAllParsedTexts() {
    let parsedTexts = JSON.parse(localStorage.getItem('parsedTexts')) || [];
    displayParsedTexts(parsedTexts);
}

function displayParsedTexts(results) {
    const allParsedTextsDiv = document.getElementById('allParsedTexts');
    if (results.length === 0) {
        allParsedTextsDiv.innerHTML = '<p>No results found</p>';
    } else {
        allParsedTextsDiv.innerHTML = results.map(result => `
            <div class="card mb-3">
                <div class="card-body">
                    <h5 class="card-title"><strong>Date:</strong> ${result.date}</h5>
                    <p class="card-text"><strong>Time:</strong> ${result.time}</p>
                    <p class="card-text"><strong>Agent:</strong> ${result.agent}</p>
                    <p class="card-text"><strong>LT:</strong> ${result.lt}</p>
                    <p class="card-text"><strong>LB:</strong> ${result.lb}</p>
                    <p class="card-text"><strong>Price:</strong> ${result.price}</p>
                    <p class="card-text"><strong>Location:</strong> ${result.location}</p>
                    <p class="card-text"><strong>SHM:</strong> ${result.shm}</p>
                    <button onclick="deleteText(${result.id})" class="btn btn-danger btn-sm">Delete</button>
                    <button onclick="editText(${result.id})" class="btn btn-warning btn-sm">Edit</button>
                </div>
            </div>
        `).join('');
    }
}
