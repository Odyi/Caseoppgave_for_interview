from flask import Flask, render_template, request, jsonify
import sqlite3

app = Flask(__name__)

# Initialiser databasen og opprett tabellen hvis den ikke finnes
def init_db():
    with sqlite3.connect('feedback.db') as conn:
        conn.execute('''CREATE TABLE IF NOT EXISTS feedback (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            message TEXT NOT NULL
        )''')

# Rute for hjemmesiden
@app.route('/')
def index():
    return render_template('index.html')

# Lagre tilbakemelding i databasen
@app.route('/feedback', methods=['POST'])
def save_feedback():
    data = request.get_json()
    with sqlite3.connect('feedback.db') as conn:
        conn.execute('INSERT INTO feedback (name, email, message) VALUES (?, ?, ?)', 
                     (data['name'], data['email'], data['message']))
    return jsonify({'message': 'Tilbakemelding lagret!'})

# Hent alle tilbakemeldinger fra databasen
@app.route('/feedback', methods=['GET'])
def get_feedback():
    with sqlite3.connect('feedback.db') as conn:
        feedback_list = conn.execute('SELECT name, email, message FROM feedback').fetchall()
    return jsonify(feedback_list)

# Start applikasjonen
if __name__ == '__main__':
    init_db()
    app.run(debug=True)
