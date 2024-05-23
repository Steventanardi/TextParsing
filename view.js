// Function to show the confirmation modal for deleting all data
function showDeleteAllModal() {
    $('#deleteAllModal').modal('show');
}

// Function to delete all data after confirmation
function deleteAllData() {
    localStorage.removeItem('parsedTexts');
    document.getElementById('allParsedTexts').innerHTML = 'All stored data has been cleared.';
    document.getElementById('searchResult').innerHTML = '';
    $('#deleteAllModal').modal('hide');
}

// Load all parsed texts when the document is ready
document.addEventListener('DOMContentLoaded', (event) => {
    loadAllParsedTexts();
});

// Function to load all parsed texts
function loadAllParsedTexts() {
    let parsedTexts = JSON.parse(localStorage.getItem('parsedTexts')) || [];
    displayParsedTexts(parsedTexts, 'allParsedTexts');
}

// Function to search texts based on a search term
function searchText() {
    const searchTerm = document.getElementById('searchTerm').value.toLowerCase();
    let parsedTexts = JSON.parse(localStorage.getItem('parsedTexts')) || [];
    const results = parsedTexts.filter(text => 
        text.agent.toLowerCase().includes(searchTerm) || 
        text.date.includes(searchTerm) || 
        text.time.includes(searchTerm) ||
        (text.description && text.description.toLowerCase().includes(searchTerm))
    );
    displayParsedTexts(results, 'searchResult');
}

// Function to display parsed texts
function displayParsedTexts(results, elementId) {
    const parsedTextsDiv = document.getElementById(elementId);
    if (results.length === 0) {
        parsedTextsDiv.innerHTML = '<p>No results found</p>';
    } else {
        parsedTextsDiv.innerHTML = results.map(result => `
            <div class="card mb-3">
                <div class="card-body">
                    <h5 class="card-title"><strong>Date:</strong> ${result.date}</h5>
                    <p class="card-text"><strong>Time:</strong> ${result.time}</h5>
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

// Function to delete a single text entry
function deleteText(id) {
    if (confirm('Are you sure you want to delete this item?')) {
        let parsedTexts = JSON.parse(localStorage.getItem('parsedTexts')) || [];
        parsedTexts = parsedTexts.filter(text => text.id !== id);
        localStorage.setItem('parsedTexts', JSON.stringify(parsedTexts));
        loadAllParsedTexts();
    }
}

// Function to edit a text entry
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

// Function to update a text entry
function updateText() {
    const id = parseInt(document.getElementById('editId').value);
    const agent = document.getElementById('editAgent').value;
    const description = document.getElementById('editDescription').value;

    let parsedTexts = JSON.parse(localStorage.getItem('parsedTexts')) || [];
    const index = parsedTexts.findIndex(text => text.id === id);
    if (index !== -1) {
        parsedTexts[index].agent = agent;
        parsedTexts[index].description = description;
        localStorage.setItem('parsedTexts', JSON.stringify(parsedTexts));
        loadAllParsedTexts();
        $('#editModal').modal('hide');
    }
}

// Function to send an email with a text entry
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

// Function to create a new text entry
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

// Function to save a new text entry
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
