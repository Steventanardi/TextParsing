function parseText() {
    const inputText = document.getElementById('inputText').value;
    const parsedResultDiv = document.getElementById('parsedResult');

    const parsedLines = inputText.split('\n').map(line => {
        const dateTimeAgentPattern = /^\d{1,2}\/\d{1,2}\/\d{2}, \d{1,2}:\d{2} - .+:/;
        if (dateTimeAgentPattern.test(line)) {
            const [dateTime, agent] = line.split(' - ');
            const [date, time] = dateTime.split(', ');
            return `<strong>Date:</strong> ${date} <strong>Time:</strong> ${time} <strong>Agent:</strong> ${agent}`;
        }
        return line;
    });

    parsedResultDiv.innerHTML = parsedLines.join('<br>');
}
