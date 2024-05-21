const apiUrl = 'http://localhost:5000';

document.addEventListener('DOMContentLoaded', (event) => {
    loadAllParsedTexts();
});

async function loadAllParsedTexts() {
    try {
        const response = await fetch(`${apiUrl}/texts`);
        const results = await response.json();
        console.log('All parsed texts:', results); // Log results for debugging
        displayParsedTexts(results);
    } catch (error) {
        console.error('Error fetching all parsed texts:', error); // Log errors for debugging
    }
}

async function searchText() {
    const searchTerm = document.getElementById('searchTerm').value;
    try {
        const response = await fetch(`${apiUrl}/texts/search?term=${searchTerm}`);
        const results = await response.json();
        console.log('Search results:', results); // Log results for debugging
        displayParsedTexts(results);
    } catch (error) {
        console.error('Error fetching search results:', error); // Log errors for debugging
    }
}

function displayParsedTexts(results) {
    const allParsedTextsDiv = document.getElementById('allParsedTexts');
    allParsedTextsDiv.innerHTML = results.map(result => `
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

async function deleteText(id) {
    await fetch(`${apiUrl}/texts/${id}`, {
        method: 'DELETE'
    });
    loadAllParsedTexts();
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
    loadAllParsedTexts();
}
