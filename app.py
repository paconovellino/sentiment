from flask import Flask, request, jsonify
from nltk.sentiment import SentimentIntensityAnalyzer
import nltk

nltk.download('vader_lexicon')

app = Flask(__name__)
sia = SentimentIntensityAnalyzer()

def analyze_sentiment(text):
    scores = sia.polarity_scores(text)
    if scores['compound'] >= 0.05:
        return 'positive'
    elif scores['compound'] <= -0.05:
        return 'negative'
    else:
        return 'neutral'

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json.get('data', [])
    results = []
    for row in data[1:]:  # Skip header row
        text = row[0]
        sentiment = analyze_sentiment(text)
        results.append({'text': text, 'sentiment': sentiment})
    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)