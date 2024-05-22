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

        saveParsedText({ date, time, agent, ...propertyDetails });

        return `<div class="card mb-3">
                    <div class="card-body">
                        <strong>Date:</strong> ${date} <strong>Time:</strong> ${time} <strong>Agent:</strong> ${agent}
                        <p><strong>Price:</strong> ${propertyDetails.price || 'N/A'}</p>
                        <p><strong>Location:</strong> ${propertyDetails.location || 'N/A'}</p>
                        <p><strong>LT:</strong> ${propertyDetails.landArea || 'N/A'}</p>
                        <p><strong>LB:</strong> ${propertyDetails.buildingArea || 'N/A'}</p>
                        <p><strong>PLN:</strong> ${propertyDetails.pln || 'N/A'}</p>
                        <p><strong>Land Shape:</strong> ${propertyDetails.landShape || 'N/A'}</p>
                        <p><strong>Entrance Direction:</strong> ${propertyDetails.entranceDirection || 'N/A'}</p>
                        <p><strong>Building Direction:</strong> ${propertyDetails.buildingDirection || 'N/A'}</p>
                        <p><strong>Previous Use:</strong> ${propertyDetails.previousUse || 'N/A'}</p>
                        <p><strong>Road Access:</strong> ${propertyDetails.roadAccess || 'N/A'}</p>
                        <p><strong>Distance:</strong> ${propertyDetails.distance || 'N/A'}</p>
                        <p><strong>Nearby:</strong> ${propertyDetails.nearby || 'N/A'}</p>
                        <p><strong>Video Link:</strong> ${propertyDetails.videoLink || 'N/A'}</p>
                        <p><strong>Contact:</strong> ${propertyDetails.contact || 'N/A'}</p>
                        <p><strong>Phone:</strong> ${propertyDetails.phone || 'N/A'}</p>
                        <p><strong>Instagram:</strong> ${propertyDetails.instagram || 'N/A'}</p>
                        <p><strong>YouTube:</strong> ${propertyDetails.youtube || 'N/A'}</p>
                    </div>
                </div>`;
    }).filter(line => line !== '');

    parsedResultDiv.innerHTML = parsedMessages.join('');
}

function parsePropertyText(text) {
    const propertyDetails = {
        price: null,
        location: null,
        landArea: null,
        buildingArea: null,
        pln: null,
        landShape: null,
        entranceDirection: null,
        buildingDirection: null,
        previousUse: null,
        roadAccess: null,
        distance: null,
        nearby: null,
        videoLink: null,
        contact: null,
        phone: null,
        instagram: null,
        youtube: null,
    };

    // Regular expressions to capture each detail
    const regexps = {
        price: /Harga\s*:\s*(.*)/i,
        location: /Lokasi\s*:\s*(.*)/i,
        landArea: /LT\s*:\s*([\d,]+)\s*m2/i,
        buildingArea: /LB\s*:\s*([\d,]+)\s*m2/i,
        pln: /PLN\s*:\s*(.*)/i,
        landShape: /Bentuk Tanah\s*:\s*(.*)/i,
        entranceDirection: /Pintu masuk\s*:\s*(.*)/i,
        buildingDirection: /bangunan produksi\s*:\s*(.*)/i,
        previousUse: /Ex\s*:\s*(.*)/i,
        roadAccess: /Jalan\s*:\s*(.*)/i,
        distance: /\+\- ([\d,]+)\s*m dari/i,
        nearby: /Dekat\s*:\s*(.*)/i,
        videoLink: /For watching, Pls click\s*(.*)/i,
        contact: /Contact\s*:\s*(.*)/i,
        phone: /wa.me\/(\+\d+)/i,
        instagram: /IG\s*:\s*(.*)/i,
        youtube: /YouTube\s*:\s*(.*)/i,
    };

    // Loop through each regular expression and apply it to the text
    for (const [key, regexp] of Object.entries(regexps)) {
        const match = text.match(regexp);
        if (match) {
            propertyDetails[key] = match[1].trim();
        }
    }

    return propertyDetails;
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
        text.landArea && text.landArea.toLowerCase().includes(searchTerm) ||
        text.buildingArea && text.buildingArea.toLowerCase().includes(searchTerm) ||
        text.price && text.price.toLowerCase().includes(searchTerm) ||
        text.location && text.location.toLowerCase().includes(searchTerm)
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
                    <p class="card-text"><strong>Price:</strong> ${result.price || 'N/A'}</p>
                    <p class="card-text"><strong>Location:</strong> ${result.location || 'N/A'}</p>
                    <p class="card-text"><strong>LT:</strong> ${result.landArea || 'N/A'}</p>
                    <p class="card-text"><strong>LB:</strong> ${result.buildingArea || 'N/A'}</p>
                    <p class="card-text"><strong>PLN:</strong> ${result.pln || 'N/A'}</p>
                    <p class="card-text"><strong>Land Shape:</strong> ${result.landShape || 'N/A'}</p>
                    <p class="card-text"><strong>Entrance Direction:</strong> ${result.entranceDirection || 'N/A'}</p>
                    <p class="card-text"><strong>Building Direction:</strong> ${result.buildingDirection || 'N/A'}</p>
                    <p class="card-text"><strong>Previous Use:</strong> ${result.previousUse || 'N/A'}</p>
                    <p class="card-text"><strong>Road Access:</strong> ${result.roadAccess || 'N/A'}</p>
                    <p class="card-text"><strong>Distance:</strong> ${result.distance || 'N/A'}</p>
                    <p class="card-text"><strong>Nearby:</strong> ${result.nearby || 'N/A'}</p>
                    <p class="card-text"><strong>Video Link:</strong> ${result.videoLink || 'N/A'}</p>
                    <p class="card-text"><strong>Contact:</strong> ${result.contact || 'N/A'}</p>
                    <p class="card-text"><strong>Phone:</strong> ${result.phone || 'N/A'}</p>
                    <p class="card-text"><strong>Instagram:</strong> ${result.instagram || 'N/A'}</p>
                    <p class="card-text"><strong>YouTube:</strong> ${result.youtube || 'N/A'}</p>
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
