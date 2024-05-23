async function parseAndStoreText() {
    const text = document.getElementById('inputText').value;
    const parsedEntries = parseText(text);
    console.log("Parsed entries:", parsedEntries);

    try {
        const responses = await Promise.all(parsedEntries.map(entry =>
            fetch('http://localhost:5000/texts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(entry)
            }).then(response => response.json())
        ));
        console.log("Saved entries:", responses);
        displayParsedTexts(responses, 'parsedTexts');
    } catch (e) {
        console.error('Failed to save parsed texts', e);
    }
}

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

async function displayParsedTexts(entries, elementId) {
    const parsedResultDiv = document.getElementById(elementId);
    if (entries.length === 0) {
        parsedResultDiv.innerHTML = '<p>No parsed results to display.</p>';
    } else {
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
}

document.addEventListener('DOMContentLoaded', async (event) => {
    const response = await fetch('http://localhost:5000/texts');
    const parsedTexts = await response.json();
    displayParsedTexts(parsedTexts, 'parsedTexts');
});
