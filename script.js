function parseText(text) {
    const entries = [];
    const lines = text.split('\n');
    let currentEntry = null;

    for (let line of lines) {
        const match = line.match(/^(\d{1,2}\/\d{1,2}\/\d{2}), (\d{2}:\d{2}) - (.*?): (.*)$/);
        if (match) {
            if (currentEntry) {
                entries.push(currentEntry);
            }
            currentEntry = {
                id: Date.now() + Math.random(),
                date: match[1],
                time: match[2],
                agent: match[3],
                description: match[4]
            };
        } else if (currentEntry) {
            currentEntry.description += '\n' + line;
        }
    }

    if (currentEntry) {
        entries.push(currentEntry);
    }

    return entries;
}

function parseAndStoreText() {
    const text = document.getElementById('inputText').value;
    const parsedEntries = parseText(text);
    let storedEntries = JSON.parse(localStorage.getItem('parsedTexts')) || [];
    storedEntries = storedEntries.concat(parsedEntries);
    localStorage.setItem('parsedTexts', JSON.stringify(storedEntries));
    displayParsedTexts(parsedEntries);
}

function displayParsedTexts(entries) {
    const parsedResultDiv = document.getElementById('parsedResult');
    parsedResultDiv.innerHTML = entries.map(entry => `
        <div class="card mb-3">
            <div class="card-body">
                <h5 class="card-title"><strong>Date:</strong> ${entry.date}</h5>
                <p class="card-text"><strong>Time:</strong> ${entry.time}</p>
                <p class="card-text"><strong>Agent:</strong> ${entry.agent}</p>
                <p class="card-text"><strong>Description:</strong> ${entry.description || 'N/A'}</p>
            </div>
        </div>
    `).join('');
}

function clearAllData() {
    localStorage.removeItem('parsedTexts');
    document.getElementById('parsedResult').innerHTML = '';
    document.getElementById('searchResult').innerHTML = '';
}

document.addEventListener('DOMContentLoaded', (event) => {
    loadAllParsedTexts();
});

function loadAllParsedTexts() {
    let parsedTexts = JSON.parse(localStorage.getItem('parsedTexts')) || [];
    displayParsedTexts(parsedTexts);
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
    displayParsedTexts(results);
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
                    <p class="card-text"><strong>Description:</strong> ${result.description || 'N/A'}</p>
                    <button onclick="editText(${result.id})" class="btn btn-warning btn-sm">Edit</button>
                    <button onclick="deleteText(${result.id})" class="btn btn-danger btn-sm">Delete</button>
                    <button onclick="sendEmail(${result.id})" class="btn btn-info btn-sm">E-Mail</button>
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
    const parsedTexts = JSON.parse(localStorage.getItem('parsedTexts')) || [];
    const textToEdit = parsedTexts.find(text => text.id === id);
    if (textToEdit) {
        document.getElementById('editId').value = textToEdit.id;
        document.getElementById('editAgent').value = textToEdit.agent;
        document.getElementById('editDescription').value = textToEdit.description;
        $('#editModal').modal('show');
    }
}

function updateText() {
    const id = parseInt(document.getElementById('editId').value);
    const agent = document.getElementById('editAgent').value;
    const description = document.getElementById('editDescription').value;

    let parsedTexts = JSON.parse(localStorage.getItem('parsedTexts')) || [];
    const index = parsedTexts.findIndex(text => text.id === id);
    if (index !== -1) {
        parsedTexts[index] = { ...parsedTexts[index], agent, description };
        localStorage.setItem('parsedTexts', JSON.stringify(parsedTexts));
        loadAllParsedTexts();
        $('#editModal').modal('hide');
    }
}

function sendEmail(id) {
    const parsedTexts = JSON.parse(localStorage.getItem('parsedTexts')) || [];
    const textToSend = parsedTexts.find(text => text.id === id);
    if (textToSend) {
        const email = prompt("Enter the recipient's email address:");
        if (email) {
            const templateParams = {
                to_email: email,
                from_name: 'Text Parsing App',
                to_name: 'Recipient',
                subject: 'Parsed Text Data',
                date: textToSend.date,
                time: textToSend.time,
                agent: textToSend.agent,
                description: textToSend.description
            };

            emailjs.send('service_lrtdj3g', 'template_jdtqtxd', templateParams, 'mjzQpAoD6n3lOIIiC')
                .then(function(response) {
                    console.log('Email sent successfully:', response.status, response.text);
                    alert('Email sent successfully');
                }, function(error) {
                    console.error('Failed to send email:', error);
                    alert('Failed to send email');
                });
        }
    }
}

function createNewText() {
    const now = new Date();
    const currentDate = now.toLocaleDateString('en-CA');
    const currentTime = now.toLocaleTimeString('en-GB');

    document.getElementById('createDate').value = currentDate;
    document.getElementById('createTime').value = currentTime;
    document.getElementById('createAgent').value = '';
    document.getElementById('createDescription').value = '';
    $('#createModal').modal('show');
}

function saveNewText() {
    const date = document.getElementById('createDate').value;
    const time = document.getElementById('createTime').value;
    const agent = document.getElementById('createAgent').value;
    const description = document.getElementById('createDescription').value;

    let parsedTexts = JSON.parse(localStorage.getItem('parsedTexts')) || [];
    const newText = { id: Date.now(), date, time, agent, description };
    parsedTexts.push(newText);
    localStorage.setItem('parsedTexts', JSON.stringify(parsedTexts));
    loadAllParsedTexts();
    $('#createModal').modal('hide');
}
