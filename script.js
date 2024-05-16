document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const fileInput = document.getElementById('csvFile');
    const file = fileInput.files[0];
    if (file && file.type === 'text/csv') {
        const reader = new FileReader();
        reader.onload = function(e) {
            const text = e.target.result;
            const lines = text.split('\n');
            const data = lines.map(line => line.split(','));
            sendToServer(data);
        };
        reader.readAsText(file);
    } else {
        alert('Please upload a valid CSV file.');
    }
});

function sendToServer(data) {
    fetch('/analyze', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: data })
    })
    .then(response => response.json())
    .then(result => {
        displayResults(result);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function displayResults(result) {
    const resultsBody = document.getElementById('resultsBody');
    resultsBody.innerHTML = '';
    result.forEach(row => {
        const tr = document.createElement('tr');
        const tdText = document.createElement('td');
        const tdSentiment = document.createElement('td');
        tdText.textContent = row.text;
        tdSentiment.textContent = row.sentiment;
        tdSentiment.innerHTML = getSentimentEmoji(row.sentiment);
        tr.appendChild(tdText);
        tr.appendChild(tdSentiment);
        resultsBody.appendChild(tr);
    });
}

function getSentimentEmoji(sentiment) {
    switch(sentiment) {
        case 'positive': return '😊';
        case 'negative': return '😞';
        case 'neutral': return '😐';
        default: return '';
    }
}