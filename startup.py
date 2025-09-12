# startup.py - This file helps Azure find your Flask app
from api.app import app

if __name__ == '__main__':
    app.run()