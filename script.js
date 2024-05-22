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
    const dateTimeAgentPattern = /^(\d{1,2}\/\d{1,2}\/\d{2}), (\d{1,2}:\d{2}) - (.+?):/;

    const messages = text.split('\n').filter(line => dateTimeAgentPattern.test(line));
    const parsedMessages = messages.map((line, index, array) => {
        const dateTimeMatch = line.match(dateTimeAgentPattern);
        const date = dateTimeMatch[1];
        const time = dateTimeMatch[2];
        const agent = dateTimeMatch[3];

        const messageText = array.slice(index + 1).join('\n').split(dateTimeAgentPattern)[0].trim();
        const ltMatch = messageText.match(/LT\s*:\s*([\d\s]+m2)/i);
        const lbMatch = messageText.match(/LB\s*:\s*([\d\s\+\-]+m2)/i);
        const priceMatch = messageText.match(/Harga\s*([\d\w\s]+ per meter)/i);
        const locationMatch = messageText.match(/Lokasi\s*:\s*([^\n]+)/i);

        const lt = ltMatch ? ltMatch[1] : 'N/A';
        const lb = lbMatch ? lbMatch[1] : 'N/A';
        const price = priceMatch ? priceMatch[1] : 'N/A';
        const location = locationMatch ? locationMatch[1] : 'N/A';

        saveParsedText({ date, time, agent, lt, lb, price, location });

        return `<div class="card mb-3">
                    <div class="card-body">
                        <strong>Date:</strong> ${date} <strong>Time:</strong> ${time} <strong>Agent:</strong> ${agent}
                        <p><strong>LT:</strong> ${lt}</p>
                        <p><strong>LB:</strong> ${lb}</p>
                        <p><strong>Price:</strong> ${price}</p>
                        <p><strong>Location:</strong> ${location}</p>
                    </div>
                </div>`;
    });

    parsedResultDiv.innerHTML = parsedMessages.join('');
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
        text.lt.toLowerCase().includes(searchTerm) ||
        text.lb.toLowerCase().includes(searchTerm) ||
        text.price.toLowerCase().includes(searchTerm) ||
        text.location.toLowerCase().includes(searchTerm)
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
