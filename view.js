const apiUrl = 'http://localhost:5000';

document.addEventListener('DOMContentLoaded', (event) => {
    loadAllParsedTexts();
});

async function loadAllParsedTexts() {
    try {
        const response = await fetch(`${apiUrl}/texts`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
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
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const results = await response.json();
        console.log('Search results:', results); // Log results for debugging
        displayParsedTexts(results);
    } catch (error) {
        console.error('Error fetching search results:', error); // Log errors for debugging
    }
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
        loadAllParsedTexts();
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
        loadAllParsedTexts();
    } catch (error) {
        console.error('Error updating text:', error); // Log errors for debugging
    }
}
