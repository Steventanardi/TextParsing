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
        text.landArea && text.landArea.toLowerCase().includes(searchTerm) ||
        text.buildingArea && text.buildingArea.toLowerCase().includes(searchTerm) ||
        text.price && text.price.toLowerCase().includes(searchTerm) ||
        text.location && text.location.toLowerCase().includes(searchTerm)
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
                    <p class="card-text"><strong>LT:</strong> ${result.landArea || 'N/A'}</p>
                    <p class="card-text"><strong>LB:</strong> ${result.buildingArea || 'N/A'}</p>
                    <p class="card-text"><strong>Price:</strong> ${result.price || 'N/A'}</p>
                    <p class="card-text"><strong>Location:</strong> ${result.location || 'N/A'}</p>
                    <p class="card-text"><strong>PLN:</strong> ${result.pln || 'N/A'}</p>
                    <p class="card-text"><strong>Contact:</strong> ${result.contact || 'N/A'}</p>
                    <p class="card-text"><strong>Phone:</strong> ${result.phone || 'N/A'}</p>
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
