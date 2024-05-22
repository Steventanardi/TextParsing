function clearAllData() {
    localStorage.removeItem('parsedTexts');
    document.getElementById('allParsedTexts').innerHTML = '';
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
            fetch('http://localhost:5000/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    textData: `
                        Date: ${textToSend.date}
                        Time: ${textToSend.time}
                        Agent: ${textToSend.agent}
                        Description: ${textToSend.description}
                    `
                })
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to send email');
            });
        }
    }
}

function createNewText() {
    document.getElementById('createDate').value = '';
    document.getElementById('createTime').value = '';
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
