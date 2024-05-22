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
        text.lt.toLowerCase().includes(searchTerm) ||
        text.lb.toLowerCase().includes(searchTerm) ||
        text.price.toLowerCase().includes(searchTerm) ||
        text.location.toLowerCase().includes(searchTerm) ||
        text.shm.toLowerCase().includes(searchTerm)
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
                    <p class="card-text"><strong>LT:</strong> ${result.lt}</p>
                    <p class="card-text"><strong>LB:</strong> ${result.lb}</p>
                    <p class="card-text"><strong>Price:</strong> ${result.price}</p>
                    <p class="card-text"><strong>Location:</strong> ${result.location}</p>
                    <p class="card-text"><strong>SHM:</strong> ${result.shm}</p>
                    <button onclick="deleteText(${result.id})" class="btn btn-danger btn-sm">Delete</button>
                    <button onclick="editText(${result.id})" class="btn btn-warning btn-sm">Edit</button>
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
    const date = prompt('Enter new date:');
    const time = prompt('Enter new time:');
    const agent = prompt('Enter new agent:');
    const lt = prompt('Enter new LT:');
    const lb = prompt('Enter new LB:');
    const price = prompt('Enter new Price:');
    const location = prompt('Enter new Location:');
    const shm = prompt('Enter new SHM:');
    let parsedTexts = JSON.parse(localStorage.getItem('parsedTexts')) || [];
    const index = parsedTexts.findIndex(text => text.id === id);
    if (index !== -1) {
        parsedTexts[index] = { id, date, time, agent, lt, lb, price, location, shm };
        localStorage.setItem('parsedTexts', JSON.stringify(parsedTexts));
        loadAllParsedTexts();
    }
}
