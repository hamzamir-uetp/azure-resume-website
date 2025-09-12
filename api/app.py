from flask import Flask, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)  # This allows your website to call this API

# Simple in-memory counter (will reset when the app restarts)
visitor_count = 100

@app.route('/api/visitor_counter', methods=['GET'])
def visitor_counter():
    global visitor_count
    visitor_count += 1
    return jsonify({'count': visitor_count})

@app.route('/api/visitor_counter', methods=['OPTIONS'])
def handle_options():
    # Handle CORS preflight requests
    response = jsonify({'message': 'OK'})
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Methods', 'GET, OPTIONS')
    return response

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)