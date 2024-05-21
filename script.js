function parseText() {
    const inputText = document.getElementById('inputText').value;
    const parsedResultDiv = document.getElementById('parsedResult');

    const parsedLines = inputText.split('\n').map(line => {
        const dateTimeAgentPattern = /^\d{1,2}\/\d{1,2}\/\d{2}, \d{1,2}:\d{2} - (.+?):/;
        const match = line.match(dateTimeAgentPattern);
        if (match) {
            const [dateTime, agent] = line.split(' - ');
            const [date, time] = dateTime.split(', ');
            return `<strong>Date:</strong> ${date} <strong>Time:</strong> ${time} <strong>Agent:</strong> ${match[1]}`;
        }
        return '';
    }).filter(line => line !== '');

    parsedResultDiv.innerHTML = parsedLines.join('<br>');
}
