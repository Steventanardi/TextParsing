async function showDeleteAllModal() {
    $('#deleteAllModal').modal('show');
}

async function deleteAllData() {
    const response = await fetch('http://localhost:5000/texts');
    const texts = await response.json();
    for (const text of texts) {
        await fetch(`http://localhost:5000/texts/${text._id}`, {
            method: 'DELETE'
        });
    }
    document.getElementById('allParsedTexts').innerHTML = 'All stored data has been cleared.';
    document.getElementById('searchResult').innerHTML = '';
    $('#deleteAllModal').modal('hide');
}

document.addEventListener('DOMContentLoaded', async (event) => {
    const response = await fetch('http://localhost:5000/texts');
    const parsedTexts = await response.json();
    displayParsedTexts(parsedTexts, 'allParsedTexts');
});

async function searchText() {
    const searchTerm = document.getElementById('searchTerm').value.toLowerCase();
    const response = await fetch(`http://localhost:5000/texts/search?term=${searchTerm}`);
    const results = await response.json();
    displayParsedTexts(results, 'searchResult');
}

function displayParsedTexts(results, elementId) {
    const parsedTextsDiv = document.getElementById(elementId);
    if (results.length === 0) {
        parsedTextsDiv.innerHTML = '<p>No results found</p>';
    } else {
        parsedTextsDiv.innerHTML = results.map(result => `
            <div class="card mb-3">
                <div class="card-body">
                    <h5 class="card-title"><strong>Date:</strong> ${result.date}</h5>
                    <p class="card-text"><strong>Time:</strong> ${result.time}</p>
                    <p class="card-text"><strong>Agent:</strong> ${result.agent}</p>
                    <p class="card-text"><strong>Description:</strong> ${result.description || 'N/A'}</p>
                    <button onclick="editText('${result._id}')" class="btn btn-warning btn-sm">Edit</button>
                    <button onclick="deleteText('${result._id}')" class="btn btn-danger btn-sm">Delete</button>
                    <button onclick="sendEmail('${result._id}')" class="btn btn-info btn-sm">E-Mail</button>
                </div>
            </div>
        `).join('');
    }
}

async function deleteText(id) {
    if (confirm('Are you sure you want to delete this item?')) {
        await fetch(`http://localhost:5000/texts/${id}`, {
            method: 'DELETE'
        });
        loadAllParsedTexts();
    }
}

async function editText(id) {
    const response = await fetch(`http://localhost:5000/texts`);
    const texts = await response.json();
    const textToEdit = texts.find(text => text._id === id);
    if (textToEdit) {
        document.getElementById('editId').value = textToEdit._id;
        document.getElementById('editAgent').value = textToEdit.agent;
        document.getElementById('editDescription').value = textToEdit.description;
        $('#editModal').modal('show');
    }
}

async function updateText() {
    const id = document.getElementById('editId').value;
    const agent = document.getElementById('editAgent').value;
    const description = document.getElementById('editDescription').value;

    await fetch(`http://localhost:5000/texts/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ agent, description })
    });

    loadAllParsedTexts();
    $('#editModal').modal('hide');
}

async function sendEmail(id) {
    const response = await fetch(`http://localhost:5000/texts`);
    const texts = await response.json();
    const textToSend = texts.find(text => text._id === id);
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

async function createNewText() {
    const now = new Date();
    const currentDate = now.toLocaleDateString('en-CA');
    const currentTime = now.toLocaleTimeString('en-GB');

    document.getElementById('createDate').value = currentDate;
    document.getElementById('createTime').value = currentTime;
    document.getElementById('createAgent').value = '';
    document.getElementById('createDescription').value = '';
    $('#createModal').modal('show');
}

async function saveNewText() {
    const date = document.getElementById('createDate').value;
    const time = document.getElementById('createTime').value;
    const agent = document.getElementById('createAgent').value;
    const description = document.getElementById('createDescription').value;

    const newText = { date, time, agent, description };

    await fetch('http://localhost:5000/texts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newText)
    });

    loadAllParsedTexts();
    $('#createModal').modal('hide');
}

async function loadAllParsedTexts() {
    const response = await fetch('http://localhost:5000/texts');
    const parsedTexts = await response.json();
    displayParsedTexts(parsedTexts, 'allParsedTexts');
}
