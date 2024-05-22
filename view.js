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
