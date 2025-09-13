from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
import os
from datetime import datetime, timedelta
import hashlib

app = Flask(__name__)
CORS(app)

# Database setup
def init_db():
    conn = sqlite3.connect('visitors.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS visitors
                 (id INTEGER PRIMARY KEY, 
                  visitor_hash TEXT UNIQUE, 
                  first_visit TIMESTAMP,
                  last_visit TIMESTAMP,
                  visit_count INTEGER)''')
    conn.commit()
    conn.close()

def get_visitor_hash():
    """Create a unique hash for each visitor using IP + User Agent"""
    ip = request.remote_addr
    user_agent = request.headers.get('User-Agent', '')
    return hashlib.md5(f"{ip}{user_agent}".encode()).hexdigest()

@app.route('/api/visitor_counter', methods=['GET'])
def visitor_counter():
    try:
        init_db()
        visitor_hash = get_visitor_hash()
        conn = sqlite3.connect('visitors.db')
        c = conn.cursor()
        
        # Check if visitor exists
        c.execute("SELECT * FROM visitors WHERE visitor_hash=?", (visitor_hash,))
        visitor = c.fetchone()
        
        current_time = datetime.now()
        
        if visitor:
            # Update existing visitor - only count once per hour
            last_visit = datetime.strptime(visitor[3], '%Y-%m-%d %H:%M:%S.%f')
            if current_time - last_visit > timedelta(hours=1):
                c.execute('''UPDATE visitors 
                            SET visit_count=visit_count+1, last_visit=?
                            WHERE visitor_hash=?''', 
                         (current_time, visitor_hash))
                count = visitor[4] + 1
            else:
                count = visitor[4]  # Return existing count without incrementing
        else:
            # New visitor
            c.execute('''INSERT INTO visitors 
                        (visitor_hash, first_visit, last_visit, visit_count)
                        VALUES (?, ?, ?, 1)''',
                     (visitor_hash, current_time, current_time))
            count = 1
        
        conn.commit()
        
        # Get total unique visitors
        c.execute("SELECT COUNT(*) FROM visitors")
        total_visitors = c.fetchone()[0]
        
        # Get total visits
        c.execute("SELECT SUM(visit_count) FROM visitors")
        total_visits = c.fetchone()[0] or 0
        
        conn.close()
        
        return jsonify({
            'current_visitor_count': count,
            'total_unique_visitors': total_visitors,
            'total_visits': total_visits,
            'is_new_visitor': visitor is None
        })
        
    except Exception as e:
        return jsonify({'error': str(e), 'count': 0}), 500

@app.route('/api/visitor_stats', methods=['GET'])
def visitor_stats():
    """Get detailed visitor statistics"""
    try:
        conn = sqlite3.connect('visitors.db')
        c = conn.cursor()
        
        c.execute("SELECT COUNT(*) FROM visitors")
        total_visitors = c.fetchone()[0]
        
        c.execute("SELECT SUM(visit_count) FROM visitors")
        total_visits = c.fetchone()[0] or 0
        
        c.execute("SELECT COUNT(*) FROM visitors WHERE last_visit > datetime('now', '-1 day')")
        daily_visitors = c.fetchone()[0]
        
        conn.close()
        
        return jsonify({
            'total_unique_visitors': total_visitors,
            'total_visits': total_visits,
            'daily_visitors': daily_visitors
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    init_db()
    app.run(host='0.0.0.0', port=5000)